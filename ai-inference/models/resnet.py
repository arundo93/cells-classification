from torchvision.models import resnet50
from torchvision import transforms
import torch
import torch.nn as nn

from PIL import Image
from typing import Dict, List

class ResNetModel:
    def __init__(self, weightsPath: str, modelName: str, classNames: List[str], device: str):
        self.classNames = classNames
        self.modelName = modelName
        self.device = device
        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])
        model = resnet50(weights=None)
        model.fc = nn.Linear(model.fc.in_features, len(self.classNames))
        stateDict = torch.load(weightsPath, map_location=self.device, weights_only=True)
        model.load_state_dict(self.__removePrefixFromStateDictKeys(stateDict, "backbone."))
        self.model = model.to(self.device).eval()
    
    def __removePrefixFromStateDictKeys(self, stateDict: Dict, prefix: str):
        """Удаляет префикс из ключей state_dict"""
        cleanStateDict = {}
        for key, value in stateDict.items():
            if key.startswith(prefix):
                new_key = key[len(prefix):]
                cleanStateDict[new_key] = value
            else:
                cleanStateDict[key] = value
        return cleanStateDict

    def predict(self, image: Image.Image) -> Dict:
        tensor = self.transform(image).unsqueeze(0).to(self.device)
        with torch.no_grad():
            output = self.model(tensor)
        probs = torch.softmax(output[0], dim=0).cpu()
        predClsIndex = probs.argmax().item()
        return {
            "predicted_class": self.classNames[predClsIndex],
            "class_index": predClsIndex,
            "confidence": round(probs[predClsIndex].item(), 4),
            "probabilities": {
                self.classNames[i]: round(probs[i].item(), 4) for i in range(len(self.classNames))
            }
        }