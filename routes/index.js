const express = require('express');
const apiRouter = express.Router();

const userController = require('../controllers/userController');
const eventController = require('../controllers/eventController');
const commentController = require('../controllers/commentController');
const logController = require('../controllers/logController');

apiRouter.post('/login', userController.login);
apiRouter.post('/signup', userController.signup);
apiRouter.get('/logout', userController.logout);
apiRouter.post('/event', eventController.create);
apiRouter.get('/event', eventController.getEvents);
apiRouter.post('/event/image', eventController.updateEventImage);
apiRouter.post('/comment', commentController.createComment);
apiRouter.get('/comment', commentController.getComments);
apiRouter.post('/enroll', eventController.enrollToEvent);
apiRouter.post('/unenroll', eventController.unenrollToEvent);
apiRouter.get('/log', logController.getLog);

module.exports = apiRouter;