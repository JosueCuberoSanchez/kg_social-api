/**
 *  Define Password verification schema
 */
const mongoose = require('mongoose');

// Related models
const User = mongoose.model('users');

const passwordVerificationSchema = new mongoose.Schema({
    code: {type: String, unique: true, required: true, trim: true},
    user: { type: mongoose.Schema.ObjectId, ref: "users" }
});

const PasswordVerification = mongoose.model('passwordVerifications', passwordVerificationSchema);
module.exports = PasswordVerification;