const 	express 					=	require("express"),
		router 						=	express.Router(),
		expressSession 				=	require("express-session"),
		mongoose					=	require("mongoose"),
		passport 					=	require("passport"),
		LocalStrategy				=	require("passport-local"),
		passportLocalMongoose		=	require("passport-local-mongoose"),
		// Models
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

// ======================
// Auth Routes
// ======================
// Shows the sign up form
router.get('/signup', (req, res) => {
	res.render("signup");
});
// Sign Up Logic
router.post('/signup', (req, res) => {
	let newUser = {username: req.body.username};
	User.register(newUser, req.body.password, (err, user) => {
		if (err) {
			console.log(err);
			return res.render("signup");
		} 
		passport.authenticate("local")(req, res, () => {
			res.redirect('/posts');
		});
	});
});

// Login Routes
router.get('/signin', (req, res) => {
	res.render("signin");
});
router.post('/signin', passport.authenticate("local", {
	successRedirect: '/posts',
	failureRedirect: '/signin'
}), (req, res) => {

});
// Logout Route
router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/posts');
});

module.exports = router;