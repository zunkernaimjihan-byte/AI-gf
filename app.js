const API_KEY = "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";

// ================= CHAT UI =================

function addMessage(text, type) {
  let chat = document.getElementById("chat");

  let div = document.createElement("div");
  div.className = "msg " + type;
  div.innerText = text;

  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

// typing animation (bot only)
function typeMessage(text) {
  let chat = document.getElementById("chat");

  let div = document.createElement("div");
  div.className = "msg bot";
  chat.appendChild(div);

  let i = 0;

  let interval = setInterval(() => {
    div.innerText = text.slice(0, i);
    i++;

    if (i > text.length) {
      clearInterval(interval);
      chat.scrollTop = chat.scrollHeight;
    }
  }, 20);
}

// ================= SEND MESSAGE =================

async function sendMessage() {
  let input = document.getElementById("input");
  let text = input.value.trim();

  if (!text) return;

  addMessage(text, "user");
  input.value = "";

  // MEMORY COMMAND
  if (text.toLowerCase().startsWith("remember ")) {
    let memory = text.slice(9).trim();
    saveMemory(memory);
    typeMessage("I will remember that ❤️");
    return;
  }

  // AI RESPONSE
  let reply = await getAIResponse(text);
  typeMessage(reply);
}

// ================= GEMINI AI =================

async function getAIResponse(userText) {

  let memoryText = getMemoryText();

  let prompt = `
You are Chloe, a friendly AI girlfriend.

Rules:
- Be emotional, natural and caring
- Keep replies short (1-3 lines)
- Stay in character always
- Never mention AI

User memories:
${memoryText}

User message:
${userText}

Chloe:
`;

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    return (
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I couldn't think properly right now..."
    );

  } catch (error) {
    return "Connection problem... try again later ❤️";
  }
}