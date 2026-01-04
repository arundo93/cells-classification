import os

class ServiceConfig:
    def __init__(self):
        self.storageDir = os.path.join(os.getcwd(), "..", "storage", "studies")
        self.models = ["resNet50", "resNet50_transfer", "VisionTransformer"]