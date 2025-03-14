(function () {
    const scriptTag = document.querySelector('script[src*="chatbot.js"]');
    const API_KEY = scriptTag.getAttribute("data-api-key");
    const API_URL = "https://your-backend.com/chat"; // Your AI backend URL
    console.log(API_KEY)
    // Create chatbot button and container
    const chatButton = document.createElement("button");
    chatButton.innerText = "Chat with us";
    chatButton.style.position = "fixed";
    chatButton.style.bottom = "20px";
    chatButton.style.right = "20px";
    chatButton.style.zIndex = "1000";
    chatButton.style.padding = "10px 15px";
    chatButton.style.background = "#007bff";
    chatButton.style.color = "#fff";
    chatButton.style.border = "none";
    chatButton.style.borderRadius = "5px";
    chatButton.style.cursor = "pointer";
    document.body.appendChild(chatButton);

    const chatBox = document.createElement("div");
    chatBox.style.display = "none";
    chatBox.style.position = "fixed";
    chatBox.style.bottom = "70px";
    chatBox.style.right = "20px";
    chatBox.style.width = "300px";
    chatBox.style.height = "400px";
    chatBox.style.background = "#fff";
    chatBox.style.border = "1px solid #ccc";
    chatBox.style.borderRadius = "10px";
    chatBox.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
    chatBox.style.overflow = "hidden";
    chatBox.style.display = "flex";
    chatBox.style.flexDirection = "column";
    document.body.appendChild(chatBox);

    const chatHeader = document.createElement("div");
    chatHeader.style.padding = "10px";
    chatHeader.style.background = "#007bff";
    chatHeader.style.color = "#fff";
    chatHeader.style.textAlign = "center";
    chatHeader.innerText = "Chatbot";
    chatBox.appendChild(chatHeader);

    const chatMessages = document.createElement("div");
    chatMessages.style.flex = "1";
    chatMessages.style.overflowY = "auto";
    chatMessages.style.padding = "10px";
    chatMessages.style.maxHeight = "320px";
    chatBox.appendChild(chatMessages);

    const chatInputContainer = document.createElement("div");
    chatInputContainer.style.display = "flex";
    chatInputContainer.style.borderTop = "1px solid #ccc";
    chatBox.appendChild(chatInputContainer);

    const chatInput = document.createElement("input");
    chatInput.style.flex = "1";
    chatInput.style.padding = "10px";
    chatInput.style.border = "none";
    chatInput.style.outline = "none";
    chatInput.placeholder = "Type a message...";
    chatInputContainer.appendChild(chatInput);

    const sendButton = document.createElement("button");
    sendButton.innerText = "Send";
    sendButton.style.padding = "10px";
    sendButton.style.background = "#007bff";
    sendButton.style.color = "#fff";
    sendButton.style.border = "none";
    sendButton.style.cursor = "pointer";
    chatInputContainer.appendChild(sendButton);

    chatButton.addEventListener("click", () => {
        chatBox.style.display = chatBox.style.display === "none" ? "block" : "none";
    });

    sendButton.addEventListener("click", async () => {
        const userMessage = chatInput.value.trim();
        if (!userMessage) return;

        // Display user message
        const userMsgElem = document.createElement("div");
        userMsgElem.innerText = "You: " + userMessage;
        userMsgElem.style.margin = "5px 0";
        userMsgElem.style.padding = "5px";
        userMsgElem.style.background = "#eee";
        chatMessages.appendChild(userMsgElem);
        chatInput.value = "";
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Send request to backend
        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${API_KEY}`
                },
                body: JSON.stringify({ message: userMessage })
            });
            const data = await response.json();
            const botMessage = data.reply || "Sorry, I didn't understand.";

            // Display bot message
            const botMsgElem = document.createElement("div");
            botMsgElem.innerText = "Bot: " + botMessage;
            botMsgElem.style.margin = "5px 0";
            botMsgElem.style.padding = "5px";
            botMsgElem.style.background = "#dff0d8";
            chatMessages.appendChild(botMsgElem);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        } catch (error) {
            console.error("Error:", error);
        }
    });

})();
