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


// Passport Configuration
router.use(expressSession({
	secret: `What should I type oo`,
	resave: false,
	saveUninitialized: false
}))
router.use(passport.initialize());
router.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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



router.get('/posts', (req, res) => {
	// Gets all the posts in the database
	Blog.find({}, (err, foundBlogs) => {
		err ? res.send(err) : res.render("index", {foundBlogs});
	});
});

router.get('/posts/new', isLoggedIn, (req, res) => {
	// Renders a form for the new post
	res.render("posts/new");
});

router.post('/posts', isLoggedIn, (req, res) => {
	// Creates new post for the blog
	Blog.create(req.body.blog, (err, newBlog) => {
		// Adds the author to the posts object
		newBlog.author = {id: req.user._id, username: req.user.username};
		newBlog.save();
		console.log(newBlog);
		err ? res.redirect('/posts/new') : res.redirect('/posts');
	});
});

// Show Page
router.get('/posts/:id', (req, res) => {
	// Gets the blog by the particular ID
	Blog.findById(req.params.id).populate("comments").exec((err, foundBlog) => {
		err ? console.log(err) : res.render("posts/show", {post: foundBlog});
	});
	// res.send(`This is the show Page`)
});

// The edit Route
router.get('/posts/:id/edit', (req, res) => {
	Blog.findById(req.params.id, (err, foundBlog) => {
		err ? console.log(err) : res.render("posts/edit", {post: foundBlog});
	});
});

router.put('/posts/:id', (req, res) => {
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
		err ? console.log(err) : res.redirect(`/posts/${req.params.id}`);
	});
});

router.delete('/posts/:id', (req, res) => {
	Blog.findByIdAndRemove(req.params.id, (err) => {
		err ? console.log(err) : res.redirect('/posts');
	});
});

module.exports = router;