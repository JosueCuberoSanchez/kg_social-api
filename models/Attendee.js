/**
 *  Define Attendee schema
 */
const mongoose = require('mongoose');

const attendeeSchema = new mongoose.Schema({
    username: {type: String, unique: true, required: true, trim: true},
    image: {type: String, unique: false, required: true, trim: true},
    event: {type: String, unique: false, required: true, trim: true}
});

const Attendee = mongoose.model('attendees', attendeeSchema);
module.exports = Attendee;