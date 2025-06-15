from flask import Flask, request, jsonify, render_template
import numpy as np
import pickle
from flask_cors import CORS
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv
import sys

# Configure output encoding for UTF-8
sys.stdout.reconfigure(encoding='utf-8')

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

current_dir = os.path.dirname(os.path.abspath(__file__))
models_dir = os.path.join(current_dir, "static", "prediction-models")

@app.route('/')
def index():
    return render_template('landing_page.html')

@app.route('/templates/<page_name>')
def render_page(page_name):
    try:
        return render_template(f'{page_name}.html')
    except Exception:
        return f"Error: Page '{page_name}' not found!", 404

@app.route('/submit-data', methods=['POST'])
def submit_data():
    try:
        # Get JSON data from the request
        data = request.get_json()

        if not data or 'features' not in data:
            return jsonify({"error": "No features data found in request"}), 400
        
        # Extract features from the JSON data
        features = data['features']
        numpy_array = np.asarray(features)  # Changing input array to numpy array

        reshaped_input = numpy_array.reshape(1, -1)  # Reshaping the array for a single instance prediction

        predicted_result = []
        if reshaped_input.shape[1] == 8:  # Ensure the input has 8 features
            predicted_result = predict_diabetes(reshaped_input)
        elif reshaped_input.shape[1] == 13:
            predicted_result = predict_heart_disease(reshaped_input)
        elif reshaped_input.shape[1] == 16:
            predicted_result = predict_parkinsons(reshaped_input)
        elif reshaped_input.shape[1] == 27:
            predicted_result = predict_cancer_type(reshaped_input)

        # Returning the prediction result as a response in JSON format
        return jsonify({"result": predicted_result[0] ,"message": predicted_result[1]})

    except Exception as e:
        return jsonify({'error': str(e)}), 400
    
def predict_diabetes(reshaped_input):
    diabetes_scaler_file = os.path.join(models_dir, 'diabetes_scaler.pkl')
    diabetes_model_file = os.path.join(models_dir, 'diabetes_model.pkl')

    # Load the pre-trained scaler and model
    with open(diabetes_scaler_file, 'rb') as scaler_file:
        diabetes_scaler = pickle.load(scaler_file)

    with open(diabetes_model_file, 'rb') as model_file:
        diabetes_classifier = pickle.load(model_file)

    # Standardize the data
    standard_input = diabetes_scaler.transform(reshaped_input)

    # Make prediction
    prediction = diabetes_classifier.predict(standard_input)  # Ensure using the correct model for prediction
    
    # Prepare the message based on the prediction
    if prediction[0] == 0:
        return ["no", "Great news! Our analysis indicates that you are healthy and show no signs of diabetes. Keep up the good work maintaining your health!"]
    else:
        return ["yes", "Urgent! Our analysis indicates that you may have diabetes. Please consult a specialist immediately for confirmation and to begin appropriate care."]
    
def predict_heart_disease(reshaped_input):
    model_file = os.path.join(models_dir, 'heart_disease_model.pkl')

    # Load the pre-trained scaler and model
    with open(model_file, 'rb') as scaler_file:
        heart_disease_model = pickle.load(scaler_file)

    # Make prediction
    prediction = heart_disease_model.predict(reshaped_input)

    # Prepare the message based on the prediction
    if prediction[0] == 0:
        return ["no", "Great news! Our analysis indicates that you are healthy and show no signs of Heart disease. Keep up the good work maintaining your health!"]
    else:
        return ["yes", "Urgent! Our analysis indicates that you may have Heart disease. Please consult a specialist immediately for confirmation and to begin appropriate care."]


def predict_parkinsons(reshaped_input):
    scaler_file = os.path.join(models_dir, 'parkinsons_scaler.pkl')
    model_file = os.path.join(models_dir, 'parkinsons_model.pkl.pkl')

    # Load the pre-trained scaler and model
    with open(scaler_file, 'rb') as scaler_file:
        parkinsons_scaler = pickle.load(scaler_file)

    with open(model_file, 'rb') as model_file:
        parkinsons_classifier = pickle.load(model_file)

    # Standardize the data
    standard_input = parkinsons_scaler.transform(reshaped_input)

    # Make prediction
    prediction = parkinsons_classifier.predict(standard_input)  # Ensure using the correct model for prediction
    
    # Prepare the message based on the prediction
    if prediction[0] == 0:
        return ["no", "Great news! Our analysis indicates that you are healthy and show no signs of Parkinson's disease. Keep up the good work maintaining your health!"]
    else:
        return ["yes", "Urgent! Our analysis indicates that you may have Parkinson's disease. Please consult a specialist immediately for confirmation and to begin appropriate care."]
    
def predict_cancer_type(reshaped_input):
    model_file = os.path.join(models_dir, 'breast_cancer_model.pkl')

    # Load the pre-trained scaler and model
    with open(model_file, 'rb') as scaler_file:
        breast_cancer_model = pickle.load(scaler_file)

    # Make prediction
    prediction = breast_cancer_model.predict(reshaped_input)

    # Prepare the message based on the prediction
    if prediction[0] == 'M':
        return ["no", "Based on the initial assessment, there may be a concern for a malignant tumor. It's important to follow up with further diagnostic tests, such as imaging or biopsy, to determine the nature of the growth. Early detection and intervention are key to effective treatment, so please consult with a healthcare provider as soon as possible."]
    elif prediction[0] == 'B':
        return ["no", "The findings suggest that the tumor may be benign. While benign tumors are typically non-cancerous and pose less immediate risk, it's still important to monitor the situation and consult with a healthcare professional for the appropriate follow-up and treatment plan. Regular check-ups can ensure any changes are detected early."]

@app.route('/send-email', methods=['POST'])
def send_message():
    try:
        # Parse JSON data from the request
        data = request.json
        sender_name = data.get("name")
        sender_gmail = data.get("email")
        message_subject = data.get("subject")
        message_content = data.get("body")

        # Gmail credentials (you should avoid hardcoding credentials in production)
        reciever_gmail = os.getenv('my_gmail')
        gmail_password = os.getenv('my_gmail_password')  # Use OAuth2 or App Password instead

        # Construct the email
        msg = MIMEMultipart()
        msg["From"] = sender_gmail  # This should be the sender's email
        msg["To"] = reciever_gmail  # This is the receiver's email
        msg["Subject"] = message_subject
        body = f"Name: {sender_name}\nEmail: {sender_gmail}\n\nSubject: {message_subject}\n\nMessage:\n{message_content}"
        msg.attach(MIMEText(body, "plain"))
      
        # Send the email using Gmail's SMTP server
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(reciever_gmail, gmail_password)  # Use credentials for reciever's account to authenticate
            server.sendmail(sender_gmail, reciever_gmail, msg.as_string())

        return jsonify({"success": True})
    
    except Exception as e:
        # Include the error message in the response for better debugging
        return jsonify({"success": False, "error": str(e)})

if __name__ == '__main__':
    # Only start the browser if this is the main process (not the reloader)
    app.run(debug=True)