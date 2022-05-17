const router = require('express').Router();

router.get('/', (_, res, next) => {
	res.json('All good in here');
});

// You put the next routes here 👇
// example: router.use("/auth", authRoutes)

const authRoutes = require('./auth.routes');
router.use('/auth', authRoutes);

const postRoutes = require('./post.routes');
router.use('/', postRoutes);

const commentsRoutes = require('./comments.routes');
router.use('/', commentsRoutes);

const userRoutes = require('./user.routes');
router.use('/', userRoutes);

const chatRoutes = require('./chat.routes');
router.use('/', chatRoutes);

module.exports = router;
