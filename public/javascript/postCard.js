// const likeForm = document.getElementById('likeForm');
// console.log(likeForm);
// const heartImage = document.querySelector('.heart-img');
// likeForm.addEventListener('click', async (event) => {
//   event.preventDefault();
//   const response = await fetch(`/newsfeed/${likeForm.dataset.postId}`, {
//     method: 'POST',
//   });
//   const post = await response.json();
//   console.log(post);
//   if (post.likes.length === 0) {
//     heartImage.src = '/images/tiny-empty-heart.png';
//   } else {
//     heartImage.src = '/images/like.png';
//   }
// });

// const notificationNo = document.getElementById('notificationNo');
// const notificationInbox = document.getElementById('inbox');

// notificationInbox.addEventListener('click', () => {
//   notificationNo.textContent = '';
//   console.log(notificationNo.textContent);
// });

// change dom to remove notification number
const inbox = document.getElementById('inboxButton');
const notificationNo = document.getElementById('notificationNo');
inbox.addEventListener('click', async (event) => {
  event.preventDefault();
  const response = await fetch(`/inbox/${inbox.dataset.userId}`, {
    method: 'POST',
  });
  const user = await response.json();
  notificationNo.textContent = '';
  console.log(user);
});
