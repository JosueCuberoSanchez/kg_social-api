/**
 *  Define Event schema
 */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {type: String, unique: true, required: true, trim: true},
    firstName: {type: String, unique: false, required: true, trim: true},
    lastName: {type: String, unique: false, required: true, trim: true},
    points: {type: Number, unique: false, required: true, trim: true, default: 0},
    username: {type: String, unique: true, required: true, trim: true},
    password: {type: String, required: true},
    image: {type: String, unique: false, required: false, trim: true, default:'https://s3.us-east-2.amazonaws.com/kg-social/user-default.png'},
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