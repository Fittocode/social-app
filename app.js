const express = require('express');
const hbs = require('hbs');
const app = express();

//middleware config
require('./config/index')(app, hbs);
require('./config/passport')(app);
// require('./config/gravatar');

// connect to MongoDB
const connectDB = require('./db/index');
connectDB();

// Routes
const index = require('./routes/index.routes');
app.use('/', index);

const auth = require('./routes/auth.routes');
app.use('/', auth);

const posts = require('./routes/posts.routes');
app.use('/', posts);

const users = require('./routes/users.routes');
app.use('/', users);

const notifications = require('./routes/notifications.routes');
app.use('/', notifications);

require('./error-handling')(app);

// local host 3000 listening
app.listen(3000, () => {
  console.log('listening...');
});
