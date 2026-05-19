import cv2
import numpy as np
from pytorch_grad_cam import GradCAMPlusPlus
from pytorch_grad_cam.utils.model_targets import ClassifierOutputTarget
from pytorch_grad_cam.utils.image import show_cam_on_image
import base64
from io import BytesIO
from PIL import Image

from services.classifier import model
from services.classifier import transform
from services.classifier import device


def generate_gradcam(image, class_index):

    rgb_img = np.array(image.convert("RGB").resize((256, 256))) / 255.0

    image = image.convert("RGB")

    input_tensor = transform(image).unsqueeze(0).to(device)

    target_layers = [model.backbone.features[-1]]

    cam = GradCAMPlusPlus(
        model=model,
        target_layers=target_layers
    )

    targets = [ClassifierOutputTarget(class_index)]

    grayscale_cam = cam(
        input_tensor=input_tensor,
        targets=targets
    )[0]

    visualization = show_cam_on_image(
        rgb_img,
        grayscale_cam,
        use_rgb=True
    )

    pil_image = Image.fromarray(visualization)

    buffer = BytesIO()
    pil_image.save(buffer, format="PNG")

    encoded = base64.b64encode(
        buffer.getvalue()
    ).decode("utf-8")

    return encoded