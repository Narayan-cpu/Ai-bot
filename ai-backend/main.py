from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

app = FastAPI()

# 🚀 Add CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # allow all (or put your Vercel URL)
    allow_credentials=True,
    allow_methods=["*"],   # allow POST, GET, OPTIONS
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
async def chat(req: ChatRequest):
    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": "You are a helpful AI assistant."},
            {"role": "user", "content": req.message},
        ],
    )

    reply_text = response.choices[0].message.content
    return {"reply": reply_text}
