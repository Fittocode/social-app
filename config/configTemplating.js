const express = require('express');

const configTemplating = (app, path, hbs) => {
  app.set('views', path.join(__dirname, '..', 'views'));
  app.use(express.static(path.join(__dirname, '..', 'public')));
  app.set('view engine', 'hbs');
  hbs.registerPartials(path.join(__dirname, '..', '/views/partials'));
  hbs.registerHelper('reverseArray', (array) => array.reverse());
  hbs.registerHelper('ifCond', function (v1, v2, options) {
    if (v1 === v2) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });
};

module.exports = configTemplating;
