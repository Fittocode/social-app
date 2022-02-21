const express = require('express');

const configTemplating = (app, path, hbs) => {
  app.set('views', path.join(__dirname, '..', '/views'));
  app.use(express.static(path.join(__dirname, '..', '/public')));
  app.set('view engine', 'hbs');
  hbs.registerPartials(path.join(__dirname, '..', '/views/partials'));
  hbs.registerHelper('reverseArray', (array) => array.reverse());
  hbs.registerHelper('ifCond', function (v1, v2, options) {
    if (v1.toString() === v2.toString()) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });
  hbs.registerHelper('notRead', function (userLogged) {
    if (
      userLogged.notifications.read === 'false' &&
      userLogged.notifications.length > 0
    ) {
      return (userLogged.notifications.read === 'false').length;
    }
  });
  hbs.registerHelper('ifLiked', function (loggedUserLiked, options) {
    if (loggedUserLiked === true) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });
};

module.exports = configTemplating;
