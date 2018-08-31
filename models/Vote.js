/**
 *  Define Vote schema
 */
const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
    username: {type: String, unique: true, required: true, trim: true},
    event: {type: String, unique: false, required: true, trim: true}
});

const Vote = mongoose.model('votes', voteSchema);
module.exports = Vote;