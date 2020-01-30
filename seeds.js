// The purpose of this file is to create new posts each time the server is started. 
// In essence, it seeds the database with new data by first, deleting all the existent data,
// then creating new posts everytime we restart the application.
// It's basically just during building it isn't going be to be deployed.

const 	mongoose 	= require("mongoose"),
		Blog 		= require('./models/blog'),
		Comment		= require('./models/comment');

const posts = [
	{
		title: "Vanilla Hills",
		image: "https://unsplash.com/photos/1azAjl8FTnU",
		content: "Tired of regular flavours?? Have a a new flavour of life here"
	},
	{
		title: "Smokey Chambers",
		image: "https://unsplash.com/photos/1azAjl8FTnU",
		content: "Perfect for lovers of the wind"
	},
	{
		title: "Lake Laky",
		image: "https://unsplash.com/photos/1azAjl8FTnU",
		content: "A beautiful ersatz lake"
	}
];


// Because it's going to be exported to the main file, I'll need to put everything in a function so I can export it.
const seedDB = () => {
	// First, delete all existent data
	Blog.deleteMany({}, (err) => {
		err ? console.log(err) : console.log(`Campgrounds have been removed`);
		posts.forEach((post) => {
			// Creates new posts from the array of posts above
			Blog.create(post, (err, createdPost) => {
				if (err) {
					console.log(err);
				} else {
					console.log(`A post has been created`);
					// If the post has been successfully created, create a comment
					Comment.create({
						name: "Mutmainah Seriki",
						content: "Let's hope this works fine"
					}, (err, comment) => {
						if (err) {
							console.log(err);
						} else {
							// Associate it with a post by pushing it into the comments array in the Blog model
							createdPost.comments.push(comment);
							// Then, save it
							createdPost.save((err, savedComment) => {
								err ? console.log(err) : console.log(`The comment has been added`);
							});
						}
					});
				}
			});
		});
	});
};
module.exports = seedDB;