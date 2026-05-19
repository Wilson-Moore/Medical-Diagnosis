from fastapi import APIRouter
from fastapi import UploadFile
from fastapi import File
from PIL import Image
import io

from services.classifier import predict_diseases
from services.report_generator import generate_report
from services.gradcam import generate_gradcam
from services.screening import screen_xray

router = APIRouter()

@router.post("/predict")
async def predict(file: UploadFile = File(...)):

    image_bytes = await file.read()

    image = Image.open(
        io.BytesIO(image_bytes)
    )

    screening = screen_xray(image)

    if not screening["is_abnormal"]:

        return {
            "screening": screening,
            "predictions": [],
            "report": (
                "No acute cardiopulmonary abnormality detected. "
                "Chest radiograph appears within normal limits."
            ),
            "heatmap": None
        }


    predictions = predict_diseases(image)

    report = generate_report(predictions)

    top_prediction = max(
        enumerate(predictions),
        key=lambda x: x[1]["probability"]
    )

    class_index = top_prediction[0]

    heatmap = generate_gradcam(
        image,
        class_index
    )

    return {
        "predictions": predictions,
        "report": report,
        "heatmap": heatmap
    }