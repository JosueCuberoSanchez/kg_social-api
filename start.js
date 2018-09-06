const mongoose = require('mongoose');

require('dotenv').config(); // evn support

// Connect to DB
mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise;
mongoose.connection.on('error', err => {
    console.log(err);
});

// Import models
require('./models/User');

// Import router
const app = require('./app');

// Set router port
app.set('port', process.env.PORT || 7777);

// Set router listen
const server = app.listen(app.get('port'), () => {
    console.log(`Listening on port ${server.address().port}`)
});
