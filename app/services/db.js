var User = require('../models/user');

module.exports = function(){
    return{
        get: function(id, callback) {
            User.findById(id, function(err, user) {
                if(err || user === null){
                    console.error(err);
                }else{
                    var data = [];
                    for(let k in user.scores) {
                        data.push(user.scores[k]);
                    }
                    data.sort(function(a, b) {
                        return b.date.localeCompare(a.date);
                    });
                    callback(data);
                }
            });
        },

        update: function(id, data) {
            User.findOne({_id: id}, function(err, user) {
                //only handles users signed on by user/pass
                user.scores[data.date] = data;
                // user.local.scores.push(data);
                user.markModified('scores');
                user.save();
            });
        },

        deleteScore:function(id, date){
            //delete an entry for user: id
            User.findOne({_id: id}, function(err, user) {
                console.log("delete date " + date)
                console.log(user.scores[date])
                delete user.scores[date];
                // console.log(user.scores)
                user.markModified('scores');
                user.save();
            });
        }


    };
};