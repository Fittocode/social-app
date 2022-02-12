const express = require('express');
const path = require('path');

function configureTemplating(app, hbs) {
  app.set('views', path.join(__dirname, '..', 'views'));
  app.use(express.static(path.join(__dirname, '..', 'public')));
  app.set('view engine', 'hbs');
  hbs.registerPartials(path.join(__dirname, '..', '/views/partials'));
}

module.exports = configureTemplating;
