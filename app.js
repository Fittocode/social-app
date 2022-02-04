const express = require('express');
const app = express();

//middleware config
require('./config/index')(app);
require('./config/passport')(app);

// connect to MongoDB
const connectDB = require('./db/index');
connectDB();

// Routes
const index = require('./routes/index.routes');
app.use('/', index);

const auth = require('./routes/auth.routes');
app.use('/', auth);

// local host 3000 listening
app.listen(3000, () => {
  console.log('listening...');
});
