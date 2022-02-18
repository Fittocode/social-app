// change dom to add and remove comment

const handlebars = (commentData, responseData) => {
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
                            <button type="submit" data-btn-post-id="${responseData._id}" data-btn-comment-id="${commentData._id}" class="removeComment btn x-btn">x</button>
                      </div>
                      <p class="mb-1">${commentData.content}</p>
                  </div>
              </div>
          </div>
        </div>
      `;
};

// add comment from form to dom

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

    const commentData = responseData.comments[responseData.comments.length - 1];

    commentList.insertAdjacentHTML(
      'beforeend',
      handlebars(commentData, responseData)
    );
    deleteComment(commentList);
  } catch (err) {
    console.log(err.message);
  }
};
const commentList = document.querySelector('.list-group');
console.log(commentList.querySelectorAll('.container-fluid'));
const commentForm = document.getElementById('commentForm');

const deleteComment = async (commentList) => {
  const buttons = commentList.querySelectorAll('.removeComment');
  buttons.forEach((button) => {
    button.addEventListener('click', async (event) => {
      console.log(event.target);
      const response = await fetch(
        `/delete/${event.target.dataset.btnPostId}/${event.target.dataset.btnCommentId}`,
        {
          method: 'POST',
        }
      );
      await response.json();
      commentList.removeChild(
        event.target.parentNode.parentNode.parentNode.parentNode.parentNode
      );
    });
  });
};

// submit comment to dom, affecting client side 'handlebars' code
commentForm.addEventListener('submit', handleFormSubmit);
// delete comments, affecting server side viewPost hbs code
deleteComment(commentList);
