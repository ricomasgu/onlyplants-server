const router = require('express').Router();

const User = require('../models/User.model');


router.post('/user/follow', async (req, res) => {
	const { currentUser, userToFollow } = req.body;
	try {
		const updatedUser = await User.findByIdAndUpdate(
			currentUser,
			{
				$push: { following: userToFollow },
			},
			{ new: true }
			);
			const secondUser = await User.findByIdAndUpdate(
				userToFollow,
			{
				$push: { followers: currentUser },
			},
			{ new: true }
		);
		res.json(updatedUser);
	} catch (error) {
		res.json(error);
	}
});

router.post('/user/unfollow', async (req, res) => {
	const { currentUser, userToUnfollow } = req.body;
	try {
		const updatedUser = await User.findByIdAndUpdate(
			currentUser,
			{
				$pull: { following: userToUnfollow },
			},
			{ new: true }
			);
			const secondUser = await User.findByIdAndUpdate(
				userToUnfollow,
			{
				$pull: { followers: currentUser },
			},
			{ new: true }
			);
			res.json(updatedUser);
		} catch (error) {
			res.json(error);
		}
	});
	
	
	router.get('/user/:userId/followers', async (req, res) => {
		const { userId } = req.params;
		try {
			const foundUser = await User.findById(userId).populate('followers');
			res.json(foundUser.followers);
	} catch (error) {
		res.json(error);
	}
});


router.get('/user/:userId/following', async (req, res) => {
	const { userId } = req.params;
	try {
		const foundUser = await User.findById(userId).populate('following');
		res.json(foundUser.following);
	} catch (error) {
		res.json(error);
	}
});

router.get('/user/:userId', async (req, res) => {
	const { userId }  = req.params;
	console.log(userId);
	try {
		const wantedUser = await User.findById(userId)
			.populate('posts');
		res.json(wantedUser);
	} catch (error) {
		console.log(error);
	}
});

module.exports = router;
