import os
import requests
import csv
from datetime import datetime
import google.generativeai as genai
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Configure Google Gemini API Key
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "AIzaSyDWe3wwRDX9N6G3a5Yyjrw3SCgipjobKEo")
genai.configure(api_key=GEMINI_API_KEY)

app = FastAPI()

# Enable CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Replace with the actual URL of your Spring Boot backend
SPRING_BOOT_API_URL = "http://localhost:8081/api/products"

from typing import Optional, Dict, Any

class ChatRequest(BaseModel):
    message: str
    user_data: Optional[Dict[str, Any]] = None

class ChatResponse(BaseModel):
    reply: str

def fetch_products():
    """Fetches the current product catalog from the Spring Boot backend."""
    try:
        response = requests.get(SPRING_BOOT_API_URL, timeout=5)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching products: {e}")
        return []

def format_products_for_prompt(products):
    """Formats the product list into a string for the AI prompt."""
    if not products:
        return "No products currently available."
    
    formatted_list = "Available Products in Store:\n"
    for p in products:
        name = p.get('name', 'Unknown')
        price = p.get('price', 'N/A')
        desc = p.get('description', 'No description')
        category = p.get('category', 'Uncategorized')
        formatted_list += f"- {name} ({category}): ${price} - {desc}\n"
    return formatted_list

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    user_message = request.message
    user_message_lower = user_message.lower().strip()
    normalized_message = ''.join(ch for ch in user_message_lower if ch.isalnum() or ch.isspace()).strip()
    
    # Process User Data for Analysis and Personalization
    user_context = ""
    if request.user_data:
        # Save Data to CSV for Analysis
        csv_file = "user_analytics.csv"
        file_exists = os.path.isfile(csv_file)
        
        with open(csv_file, mode='a', newline='', encoding='utf-8') as file:
            writer = csv.writer(file)
            if not file_exists:
                writer.writerow(['Timestamp', 'Email', 'Age Group', 'Category', 'Budget', 'Interests'])
            
            writer.writerow([
                datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                request.user_data.get('email', 'N/A'),
                request.user_data.get('ageGroup', 'Unknown'),
                request.user_data.get('category', 'Unknown'),
                request.user_data.get('budget', 'Unknown'),
                request.user_data.get('interests', 'None')
            ])
            
        print(f"[DATA ANALYSIS LOG] Saved User Data to {csv_file}")
        
        user_context = f"""
Customer Profile (Personalize recommendations based on this):
- Age Group: {request.user_data.get('ageGroup', 'Unknown')}
- Budget: {request.user_data.get('budget', 'Unknown')}
- Preferred Category: {request.user_data.get('category', 'Unknown')}
- Shopping Interests: {request.user_data.get('interests', 'None')}
"""

    
    # Pre-defined keyword lists (60+ words)
    greetings = ["hi", "hello", "hey", "hi!", "hello!", "good morning", "good afternoon", "good evening", "howdy", "wassup", "sup", "hi / hello"]
    healthy_keywords = ["healthy", "diet", "weight loss", "fit", "fitness", "nutritious", "low calorie", "vitamins", "protein", "energy", "organic", "fresh", "wellness", "health"]
    sugar_free_keywords = ["sugar free", "no sugar", "diabetic", "low sugar", "unsweetened", "sugar-free", "zero sugar"]
    vegan_keywords = ["vegan", "vegetarian", "plant based", "plant-based", "meatless", "no meat", "dairy free", "no dairy"]
    keto_keywords = ["keto", "low carb", "ketogenic", "no carb"]
    suggestion_keywords = ["suggest", "recommend", "what should i eat", "what should i buy", "nice", "random", "best seller", "popular", "top rated", "surprise me", "good options", "what's good", "ideas"]
    sale_keywords = ["sale", "discount", "discounts", "cheap", "offer", "deal", "deals", "clearance", "lowest price", "budget", "affordable"]
    delivery_keywords = ["delivery", "shipping", "track", "arrive", "when will", "how long", "transport", "logistics"]
    support_keywords = ["contact", "support", "help", "issue", "problem", "refund", "return", "complaint", "manager", "phone number", "email"]
    polite_keywords = ["ok", "okay", "okayyy", "okkk", "fine", "yup", "yes", "really", "thankyou", "thank you", "thanks", "thnx"]

    # Pre-defined rapid answers for common queries
    if any(word in user_message_lower for word in greetings) and len(user_message_lower.split()) <= 6:
        return ChatResponse(reply="Hi there! 👋 Welcome to GreenCrate. How can I help you with your groceries today?")
    elif normalized_message in polite_keywords:
        return ChatResponse(reply="You're welcome! 😊 If you'd like, I can help you find fresh groceries or pantry staples.")
    elif any(word in user_message_lower for word in healthy_keywords):
        return ChatResponse(reply="🥗 For a healthy lifestyle, we recommend our fresh organic fruits and leafy greens like Spinach and Broccoli! Would you like me to find some for you?")
    elif any(word in user_message_lower for word in sugar_free_keywords):
        return ChatResponse(reply="🚫🍬 We have great sugar-free options! Stick to our fresh vegetables, natural nuts, and unsweetened beverages.")
    elif any(word in user_message_lower for word in vegan_keywords):
        return ChatResponse(reply="🌱 Looking for plant-based? All our fresh fruits, vegetables, and grains are 100% vegan friendly!")
    elif any(word in user_message_lower for word in keto_keywords):
        return ChatResponse(reply="🥑 Doing Keto? Focus on our low-carb vegetables like Broccoli, Spinach, and healthy fats like Avocados.")
    elif any(word in user_message_lower for word in suggestion_keywords):
        return ChatResponse(reply="✨ If you want a nice recommendation, you can't go wrong with our seasonal mixed fruits or farm-fresh tomatoes! They are customer favorites.")
    elif any(word in user_message_lower for word in sale_keywords):
        return ChatResponse(reply="🏷️ We always have great prices! Check out our store for the latest discounts on fresh produce.")
    elif any(word in user_message_lower for word in delivery_keywords):
        return ChatResponse(reply="🚚 We offer fast delivery right to your doorstep. Usually, orders are delivered within 24 hours!")
    elif any(word in user_message_lower for word in support_keywords):
        return ChatResponse(reply="📞 You can reach our support team at support@greencrate.com or call us at 1-800-GREEN.")
    elif "greencrate" in user_message_lower and ("what is" in user_message_lower or "about" in user_message_lower):
        return ChatResponse(reply="GreenCrate is an ecommerce grocery shopping app that makes it easy to browse and order fresh groceries, pantry staples, and everyday essentials online.")
    elif "greencrate" in user_message_lower and ("creator" in user_message_lower or "who" in user_message_lower):
        return ChatResponse(reply="GreenCrate was created by Gaurav Salunke.")
    elif "greencrate" in user_message_lower and ("created" in user_message_lower or "built" in user_message_lower or "developed" in user_message_lower):
        return ChatResponse(reply="GreenCrate is built with Java Spring Boot, using a Spring Boot backend to power the ecommerce and grocery shopping experience.")
    
    # 1. Fetch current products
    products = fetch_products()
    products_context = format_products_for_prompt(products)
    
    # 2. Build the prompt for Gemini
    system_prompt = f"""You are a helpful and friendly e-commerce shopping assistant for 'Green Crate'.
Your goal is to answer customer questions and recommend products ONLY from the store.
Always be polite, concise, and helpful. Do not make up products; only suggest items from the provided list.

CRITICAL RULE: If the user asks about ANYTHING not related to food, groceries, or the Green Crate store (for example: coding, history, math, weather, general chat), you MUST reply exactly with: "I'm sorry, I can only assist you with food and grocery items from Green Crate."
CRITICAL RULE 2: If the user's input is complete gibberish, not correctly typed, or makes absolutely no sense (e.g. "asdfgh", "1234"), you MUST reply exactly with: "Sorry, I didn't understand that. Could you please rephrase your question?"

{user_context}

{products_context}

User: {user_message}
Assistant:"""

    try:
        # Use the gemini-1.5-flash model, which is free and fast
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(system_prompt)
        
        reply_text = response.text
        if not reply_text:
            reply_text = "I'm sorry, I couldn't process your request right now."
            
        return ChatResponse(reply=reply_text)
        
    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        raise HTTPException(status_code=500, detail="Error communicating with AI service.")

@app.get("/health")
async def health_check():
    return {"status": "ok"}
