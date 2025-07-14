from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences
import re
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

# Download NLTK resources (once)
nltk.download('stopwords')
nltk.download('wordnet')

# Load tokenizer and model
tokenizer = joblib.load("backend/model/tokenizer.pkl")
model = load_model("backend/model/spam_lstm_model.h5")

# Text preprocessing
stop_words = set(stopwords.words('english'))
lemmatizer = WordNetLemmatizer()

def clean_text(text):
    text = text.lower()
    text = re.sub(r"http\S+|www\S+|https\S+", "", text)
    text = re.sub(r'\@w+|\#','', text)
    text = re.sub(r'[^A-Za-z\s]', '', text)
    words = text.split()
    words = [lemmatizer.lemmatize(word) for word in words if word not in stop_words]
    return " ".join(words)

# FastAPI app
app = FastAPI()

class Comment(BaseModel):
    text: str

@app.get("/")
def read_root():
    return {"message": "Instagram Spam Detection API with LSTM is live!"}

@app.post("/predict")
def predict_spam(comment: Comment):
    cleaned = clean_text(comment.text)

    # Tokenize and pad
    sequence = tokenizer.texts_to_sequences([cleaned])
    padded = pad_sequences(sequence, maxlen=100)

    # Predict
    prediction = model.predict(padded)[0][0]
    label = "spam" if prediction > 0.5 else "not spam"

    return {
        "prediction": label,
        "probability": float(prediction),
        "input": comment.text,
        "cleaned": cleaned
    }
