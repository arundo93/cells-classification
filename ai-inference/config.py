import os

class ServiceConfig:
    def __init__(self):
        self.storageDir = os.path.join(os.getcwd(), "..", "storage", "studies")