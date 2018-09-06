const express = require('express');
const apiRouter = express.Router();

const userController = require('../controllers/userController');
const eventController = require('../controllers/eventController');
const commentController = require('../controllers/commentController');
const logController = require('../controllers/logController');
const voteController = require('../controllers/voteController');
const accountVerificationController = require('../controllers/accountVerificationController');
const passwordVerificationController = require('../controllers/passwordVerificationController');
const contactRequestController = require('../controllers/contactRequestController');

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

// Event CRUD
apiRouter.post('/event', eventController.createEvent);
apiRouter.put('/event', eventController.updateEvent);
apiRouter.get('/event', eventController.getEvents);
apiRouter.delete('/event', eventController.deleteEvent);
apiRouter.put('/event-pics', eventController.updateEventPics);

// Event related models CRUDs
apiRouter.post('/comment', commentController.createComment);
apiRouter.get('/comment', commentController.getComments);

apiRouter.post('/enroll', eventController.enrollToEvent);
apiRouter.post('/unenroll', eventController.unenrollToEvent);

apiRouter.get('/attendees', eventController.getAttendees);

apiRouter.post('/votes', voteController.vote);
apiRouter.get('/votes', voteController.checkVote);

apiRouter.post('/invite', eventController.inviteUsers);

// Contact us
apiRouter.post('/contact-us', contactRequestController.createContactRequest);

// Log
apiRouter.get('/log', logController.getLog);

module.exports = apiRouter;