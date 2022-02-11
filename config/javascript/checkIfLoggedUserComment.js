const checkIfLoggedUserComment = (post, req) => {
  let myComment;
  let userComments = post.comments.filter(
    (comment) => comment.author.username === req.user.username
  );

  if (post.comments.length > 0) {
    if (userComments) {
      userComments.forEach((comment) => {
        if (comment.author._id.toString() === req.user._id.toString()) {
          comment.isLoggedUser = 'true';
        }
      });
    }
  }
  return myComment;
};

module.exports = checkIfLoggedUserComment;
