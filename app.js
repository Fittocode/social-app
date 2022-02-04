const express = require('express');
const app = express();

//middleware config
require('./config/index')(app);

// Routes
const index = require('./routes/index.routes');
app.use('/', index);

// local host 3000 listening
app.listen(3000, () => {
  console.log('listening...');
});
