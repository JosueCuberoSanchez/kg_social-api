/**
 * Log controller
 */
const mongoose = require('mongoose');

// Models
require('../models/Event');
require('../models/User');
require('../models/Log')
const Event = mongoose.model('events');
const User = mongoose.model('users');
const Log = mongoose.model('logs');

// JSON response utility function
const respond = function(res, status, content) {
    res.status(status);
    res.json(content);
};

async function getLog(req, res, next) {
    try {
        const logs = await Log.find().sort({date: 'descending'}).populate('author','image');
        const firstLogs = logs.slice(0,10);
        respond(res, 200, {firstLogs});
    } catch (e) {
        console.log('Error :', e);
        next(e);
    }
}

module.exports = { getLog };
