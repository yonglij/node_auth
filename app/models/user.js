var mongoose = require('mongoose');
	bcrypt   = require('bcrypt-nodejs')


//define user schema
var userSchema = mongoose.Schema({
	local: {
		email: String,
		password: String,
		scores: Array,
	},
	facebook: {
		id: String,
		token: String,
		email: String,
		name: String,
	}
});

//methods
//generate hash for passwords
userSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

//check if password is valid
userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.local.password);
}

module.exports = mongoose.model('User', userSchema);