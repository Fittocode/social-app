const express = require('express');
const connectDB = require('./db/index');
const app = express();

// connect to MongoDB
connectDB();

//middleware config
require('./config/index')(app);

// Routes
const index = require('./routes/index.routes');
app.use('/', index);

const auth = require('./routes/auth.routes');
app.use('/', auth);

// local host 3000 listening
app.listen(3000, () => {
  console.log('listening...');
});
