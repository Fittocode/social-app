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

// change dom to add and remove comment

const handlebars = (commentData, responseData) => {
  const conditional = (responseData) => {
    if (commentData.isLoggedUser) {
      return `<form action="/delete/${responseData._id}/${commentData._id}" method="post">
                <button type="submit" class="btn x-btn">x</button>
              </form>`;
    }
  };

  return `
    <div class="container-fluid">
      <div class="row no-gutters">
          <div class="col-1">
              <img src='${commentData.author.gravatar}' alt="" class="tiny-gravatar">
          </div>
          <div class="col-8 g-0">
              <div class="list-group grey-comment-box">
                  <div class="d-flex w-100 justify-content-between">
                      <a href="/profile/
                      ${commentData.author._id}" 
                      class="comment-name">
                        <p class="mb-1 comment-name">
                          ${commentData.author.username}
                        </p>
                      </a>
                    
                  </div>
                  <p class="mb-1">${commentData.content}</p>
              </div>
          </div>
      </div>
    </div>
  `;
};

const postFormDataAsJson = async ({ url, formData }) => {
  const plainFormData = Object.fromEntries(formData.entries());
  const formDataJsonString = JSON.stringify(plainFormData);

  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: formDataJsonString,
  };

  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }

  return response.json();
};

const handleFormSubmit = async (event) => {
  event.preventDefault();

  const form = event.currentTarget;
  const url = form.action;
  try {
    const formData = new FormData(form);
    const responseData = await postFormDataAsJson({ url, formData });
    console.log(responseData);
    const commentData = responseData.comments[responseData.comments.length - 1];

    commentList.insertAdjacentHTML(
      'beforeend',
      handlebars(commentData, responseData)
    );

    return commentList;
  } catch (err) {
    console.log(err.message);
  }
};

let commentList = document.querySelector('.list-group');

const commentForm = document.getElementById('commentForm');
commentForm.addEventListener('submit', handleFormSubmit);
