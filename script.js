let uploadImage=document.querySelector("#uploadImage")
let inputImage=document.querySelector("#inputImage")
let prompt=document.querySelector("#prompt")
let container=document.querySelector(".container")
let ChatContainer=document.querySelector(".chat-container")
let btn=document.querySelector("#btn")
let selectedImage = null;
let conversation = [
    {
        role: "system",
        content: `
You are Suresh's personal AI agent.

Your responsibilities:
1. Give clear and accurate answers.
2. Help with JavaScript, React, Node.js, DSA, and system design.
3. Remember the conversation context.
4. Explain concepts in simple language.
5. Challenge incorrect assumptions respectfully.
6. If you do not know something, say so honestly.
        `
    }
];


inputImage.addEventListener("change", () => {
    const file = inputImage.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
        // Store Base64 image
        selectedImage = e.target.result.split(",")[1];
         console.log(e)
        console.log("Image selected");
    };

    reader.readAsDataURL(file);
});

uploadImage.addEventListener("click", () => {
    inputImage.click();
});



function scrollToBottom() {
    ChatContainer.scrollTo({
        top: ChatContainer.scrollHeight,
        behavior: "smooth"
    });
}

let Api_Url = "http://localhost:11434/api/chat";


function createChatBox(html,className){
    let div=document.createElement("div")
    div.classList.add(className)
    div.innerHTML=html
    return div
}

function typeText(element, text) {

    let index = 0;

    element.innerHTML = "";

    let interval = setInterval(() => {

        if (index < text.length) {

            index += 3; // Display 3 characters per interval

            element.innerHTML = marked.parse(
                text.substring(0, index)
            );

            ChatContainer.scrollTop =
                ChatContainer.scrollHeight;

        } else {

            clearInterval(interval);

        }

    }, 5); // Faster speed
}


async function getApiResponse(aiChatBox, message, image) {

    const textElement = aiChatBox.querySelector(".text");
    const loading = aiChatBox.querySelector(".loading");

    try {

        const userMessage = {
            role: "user",
            content: message || "Describe this image."
        };

        if (image) {
            userMessage.images = [image];
        }

        conversation.push(userMessage);

        // Keep recent conversation to improve performance
        const recentConversation = [
            conversation[0],
            ...conversation.slice(-10)
        ];

        const response = await fetch(Api_Url, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                model: "gemma3:4b",
                messages: recentConversation,
                stream: true,

                options: {
                    num_predict: 300,
                    temperature: 0.7
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
                errorData?.error || "API request failed"
            );
        }

        loading?.remove();

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        let aiText = "";

        while (true) {

            const { value, done } = await reader.read();

            if (done) break;

            const chunk = decoder.decode(value, {
                stream: true
            });

            // Ollama returns JSON objects separated by new lines
            const lines = chunk
                .split("\n")
                .filter(line => line.trim() !== "");

            for (const line of lines) {

                try {

                    const data = JSON.parse(line);

                    if (data.message?.content) {

                        aiText += data.message.content;

                        // Render Markdown while streaming
                        textElement.innerHTML =
                            marked.parse(aiText);

                        ChatContainer.scrollTop =
                            ChatContainer.scrollHeight;
                    }

                    if (data.error) {
                        throw new Error(data.error);
                    }

                } catch (parseError) {

                    console.warn(
                        "Skipping invalid JSON chunk:",
                        line
                    );
                }
            }
        }

        // Save complete AI response
        conversation.push({
            role: "assistant",
            content: aiText
        });

        // Final complete Markdown rendering
        textElement.innerHTML = marked.parse(aiText);

    } catch (error) {

        console.error("Agent Error:", error);

        loading?.remove();

        textElement.innerText =
            "Error: " + error.message;
    }
}

function showLoading(message, image) {

    let html = `
        <div class="img">
            <img src="user.png" alt="" style="
                width: 45px;
                height: 45px;
                border-radius: 50%;
                object-fit: cover">
        </div>

        <p class="text"></p>

        <img class="loading"
             src="loading.gif"
             alt="loading"
             width="50"
             height="50">
    `;

    let aiChatBox =
        createChatBox(html, "ai-message-box");

    ChatContainer.appendChild(aiChatBox);

    scrollToBottom();

    getApiResponse(aiChatBox, message, image);
}


function sendMessage() {

    let message = prompt.value.replace(/\/\*[\s\S]*?\*\//g, "").trim();

    if (!message && !selectedImage) return;

    container.style.display = "none";

    let imageToSend = selectedImage;

    let html = `
        <div class="img">
            <img src="user.png" alt="" style="
                width: 45px;
                height: 45px;
                border-radius: 50%;
                object-fit: cover">
        </div>

        <p class="text"></p>
    `;

    let userChatBox =
        createChatBox(html, "user-message-box");

    let textElement =
        userChatBox.querySelector(".text");

    textElement.innerText =
         `${message}`;

    ChatContainer.appendChild(userChatBox);

    scrollToBottom();

    prompt.value = "";

    // Clear selected image after storing it
    selectedImage = null;
    inputImage.value = "";

    setTimeout(() => {
        showLoading(message, imageToSend);
    }, 0);
}

btn.addEventListener("click",sendMessage);

prompt.addEventListener("keydown", (event)=>{
    if(event.key=="Enter"){
        event.preventDefault();
        sendMessage();
    }
})