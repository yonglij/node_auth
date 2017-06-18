var express    = require('express');
    app        = express();
    port       = process.env.PORT || 8080;
    mongoose   = require('mongoose');
    passport   = require('passport');
    flash      = require('connect-flash');
    handlebars = require('express-handlebars');

var morgan       = require('morgan');
    cookieParser = require('cookie-parser');
    bodyParser   = require('body-parser');
    session      = require('express-session');

var config = require('./config/credentials.js');

//Configuration
mongoose.connect("mongodb://heroku_pwcr85hb:8fkfpeq3bv7sfnv7g5oansjcm0@ds131312.mlab.com:31312/heroku_pwcr85hb"); //connect to db
require('./config/passport')(passport) //configure passport

//Set up express app
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.engine('handlebars', handlebars({ defaultLayout: 'mainLayout' }))
app.set('view engine', 'handlebars'); //ejs for templating
app.use(express.static(__dirname + '/client'));

//setup passport
app.use(session({
    secret: 'somethingsecret',
    resave: true,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session()); //persist login session
app.use(flash()) 

//Set up routes
require('./app/routes.js')(app, passport); //configure routes and passport 
require('./app/api.js')(app);

//start serer
app.listen(port, function(err){
	console.log("listening on port " + port);
});
