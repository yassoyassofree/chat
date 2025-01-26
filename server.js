const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

let users = {};

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('join', (username) => {
        users[socket.id] = username;
        io.emit('message', {
            text: `${username} has joined the chat.`,
            username: 'System'
        });
        io.emit('userList', Object.values(users));
    });

    socket.on('sendMessage', (message) => {
        io.emit('message', { text: message, username: users[socket.id] });
    });

    socket.on('disconnect', () => {
        const username = users[socket.id];
        delete users[socket.id];
        io.emit('message', {
            text: `${username} has left the chat.`,
            username: 'System'
        });
        io.emit('userList', Object.values(users));
        console.log('A user disconnected');
    });
});

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});