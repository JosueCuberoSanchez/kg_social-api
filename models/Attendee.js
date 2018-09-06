/**
 *  Define Attendee schema
 */
const mongoose = require('mongoose');

// Related models
const User = mongoose.model('users');
const Event = mongoose.model('events');

const attendeeSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.ObjectId, ref: "users" },
    event: { type: mongoose.Schema.ObjectId, ref: "events" } 
});

const Attendee = mongoose.model('attendees', attendeeSchema);
module.exports = Attendee;