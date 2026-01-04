import os
import torch

class ModelConfig:
    def __init__(self):
        self.classes = [
            "basophil",
            "eosinophil",
            "erythroblast",
            "ig",
            "lymphocyte",
            "monocyte",
            "neutrophil",
            "platelet"
        ]
        self.imgSize = 224
        self.weightsDir = os.path.join(os.getcwd(), "weights")
        self.models = [
            {
                "name": "resNet50",
                "weights": os.path.join(self.weightsDir, "base.pth")
            },
            {
                "name": "resNet50_transfer",
                "weights": os.path.join(self.weightsDir, "transfer_ft.pth")
            },
            {
                "name": "visionTransformer",
                "weights": os.path.join(self.weightsDir, "vit.pth")
            },
        ]
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
