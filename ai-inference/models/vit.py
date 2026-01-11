import torch
from torchvision.models.vision_transformer import _vision_transformer
from torchvision import transforms

from PIL import Image
from typing import Dict, List

class ViTModel:
    def __init__(self, weightsPath: str, classNames: List[str], device: str):
        self.classNames = classNames
        self.modelName = "vit"
        self.device = device
        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.5, 0.5, 0.5], std=[0.5, 0.5, 0.5])
        ])
        model = _vision_transformer(
            patch_size = 16,
            num_layers = 8,
            num_heads = 16,
            hidden_dim = 384,
            mlp_dim = 384 * 4,
            image_size = 224,
            num_classes = 8,
            weights = None,
            progress = True
        )
        stateDict = torch.load(weightsPath, map_location=self.device, weights_only=True)
        model.load_state_dict(self.__removePrefixFromStateDictKeys(stateDict, "model."))
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
        pred_idx = probs.argmax().item()
        return {
            "predicted_class": self.classNames[pred_idx],
            "class_index": pred_idx,
            "confidence": round(probs[pred_idx].item(), 4),
            "probabilities": dict({
                self.classNames[i]: round(probs[i].item(), 4) for i in range(len(self.classNames))
            })
        }