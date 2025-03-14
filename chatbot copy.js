(function () {
    // Get API key more reliably - handles both script name possibilities
    let API_KEY = "DEFAULT_API_KEY"; // Fallback default
    let scriptTag = document.querySelector('script[src*="chatbot.js"]');
    
    // If not found, try with chat.js
    if (!scriptTag) {
        scriptTag = document.querySelector('script[src*="chat.js"]');
    }
    
    // If found, get API key
    if (scriptTag) {
        API_KEY = scriptTag.getAttribute("data-api-key") || API_KEY;
    }
    
    const API_URL = "https://your-backend.com/chat"; // Your AI backend URL
    console.log("Using API Key:", API_KEY);
    
    // Add CSS styles
    const styleEl = document.createElement('style');
    styleEl.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap');
        
        .chatbot-container * {
            font-family: 'Roboto', sans-serif;
            box-sizing: border-box;
        }
        
        .chatbot-button {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background-color: #4A6FFF;
            color: white;
            border: none;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            z-index: 1000;
        }
        
        .chatbot-button:hover {
            background-color: #3A5EEE;
            transform: scale(1.05);
        }
        
        .chatbot-box {
            position: fixed;
            bottom: 90px;
            right: 20px;
            width: 350px;
            height: 500px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
            overflow: hidden;
            display: none;
            flex-direction: column;
            z-index: 1000;
            transition: all 0.3s ease;
        }
        
        .chatbot-header {
            padding: 15px;
            background: linear-gradient(135deg, #4A6FFF, #3A5EEE);
            color: white;
            font-weight: 500;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
        .chatbot-header-title {
            display: flex;
            align-items: center;
        }
        
        .chatbot-header-dot {
            height: 10px;
            width: 10px;
            background-color: #4CD964;
            border-radius: 50%;
            margin-right: 8px;
        }
        
        .chatbot-close {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            font-size: 16px;
        }
        
        .chatbot-messages {
            flex: 1;
            overflow-y: auto;
            padding: 15px;
            background-color: #F5F7FB;
        }
        
        .chatbot-input-container {
            display: flex;
            border-top: 1px solid #EAEAEA;
            padding: 10px;
            background-color: white;
        }
        
        .chatbot-input {
            flex: 1;
            padding: 12px 15px;
            border: 1px solid #EAEAEA;
            border-radius: 20px;
            outline: none;
            transition: border 0.3s ease;
        }
        
        .chatbot-input:focus {
            border-color: #4A6FFF;
        }
        
        .chatbot-send {
            margin-left: 10px;
            background-color: #4A6FFF;
            color: white;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .chatbot-send:hover {
            background-color: #3A5EEE;
            transform: scale(1.05);
        }
        
        .message {
            margin-bottom: 15px;
            max-width: 80%;
            word-wrap: break-word;
            padding: 12px 15px;
            border-radius: 18px;
            position: relative;
            animation: fadeIn 0.3s ease;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .user-message {
            background-color: #4A6FFF;
            color: white;
            margin-left: auto;
            border-bottom-right-radius: 5px;
        }
        
        .bot-message {
            background-color: white;
            color: #333333;
            margin-right: auto;
            border-bottom-left-radius: 5px;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }
        
        .error-message {
            background-color: #FFE0E0;
            color: #D33A3A;
            margin-right: auto;
            border-bottom-left-radius: 5px;
        }
        
        .typing-indicator {
            display: flex;
            padding: 12px 15px;
            background-color: white;
            border-radius: 18px;
            border-bottom-left-radius: 5px;
            margin-bottom: 15px;
            max-width: 100px;
            margin-right: auto;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }
        
        .typing-dot {
            height: 8px;
            width: 8px;
            background-color: #bbb;
            border-radius: 50%;
            margin: 0 3px;
            animation: typing 1.4s infinite;
        }
        
        .typing-dot:nth-child(1) { animation-delay: 0s; }
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }
        
        @keyframes typing {
            0% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
            100% { transform: translateY(0); }
        }
    `;
    document.head.appendChild(styleEl);
    
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initChatbot);
    } else {
        initChatbot();
    }
    
    function initChatbot() {
        // Create chat button with SVG icon
        const chatButton = document.createElement("button");
        chatButton.className = "chatbot-button";
        chatButton.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 2H4C2.9 2 2.01 2.9 2.01 4L2 22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM9 11H7V9H9V11ZM13 11H11V9H13V11ZM17 11H15V9H17V11Z" fill="white"/>
            </svg>
        `;
        document.body.appendChild(chatButton);

        // Create chat container
        const chatBox = document.createElement("div");
        chatBox.className = "chatbot-box";
        document.body.appendChild(chatBox);

        // Header with status and close button
        const chatHeader = document.createElement("div");
        chatHeader.className = "chatbot-header";
        
        const headerTitle = document.createElement("div");
        headerTitle.className = "chatbot-header-title";
        
        const statusDot = document.createElement("div");
        statusDot.className = "chatbot-header-dot";
        
        const headerText = document.createElement("span");
        headerText.innerText = "Chat Assistant";
        
        headerTitle.appendChild(statusDot);
        headerTitle.appendChild(headerText);
        
        const closeButton = document.createElement("button");
        closeButton.className = "chatbot-close";
        closeButton.innerHTML = "✕";
        
        chatHeader.appendChild(headerTitle);
        chatHeader.appendChild(closeButton);
        chatBox.appendChild(chatHeader);

        // Messages container
        const chatMessages = document.createElement("div");
        chatMessages.className = "chatbot-messages";
        chatBox.appendChild(chatMessages);

        // Input area
        const chatInputContainer = document.createElement("div");
        chatInputContainer.className = "chatbot-input-container";
        chatBox.appendChild(chatInputContainer);

        const chatInput = document.createElement("input");
        chatInput.className = "chatbot-input";
        chatInput.placeholder = "Type a message...";
        chatInputContainer.appendChild(chatInput);

        const sendButton = document.createElement("button");
        sendButton.className = "chatbot-send";
        sendButton.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill="white"/>
            </svg>
        `;
        chatInputContainer.appendChild(sendButton);

        // Event listeners
        chatButton.addEventListener("click", () => {
            chatBox.style.display = "flex";
            chatButton.style.display = "none";
            
            // Add welcome message if this is the first open
            if (chatMessages.children.length === 0) {
                addBotMessage("Hello! How can I help you today?");
            }
        });
        
        closeButton.addEventListener("click", () => {
            chatBox.style.display = "none";
            chatButton.style.display = "flex";
        });

        sendButton.addEventListener("click", sendMessage);
        chatInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                sendMessage();
            }
        });

        // Helper function to add a bot message
        function addBotMessage(text) {
            const botMsgElem = document.createElement("div");
            botMsgElem.className = "message bot-message";
            botMsgElem.innerText = text;
            chatMessages.appendChild(botMsgElem);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
        
        // Helper function to show typing indicator
        function showTypingIndicator() {
            const typingIndicator = document.createElement("div");
            typingIndicator.className = "typing-indicator";
            typingIndicator.innerHTML = `
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            `;
            chatMessages.appendChild(typingIndicator);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            return typingIndicator;
        }

        async function sendMessage() {
            const userMessage = chatInput.value.trim();
            if (!userMessage) return;

            // Display user message
            const userMsgElem = document.createElement("div");
            userMsgElem.className = "message user-message";
            userMsgElem.innerText = userMessage;
            chatMessages.appendChild(userMsgElem);
            chatInput.value = "";
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            // Show typing indicator
            const typingIndicator = showTypingIndicator();
            
            // Send request to backend
            try {
                // Simulate network delay (remove in production)
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                const response = await fetch(API_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${API_KEY}`
                    },
                    body: JSON.stringify({ message: userMessage })
                });
                
                // Remove typing indicator
                typingIndicator.remove();
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                const botMessage = data.reply || "Sorry, I didn't understand that.";
                
                // Display bot message
                addBotMessage(botMessage);
                
            } catch (error) {
                console.error("Error:", error);
                
                // Remove typing indicator
                typingIndicator.remove();
                
                // Show error message
                const errorMsgElem = document.createElement("div");
                errorMsgElem.className = "message error-message";
                errorMsgElem.innerText = "Sorry, there was an error connecting to the server. Please try again later.";
                chatMessages.appendChild(errorMsgElem);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        }
    }
})();