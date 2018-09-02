const express = require('express');
const apiRouter = express.Router();

const userController = require('../controllers/userController');
const eventController = require('../controllers/eventController');
const commentController = require('../controllers/commentController');
const logController = require('../controllers/logController');
const voteController = require('../controllers/voteController');
const accountVerificationController = require('../controllers/accountVerificationController');
const passwordVerificationController = require('../controllers/passwordVerificationController');

apiRouter.post('/login', userController.login);
apiRouter.post('/signup', userController.signup);
apiRouter.get('/logout', userController.logout);
apiRouter.get('/user', userController.getUser);
apiRouter.post('/event', eventController.create);
apiRouter.get('/event', eventController.getEvents);
apiRouter.post('/event/image', eventController.updateEventImage);
apiRouter.post('/comment', commentController.createComment);
apiRouter.get('/comment', commentController.getComments);
apiRouter.post('/enroll', eventController.enrollToEvent);
apiRouter.post('/unenroll', eventController.unenrollToEvent);
apiRouter.get('/log', logController.getLog);
apiRouter.get('/attendees', eventController.getAttendees);
apiRouter.post('/votes', voteController.vote);
apiRouter.get('/votes', voteController.checkVote);
apiRouter.get('/verify-signup-code', accountVerificationController.verifyCode);
apiRouter.post('/forgot-password', passwordVerificationController.forgotPassword);
apiRouter.get('/reset-password', passwordVerificationController.verifyCode);
apiRouter.post('/reset-password', passwordVerificationController.resetPassword);

module.exports = apiRouter;