const http = require('http');
const Chat = require('../models/Chat.model');

module.exports = (app) => {
	const server = http.createServer(app);
	const io = require('socket.io')(server, {
		cors: {
			origin: process.env.ORIGIN,
			methods: ['GET', 'POST'],
		},
	});
	io.on('connection', (socket) => {
		socket.on('joinChat', ({ chatId, userId }) => {
			socket.join(chatId);
		});
		socket.on('chatroomMessage', async ({ chatId, text, userId }) => {
			try {
				const message = { author: userId, content: text };
				const updatedChat = await Chat.findByIdAndUpdate(chatId, {
					$push: { messages: message },
				});
				socket.to(chatId).emit('newMessage', message);
			} catch (error) {
				console.log(error);
			}
		});
	});
	return server;
};
