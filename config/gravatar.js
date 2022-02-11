const gravatar = require('gravatar');

const secureGravUrl = (user, size) => {
  // connect gravatar
  return gravatar.url(user.email, { s: size, r: 'x', d: 'retro' }, true);
};

module.exports = secureGravUrl;
