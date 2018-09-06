/**
 *  Define Log schema
 */
const mongoose = require('mongoose');

const User = mongoose.model('users');

const logSchema = new mongoose.Schema({
    action: {type: String, unique: false, required: true, trim: true},
    link: {type: String, unique: false, required: true, trim: true},
    date: {type: Date, unique: false, required: true, trim: true},
    author: { type: mongoose.Schema.ObjectId, ref: "users" },
});

const Log = mongoose.model('logs', logSchema);
module.exports = Log;