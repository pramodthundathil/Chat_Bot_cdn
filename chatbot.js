(function () {
    // Get API key from script tag
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
    
    const CHAT_API_URL = "https://johnsconcept.pythonanywhere.com/chatbot_response/"; // Your AI backend URL for chat
    const COMPANY_API_URL = "https://johnsconcept.pythonanywhere.com/customer_details/"; // Company details API
    
    // Default configurations
    let botConfig = {
        chatbotColor: "#4A6FFF",
        botName: "Chat Assistant",
        companyLogo: null,
        companyName: null,
        website: null
    };
    
   // Replace the CSS section in the script with this modernized version
// Replace the CSS section in the script with this ultra-modern version
const styleEl = document.createElement('style');
styleEl.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');
    
    .chatbot-container * {
        font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
        box-sizing: border-box;
        font-size: 11px;
    }
    
    .chatbot-button {
        position: fixed;
        bottom: 24px;
        right: 24px;
        width: 50px;
        height: 50px;
        border-radius: 14px;
        background-color: #4A6FFF;
        color: white;
        border: none;
        box-shadow: 0 8px 24px rgba(74, 111, 255, 0.25);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        z-index: 1000;
    }
    
    .chatbot-button:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 28px rgba(74, 111, 255, 0.3);
    }
    
    .chatbot-box {
        position: fixed;
        bottom: 90px;
        right: 24px;
        width: 320px;
        height: 460px;
        background: white;
        border-radius: 20px;
        box-shadow: 0 16px 40px rgba(0, 0, 0, 0.12);
        overflow: hidden;
        display: none;
        flex-direction: column;
        z-index: 1000;
        transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
    }
    
    .chatbot-header {
        padding: 14px 16px;
        background: linear-gradient(125deg, #4A6FFF, #5B4FFF);
        color: white;
        font-weight: 600;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 12px;
    }
    
    .chatbot-header-title {
        display: flex;
        align-items: center;
    }
    
    .chatbot-logo {
        height: 22px;
        width: 22px;
        margin-right: 8px;
        border-radius: 8px;
        object-fit: cover;
    }
    
    .chatbot-header-dot {
        height: 8px;
        width: 8px;
        background-color: #4CD964;
        border-radius: 50%;
        margin-right: 8px;
        box-shadow: 0 0 0 2px rgba(76, 217, 100, 0.2);
    }
    
    .chatbot-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 14px;
        opacity: 0.8;
        transition: opacity 0.2s ease;
        width: 24px;
        height: 24px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .chatbot-close:hover {
        opacity: 1;
        background-color: rgba(255, 255, 255, 0.1);
    }
    
    .chatbot-messages {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
        background-color: #FAFBFF;
    }
    
    /* Scrollbar styling */
    .chatbot-messages::-webkit-scrollbar {
        width: 6px;
    }
    
    .chatbot-messages::-webkit-scrollbar-track {
        background: transparent;
    }
    
    .chatbot-messages::-webkit-scrollbar-thumb {
        background-color: rgba(0, 0, 0, 0.1);
        border-radius: 10px;
    }
    
    .chatbot-input-container {
        display: flex;
        border-top: 1px solid #F0F0F5;
        padding: 12px;
        background-color: white;
    }
    
    .chatbot-input {
        flex: 1;
        padding: 10px 14px;
        border: 1px solid #EAEDF5;
        border-radius: 12px;
        outline: none;
        transition: all 0.2s ease;
        font-size: 11px;
        background-color: #F8F9FC;
    }
    
    .chatbot-input:focus {
        border-color: #4A6FFF;
        box-shadow: 0 0 0 3px rgba(74, 111, 255, 0.1);
        background-color: white;
    }
    
    .chatbot-send {
        margin-left: 8px;
        background-color: #4A6FFF;
        color: white;
        border: none;
        border-radius: 10px;
        width: 34px;
        height: 34px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    .chatbot-send:hover {
        transform: scale(1.05);
        background-color: #3A5EEE;
    }
    
    .message {
        margin-bottom: 12px;
        max-width: 80%;
        word-wrap: break-word;
        padding: 10px 14px;
        border-radius: 16px;
        position: relative;
        animation: fadeIn 0.2s ease;
        font-size: 11px;
        line-height: 1.5;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(8px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .user-message {
        background-color: #4A6FFF;
        color: white;
        margin-left: auto;
        border-bottom-right-radius: 4px;
        font-weight: 400;
    }
    
    .bot-message {
        background-color: white;
        color: #333333;
        margin-right: auto;
        border-bottom-left-radius: 4px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }
    
    .error-message {
        background-color: #FFF0F0;
        color: #D33A3A;
        margin-right: auto;
        border-bottom-left-radius: 4px;
        border-left: 3px solid #D33A3A;
    }
    
    .typing-indicator {
        display: flex;
        padding: 12px 16px;
        background-color: white;
        border-radius: 16px;
        border-bottom-left-radius: 4px;
        margin-bottom: 12px;
        max-width: 60px;
        margin-right: auto;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }
    
    .typing-dot {
        height: 6px;
        width: 6px;
        background-color: #bbb;
        border-radius: 50%;
        margin: 0 2px;
        animation: typing 1.4s infinite;
    }
    
    .typing-dot:nth-child(1) { animation-delay: 0s; }
    .typing-dot:nth-child(2) { animation-delay: 0.2s; }
    .typing-dot:nth-child(3) { animation-delay: 0.4s; }
    
    @keyframes typing {
        0% { transform: translateY(0); opacity: 0.3; }
        50% { transform: translateY(-4px); opacity: 1; }
        100% { transform: translateY(0); opacity: 0.3; }
    }
    
    .company-info {
        text-align: center;
        padding: 8px;
        font-size: 9px;
        color: #9CA3AF;
        border-top: 1px solid #F0F0F5;
    }
    
    .company-info a {
        color: #4A6FFF;
        text-decoration: none;
        font-weight: 500;
    }
    
    /* Typing effect for bot messages */
    .typing-text {
        visibility: hidden;
    }
    
    .typing-animation {
        border-right: 2px solid #4A6FFF;
        white-space: nowrap;
        overflow: hidden;
        margin: 0;
        animation: typing-cursor 0.75s step-end infinite;
    }
    
    @keyframes typing-cursor {
        from, to { border-color: transparent }
        50% { border-color: #4A6FFF; }
    }
`;
document.head.appendChild(styleEl);



    
    // Fetch company details and initialize chatbot
    async function fetchCompanyDetails() {
        try {
            const response = await fetch(COMPANY_API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ api_key: API_KEY })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Update configuration with company details
            if (data.chatbot_color) {
                botConfig.chatbotColor = data.chatbot_color;
            }
            
            if (data.bot_name) {
                botConfig.botName = data.bot_name;
            }
            
            if (data.company && data.company.company_name) {
                botConfig.companyName = data.company.company_name;
            }
            
            if (data.company && data.company.website) {
                botConfig.website = data.company.website;
            }
            
            if (data.company && data.company.company_logo) {
                botConfig.companyLogo = data.company.company_logo;
                // If it's a relative URL, make it absolute
                if (botConfig.companyLogo.startsWith('/')) {
                    const baseUrl = new URL(COMPANY_API_URL).origin;
                    botConfig.companyLogo = baseUrl + botConfig.companyLogo;
                }
            }
            
            console.log("Company details loaded:", botConfig);
            
            // Now initialize the chatbot with the fetched config
            initChatbot();
            
        } catch (error) {
            console.error("Error fetching company details:", error);
            
            // Initialize with default config if there's an error
            initChatbot();
        }
    }
    
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fetchCompanyDetails);
    } else {
        fetchCompanyDetails();
    }
    
    function updateChatbotStyles() {
        const chatButton = document.querySelector(".chatbot-button");
        const chatHeader = document.querySelector(".chatbot-header");
        const sendButton = document.querySelector(".chatbot-send");
        const userMessages = document.querySelectorAll(".user-message");
        
        if (chatButton) {
            chatButton.style.backgroundColor = botConfig.chatbotColor;
        }
        
        if (chatHeader) {
            chatHeader.style.background = `linear-gradient(135deg, ${botConfig.chatbotColor}, ${adjustColor(botConfig.chatbotColor, -20)})`;
        }
        
        if (sendButton) {
            sendButton.style.backgroundColor = botConfig.chatbotColor;
        }
        
        userMessages.forEach(msg => {
            msg.style.backgroundColor = botConfig.chatbotColor;
        });
        
        // Update chat input focus color
        styleEl.textContent += `
            .chatbot-input:focus {
                border-color: ${botConfig.chatbotColor};
            }
        `;
    }
    
    // Helper to darken/lighten a color
    function adjustColor(color, amount) {
        let usePound = false;
        
        if (color[0] === "#") {
            color = color.slice(1);
            usePound = true;
        }
        
        let R = parseInt(color.substring(0, 2), 16);
        let G = parseInt(color.substring(2, 4), 16);
        let B = parseInt(color.substring(4, 6), 16);
        
        R = Math.max(0, Math.min(255, R + amount));
        G = Math.max(0, Math.min(255, G + amount));
        B = Math.max(0, Math.min(255, B + amount));
        
        const RR = R.toString(16).padStart(2, '0');
        const GG = G.toString(16).padStart(2, '0');
        const BB = B.toString(16).padStart(2, '0');
        
        return (usePound ? "#" : "") + RR + GG + BB;
    }
    
    function initChatbot() {
        // Create chat button with SVG icon
        const chatButton = document.createElement("button");
        chatButton.className = "chatbot-button";
        chatButton.style.backgroundColor = botConfig.chatbotColor;
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
        chatHeader.style.background = `linear-gradient(135deg, ${botConfig.chatbotColor}, ${adjustColor(botConfig.chatbotColor, -20)})`;
        
        const headerTitle = document.createElement("div");
        headerTitle.className = "chatbot-header-title";
        
        // Add logo if available
        if (botConfig.companyLogo) {
            const logo = document.createElement("img");
            logo.className = "chatbot-logo";
            logo.src = botConfig.companyLogo;
            logo.alt = botConfig.companyName || "Logo";
            headerTitle.appendChild(logo);
        } else {
            const statusDot = document.createElement("div");
            statusDot.className = "chatbot-header-dot";
            headerTitle.appendChild(statusDot);
        }
        
        const headerText = document.createElement("span");
        headerText.innerText = botConfig.botName;
        
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
        sendButton.style.backgroundColor = botConfig.chatbotColor;
        sendButton.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill="white"/>
            </svg>
        `;
        chatInputContainer.appendChild(sendButton);
        
        // Add company info if available
        if (botConfig.companyName && botConfig.website) {
            const companyInfo = document.createElement("div");
            companyInfo.className = "company-info";
            companyInfo.innerHTML = `Powered by <a href="${botConfig.website}"  target="_blank">${botConfig.companyName}</a>`;
            chatBox.appendChild(companyInfo);
        }

        // Event listeners
        chatButton.addEventListener("click", () => {
            chatBox.style.display = "flex";
            chatButton.style.display = "none";
            
            // Add welcome message if this is the first open
            if (chatMessages.children.length === 0) {
                addBotMessage(`Hello! I'm ${botConfig.botName}. How can I help you today?`);
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
             // Implement typing effect
    let i = 0;
    const speed = 30; // typing speed in milliseconds
    
    function typeWriter() {
        if (i < text.length) {
            textSpan.textContent += text.charAt(i);
            i++;
            chatMessages.scrollTop = chatMessages.scrollHeight;
            setTimeout(typeWriter, speed);
        } else {
            // Remove typing animation class when done
            textSpan.className = "";
        }
    }
    
    // Start typing effect
    setTimeout(typeWriter, 200);
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
        // Generate a unique session ID (uid) per session
        const session_id = localStorage.getItem("session_id") || crypto.randomUUID();
        localStorage.setItem("session_id", session_id);
        console.log(session_id)
        async function sendMessage() {
            const userMessage = chatInput.value.trim();
            if (!userMessage) return;

            // Display user message
            const userMsgElem = document.createElement("div");
            userMsgElem.className = "message user-message";
            userMsgElem.style.backgroundColor = botConfig.chatbotColor;
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
                
                const response = await fetch(CHAT_API_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${API_KEY}`
                    },
                    body: JSON.stringify({ 
                        api_key: API_KEY,
                        message: userMessage,
                        session_id: session_id
                        
                          })

                          
                });
                
                // Remove typing indicator
                typingIndicator.remove();
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                console.log(data)
                const botMessage = data.response || "Sorry, I didn't understand that.";
                
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