
canvas.addEventListener('click', createNewComment);
document.querySelector('.app').addEventListener('click', sendingComment);
document.addEventListener('click', closeForm);
document.addEventListener('click', markerClick);

function removeEmptyComment() {
    const isNewComment = document.getElementsByClassName('comments__form new')[0];
    if (isNewComment) {
        document.querySelector('.app').removeChild(isNewComment);
    }
}

function closeForm(event) {
    if (event.target.className === 'comments__close') {
        event.target.parentNode.style.display = 'none';
    }
}

function closeAllForms() {
    const otherForms = document.querySelectorAll('.comments__body');
    for (const body of otherForms) {
        body.style.display = 'none';
    }
}


function clearForms() {
    const forms = document.querySelectorAll('.comments__form');
    for (const form of forms) {
        document.querySelector('.app').removeChild(form);
    }
}


function createNewComment(event) {
    const isCommentsOn = document.getElementById('comments-on').checked;
    if (comments.dataset.state === 'selected' && isCommentsOn) {
        const app = document.querySelector('.app');
        removeEmptyComment();
        closeAllForms();

        const form = document.createElement('div');
        form.className = 'comments__form new';

        const marker = document.createElement('span');
        marker.className = 'comments__marker';

        const commentsBody = document.createElement('div');
        commentsBody.className = 'comments__body';

        const createMessaege = document.createElement('div');
        createMessaege.className = 'comment';

        const loader = document.createElement('div');
        loader.className = 'loader hidden';

        const span = document.createElement('span');

        const commentsInput = document.createElement('textarea');
        commentsInput.className = 'comments__input';
        commentsInput.setAttribute('type', 'text');
        commentsInput.setAttribute('placeholder', 'Напишите ответ...');

        const commentsClose = document.createElement('input');
        commentsClose.className = 'comments__close';
        commentsClose.type = 'button';
        commentsClose.value = 'Закрыть';

        const commentsSubmit = document.createElement('input');
        commentsSubmit.className = 'comments__submit';
        commentsSubmit.type = 'submit';
        commentsSubmit.value = 'Отправить';

        createMessaege.appendChild(loader);
        loader.appendChild(span);
        loader.appendChild(span);
        loader.appendChild(span);
        loader.appendChild(span);
        loader.appendChild(span);
        commentsBody.appendChild(createMessaege);
        commentsBody.appendChild(commentsInput);
        commentsBody.appendChild(commentsClose);
        commentsBody.appendChild(commentsSubmit);

        form.style.left = event.pageX + 'px';
        form.style.top = event.pageY + 'px';
        form.style.zIndex = '2';

        form.appendChild(marker);
        form.appendChild(commentsBody);
        app.appendChild(form);
        commentsClose.addEventListener('click', removeEmptyComment);
        commentsBody.style.display = 'block';
    }
}


function sendingComment(event) {
    if (event.target.className === 'comments__submit') {
        event.preventDefault();
        const element = event.target.parentNode.querySelector('textarea');
        const form = event.target.parentNode.parentNode;
        if (element.value) {
            const comment = {'message': element.value, 'left': parseInt(form.style.left), 'top': parseInt(form.style.top)};
            needReload = true;
            sendNewComment(imageId, comment, form);
            element.value = '';
        }
    }
}


function createCommentsArray(comments) {
    const commentArray = [];
    console.log(comments)
    for (const comment in comments) {
        commentArray.push(comments[comment]);
    }
    clearForms();
    createCommentForm(commentArray);
}


function createCommentForm(comments) {
    console.log(comments);
    const app = document.querySelector('.app');

    for (let comment of comments) {
        closeAllForms();

        const form = document.createElement('div');
        form.className = 'comments__form';

        const marker = document.createElement('span');
        marker.className = 'comments__marker';

        const markerCheckbox = document.createElement('input');
        markerCheckbox.className = 'comments__marker-checkbox';
        markerCheckbox.type = 'checkbox';

        const commentsBody = document.createElement('div');
        commentsBody.className = 'comments__body';
        commentsBody.style.display = 'block';

        const commit = document.createElement('div');
        commit.className = 'comment';

        const time = document.createElement('p');
        time.className = 'comment__time';
        time.innerText = timeParser(comment.timestamp);

        const message = document.createElement('p');
        message.className = 'comment__message';
        message.innerText = comment.message;

        commit.appendChild(time);
        commit.appendChild(message);

        const current = document.querySelector(`.comments__form[style="left: ${comment.left}px; top: ${comment.top}px;"]`);

        if (!current) {
            commentsBody.appendChild(commit);
            form.style.left = comment.left + 'px';
            form.style.top = comment.top + 'px';
            form.style.zIndex = '2';
            markerCheckbox.style.zIndex = '2';
            app.appendChild(form);
        } else {
            appendComment(commit, current);
        }

        const createMessage = document.createElement('div');
        createMessage.className = 'comment load';

        const loader = document.createElement('div');
        loader.className = 'loader hidden';

        const commentsInput = document.createElement('textarea');
        commentsInput.className = 'comments__input';
        commentsInput.setAttribute('type', 'text');
        commentsInput.setAttribute('placeholder', 'Напишите ответ...');

        const commentsClose = document.createElement('input');
        commentsClose.className = 'comments__close';
        commentsClose.type = 'button';
        commentsClose.value = 'Закрыть';

        const commentsSubmit = document.createElement('input');
        commentsSubmit.className = 'comments__submit';
        commentsSubmit.type = 'submit';
        commentsSubmit.value = 'Отправить';

        loader.appendChild(document.createElement('span'));
        loader.appendChild(document.createElement('span'));
        loader.appendChild(document.createElement('span'));
        loader.appendChild(document.createElement('span'));
        loader.appendChild(document.createElement('span'));
        createMessage.appendChild(loader);
        commentsBody.appendChild(createMessage);
        commentsBody.appendChild(commentsInput);
        commentsBody.appendChild(commentsClose);
        commentsBody.appendChild(commentsSubmit);

        form.appendChild(marker);
        form.appendChild(markerCheckbox);
        form.appendChild(commentsBody);
    }
}


function appendComment(element, target) {
    const comments = target.querySelector('.comments__body').querySelectorAll('.comment');
    closeAllForms();
    if (target) {
        target.querySelector('.comments__body').insertBefore(element, target.querySelector('.load'));
        target.querySelector('.comments__body').style.display = 'block';
    }
    needReload = false;
}

function timeParser(miliseconds) {
    const date = new Date(miliseconds);
    const options = {day: 'numeric', month: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'};
    const formatDate = new Intl.DateTimeFormat("ru-RU", options).format;
    return formatDate(date);
}