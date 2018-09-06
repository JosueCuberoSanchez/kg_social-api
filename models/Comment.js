/**
 *  Define Comment schema
 */
const mongoose = require('mongoose');

// Related models
const User = mongoose.model('users');
const Event = mongoose.model('events');

const commentSchema = new mongoose.Schema({
    text: {type: String, unique: false, required: true, trim: true},
    author: { type: mongoose.Schema.ObjectId, ref: "users" },
    event: { type: mongoose.Schema.ObjectId, ref: "events" },
});

const Comment = mongoose.model('comments', commentSchema);
module.exports = Comment;