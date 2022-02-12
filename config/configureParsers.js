const express = require('express');
const cookieParser = require('cookie-parser');

function configureParsers(app) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
}

module.exports = configureParsers;
