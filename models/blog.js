const mongoose = require("mongoose");
const blogSchema =  mongoose.Schema({
	title: String,
	image: String,
	content: String,
	dateCreated: {type: Date, default: Date.now},
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	]
});

module.exports = mongoose.model("Blog", blogSchema)