/**
 *  Define Event schema
 */
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {type: String, unique: true, required: true, trim: true},
    description: {type: String, unique: false, required: true, trim: true},
    image: {type: String, unique: false, required: false, trim: true, default:'https://s3.us-east-2.amazonaws.com/kg-social/default.png'},
    hashtags: {type: [String], unique: false, required: true, trim: true},
    stars: {type: Number, unique: false, trim: true, default: 0},
    private: {type: Boolean, unique: false, required: true, trim: true},
    active: {type: Boolean, unique: false, trim: true, default: true},
    owner: {type: String, unique: false, trim: true, required: true},
    location: {type: String, unique: false, trim: true, required: true},
    date: {type: Date, unique: false, trim: true, required: true}
});

const Event = mongoose.model('events', eventSchema);
module.exports = Event;