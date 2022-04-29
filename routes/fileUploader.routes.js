const router = require('express').Router();
const fileUploader = require('../config/cloudinary.config');

router.post(
	'/upload-avatar',
	fileUploader.single('imageUrl'),
	(req, res, next) => {
		if (!req.file) {
			next(new Error('No file uploaded!'));
			return;
		}
		res.json({ secure_url: req.file.path });
	}
);

module.exports = router;