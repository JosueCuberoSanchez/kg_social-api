/**
 *  Define Log schema
 */
const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    action: {type: String, unique: false, required: true, trim: true},
    link: {type: String, unique: false, required: true, trim: true},
    date: {type: Date, unique: false, required: true, trim: true}
});

const Log = mongoose.model('logs', logSchema);
module.exports = Log;