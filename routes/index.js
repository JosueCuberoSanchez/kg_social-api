const express = require('express');
const apiRouter = express.Router();

const userController = require('../controllers/userController');

apiRouter.post('/login', userController.login);
apiRouter.post('/signup', userController.signup);
apiRouter.get('/logout', userController.logout);

module.exports = apiRouter;