const { Schema, model } = require('mongoose');
const random = require('mongoose-simple-random');

const postSchema = new Schema(
	{
		imageUrl: {
			type: String,
		},
		plantType: {
			type: String,
		},
		description: String,
		creator: { type: Schema.Types.ObjectId, ref: 'User' },
		likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
		comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
	},
	{
		timestamps: true,
	}
);

postSchema.index({ '$**': 'text' });
postSchema.plugin(random);
const Post = model('Post', postSchema);

module.exports = Post;
