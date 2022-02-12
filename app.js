const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const cookieParser = require('cookie-parser');

const index = require('./routes/index.routes');
const auth = require('./routes/auth.routes');
const posts = require('./routes/posts.routes');
const users = require('./routes/users.routes');
const notifications = require('./routes/notifications.routes');

//middleware config
const { configParsers, configTemplating } = require('./config/index');
configParsers(app, cookieParser);
configTemplating(app, path, hbs);

require('./config/passport')(app);

// connect to MongoDB
const connectDB = require('./db/index');
connectDB();

// Routes
app.use('/', index);

app.use('/', auth);

app.use('/', posts);

app.use('/', users);

app.use('/', notifications);

require('./error-handling')(app);

const PORT = 3000;

// local host 3000 listening
app.listen(PORT, () => {
  console.log(`listening on port localhost:${PORT}...`);
});
