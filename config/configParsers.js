const express = require('express');

const configParsers = (app, bodyParser, cookieParser) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(bodyParser.json());
};

module.exports = configParsers;
