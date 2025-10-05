const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

// Zapier webhook
const API_URL = "https://hooks.zapier.com/hooks/catch/24869704/u9asgak/";

// Your backend to fetch AI responses
const BACKEND_URL = "https://your-backend.onrender.com";

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.classList.add("msg", sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  addMessage(text, "user");
  userInput.value = "";

  // Send to Zapier
  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: text })
  })
  .catch(() => {
    addMessage("⚠️ Error sending message.", "bot");
  });

  addMessage("🤖 AI: I'm thinking...", "bot");
}

// Poll backend every 2 seconds for AI response
async function fetchAIResponse() {
  try {
    const res = await fetch(`${BACKEND_URL}/latest-response`);
    const data = await res.json();
    if (data.response) {
      addMessage(data.response, "bot");
      // Clear response after showing
      await fetch(`${BACKEND_URL}/clear-response`, { method: "POST" });
    }
  } catch (err) {
    console.error("Error fetching AI response:", err);
  }
}

setInterval(fetchAIResponse, 2000);
