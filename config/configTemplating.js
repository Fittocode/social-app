const express = require('express');

const configTemplating = (app, path, hbs) => {
  app.set('views', path.join(__dirname, '..', 'views'));
  app.use(express.static(path.join(__dirname, '..', 'public')));
  app.set('view engine', 'hbs');
  hbs.registerPartials(path.join(__dirname, '..', '/views/partials'));
  hbs.registerHelper('reverseArray', (array) => array.reverse());
};

module.exports = configTemplating;
