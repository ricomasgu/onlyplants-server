const router = require('express').Router();

const User = require('../models/User.model');
const Post = require('../models/Post.model');
const Comment = require('../models/Comment.model');

router.post('/comment', async (req, res) => {
	const { comment, owner, post } = req.body;
	try {
		const createdComment = await Comment.create({
			comment,
			owner,
			post,
		});
		const updatedPost = await Post.findByIdAndUpdate(post, {
			$push: { comments: createdComment._id },
		});
		res.json(createdComment);
	} catch (error) {
		res.json({ error: error.message });
	}
});

router.post('/comment/delete', async (req, res) => {
	const { commentId, postId } = req.body;
	console.log(commentId, postId);
	try {
		const updatedPost = await Post.findByIdAndUpdate(postId, {
			$pull: { comments: commentId },
		});
		const deleted = await Comment.findByIdAndRemove(commentId);
		res.json({ message: 'Comment deleted successfully' });
	} catch (error) {
		res.json({ error: error.message });
	}
});

module.exports = router;
