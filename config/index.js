const express = require('express');
const hbs = require('hbs');
const cookieParser = require('cookie-parser');
const path = require('path');

module.exports = (app) => {
  app.set('views', path.join(__dirname, '..', 'views'));
  app.use(express.static(path.join(__dirname, '..', 'public')));
  app.set('view engine', 'hbs');

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
};
