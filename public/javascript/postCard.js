// like, unlike in dom and change data in mongodb

const likeButton = document.getElementById('likeButton');
const likeNo = document.querySelector('.likes-no');
const heartImage = document.querySelector('.heart-img');
likeButton.addEventListener('click', async (event) => {
  event.preventDefault();
  const response = await fetch(`/like/${likeButton.dataset.postId}`, {
    method: 'POST',
  });
  const post = await response.json();
  if (post[1] === false) {
    likeNo.textContent--;
    heartImage.src = '/images/tiny-empty-heart.png';
  } else {
    likeNo.textContent++;
    heartImage.src = '/images/like.png';
  }
});

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
});

//
