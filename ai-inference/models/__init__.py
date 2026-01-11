from .resnet import ResNetModel
from .vit import ViTModel
from .config import ModelConfig

class ModelBase:
    def __init__(self, modelConfig: ModelConfig):
        self.__modelCache = {}
        self.config = modelConfig
        self.models = dict({model["name"]: model["weights"] for model in self.config.models})

    def getModel(self, modelName: str):
        if not modelName in self.models.keys():
            return None
        
        if modelName in self.__modelCache:
            return self.__modelCache[modelName]
        
        weightsPath = self.models[modelName]

        if modelName == "ResNet50" or modelName == "ResNet50_transfer":
            model = ResNetModel(weightsPath, modelName, self.config.classes, self.config.device)
        elif modelName == "VisionTransformer":
            model = ViTModel(weightsPath, self.config.classes, self.config.device)
        else:
            print(f"Unknown model: {modelName}")
            return None

        self.__modelCache[modelName] = model
        return model