var express  = require('express');
    app      = express();
    port     = process.env.PORT || 8080;
    mongoose = require('mongoose');
    passport = require('passport');
    flash    = require('connect-flash');

var morgan       = require('morgan');
    cookieParser = require('cookie-parser');
    bodyParser   = require('body-parser');
    session      = require('express-session');

var configDB = require('./config/database.js');

//Configuration
mongoose.connect(configDB.url); //connect to db
require('./config/passport')(passport) //configure passport

//Set up express app
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser());

app.set('view engine', 'ejs'); //ejs for templating

//setup passport
app.use(session({secret: 'somethingsecret'}));
app.use(passport.initialize());
app.use(passport.session()); //persist login session
app.use(flash()) 

//Set up routes
require('./app/routes.js')(app, passport); //configure routes and passport 

//start serer
app.listen(port, function(err){
	console.log("listening on port " + port);
});
