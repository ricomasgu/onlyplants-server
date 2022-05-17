const { Schema, model } = require('mongoose');

const chatSchema = new Schema(
	{
		participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
		messages: [{ 
      author: String,
      content: String,
    }],
	},
	{
		timestamps: true,
	}
);

chatSchema.index({ '$**': 'text' });
const Chat = model('Chat', chatSchema);

module.exports = Chat;