import os
import sys
import requests
import base64
from pymongo import MongoClient
from bson import ObjectId
from groq import Groq

client = MongoClient('mongodb://localhost:27017/')
db = client['railmadad']

HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large"
huggingface_headers = {"Authorization": "Bearer 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"}

GROQ_API_URL = "https://api.groq.com/v1/classify"
groq_headers = {
    "Authorization": "Bearer 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",
    "Content-Type": "application/json"
}

BASE_IMAGE_PATH = "D:/Projects/UI/Railway/Backend/uploads"

def query_huggingface(filename):
    with open(filename, "rb") as f:
        data = f.read()
        encoded_image = base64.b64encode(data).decode("utf-8")
    payload = {"inputs": encoded_image}
    
    response = requests.post(HUGGINGFACE_API_URL, headers=huggingface_headers, json=payload)
    
    if response.status_code == 200:
        result = response.json()
        if isinstance(result, list) and len(result) > 0:
            return result[0].get("generated_text", "No caption generated.")
        else:
            return "Unexpected response format from Hugging Face API."
    else:
        raise Exception(f"Error: {response.status_code}, {response.text}")

def classify_text_with_groq(text_data):
    client = Groq(api_key="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")
    prompt = (
        f"Given the description '{text_data}', classify the issue into one of the following categories:\n"
        "\"Medical Assistance\", \"Security\", \"Divyangjan Facilities\", "
        "\"Facilities for Women with Special needs\", \"Electrical Equipment\", "
        "\"Coach-Cleanliness\", \"Punctuality\", \"Water Availability\", "
        "\"Coach-Maintenance\", \"Catering & Vending Service\", "
        "\"Staff Behaviour\", \"Corruption/Bribery\", \"Bed Roll\", \"Miscellaneous\"."
        "Do not give any additional text, only return the category."
    )

    response = client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model="llama3-8b-8192"
    )
    
    return response.choices[0].message.content

try:
    # Get the caption input (either problem description or image path)
    caption_input = sys.argv[1]

    if os.path.exists(caption_input):  # Check if it's an image path
        text_output = query_huggingface(caption_input)
    else:
        text_output = caption_input  # If it's a problem description, use it directly

    print(f"Image Caption: {text_output}")
    
    department = classify_text_with_groq(text_output)
    print(f"Department: {department}")

except Exception as e:
    print(f"Error: {e}")
