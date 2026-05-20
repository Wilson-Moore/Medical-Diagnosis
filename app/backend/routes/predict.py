from fastapi import APIRouter, UploadFile, File
from PIL import Image
import io

from services.classifier import predict_with_model, AVAILABLE_MODELS, efficientnet_model, densenet_model
from services.report_generator import generate_report
from services.gradcam import generate_gradcam
from services.screening import screen_xray

router = APIRouter()

@router.post("/predict")
async def predict(file: UploadFile = File(...)):
    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes))
    
    screening = screen_xray(image)
    
    if not screening["is_abnormal"]:
        return {
            "screening": screening,
            "efficientnet": {
                "predictions": [],
                "report": "No acute cardiopulmonary abnormality detected. Chest radiograph appears within normal limits.",
                "heatmap": None
            },
            "densenet": {
                "predictions": [],
                "report": "No acute cardiopulmonary abnormality detected. Chest radiograph appears within normal limits.",
                "heatmap": None
            }
        }
    
    efficientnet_predictions = efficientnet_model.predict(image)
    densenet_predictions = densenet_model.predict(image)
    
    efficientnet_report = generate_report(efficientnet_predictions)
    densenet_report = generate_report(densenet_predictions)
    
    efficientnet_top_idx = max(enumerate(efficientnet_predictions), key=lambda x: x[1]["probability"])[0]
    densenet_top_idx = max(enumerate(densenet_predictions), key=lambda x: x[1]["probability"])[0]
    
    efficientnet_heatmap = generate_gradcam(image, "efficientnet", efficientnet_top_idx)
    densenet_heatmap = generate_gradcam(image, "densenet", densenet_top_idx)
    
    return {
        "screening": screening,
        "efficientnet": {
            "predictions": efficientnet_predictions,
            "report": efficientnet_report,
            "heatmap": efficientnet_heatmap
        },
        "densenet": {
            "predictions": densenet_predictions,
            "report": densenet_report,
            "heatmap": densenet_heatmap
        }
    }


@router.get("/models")
async def list_models():
    """List available models"""
    return {
        "models": AVAILABLE_MODELS,
        "details": {
            "efficientnet": {
                "name": "EfficientNet-B1",
                "description": "High-efficiency CNN with strong performance on medical imaging",
                "color": "cyan"
            },
            "densenet": {
                "name": "DenseNet121",
                "description": "Densely connected CNN excelling at fine-grained feature extraction",
                "color": "emerald"
            }
        }
    }