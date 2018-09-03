const express = require('express');
const apiRouter = express.Router();

const userController = require('../controllers/userController');
const eventController = require('../controllers/eventController');
const commentController = require('../controllers/commentController');
const logController = require('../controllers/logController');
const voteController = require('../controllers/voteController');
const accountVerificationController = require('../controllers/accountVerificationController');
const passwordVerificationController = require('../controllers/passwordVerificationController');

// Verifications
apiRouter.get('/verify-signup-code', accountVerificationController.verifyCode);
apiRouter.post('/forgot-password', passwordVerificationController.forgotPassword);
apiRouter.get('/reset-password', passwordVerificationController.verifyCode);
apiRouter.post('/reset-password', passwordVerificationController.resetPassword);

// User auth
apiRouter.post('/login', userController.login);
apiRouter.get('/logout', userController.logout);

// User CRUD
apiRouter.post('/user', userController.createUser);
apiRouter.get('/user', userController.getUser);
apiRouter.put('/user', userController.updateUser);
apiRouter.put('/user-image', userController.updateUserImage); // image is treated on another route

// Event CRUD
apiRouter.post('/event', eventController.createEvent);
apiRouter.put('/event', eventController.updateEvent);
apiRouter.get('/event', eventController.getEvents);
apiRouter.post('/event/image', eventController.updateEventImage); // image is treated on another route

// Event related models CRUDs
apiRouter.post('/comment', commentController.createComment);
apiRouter.get('/comment', commentController.getComments);
apiRouter.post('/enroll', eventController.enrollToEvent);
apiRouter.post('/unenroll', eventController.unenrollToEvent);
apiRouter.get('/attendees', eventController.getAttendees);
apiRouter.post('/votes', voteController.vote);
apiRouter.get('/votes', voteController.checkVote);

// Log
apiRouter.get('/log', logController.getLog);

module.exports = apiRouter;