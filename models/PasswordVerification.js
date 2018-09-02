/**
 *  Define Password verification schema
 */
const mongoose = require('mongoose');

const passwordVerificationSchema = new mongoose.Schema({
    code: {type: String, unique: true, required: true, trim: true},
    user: {type: String, unique: true, required: true, trim: true}
});

const PasswordVerification = mongoose.model('passwordVerifications', passwordVerificationSchema);
module.exports = PasswordVerification;