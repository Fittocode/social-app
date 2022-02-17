// like, unlike in dom and change data in mongodb

const likeButtons = document.querySelectorAll('[data-post-id]');
console.log(likeButtons);
const likeNo = document.querySelectorAll('.likes-no');
console.log(likeNo);
const heartImage = document.querySelectorAll('.heart-img');
let number = 0;
likeButtons.forEach((button, i) => {
  button.addEventListener('click', async () => {
    console.log('tap');
    const response = await fetch(`/like/${button.dataset.postId}`, {
      method: 'POST',
    });
    const post = await response.json();
    if (post[1] === false) {
      likeNo[i].textContent--;
      heartImage[i].src = '/images/tiny-empty-heart.png';
    } else {
      likeNo[i].textContent++;
      heartImage[i].src = '/images/like.png';
    }
  });
});

// change dom to remove notification number
const inbox = document.getElementById('inboxButton');
const notificationNo = document.getElementById('notificationNo');
inbox.addEventListener('click', async () => {
  const response = await fetch(`/inbox/${inbox.dataset.userId}`, {
    method: 'POST',
  });
  const user = await response.json();
  notificationNo.textContent = '';
});

//
