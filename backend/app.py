from flask import Flask, request, jsonify
from transformers import BlipProcessor, BlipForConditionalGeneration
from PIL import Image
from flask_cors import CORS
import torch

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load BLIP image captioning model and processor once at startup
processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")

@app.route('/caption', methods=['POST'])
def caption_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    file = request.files['image']
    image = Image.open(file.stream).convert('RGB')

    # Process and generate caption
    inputs = processor(image, return_tensors="pt")
    outputs = model.generate(**inputs)
    caption = processor.decode(outputs[0], skip_special_tokens=True)

    return jsonify({'caption': caption})

if __name__ == '__main__':
    # For Render deployment, use host="0.0.0.0" and port=5000
    app.run(host="0.0.0.0", port=5000)
