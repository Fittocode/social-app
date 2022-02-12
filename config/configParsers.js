const express = require('express');

const configParsers = (app, cookieParser) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
};

module.exports = configParsers;
