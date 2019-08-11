commentsEl.addEventListener('click', commentsVisibleChange, false);

function commentsVisibleChange() {
  const comments = picture.querySelectorAll('[data-top]'); 

  for (let i = 0; i < comments.length; i++) {
    if(commentsOn.checked) {
      comments[i].classList.remove('hidden');
    } else {
      comments[i].classList.add('hidden');
    };
  }; 
};

canvasMask.addEventListener('click', commentAdd, false);

function commentAdd(event) {
  newCommentForm.style.left = `${event.offsetX - 22}px`;
  newCommentForm.style.top = `${event.offsetY - 14}px`;
  newCommentForm.classList.remove('hidden');
  const submitLoader = newCommentForm.querySelector('.comment_loader');
    submitLoader.classList.add('hidden');
  const checkbox = newCommentForm.querySelector('.comments__marker-checkbox');
    checkbox.checked = true; 
    checkbox.disabled = true;  
  const textField = newCommentForm.querySelector('.comments__input');
    textField.focus();
  const closeBtn = newCommentForm.querySelector('.comments__close');
    closeBtn.addEventListener('click', () => newCommentForm.classList.add('hidden'), false);  
  newCommentForm.reset();    
};

pictureWrap.addEventListener('submit', sendCommentDateAfterSubmit, false);

function sendCommentDateAfterSubmit(event) {
  event.preventDefault();
  newCommentForm.classList.add('hidden'); 
  let imageID = window.imageID; 
  const textField = event.target.querySelector('.comments__input');
  const commentData = {'message':textField.value, 'left':parseInt(event.target.style.left),'top':parseInt(event.target.style.top)};                                               
  const checkbox = event.target.querySelector('.comments__marker-checkbox');
    checkbox.checked = true;
    checkbox.disabled = false;
  sendComment(commentData); 
  const submitLoader = event.target.querySelector('.comment_loader');
    submitLoader.classList.remove('hidden');    
};

function sendComment(data) {
  newCommentForm.reset(); 
  let bodyRequest = [];
  for (let property in data) {
    let encodedKey = encodeURIComponent(property);
    let encodedValue = encodeURIComponent(data[property]);
    bodyRequest.push(encodedKey + '=' + encodedValue);
  };
  bodyRequest = bodyRequest.join('&');
  const request = new XMLHttpRequest();
  request.addEventListener('error', () => console.log(request.responseText));
  request.addEventListener('load', () => {
    if (request.status === 200) {
      let response = JSON.parse(request.responseText);
    } else {
      alert(request.responseText);
    };
  });
  request.open('POST', 'https://neto-api.herokuapp.com/pic/'+imageID+'/comments', true);
  request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  request.send(bodyRequest);
};

function commentsLoad(comments) {
  for (let comment in comments) {
    let curComment = {message: comments[comment].message,
                      left: comments[comment].left,
                      top: comments[comment].top};                  
    renderComment(curComment);
  };
};

function renderComment(comment) {
  const currentFormNode = document.querySelector(`.comments__form[data-left="${comment.left}"][data-top="${comment.top}"]`);
  if (currentFormNode) { 
    const submitLoader = currentFormNode.querySelector('.comment_loader');
      submitLoader.classList.add('hidden');
    renderNewCommentElement(currentFormNode, comment);
  } else {
    placeComment(comment);
  }; 
};

function placeComment(comment) {
  const commentsFormSimple = newCommentForm;
  const commentElement = commentsFormSimple.cloneNode(true);
    commentElement.classList.remove('hidden');
    commentElement.classList.remove('new_comment');
    commentElement.querySelector('.comments__submit').classList.add('on_place');
    commentElement.style.top = `${comment.top}px`;
    commentElement.style.left = `${comment.left}px`;
    commentElement.dataset.top = comment.top;
    commentElement.dataset.left = comment.left;
  const submitLoader = commentElement.querySelector('.comment_loader');
    submitLoader.classList.add('hidden');
  const checkbox = commentElement.querySelector('.comments__marker-checkbox');
    checkbox.checked = true;
    checkbox.disabled = false;
    checkbox.addEventListener('click', event => {
      let commentsForm = $$('.comments__form');
      for (let i = 0; i < commentsForm.length; i++) {
        commentsForm[i].style.zIndex = '100';
      }
      event.currentTarget.parentNode.style.zIndex = '110';
    });
  let date = new Date();
  let time = date.getHours()+':'+date.getMinutes()+':'+date.getSeconds(); 
  const commentDatetime = commentElement.querySelector('.comment__time');
    commentDatetime.textContent = time;
  const commentMessage = commentElement.querySelector('.comment__message');
    commentMessage.setAttribute('style', 'white-space: pre;');
    commentMessage.textContent = comment.message;
  const closeBtn = commentElement.querySelector('.comments__close');
    closeBtn.addEventListener('click', () => commentElement.querySelector('.comments__marker-checkbox').checked = false, false) 
  picture.appendChild(commentElement);
  commentsVisibleChange();
};

function renderNewCommentElement(currentFormNode, comment) {
  const currentFormNodeCommentsBody = currentFormNode.querySelector('.comments__body');
  const currentFormNodeLoader = currentFormNode.querySelector('.comment_loader');
  const commentsFormSimple = currentFormNodeCommentsBody.querySelector('.comment');
  const commentElement = commentsFormSimple.cloneNode(true);
  let date = new Date();
  let time = date.getHours()+':'+date.getMinutes()+':'+date.getSeconds(); 
  const commentDatetime = commentElement.querySelector('.comment__time');
    commentDatetime.textContent = time;
  const commentMessage = commentElement.querySelector('.comment__message');
    commentMessage.setAttribute('style', 'white-space: pre;');
    commentMessage.textContent = comment.message;
    currentFormNodeCommentsBody.insertBefore(commentElement, currentFormNodeLoader);
  currentFormNode.reset();
  commentsVisibleChange();
};

function resetComment() {
  let curCommentsArr = pictureWrap.querySelectorAll('[data-top]');
  let elemArr = Array.from(curCommentsArr);
  for(let i = 0; i < elemArr.length; i++) {
    pictureWrap.removeChild(elemArr[i]);
  };
};

