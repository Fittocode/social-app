const addLike = async (postId, req, res, path) => {
  try {
    const post = await Post.findById(postId).populate('likes');
    if (post.likes.find((o) => o.username === req.user.username)) {
      await Post.findByIdAndUpdate(postId, {
        $pullAll: {
          likes: [{ _id: req.user._id }],
        },
      });
      await removeNotification(postId, req, 'liked');
      liked = false;
    } else {
      await Post.findByIdAndUpdate(postId, {
        $push: { likes: req.user },
      });
      await addNotification(postId, req, 'liked');
      liked = true;
    }
    res.redirect(path);
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = addLike;
