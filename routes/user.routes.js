const router = require('express').Router();

const User = require('../models/User.model');

router.get('/user/:userId', async (req, res) => {
	const { userId } = req.params;
	try {
		const wantedUser = await User.findById(userId)
			.populate('posts');
		res.json(wantedUser);
	} catch (error) {
		console.log(error);
	}
});

module.exports = router;
