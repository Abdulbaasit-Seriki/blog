const 	express 					=	require("express"),
		router 						=	express.Router(),
		expressSession 				=	require("express-session"),
		mongoose					=	require("mongoose"),
		passport 					=	require("passport"),
		LocalStrategy				=	require("passport-local"),
		passportLocalMongoose		=	require("passport-local-mongoose"),
		// Models
		Blog 						=	require('../models/blog'),
		Comment 					=	require('../models/comment'),
		User 						=	require('../models/user');


// Middlewares
const isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/signin');
};

router.use((req, res, next) => {
	res.locals.currentUser = req.user;
	next();
});


// ======================
// The comments Routes
// ======================

// Add a comment
router.get('/posts/:id/comments/new', isLoggedIn, (req, res) => {
	Blog.findById(req.params.id, (err, foundBlog) => {
		err ? console.log(err) : res.render("comments/new", {post: foundBlog});
	});
});

// Create the comment
router.post('/posts/:id/comments',isLoggedIn, (req, res) => {
	Blog.findById(req.params.id, (err, foundBlog) => {
		if (err) {
		console.log(err);
		} else {
			Comment.create(req.body.comment, (err, comment) => {
				if (err) {
					console.log(err);
				} else {
					let author = {id: req.user._id, username: req.user.username};
					comment.author = author;
					comment.save();
					foundBlog.comments.push(comment);
					foundBlog.save();
					res.redirect(`/posts/${foundBlog._id}`);
				}
			});
		}
	});
});

module.exports = router;