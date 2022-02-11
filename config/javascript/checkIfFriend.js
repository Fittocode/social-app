const User = require('../../models/User.models');

const checkIfFriend = async (loggedUser) => {
  let friendsArray = [];
  const user = await User.findById(loggedUser._id).populate({
    path: 'friends',
    populate: {
      path: 'posts',
      model: 'Post',
    },
  });
  user.friends.forEach((friend) => {
    friendsArray.push(friend._id.toString());
  });

  return friendsArray;
};

module.exports = checkIfFriend;
