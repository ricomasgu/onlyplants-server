const router = require('express').Router();

const User = require('../models/User.model');
const Post = require('../models/Post.model');

router.post('/post', async (req, res) => {
	const { imageUrl, plantType, description, creator } = req.body;
	try {
		const createdPost = await Post.create({
			imageUrl,
			plantType,
			description,
			creator,
		});
		const updatedUser = await User.findByIdAndUpdate(creator, {
			$push: { posts: newPost._id },
		});
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
		const updatedPost = await Post.findByIdAndUpdate(postId, {
			$push: { likes: userId },
		});
	} catch (error) {
		res.json({ error: error.message });
	}
});

router.put('/post/:postId/dislike', async (req, res) => {
	const { postId, userId } = req.body;
	try {
		const updatedPost = await Post.findByIdAndUpdate(postId, {
			$pull: { likes: userId },
		});
	} catch (error) {
		res.json({ error: error.message });
	}
});

module.exports = router;
