// require session
const session = require('express-session');
const MongoStore = require('connect-mongo');

module.exports = (app) => {
	// use session
	app.use(
		session({
			secret: process.env.SESS_SECRET,
			resave: true,
			saveUninitialized: false,
			cookie: {
				sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
				secure: process.env.NODE_ENV === 'production',
				httpOnly: true,
				maxAge: 3600000 * 24, // 3600 * 1000 ms === 1 h
			},
			store: MongoStore.create({
				mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost/basic-auth',
			}),
		})
	);
};
