const findPopulateUser = async (User, req) => {
  const user = await User.findOne(req.user)
    .populate('posts friends notifications')
    .populate({
      path: 'notifications',
      populate: [
        { path: 'user', model: 'User' },
        { path: 'post', model: 'Post' },
      ],
    });
  return user;
};

module.exports = findPopulateUser;
