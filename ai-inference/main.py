from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import threading
from queue import Queue
from taskWorker import processSingleTask, modelConfig
from config import ServiceConfig

config = ServiceConfig()
taskQueue = Queue(100)

workerRunning = True
def backgroundWorker():
    print("🔄 Worker starting...")
    while workerRunning:
        try:
            singleTask = taskQueue.get(timeout=1)
            if singleTask is None:
                continue
            try:
                processSingleTask(singleTask, config.storageDir)
            except Exception as e:
                print(f"❌ Error in worker: {e}")
            finally:
                taskQueue.task_done()
        except Exception as e:
            continue

workerThread = threading.Thread(target=backgroundWorker, name="task-processor", daemon=True)
workerThread.start()


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/task/create")
async def enqueueTask(request: Request):
    try:
        batchData = await request.json()
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid JSON format")

    # Validate required fields
    if not batchData:
        raise HTTPException(status_code=400, detail="Request body is required")

    studies = batchData.get("studies")
    models = batchData.get("models", [])

    # Validate studies
    if studies is None:
        raise HTTPException(status_code=400, detail="studies field is required")
    
    if not isinstance(studies, list):
        raise HTTPException(status_code=400, detail="studies must be an array")
    
    if not studies:
        raise HTTPException(status_code=400, detail="studies must be a non-empty array")

    # Validate each study
    for i, study in enumerate(studies):
        if not isinstance(study, dict):
            raise HTTPException(status_code=400, detail=f"Study at index {i} must be an object")
        
        if "id" not in study:
            raise HTTPException(status_code=400, detail=f"Study at index {i} missing required field: id")
        
        if "filePath" not in study:
            raise HTTPException(status_code=400, detail=f"Study at index {i} missing required field: filePath")

    # Validate models
    if not isinstance(models, list):
        raise HTTPException(status_code=400, detail="models must be an array")
    
    if models:
        for m in models:
            if m not in list(model['name'] for model in modelConfig.models):
                raise HTTPException(status_code=400, detail=f"Unsupported model: {m}")

    # Check if queue is full
    if taskQueue.full():
        raise HTTPException(status_code=503, detail="Task queue is full")

    # Add tasks to queue
    ignored = 0
    try:
        for study in studies:
            singleTask = {
                "id": study.get('id'),
                "filePath": study.get('filePath'),
                "models": models
            }
            if not taskQueue.full():
                taskQueue.put(singleTask)
            else:
                ignored += 1
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to enqueue tasks: {str(e)}")

    status = "all" if ignored == 0 else "partial"
    return {"status": status, "tasks_ignored": ignored}

@app.get("/health")
def healthCheck():
    try:
        return {
            "status": "ok",
            "is_full": taskQueue.full(),
            "tasks_count": taskQueue.qsize()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Health check failed: {str(e)}")


@app.get("/options")
def getOptions():
    try:
        return {
            "models": list(model['name'] for model in modelConfig.models),
            "class_labels": modelConfig.classes
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Config retrieval failed: {str(e)}")

@app.get("/models")
def getOptions():
    try:
        return {
            "models": list(
                {k: v for k, v in model.items() if k != "weights"}
                for model in modelConfig.models
            ),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get models info: {str(e)}")