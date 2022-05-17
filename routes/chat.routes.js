const router = require('express').Router();

const User = require('../models/User.model');
const Chat = require('../models/Chat.model');

router.post('/createChat', async (req, res) => {
	const { userId, userSelectedId } = req.body;
	console.log(userId, userSelectedId);
	try {
		//Create a new chat
		const newChat = await Chat.create({
			participants: [userId, userSelectedId],
		});
		//Adding the id of the chat to one participant
		const addChatToUser1 = await User.findByIdAndUpdate(
			{ _id: userId },
			{ $push: { chats: newChat._id } }
		);
		//Adding the id of the chat to the other participant
		const addChatToUser2 = await User.findByIdAndUpdate(
			{ _id: userSelectedId },
			{ $push: { chats: newChat._id } }
		);
		//returning the chat info (to add the id to the state)
		res.json(newChat);
	} catch (error) {
		res.json(error);
	}
});

router.post('/getChat', async (req, res) => {
	const { userId, chatId } = req.body;
	try {
		console.log(userId, chatId);
		const foundChat = await Chat.findById(chatId);
		if (foundChat.participants.includes(userId)) {
			res.json(foundChat);
		}
	} catch (error) {
		res.json(error);
	}
});

module.exports = router;
