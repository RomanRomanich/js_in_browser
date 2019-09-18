'use strict';



function clearForms() {
    const forms = document.querySelectorAll('.comments__form');
    for (const form of forms) {
        //document.querySelector('.app').removeChild(form);
        formContainer.removeChild(form);
    }
}
function onOpen () { 
    menu.dataset.state = 'initial';
    image.src = '';
    clearForms();
}

if ((href.indexOf('?id=')) == -1) {
    mask.classList.add('hidden');
    onOpen();
}

function clearCommentForms() {
    const forms = document.querySelectorAll('.comments__form');
    for (const form of forms) {
        formContainer.removeChild(form);
    }
}

function showError(files) {
    if (files[0].type !== 'image/png' && files[0].type !== 'image/jpeg') {
        errorMessage.textContent = 'Неверный формат файла. Пожалуйста, выберите изображение в формате .jpg или .png.';
        error.classList.remove('hidden');
        onOpen();
    }
    else {
        error.classList.add('hidden');
        return true;
    }
}

function sendFile(file) {
    error.classList.add('hidden');
    const imageTypeRegExp = /^image\/jpg|jpeg|png/;
    if (imageTypeRegExp.test(file.type)) {
        const xhr = new XMLHttpRequest();
        const formData = new FormData();
        formData.append('title', file.name);
        formData.append('image', file);
        xhr.open('POST', 'https://neto-api.herokuapp.com/pic/');
        xhr.addEventListener("loadstart", () => imgLoad.style.display = 'block');
        xhr.addEventListener("loadend", () => imgLoad.style.display = 'none');
        xhr.addEventListener('load', () => {
            if(xhr.status === 200) {
            if(connection) {
                connection.close(1000, 'Работа закончена');
            }
            const result = JSON.parse(xhr.responseText);
            image.src = result.url;
            mask.classList.add('hidden');
            mask.src = '';
            imageId = result.id;
            url.value = `${location.origin + location.pathname}?${imageId}` + '&share';
            menu.dataset.state = 'selected';
            share.dataset.state = 'selected';
            clearCommentForms();
            webSocket();
            if(!location.search) {
                location.search = `?${imageId}`;
            }   
        } else {
            error.classList.remove('hidden');
            errorMessage.innerText = `Произошла ошибка ${xhr.status}! ${xhr.statusText}... Повторите попытку позже... `;
        }
    })
        xhr.send(formData);
    } else {
        error.classList.remove('hidden');
        errorMessage.innerText = 'Неверный формат файла. Пожалуйста, выберите изображение в формате .jpg или .png.';
    }
}

function webSocket() {
    connection = new WebSocket(`wss://neto-api.herokuapp.com/pic/${imageId}`);
    connection.addEventListener('message', event => {
        console.log(JSON.parse(event.data));
        if (JSON.parse(event.data).event === 'pic'){
            if (JSON.parse(event.data).pic.mask) {
                canvas.style.background = `url(${JSON.parse(event.data).pic.mask})`;
            } else {
                canvas.style.background = ``;
            }
        }

        if (JSON.parse(event.data).event === 'comment'){
            pullComments(JSON.parse(event.data).comment);
        }

        if (JSON.parse(event.data).event === 'mask'){
            canvas.style.background = `url(${JSON.parse(event.data).url})`;
        }
    });
}

if (location.search) {
    if ((href.indexOf('?')) == -1) {
    mask.classList.add('hidden');
    onOpen();
    } else {
    let indexOfId = href.indexOf('?') + 1;
    let indexOfShare = href.indexOf('&share');
    if (indexOfShare == -1) {
        imageId = href.substring(indexOfId);
        console.log(imageId);
        webSocket();
    } else {
        imageId = href.substring(indexOfId, indexOfShare);
        webSocket();
        menu.dataset.state = 'selected';
        comments.dataset.state = 'selected';
    }
    url.value = window.location.href;

    }
    console.log(`Перехожу по ссылке ${`\`${location.origin + location.pathname}${location.search}\``}`);
    getShareData(imageId);
}

function getShareData(id) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `https://neto-api.herokuapp.com/pic/${id}`);
    xhr.addEventListener('load', () => {
        console.log(xhr.status)
    if (xhr.status === 200) {
        loadShareData(JSON.parse(xhr.responseText));
    } else {
        error.classList.remove('hidden');
        errorMessage.innerText = `Произошла ошибка ${xhr.status}! ${xhr.statusText}... Повторите попытку позже... `;
    }
})
    xhr.send();
}

function loadShareData(result) {
    image.src = result.url;
    imageId = result.id;
    if(href.indexOf('&share') == -1) {
        url.value = `${location.href}` + '&share';
        menu.dataset.state = 'selected';
        share.dataset.state = 'selected';        
    } else {
        menu.dataset.state = 'selected';
        comments.dataset.state = 'selected';
        formContainer.style.zIndex = '2'; 
    }


    if (result.comments) {
        createCommentsArray(result.comments);
    }

    if (result.mask) {
        mask.src = result.mask;
        mask.classList.remove('hidden');
        mask.style.display = 'none';
    }

    if (document.getElementById('comments-off').checked) {
        console.log('Комментарии выключены!');
        commentsForm = document.querySelectorAll('.comments__form');
        for (const comment of commentsForm) {
            comment.classList.add('hidden');
        }
    }
    webSocket()
    closeAllForms();
}


function sendNewComment(id, comment, target) {
    const xhr = new XMLHttpRequest();
    const body = 'message=' + encodeURIComponent(comment.message) +
        '&left=' + comment.left +
        '&top=' + comment.top;
    xhr.open("POST", `https://neto-api.herokuapp.com/pic/${id}/comments`, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.addEventListener("loadstart", () => target.querySelector('.loader').classList.remove('hidden'));
    xhr.addEventListener("loadend", () => target.querySelector('.loader').classList.add('hidden'));
    xhr.addEventListener('load', () => {
        console.log(xhr.status)
    if(xhr.status === 200) {
        console.log('Комментарий был отправвлен!');
        const result = JSON.parse(xhr.responseText);
        createCommentsArray(result.comments);
        needReload = false;
    } else {
        error.classList.remove('hidden');
        errorMessage.innerText = `Произошла ошибка ${xhr.status}! ${xhr.statusText}... Повторите попытку позже... `;
    }
})
    xhr.send(body);
}


function sendMask(event) {
    canvas.removeEventListener('mousemove', draw);
    if (event.target !== canvas) {
        return;
    }
    now = Date.now();
    if (now - timer > 1000) {
        canvas.toBlob(blob => connection.send(blob));
        timer = now;
    }
    if (event === 'mask') {
        console.log('Событие mask...');
        mask.classList.remove('hidden');
        mask.src = response.url;
        clearCanvas();
    } else if (event === 'comment') {
        console.log('Событие comment...');
        pullComments(response);
    }
}

function pullComments(result) {
//    console.log(result.id);
//    console.log(commentId);
    if(commentId === result.id) {
        return;
    }
    globalCommentsArray.push(result);
    countComments = 0;
    commentId = result.id;
    const countCurrentComments = document.getElementsByClassName('comment').length - document.getElementsByClassName('comment load').length;
    needReload = (countComments === countCurrentComments) ? false : true;

    if (result) {
        createCommentsArray(globalCommentsArray);
    }

    if (document.getElementById('comments-off').checked) {
        const commentsForm = document.querySelectorAll('.comments__form');
        for (const comment of commentsForm) {
            comment.classList.add('hidden');
        }
    }
}
