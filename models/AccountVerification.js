/**
 *  Define Account verification schema
 */
const mongoose = require('mongoose');

// Related models
const User = mongoose.model('users');

const accountVerificationSchema = new mongoose.Schema({
    code: {type: String, unique: true, required: true, trim: true},
    user: { type: mongoose.Schema.ObjectId, ref: "users" } 
});

const AccountVerification = mongoose.model('accountVerifications', accountVerificationSchema);
module.exports = AccountVerification;