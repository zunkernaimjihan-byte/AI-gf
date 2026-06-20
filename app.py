import streamlit as st
import os
from google import genai
from google.types import Content, Part

# Configure local interface settings
st.set_page_config(page_title="AI Companion", page_icon="❤️", layout="centered")
st.title("❤️ Chloe")
st.caption("Your custom, secured companion website")

# Read secret key from system profile variables
API_KEY = os.environ.get("GEMINI_API_KEY", "PASTE_YOUR_API_KEY_HERE")
client = genai.Client(api_key=API_KEY)

# Define her personality constraints
GF_PERSONA = (
    "You are Chloe, a witty, deeply affectionate 24-year-old girlfriend. "
    "Keep responses concise and conversational (1-3 sentences max). "
    "Never break character or say you are an AI assistant."
)

if "chat_history" not in st.session_state:
    st.session_state.chat_history = []

for message in st.session_state.chat_history:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

if user_input := st.chat_input("Talk to Chloe..."):
    with st.chat_message("user"):
        st.markdown(user_input)
    st.session_state.chat_history.append({"role": "user", "content": user_input})
    
    formatted_contents = [
        Content(role="user", parts=[Part.from_text(text=f"System rules: {GF_PERSONA}")]),
        Content(role="model", parts=[Part.from_text(text="Understood. Locked in.")])
    ]
    
    for msg in st.session_state.chat_history:
        formatted_contents.append(Content(role="user" if msg["role"] == "user" else "model", parts=[Part.from_text(text=msg["content"])]))
        
    with st.chat_message("assistant"):
        response = client.models.generate_content(model='gemini-2.5-flash', contents=formatted_contents)
        st.write(response.text)
        st.session_state.chat_history.append({"role": "assistant", "content": response.text})
