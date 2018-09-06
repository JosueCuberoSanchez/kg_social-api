/**
 *  Define Vote schema
 */
const mongoose = require('mongoose');

// Related models
const User = mongoose.model('users');
const Event = mongoose.model('events');

const voteSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.ObjectId, ref: "users" },
    event: { type: mongoose.Schema.ObjectId, ref: "events" }
});

const Vote = mongoose.model('votes', voteSchema);
module.exports = Vote;