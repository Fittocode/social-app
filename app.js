const express = require('express');
const { 
  configureParsers, 
  configureTemplating, 
  configurePassport 
} = require('./config/index');
const connectDB = require('./db/index');
const index = require('./routes/index.routes');
const auth = require('./routes/auth.routes');
const posts = require('./routes/posts.routes');
const users = require('./routes/users.routes');
const notifications = require('./routes/notifications.routes');
const handleErrors = require('./error-handling');


const app = express();
const hbs = require('hbs');


//middleware config
configureTemplating(app, hbs);
configureParsers(app);
configurePassport(app);
// require('./config/gravatar');

// connect to MongoDB
connectDB();

// Routes
app.use('/', index);

app.use('/', auth);

app.use('/', posts);

app.use('/', users);

app.use('/', notifications);

handleErrors(app);

// local host 3000 listening
const PORT = 3000

app.listen(PORT, () => {
  console.log(`listening on port http://localhost:${PORT}`);
});
