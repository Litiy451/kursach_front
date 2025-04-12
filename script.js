let lastFetchTimestamp = 0;

window.onload = function () {
    fetchMessages();
    setInterval(fetchMessages, 2000); // Обновляем чат каждые 2 секунды
};

function fetchMessages() {
    fetch("http://localhost:4567/messages")
        .then(response => response.json())
        .then(messages => {
            const chatMessages = document.getElementById("chatMessages");
            chatMessages.innerHTML = "";

            messages.forEach(message => {
                const messageElement = document.createElement("div");
                messageElement.classList.add("message", message.sender === "user1" ? "sent" : "received");

                const textElement = document.createElement("span");
                textElement.textContent = `${message.sender}: ${message.content}`;
                messageElement.appendChild(textElement);

                const timeElement = document.createElement("div");
                timeElement.style.fontSize = "0.8em";
                timeElement.style.color = "#999";
                timeElement.textContent = new Date(message.timestamp).toLocaleTimeString();
                messageElement.appendChild(timeElement);

                chatMessages.appendChild(messageElement);
            });

            chatMessages.scrollTop = chatMessages.scrollHeight;
        })
        .catch(error => console.error("Ошибка загрузки сообщений:", error));
}

function sendMessage() {
    const messageInput = document.getElementById("messageInput");
    const messageText = messageInput.value.trim();

    if (messageText === "") return;

    fetch("http://localhost:4567/messages", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            senderId: 1,
            content: messageText
        })
    })
    .then(response => {
        if (response.ok) {
            messageInput.value = "";
            fetchMessages(); // сразу обновить чат
        }
    })
    .catch(error => console.error("Ошибка отправки сообщения:", error));
}

document.getElementById("messageInput").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});