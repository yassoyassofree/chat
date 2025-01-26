document.getElementById('copyButton').addEventListener('click', function() {
    const codeSnippet = document.getElementById('codeSnippet').innerText;

    navigator.clipboard.writeText(codeSnippet).then(() => {
        alert('Code snippet copied to clipboard!');
    }).catch(err => {
        console.error('Error copying text: ', err);
    });
});
const socket = io();

const messageInput = document.getElementById('message');
const sendButton = document.getElementById('sendButton');
const messagesContainer = document.getElementById('messages');
const userList = document.getElementById('userList');

// Prompt for username
const username = prompt('Enter your name');
socket.emit('join', username);

// Listening for user updates
socket.on('userList', (users) => {
    userList.innerHTML = 'Online: ' + users.join(', ');
});

// Listening for incoming messages
socket.on('message', (data) => {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.textContent = `${data.username}: ${data.text}`;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight; // Scroll to bottom
});

// Sending messages
sendButton.addEventListener('click', () => {
    const message = messageInput.value;
    if (message.trim()) {
        socket.emit('sendMessage', message);
        messageInput.value = '';
    }
});

// Sending messages on Enter key
messageInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendButton.click();
    }
});