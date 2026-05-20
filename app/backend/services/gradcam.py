import cv2
import numpy as np
from PIL import Image
import base64
from io import BytesIO
import torch

def generate_gradcam_efficientnet(image, class_index):
    from pytorch_grad_cam import GradCAMPlusPlus
    from pytorch_grad_cam.utils.model_targets import ClassifierOutputTarget
    from pytorch_grad_cam.utils.image import show_cam_on_image
    from services.classifier import efficientnet_model, device
    
    rgb_img = np.array(image.convert("RGB").resize((256, 256))) / 255.0
    image_pil = image.convert("RGB")
    input_tensor = efficientnet_model.transform(image_pil).unsqueeze(0).to(device)
    
    target_layers = [efficientnet_model.model.backbone.features[-1]]
    
    cam = GradCAMPlusPlus(model=efficientnet_model.model, target_layers=target_layers)
    targets = [ClassifierOutputTarget(class_index)]
    
    grayscale_cam = cam(input_tensor=input_tensor, targets=targets)[0]
    visualization = show_cam_on_image(rgb_img, grayscale_cam, use_rgb=True)
    
    pil_image = Image.fromarray(visualization)
    buffer = BytesIO()
    pil_image.save(buffer, format="PNG")
    encoded = base64.b64encode(buffer.getvalue()).decode("utf-8")
    
    return encoded

def generate_gradcam_densenet(image, class_index):
    import tensorflow as tf
    from services.classifier import densenet_model
    
    img = np.array(image.convert("RGB").resize((224, 224)))
    img = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)  # Convert to BGR to match cv2.imread
    
    img_norm = img / 255.0
    
    input_img = np.expand_dims(img_norm, axis=0).astype(np.float32)
    
    last_conv_layer = densenet_model.base_model.get_layer("conv5_block16_concat")
    
    grad_model = tf.keras.models.Model(
        inputs=densenet_model.base_model.input,
        outputs=[last_conv_layer.output, densenet_model.base_model.output]
    )
    
    gap_layer = densenet_model.model.layers[1]
    dropout_layer = densenet_model.model.layers[2]
    dense_layer = densenet_model.model.layers[3]
    
    with tf.GradientTape() as tape:
        conv_outputs, base_out = grad_model(input_img)
        x = gap_layer(base_out, training=False)
        x = dropout_layer(x, training=False)
        predictions = dense_layer(x, training=False)
        loss = predictions[:, class_index]
    
    grads = tape.gradient(loss, conv_outputs)
    
    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))
    conv_out = conv_outputs[0]
    
    heatmap = tf.reduce_sum(conv_out * pooled_grads, axis=-1)
    heatmap = np.maximum(heatmap.numpy(), 0)
    heatmap = heatmap / (np.max(heatmap) + 1e-8)
    
    heatmap_resized = cv2.resize(heatmap, (224, 224))
    heatmap_colored = np.uint8(255 * heatmap_resized)
    heatmap_colored = cv2.applyColorMap(heatmap_colored, cv2.COLORMAP_JET)
    
    superimposed_img = cv2.addWeighted(img, 0.6, heatmap_colored, 0.4, 0)
    
    superimposed_img_rgb = cv2.cvtColor(superimposed_img, cv2.COLOR_BGR2RGB)
    
    pil_image = Image.fromarray(superimposed_img_rgb)
    buffer = BytesIO()
    pil_image.save(buffer, format="PNG")
    encoded = base64.b64encode(buffer.getvalue()).decode("utf-8")
    
    return encoded


def generate_gradcam(image, model_name, class_index):
    if model_name == "efficientnet":
        return generate_gradcam_efficientnet(image, class_index)
    elif model_name == "densenet":
        return generate_gradcam_densenet(image, class_index)
    else:
        raise ValueError(f"Model {model_name} not found")