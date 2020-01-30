const 	bodyParser				=	require("body-parser"),
		ejs						=	require("ejs"),
		express					=	require("express"),
		app						=	express(),
		mongoose				=	require("mongoose"),
		methodOverride 			= 	require("method-override"),
		expressSanitizer 		= 	require("express-sanitizer"),
		expressSession			=	require("express-session"),
		passport 				=	require("passport"),
		LocalStrategy			=	require("passport-local"),
		passportLocalMongoose	=	require("passport-local-mongoose"),
		Blog 					=	require('./models/blog'),
		Comment					=	require('./models/comment'),
		User 					=	require('./models/user'),
		seedDB					=	require('./seeds.js'),
		// Route files
		postsRoutes 			=	require('./routes/posts'),
		commentsRoutes 			=	require('./routes/comments'),
		authRoutes 				=	require('./routes/auth'),
		port					=	process.env.PORT || 3000;

// APP CONFIGURATION
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(methodOverride("_method"));
app.use(postsRoutes);
app.use(commentsRoutes);
app.use(authRoutes);

// Passport Configuration
app.use(expressSession({
	secret: "What Should I type oo",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Database Configuration 
mongoose.connect('mongodb://localhost/FawazBlog', {	useUnifiedTopology: true,
													useNewUrlParser: true,
													useCreateIndex: true,
													useFindAndModify: false
});

// Midlewares
// A function to check if a user is logged if not redirect tthe user to login
const isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/signin');
};

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	next();
});
// seedDB();

// Routes
app.get('/', (req, res) => {
	res.redirect("/posts");
});

app.listen(port, () => {
	console.log(`Server Running Already`);
});