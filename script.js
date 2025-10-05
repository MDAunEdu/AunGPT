const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

// Replace with your API endpoint (Zapier, OpenAI, or any backend automation)
const API_URL = "https://hooks.zapier.com/hooks/catch/YOUR_ZAP_ID/";

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

  // Send to Zapier or backend
  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: text })
  })
  .then(res => res.json())
  .then(data => {
    addMessage(data.reply || "🤖 AI: I'm thinking...", "bot");
  })
  .catch(() => {
    addMessage("⚠️ Error connecting to server.", "bot");
  });
}
