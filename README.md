# 🤖 Personal AI Chatbot

A personal AI chatbot built with **HTML, CSS, and JavaScript**, powered
by **Ollama** and a locally running open-source language model.

The chatbot provides a simple conversational interface, supports image
uploads, displays Markdown-formatted AI responses, and maintains
conversation context during the current browser session.

## 🚀 Live Demo

Frontend hosted on GitHub Pages:

👉 https://suresh8290.github.io/personal-ai-chatbot/

> **Important:** GitHub Pages hosts only the frontend. The AI response
> requires Ollama to be running on your computer and accessible through
> a backend or secure network connection.

## ✨ Features

-   💬 Chat with a locally running AI model
-   🧠 Conversation memory during the current session
-   🖼️ Image upload support
-   👁️ Image description capability with a vision-capable model
-   📝 Markdown response rendering
-   **Bold text**, lists, and formatted responses
-   ⌨️ Send messages using the Enter key
-   ⏳ Loading animation while the AI is generating a response
-   ⚡ Fast typewriter-style AI response display
-   📜 Automatic chat scrolling
-   🔒 Local model execution using Ollama
-   📱 Responsive frontend that can be opened on other devices on the
    same network

## 🛠️ Technologies Used

-   **HTML5** -- Page structure
-   **CSS3** -- Styling and responsive layout
-   **JavaScript (ES6+)** -- Chat logic and DOM manipulation
-   **Ollama** -- Local AI model execution
-   **Marked.js** -- Markdown-to-HTML conversion
-   **GitHub Pages** -- Frontend hosting

## 📁 Project Structure

``` text
personal-ai-chatbot/
│
├── index.html          # Main HTML page
├── style.css           # Application styling
├── script.js           # Chatbot logic and Ollama API integration
├── Ai.jpg              # AI profile image
├── user.png            # User profile image
├── loading.gif         # Loading animation
├── send.svg            # Send icon
└── uploadImage.svg     # Image upload icon
```

## ⚙️ Local Setup

### 1. Install Ollama

Download and install Ollama:

https://ollama.com/

### 2. Download an AI model

For a text chatbot:

``` bash
ollama pull gemma3:4b
```

Run the model:

``` bash
ollama run gemma3:4b
```

For image input, use a vision-capable model supported by your Ollama
installation.

### 3. Start Ollama

Run:

``` bash
ollama serve
```

The default Ollama API endpoint is:

``` text
http://localhost:11434/api/chat
```

### 4. Run the frontend locally

Open the project folder in a terminal:

``` bash
python -m http.server 8000
```

Then open:

``` text
http://localhost:8000
```

## 🔌 API Configuration

In `script.js`, configure the Ollama API URL:

``` javascript
let Api_Url = "http://localhost:11434/api/chat";
```

When testing from another device on the same Wi-Fi network, you may use
your laptop's local IP:

``` javascript
let Api_Url = "http://YOUR_LAPTOP_IP:11434/api/chat";
```

> **Security note:** Do not expose the Ollama API directly to the public
> internet. For public deployment, use a secure backend proxy, HTTPS,
> authentication, and rate limiting.

## 🧠 Conversation Memory

The chatbot stores conversation messages in a JavaScript array:

``` javascript
let conversation = [
  {
    role: "system",
    content: "You are Suresh's personal AI agent."
  }
];
```

User messages and AI responses are appended to this array, allowing the
model to use previous messages as context.

> Conversation memory currently lasts only while the page remains open.
> Refreshing the page clears the in-memory conversation.

## 🖼️ Image Upload

The application reads the selected image using `FileReader` and sends
the image as Base64 data to Ollama.

Example request structure:

``` javascript
const userMessage = {
  role: "user",
  content: message || "Describe this image.",
  images: [base64Image]
};
```

The selected model must support image input for image-related requests
to work.

## 📝 Markdown Rendering

AI responses are converted from Markdown into HTML using Marked.js:

``` javascript
element.innerHTML = marked.parse(text);
```

This enables formatted output such as:

-   **Bold text**
-   *Italic text*
-   Headings
-   Lists
-   Code blocks
-   Links

Only render trusted or sanitized content in production because
converting Markdown directly to HTML can introduce security risks.

## 🌐 Deployment

The frontend can be hosted using GitHub Pages.

### GitHub Pages setup

1.  Push the project to GitHub.
2.  Open the repository's **Settings**.
3.  Select **Pages**.
4.  Choose **Deploy from a branch**.
5.  Select the `main` branch.
6.  Select the `/ (root)` folder.
7.  Click **Save**.
8.  Open the generated GitHub Pages URL.

### Important deployment limitation

GitHub Pages is a static hosting service. It cannot run Ollama or a
Node.js backend.

Recommended architecture for public access:

``` text
User Browser
     │
     ▼
GitHub Pages Frontend
     │
     ▼
Secure HTTPS Backend
     │
     ▼
Ollama Running on Your Computer or Server
     │
     ▼
Local AI Model
```

## 🔐 Security Recommendations

Before making the chatbot publicly accessible:

-   Do not expose port `11434` directly to the internet.
-   Use HTTPS.
-   Add authentication.
-   Add request rate limiting.
-   Limit maximum prompt length.
-   Validate uploaded image size and file type.
-   Avoid exposing private system information.
-   Keep API keys and secrets out of GitHub.
-   Use a backend proxy instead of calling Ollama directly from the
    browser.

## 🔮 Future Improvements

-   [ ] Add a Node.js and Express backend
-   [ ] Add user authentication
-   [ ] Store conversations in MongoDB
-   [ ] Add persistent chat history
-   [ ] Add streaming AI responses
-   [ ] Add voice input and text-to-speech
-   [ ] Add multiple model selection
-   [ ] Add chat export as PDF
-   [ ] Add secure Cloudflare Tunnel deployment
-   [ ] Add prompt history and conversation management
-   [ ] Add message regeneration
-   [ ] Add dark/light theme switching

## 👨‍💻 Author

**Suresh Sahu**

-   GitHub: https://github.com/suresh8290
-   LinkedIn: https://www.linkedin.com/in/suresh-sahu-047428187
-   LeetCode: https://leetcode.com/u/sureshsahu829067/

## 📄 License

This project is intended for personal learning and development. You may
modify it for your own use.
