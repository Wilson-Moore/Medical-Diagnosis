import torch
import torchvision.models as models
import torch.nn as nn
from torchvision import transforms
from PIL import Image

DISEASES = [
    'Atelectasis', 'Cardiomegaly', 'Effusion',
    'Infiltration', 'Mass', 'Nodule',
    'Pneumonia', 'Pneumothorax',
    'Consolidation', 'Edema',
    'Emphysema', 'Fibrosis',
    'Pleural_Thickening', 'Hernia'
]

device=torch.device("cuda" if torch.cuda.is_available() else "cpu")

class EfficientNetMultiLabel(nn.Module):
    def __init__(self,num_classes=14):
        super().__init__()

        self.backbone=models.efficientnet_b1(weights=None)

        in_features=self.backbone.classifier[1].in_features

        self.backbone.classifier=nn.Sequential(nn.Dropout(0.4),nn.Linear(in_features,num_classes))

    def forward(self, x):
        return self.backbone(x)

model=EfficientNetMultiLabel()
checkpoint = torch.load("models/efficient_net-b1_model_v2.pth",map_location=device,weights_only=False)

# if checkpoint contains model_state_dict
if "model_state_dict" in checkpoint:
    model.load_state_dict(checkpoint["model_state_dict"])
else:
    model.load_state_dict(checkpoint)

model.to(device)
model.eval()

transform=transforms.Compose([
    transforms.Resize((256,256)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485,0.456,0.406],
        std=[0.229,0.224,0.225]
    )
])

def predict_diseases(image: Image.Image):

    image = image.convert("RGB")

    tensor = transform(image).unsqueeze(0).to(device)

    with torch.no_grad():
        logits = model(tensor)
        probs = torch.sigmoid(logits)[0].cpu().numpy()

    results = []

    for disease, prob in zip(DISEASES, probs):
        results.append({
            "disease": disease,
            "probability": float(prob)
        })

    results.sort(
        key=lambda x: x["probability"],
        reverse=True
    )

    return results