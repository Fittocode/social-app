const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const favicon = require('serve-favicon');

module.exports = (app, hbs) => {
  app.set('views', path.join(__dirname, '..', 'views'));
  app.use(express.static(path.join(__dirname, '..', 'public')));
  app.set('view engine', 'hbs');
  hbs.registerPartials(path.join(__dirname, '..', '/views/partials'));

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
};
