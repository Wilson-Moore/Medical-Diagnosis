import torch
import timm
from PIL import Image
from torchvision import transforms

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

model = timm.create_model(
    "efficientnet_b3",
    pretrained=False,
    num_classes=2
)

checkpoint = torch.load(
    "models/chestX_efficientnet_p2_final.pth",
    map_location=device,
    weights_only=False
)

if "model_state_dict" in checkpoint:
    state_dict = checkpoint["model_state_dict"]
else:
    state_dict = checkpoint

model.load_state_dict(state_dict)

model.to(device)
model.eval()

transform = transforms.Compose([
    transforms.Resize((256, 256)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])

def screen_xray(image: Image.Image):
    image = image.convert("RGB")
    tensor = transform(image).unsqueeze(0).to(device)

    with torch.no_grad():
        logits = model(tensor)
        probs = torch.softmax(logits, dim=1)
        abnormal_prob = probs[0][1].item()

    return {
        "abnormal_probability": abnormal_prob,
        "is_abnormal": abnormal_prob > 0.5
    }