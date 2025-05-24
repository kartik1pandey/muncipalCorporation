from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
import os
from werkzeug.utils import secure_filename
import pathlib

app = Flask(__name__)

# Get the absolute path to the model file
current_dir = pathlib.Path(__file__).parent.absolute()
model_path = os.path.join(current_dir.parent, 'model.h5')

# Add a check if model file exists before loading
if not os.path.exists(model_path):
    print(f"[ERROR] Model file not found at: {model_path}")
    # You might want to exit or handle this error differently
    # For now, we'll raise an error to stop the service if the model is missing
    raise FileNotFoundError(f"Model file not found at {model_path}")
    
model = load_model(model_path)
print(f"[INFO] Model loaded successfully from {model_path}")

UPLOAD_FOLDER = os.path.join(current_dir, 'uploads')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
print(f"[INFO] Upload folder set to: {UPLOAD_FOLDER}")

def model_predict(img_path, model):
    print(f"[DEBUG] Loading image from: {img_path}")
    try:
        img = image.load_img(img_path, target_size=(128, 128))
        print(f"[DEBUG] Image loaded successfully.")
        img_array = image.img_to_array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)
        print(f"[DEBUG] Image array shape: {img_array.shape}")
        prediction = model.predict(img_array)[0][0]
        print(f"[DEBUG] Raw prediction output: {prediction}")
        return {
            'is_pothole': bool(prediction > 0.5),
            'confidence': float(prediction)
        }
    except Exception as e:
        print(f"[ERROR] Error during model prediction: {e}")
        raise e

@app.route('/detect', methods=['POST'])
def detect_pothole():
    print("[DEBUG] /detect endpoint hit.")
    if 'file' not in request.files:
        print("[ERROR] No file provided in request.")
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    if file.filename == '':
        print("[ERROR] No file selected.")
        return jsonify({'error': 'No file selected'}), 400
    
    if file:
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        
        # Ensure the upload directory exists before saving
        os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
        
        file.save(filepath)
        print(f"[DEBUG] File saved to: {filepath}")
        
        try:
            result = model_predict(filepath, model)
            print(f"[DEBUG] Model prediction result: {result}")
            return jsonify(result)
        except Exception as e:
            # The exception is already printed in model_predict
            print("[ERROR] Error processing image for detection, returning 500.")
            return jsonify({'error': 'Error processing image for detection'}), 500

if __name__ == '__main__':
    print("[INFO] Starting Flask service for pothole detection on port 5001...")
    app.run(port=5001, debug=True)
