/**
 *  Define Account verification schema
 */
const mongoose = require('mongoose');

const accountVerificationSchema = new mongoose.Schema({
    code: {type: String, unique: true, required: true, trim: true},
    user: {type: String, unique: true, required: true, trim: true}
});

const AccountVerification = mongoose.model('accountVerifications', accountVerificationSchema);
module.exports = AccountVerification;