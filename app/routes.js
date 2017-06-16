var db = require('./services/db')();

module.exports = function(app, passport) {

	app.get('/', function(req, res) {
		res.render('partials/index');
	});

	app.get('/login', function(req, res) {
		res.render('partials/login', { message: req.flash('loginMessage') });
	});

	//process login form
	app.post('/login', passport.authenticate('local-login', {
		successRedirect: '/profile',
		failureRedirect: '/login',
		failureFlash: true
	}));

	//Sign up form
	app.get('/signup', function(req, res) {
		res.render('partials/signup', { message: req.flash('signupMessage') });
	});

	//process signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/profile',
		failureRedirect: '/signup',
		failureFlash: true
	}));

	//Profile section, past authentication
	app.get('/profile', isLoggedIn, function(req, res) {
		db.get(req.session.passport.user, function(scores) {
			console.log(req.user)
			res.render('partials/profile', {
				user: req.user,
				scores: scores
			});
		})

	});

	//log out
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});


	//Passport routes
	app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

	app.get('/auth/facebook/callback', passport.authenticate('facebook', {
		successRedirect : 'partials/profile',
		failureRedirect : '/'
	}));

	//route middleware for user authentication
	function isLoggedIn(req, res, next) {
		if (req.isAuthenticated())
			return next();
		res.redirect('/login');
	}
}