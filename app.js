const API_KEY = "YOUR_OPENAI_API_KEY";

// ================= CHAT UI =================

function addMessage(text, type) {
  let chat = document.getElementById("chat");

  let div = document.createElement("div");
  div.className = "msg " + type;
  div.innerText = text;

  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

// typing animation
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

  // memory save command
  if (text.toLowerCase().startsWith("remember ")) {
    let memory = text.slice(9).trim();
    saveMemory(memory);
    typeMessage("I will remember that ❤️");
    return;
  }

  let reply = await getAIResponse(text);
  typeMessage(reply);
}

// ================= OPENAI API =================

async function getAIResponse(userText) {

  let memoryText = getMemoryText();

  const messages = [
    {
      role: "system",
      content: `
You are Chloe, a friendly AI girlfriend.

Rules:
- Be emotional, caring, natural
- Keep replies short (1-3 lines)
- Never say you are AI or ChatGPT

User memories:
${memoryText}
`
    },
    {
      role: "user",
      content: userText
    }
  ];

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + API_KEY
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: messages,
        temperature: 0.9
      })
    });

    const data = await res.json();

    console.log(data);

    if (!data.choices || data.choices.length === 0) {
      return "No response from AI...";
    }

    return data.choices[0].message.content;

  } catch (err) {
    console.log(err);
    return "Network error... try again ❤️";
  }
}