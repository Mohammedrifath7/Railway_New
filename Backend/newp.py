import os
import sys
import requests
import base64
from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client['railmadad']

HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large"
huggingface_headers = {"Authorization": f"Bearer {os.getenv('HUGGINGFACE_API')}"}

GROQ_API_URL = "https://api.groq.com/v1/classify"
groq_headers = {
    "Authorization": f"Bearer {os.getenv('GROQ_API')}",
    "Content-Type": "application/json"
}
GROQ_API_KEY = os.getenv("GROQ_API")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BASE_IMAGE_PATH = os.path.join(BASE_DIR, "uploads")

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
    
    client = Groq(api_key=GROQ_API_KEY)
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
        model="llama-3.3-70b-versatile"
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
