require('dotenv/config');
const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const index = require('./routes/index.routes');
const auth = require('./routes/auth.routes');
const posts = require('./routes/posts.routes');
const users = require('./routes/users.routes');
const notifications = require('./routes/notifications.routes');

//middleware config
const { configParsers, configTemplating } = require('./config/index');
configParsers(app, bodyParser, cookieParser);
configTemplating(app, path, hbs);

require('./config/passport')(app);

// connect to MongoDB
const connectDB = require('./db/index');
connectDB();

app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, './app')));

// Routes
app.use('/', index);

app.use('/', auth);

app.use('/', posts);

app.use('/', users);

app.use('/', notifications);

require('./error-handling')(app);

const PORT = process.env.PORT || 8080;

// local host 8080 listening
app.listen(PORT, () => {
  console.log(`listening on port localhost:${PORT}...`);
});
