import torch
import torchvision.models as models
import torch.nn as nn
from torchvision import transforms
from PIL import Image
import numpy as np
import cv2
import tensorflow as tf
from tensorflow.keras.applications import DenseNet121
from tensorflow.keras import layers, models as keras_models

DENSENET_DISEASES = [
    'Atelectasis', 'Consolidation', 'Infiltration', 'Pneumothorax',
    'Edema', 'Emphysema', 'Fibrosis', 'Effusion', 'Pneumonia',
    'Pleural_Thickening', 'Cardiomegaly', 'Nodule', 'Mass', 'Hernia'
]

EFFICIENTNET_DISEASES = [
    'Atelectasis', 'Cardiomegaly', 'Effusion',
    'Infiltration', 'Mass', 'Nodule',
    'Pneumonia', 'Pneumothorax',
    'Consolidation', 'Edema',
    'Emphysema', 'Fibrosis',
    'Pleural_Thickening', 'Hernia'
]

DISEASES = EFFICIENTNET_DISEASES

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

class EfficientNetMultiLabel(nn.Module):
    def __init__(self, num_classes=14):
        super().__init__()
        self.backbone = models.efficientnet_b1(weights=None)
        in_features = self.backbone.classifier[1].in_features
        self.backbone.classifier = nn.Sequential(
            nn.Dropout(0.4),
            nn.Linear(in_features, num_classes)
        )

    def forward(self, x):
        return self.backbone(x)

class EfficientNetModel:
    def __init__(self, weights_path="models/efficient_net-b1_model_v2.pth"):
        self.model = EfficientNetMultiLabel(num_classes=14)
        checkpoint = torch.load(weights_path, map_location=device, weights_only=False)
        
        if "model_state_dict" in checkpoint:
            self.model.load_state_dict(checkpoint["model_state_dict"])
        else:
            self.model.load_state_dict(checkpoint)
        
        self.model.to(device)
        self.model.eval()
        
        self.transform = transforms.Compose([
            transforms.Resize((256, 256)),
            transforms.ToTensor(),
            transforms.Normalize(
                mean=[0.485, 0.456, 0.406],
                std=[0.229, 0.224, 0.225]
            )
        ])
        
        self.disease_names = EFFICIENTNET_DISEASES
        
        print(f"EfficientNet-B1 loaded successfully")
    
    @property
    def name(self):
        return "EfficientNet-B1"
    
    def predict(self, image: Image.Image):
        image = image.convert("RGB")
        tensor = self.transform(image).unsqueeze(0).to(device)
        
        with torch.no_grad():
            logits = self.model(tensor)
            probs = torch.sigmoid(logits)[0].cpu().numpy()
        
        results = []
        for disease, prob in zip(self.disease_names, probs):
            results.append({
                "disease": disease,
                "probability": float(prob)
            })
        
        results.sort(key=lambda x: x["probability"], reverse=True)
        return results

class DenseNetModel:
    def __init__(self, weights_path="models/chexnet_best.keras"):
        self.disease_names = DENSENET_DISEASES
        self.input_size = (224, 224)
        
        base_model = DenseNet121(
            weights=None,
            include_top=False,
            input_shape=(224, 224, 3)
        )
        
        self.model = keras_models.Sequential([
            base_model,
            layers.GlobalAveragePooling2D(),
            layers.Dropout(0.2),
            layers.Dense(14, activation='sigmoid')
        ])
        
        self.model.load_weights(weights_path)
        self.model.build((None, 224, 224, 3))
        
        self.base_model = base_model
        self.last_conv_layer = base_model.get_layer("conv5_block16_concat")
        self.gap_layer = self.model.layers[1]
        self.dropout_layer = self.model.layers[2]
        self.dense_layer = self.model.layers[3]
        
        print(f"DenseNet121 loaded successfully with {len(self.disease_names)} diseases")
        print(f"Disease order: {self.disease_names}")
    
    @property
    def name(self):
        return "DenseNet121"
    
    def predict(self, image: Image.Image):
        img = np.array(image.convert("RGB").resize(self.input_size))
        img = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)
        img_norm = img / 255.0
        input_img = np.expand_dims(img_norm, axis=0).astype(np.float32)
        
        predictions = self.model.predict(input_img, verbose=0)[0]
        
        results = []
        for disease, prob in zip(self.disease_names, predictions):
            results.append({
                "disease": disease,
                "probability": float(prob)
            })
        
        results.sort(key=lambda x: x["probability"], reverse=True)
        return results

efficientnet_model = EfficientNetModel()
densenet_model = DenseNetModel()

AVAILABLE_MODELS = ["efficientnet", "densenet"]

def predict_with_model(image: Image.Image, model_name: str):
    """Get predictions from specified model"""
    if model_name == "efficientnet":
        return efficientnet_model.predict(image)
    elif model_name == "densenet":
        return densenet_model.predict(image)
    else:
        raise ValueError(f"Model {model_name} not found. Available: {AVAILABLE_MODELS}")