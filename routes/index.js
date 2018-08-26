const express = require('express');
const apiRouter = express.Router();

const userController = require('../controllers/userController');
const eventController = require('../controllers/eventController');

apiRouter.post('/login', userController.login);
apiRouter.post('/signup', userController.signup);
apiRouter.get('/logout', userController.logout);
apiRouter.post('/event', eventController.create);
apiRouter.get('/event', eventController.getEvents);
apiRouter.post('/event/image', eventController.updateEventImage);

module.exports = apiRouter;