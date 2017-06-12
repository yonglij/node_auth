var User = require('./app/models/user');
User.find(function(err, users){
    if(err) return console.log(err);
    if(users.length) return;
    new User({
        authID:'Ted',
        name: 'Ted',
        email: 'Ted@mail.com',
        scores: {
                    '0001-01-01' : {
                        date: new Date(),
                        score: 1,
                        comment: 'comment',
                    },
                     '0001-01-02' : {
                        date: new Date(),
                        score: 1,
                        comment: 'comment',
                    },
                     '0001-01-03' : {
                        date: new Date(),
                        score: 1,
                        comment: 'comment',
                    }
                },
        created:new Date(),
    }).save();
});