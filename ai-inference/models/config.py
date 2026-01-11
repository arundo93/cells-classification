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
                "name": "ResNet50",
                "weights": os.path.join(self.weightsDir, "base.pth"),
                "description": "Базовая модель для задачи классификации клеток крови",
                "characteristics": {
                        "Параметров": '15M',
                        "Входные изображения": '224х224',
                        "Версия": '1.0',
                }
            },
            {
                "name": "ResNet50_transfer",
                "weights": os.path.join(self.weightsDir, "transfer_ft.pth"),
                "description": "Дообученная модель для задачи классификации клеток крови",
                "characteristics": {
                        "Параметров": '15M',
                        "Входные изображения": '224х224',
                        "Версия": '1.0',
                }
            },
            {
                "name": "VisionTransformer",
                "weights": os.path.join(self.weightsDir, "vit.pth"),
                "description": "Модель на основе энкодера с механизмом самовнимания",
                "characteristics": {
                        "Параметров": '14.6M',
                        "Входные изображения": '224х224',
                        "Версия": '3.0',
                }
            },
        ]
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
