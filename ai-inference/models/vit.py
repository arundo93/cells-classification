import math
import torch
import torch.nn as nn
from torchvision import transforms

from PIL import Image
from typing import Dict, List

class PatchEmbedding(nn.Module):
    def __init__(self, imageSize=224, patchSize=16, inFeatures=3, embeddingDim=768):
        super().__init__()
        self.imageSize = imageSize
        self.hiddenDim = embeddingDim
        self.patchSize = patchSize
        self.numOfPatches = (imageSize // patchSize) ** 2

        self.conv = nn.Conv2d(
            in_channels = inFeatures,
            out_channels = embeddingDim,
            kernel_size = patchSize,
            stride = patchSize
        )
        # Для conv_proj (патч-эмбеддинг)
        fan_in = self.conv.in_channels * self.conv.kernel_size[0] * self.conv.kernel_size[1]
        nn.init.trunc_normal_(self.conv.weight, std=math.sqrt(1 / fan_in))
        if self.conv.bias is not None:
            nn.init.zeros_(self.conv.bias)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        n, c, h, w = x.shape
        p = self.patchSize
        torch._assert(h == self.imageSize, f"Wrong image height! Expected {self.imageSize} but got {h}!")
        torch._assert(w == self.imageSize, f"Wrong image width! Expected {self.imageSize} but got {w}!")
        n_h = h // p
        n_w = w // p

        # (n, c, h, w) -> (n, hiddenDim, n_h, n_w)
        x = self.conv(x)
        # (n, hiddenDim, n_h, n_w) -> (n, hiddenDim, (n_h * n_w))
        x = x.reshape(n, self.hiddenDim, n_h * n_w)

        # (n, hiddenDim, (n_h * n_w)) -> (n, (n_h * n_w), hiddenDim)
        # The self attention layer expects inputs in the format (N, S, E)
        # where S is the source sequence length, N is the batch size, E is the
        # embedding dimension
        x = x.permute(0, 2, 1)
        return x


class MLP(nn.Module):
    def __init__(self, inFeatures, hiddenFeatures, outFeatures, dropout=0.1):
        super().__init__()
        self.mlp = nn.Sequential(
            nn.Linear(inFeatures, hiddenFeatures),
            nn.GELU(),
            nn.Dropout(dropout),
            nn.Linear(hiddenFeatures, outFeatures),
            nn.Dropout(dropout),
        )

    def forward(self, x):
        return self.mlp(x)


class EncoderBlock(nn.Module):
    def __init__(self, embeddingDim, attnHeads, mlpHiddenFeatures, dropout=0.1):
        super().__init__()
        self.norm1 = nn.LayerNorm(embeddingDim)
        self.attn = nn.MultiheadAttention(embeddingDim, attnHeads, dropout=dropout, batch_first=True)
        self.dropout = nn.Dropout(dropout)
        self.norm2 = nn.LayerNorm(embeddingDim)
        self.mlp = MLP(embeddingDim, mlpHiddenFeatures, embeddingDim, dropout)

    def forward(self, x):
        # Self-attention + residual
        xNorm = self.norm1(x)
        attnOutput, _ = self.attn(xNorm, xNorm, xNorm, need_weights=False)
        x = x + self.dropout(attnOutput)
        # MLP + residual
        xNorm = self.norm2(x)
        return x + self.mlp(xNorm)


class SimpleVisionTransformer(nn.Module):
    def __init__(
        self,
        imageSize: int,
        numClasses: int,
        patchSize: int,
        inChannels: int,
        depth: int,
        attnHeads: int,
        embeddingDim: int,
        mlpHiddenFeatures: int,
        dropout: float
    ):
        super().__init__()
        self.patchEmbedding = PatchEmbedding(imageSize, patchSize, inChannels, embeddingDim)
        self.numOfPatches = self.patchEmbedding.numOfPatches

        # Class token
        self.clsToken = nn.Parameter(torch.zeros(1, 1, embeddingDim).normal_(std=0.02))
        # Positional embedding (for N patches + 1 cls token)
        self.positionalEmbedding = nn.Parameter(torch.zeros(1, self.numOfPatches + 1, embeddingDim).normal_(std=0.02))
        self.dropout = nn.Dropout(dropout)

        # Transformer encoder blocks
        self.blocks = nn.Sequential(*[
            EncoderBlock(embeddingDim, attnHeads, mlpHiddenFeatures, dropout)
            for _ in range(depth)
        ])

        self.norm = nn.LayerNorm(embeddingDim)
        self.head = nn.Linear(embeddingDim, numClasses)

    def forward(self, x):
        B = x.shape[0]
        x = self.patchEmbedding(x)                     # (B, N, E)

        cls_tokens = self.clsToken.expand(B, -1, -1)  # (B, 1, E)
        x = torch.cat((cls_tokens, x), dim=1)       # (B, N+1, E)

        x = x + self.positionalEmbedding                      # Add positional embedding
        x = self.dropout(x)

        x = self.blocks(x)                          # Transformer encoder
        x = self.norm(x)

        cls_final = x[:, 0]                         # Use [CLS] token
        return self.head(cls_final)


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
        model = SimpleVisionTransformer(
            imageSize = 224,
            numClasses = len(self.classNames),
            patchSize = 16,
            inChannels=3,
            depth=8,
            attnHeads=8,
            embeddingDim=768,
            mlpHiddenFeatures=3072,
            dropout=0.2,
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