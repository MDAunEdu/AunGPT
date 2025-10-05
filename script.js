const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

// Your Zapier webhook URL (send user message)
const ZAPIER_HOOK = "https://hooks.zapier.com/hooks/catch/24869704/u9asgak/";

// Temporary endpoint to fetch AI responses
const AI_RESPONSE_URL = "https://api.jsonbin.io/v3/b/YOUR_BIN_ID/latest"; // replace with your JSON bin

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

  addMessage("🤖 AI: I'm thinking...", "bot");

  fetch(ZAPIER_HOOK, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: text })
  })
  .catch(() => addMessage("⚠️ Error sending message to Zapier.", "bot"));
}

// Poll for AI response every 2 seconds
async function fetchAIResponse() {
  try {
    const res = await fetch(AI_RESPONSE_URL, {
      headers: { "X-Master-Key": "$YOUR_JSONBIN_KEY" } // only if using JSONBin
    });
    const data = await res.json();

    if (data.record && data.record.response) {
      addMessage(data.record.response, "bot");
      // Clear response after showing (optional)
      await fetch(AI_RESPONSE_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Master-Key": "$YOUR_JSONBIN_KEY"
        },
        body: JSON.stringify({ response: "" })
      });
    }
  } catch (err) {
    console.error(err);
  }
}

setInterval(fetchAIResponse, 2000);
