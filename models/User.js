/**
 *  Define Pokemon schema
 */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {type: String, unique: true, required: true, trim: true},
    firstName: {type: String, unique: true, required: true, trim: true},
    lastName: {type: String, unique: true, required: true, trim: true},
    points: {type: Number, unique: true, required: true, trim: true},
    username: {type: String, unique: true, required: true, trim: true},
    password: {type: String, required: true},
    passwordConf: {type: String, required: true}
});

userSchema.pre('save', function (next) {
    const user = this;
    bcrypt.hash(user.password, 10, function (err, hash){
        if (err) {
            return next(err);
        }
        user.password = hash;
        next();
    })
});

const User = mongoose.model('users', userSchema);
module.exports = User;