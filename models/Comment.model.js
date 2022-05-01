const { Schema, model } = require('mongoose');

const commentSchema = new Schema(
	{
		comment: {
			type: String,
			required: true,
		},
		owner: { type: Schema.Types.ObjectId, ref: 'User' },
		post: { type: Schema.Types.ObjectId, ref: 'Post' },
	},
	{
		timestamps: true,
	}
);

commentSchema.index({ '$**': 'text' });
const Comment = model('Comment', commentSchema);

module.exports = Comment;
