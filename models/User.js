/**
 *  Define Event schema
 */
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {type: String, unique: true, required: true, trim: true},
    firstName: {type: String, unique: false, required: true, trim: true},
    lastName: {type: String, unique: false, required: true, trim: true},
    username: {type: String, unique: true, required: true, trim: true},
    phone: {type: String, unique: false, required: false, trim: true, default: 'No phone number registered.'},
    points: {type: Number, unique: false, required: true, trim: true, default: 0},
    active: {type: Boolean, required: false, default: false},
    image: {type: String, unique: false, required: false, trim: true, default:'https://s3.us-east-2.amazonaws.com/kg-social/user-default.png'},
    facebook: {type: String, unique: false, required: false, trim: true, default:''},
    twitter: {type: String, unique: false, required: false, trim: true, default:''},
    instagram: {type: String, unique: false, required: false, trim: true, default:''},
    password: {type: String, required: true}
});

const User = mongoose.model('users', userSchema);
module.exports = User;