'use strict';

// 3rd Party Resources
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Esoteric Resources
const errorHandler = require('./error-handlers/500');
const notFound = require('./error-handlers/404.js');
const authRoutes = require('./auth/routes.js');
const logger = require('./auth/middleware/logger.js'); //copied

// Prepare the express app
const app = express();

// App Level MW
app.use(cors());
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(logger); //copied

// Routes
app.use('/api/v1', authRoutes);//copied - what is this route????

app.use(authRoutes);

// Catchalls
app.use('*', notFound); // added catchall
app.use(errorHandler);

module.exports = {
  server: app,
  start: (port) => {
    app.listen(port, () => {
      console.log(`Server Up on ${port}`);
    });
  },
};
