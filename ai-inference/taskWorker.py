import os
import json
from datetime import datetime, timezone
from PIL import Image
from models import ModelBase
from models.config import ModelConfig

modelConfig = ModelConfig()
modelManager = ModelBase(modelConfig)

def getTimestamp():
    return datetime.now(timezone.utc).isoformat()

def processSingleTask(singleTask, storageDir: str):
    """
    Обрабатывает задачу
    """
    filePath = os.path.join(storageDir, singleTask["filePath"])
    filename = os.path.splitext(os.path.basename(filePath))[0]
    taskDir = os.path.dirname(filePath)

    if not filePath or not os.path.exists(filePath) :
        print(f"⚠️  Invalid file path: {filePath}")
        return

    image = Image.open(filePath).convert("RGB")

    if image is None:
        print(f"⚠️  Failed to read image: {filePath}")
        return

    result = {"results": {}, "errors": {}}

    for modelName in singleTask["models"]:
        model = modelManager.getModel(modelName)
        if not model:
            continue
        try:
            startTimestamp = getTimestamp()
            pred = model.predict(image)
            result["results"][modelName] = pred
            result["results"][modelName]["time_start"] = startTimestamp
            result["results"][modelName]["time_end"] = getTimestamp()
        except Exception as e:
            result["errors"][modelName] = {"error": str(e)}

    # Сохраняем результат рядом с файлом
    resultPath = os.path.join(taskDir, filename + "_result.json")
    with open(resultPath, "w") as f:
        json.dump(result, f, indent=2)