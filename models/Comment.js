/**
 *  Define Comment schema
 */
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    text: {type: String, unique: false, required: true, trim: true},
    author: {type: String, unique: false, required: true, trim: true},
    eventId: {type: String, unique: false, required: true, trim: true}
});

const Comment = mongoose.model('comments', commentSchema);
module.exports = Comment;