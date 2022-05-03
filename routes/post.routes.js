const router = require('express').Router();
const fileUploader = require('../config/cloudinary.config');

const User = require('../models/User.model');
const Post = require('../models/Post.model');

router.post(
	'/fileUpload',
	fileUploader.single('imageUrl'),
	(req, res, next) => {
		if (!req.file) {
			next(new Error('No file uploaded!'));
			return;
		}
		res.json({ secure_url: req.file.path });
	}
);

router.post('/post', async (req, res) => {
	const { imageUrl, plantType, description, creator } = req.body;
	try {
		const createdPost = await Post.create({
			imageUrl,
			plantType,
			description,
			creator,
		});
		const updatedUser = await User.findByIdAndUpdate(
			creator,
			{
				$push: { posts: createdPost._id },
			},
			{ new: true }
		);
		res.json(createdPost);
	} catch (error) {
		res.json({ error: error.message });
	}
});

router.get('/post/:postId', async (req, res) => {
	const { postId } = req.params;
	try {
		const wantedPost = await Post.findById(postId)
			.populate('creator')
			.populate('comments');
		res.json(wantedPost);
	} catch (error) {
		console.log(error);
	}
});

router.delete('/post/:postId', async (req, res) => {
	const { postId } = req.params;
	try {
		const deletedPost = await Post.findByIdAndDelete(postId);
		res.json({ message: 'Post deleted' });
	} catch (error) {
		res.json({ error: error.message });
	}
});

router.put('/post/:postId/like', async (req, res) => {
	const { postId, userId } = req.body;
	try {
		const updatedPost = await Post.findByIdAndUpdate(
			postId,
			{
				$push: { likes: userId },
			},
			{ new: true }
		);
	} catch (error) {
		res.json({ error: error.message });
	}
});

router.put('/post/:postId/dislike', async (req, res) => {
	const { postId, userId } = req.body;
	try {
		const updatedPost = await Post.findByIdAndUpdate(
			postId,
			{
				$pull: { likes: userId },
			},
			{ new: true }
		);
	} catch (error) {
		res.json({ error: error.message });
	}
});

module.exports = router;
