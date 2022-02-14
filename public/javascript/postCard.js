// const likeForm = document.forms[0];
// console.log(likeForm);
// const heartImage = document.querySelector('.heart-img');
// likeForm.addEventListener('submit', async (event) => {
//   event.preventDefault();
//   const response = await fetch(`/newsfeed/${likeForm.dataset.postId}`, {
//     method: 'POST',
//   });
//   const post = await response.json();
//   if (post.likes.length === 0) {
//     heartImage.src = '/images/tiny-empty-heart.png';
//   } else {
//     heartImage.src = '/images/like.png';
//   }
// });
