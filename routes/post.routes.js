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
			.populate('comments')
			.populate({
				path: 'comments',
				populate: { path: 'owner' },
			});
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

router.post('/post/like', async (req, res) => {
	const { postId, userId } = req.body;
	try {
		const post = await Post.findById(postId);
		if (!post.likes.includes(userId)) {
			const updatedPost = await Post.findByIdAndUpdate(
				postId,
				{
					$push: { likes: userId },
				},
				{ new: true }
			);
			res.json({ message: 'Post liked' });
		} else {
			return;
		}
	} catch (error) {
		res.json({ error: error.message });
	}
});

router.post('/post/dislike', async (req, res) => {
	const { postId, userId } = req.body;
	try {
		const post = await Post.findById(postId);
		if (post.likes.includes(userId)) {
			const updatedPost = await Post.findByIdAndUpdate(
				postId,
				{
					$pull: { likes: userId },
				},
				{ new: true }
			);
			res.json({ message: 'Post disliked' });
		} else {
			return;
		}
	} catch (error) {
		res.json({ error: error.message });
	}
});

router.post('/feed', async (req, res) => {
	const { userId, limit } = req.body;
	try {
		const foundUser = await User.findById(userId);
		const foundPosts = await Post.find(
			{
				creator: { $in: foundUser.following },
			},
			null,
			{ limit: limit, sort: { createdAt: -1 } }
		);
		res.json(foundPosts);
	} catch (error) {
		res.json(error);
	}
});

router.get('/explore', async (req, res) => {
	const randomPosts = Post.findRandom(
		{},
		{},
		{ limit: 20 },
		function (err, results) {
			if (!err) {
				res.json(results);
			}
		}
	);
});

module.exports = router;
