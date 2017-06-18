var db = require('./services/db')();

module.exports = function(app) {
    app.use(isLoggedIn, function(req, res, next) {
        next();
    });

    app.get('/api', function(req, res) {
        res.send('Welcome to api');
    });

    app.get('/api/scores', function(req, res) {
        db.get(req.session.passport.user, function(scores){
            res.send(scores);
        });
    });

    app.post('/api/scores', function(req, res) {
        var body = {
            date : req.body.date,
            epoch : new Date(req.body.date).getTime(),
            score: req.body.score,
            comment: req.body.comment,
        };  

        var id = req.session.passport.user;
        db.update(id, body);

        res.redirect('/profile');
    })    

    app.post('/api/scores/:date', function(req, res) {
        // console.log(req.params.date)
        var id = req.session.passport.user;
        db.deleteScore(id, req.params.date);
        res.redirect('/profile');
    });

    //route middleware for user authentication
    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();
        res.redirect('/');
    }
}