const addNotification = async (postId, req, action) => {
  let icon = action === 'liked' ? 'like.png' : 'notification.png';
  const post = await Post.findById(postId).populate('author');
  await User.findByIdAndUpdate(post.author._id, {
    $push: {
      notifications: { user: req.user, action: action, post: post, icon: icon },
    },
  });
};

module.exports = addNotification;
