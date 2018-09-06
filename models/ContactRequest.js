/**
 *  Define contact request schema
 */
const mongoose = require('mongoose');

// Related models
const User = mongoose.model('users');

const contactRequestSchema = new mongoose.Schema({
    title: {type: String, unique: false, required: true, trim: true},
    description: {type: String, unique: false, required: true, trim: true},
    user: { type: mongoose.Schema.ObjectId, ref: "users" } 
});

const ContactRequest = mongoose.model('contactRequests', contactRequestSchema);
module.exports = ContactRequest;