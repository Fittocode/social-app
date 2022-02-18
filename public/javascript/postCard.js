// like, unlike in dom and change data in mongodb

const likeButtons = document.querySelectorAll('[data-post-id]');
const likeNo = document.querySelectorAll('.likes-no');
const heartImage = document.querySelectorAll('.heart-img');
const notificationNo = document.getElementById('notificationNo');

likeButtons.forEach((button, i) => {
  button.addEventListener('click', async () => {
    const response = await fetch(`/like/${button.dataset.postId}`, {
      method: 'POST',
    });
    const post = await response.json();
    if (post[1] === false) {
      likeNo[i].textContent--;
      // notificationNo.textContent--;
      heartImage[i].src = '/images/tiny-empty-heart.png';
    } else {
      likeNo[i].textContent++;
      // notificationNo.textContent++;
      heartImage[i].src = '/images/like.png';
    }
  });
});

// change dom to remove notification number
const inbox = document.getElementById('inboxButton');

inbox.addEventListener('click', async () => {
  const response = await fetch(`/inbox/${inbox.dataset.userId}`, {
    method: 'POST',
  });
  await response.json();
  notificationNo.textContent = '';
});
