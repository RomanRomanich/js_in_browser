document.addEventListener('click', () => error.classList.add('hidden'));

burger.addEventListener('click', () => {
    menu.dataset.state = 'default';
    modes.forEach(elem => elem.dataset.state = '');
    canvas.removeEventListener('mousedown', canvasMouseDown);
    canvas.removeEventListener('mouseup', sendMask);
    canvas.removeEventListener('mousemove', draw);
    canvas.classList.add('hidden');
});

modes.forEach(elem => {
    if (!elem.classList.contains('new')) {
        elem.addEventListener('click', (event) => {
            menu.dataset.state = 'selected';
            event.currentTarget.dataset.state = 'selected';
        });
    }
});
//---------------------SHOWCOMMENTS------------------------//
commentsOn.addEventListener('change', commentsToogle);
commentsOff.addEventListener('change', commentsToogle);

function commentsToogle() {
    if (commentsOn.checked) {
        document.querySelectorAll('.comments__form').forEach(form => {
            form.style.display = '';
        });
    } else {
        document.querySelectorAll('.comments__form').forEach(form => {
            form.style.display = 'none';
        });
    }
}

function markerClick(event) {
    const bodyForm = event.target.nextElementSibling;
    if (bodyForm) {
        if (event.target.className === 'comments__marker-checkbox') {
            removeEmptyComment();

            if (bodyForm.style.display === 'block') {
                closeAllForms();
                bodyForm.style.display = 'none';
            } else {
                closeAllForms();
                bodyForm.style.display = 'block';
            }
        }
    }
}
//-------------------MENUFILELOAD-------------------------//
const fileInput = document.createElement('input');
fileInput.setAttribute('id', 'fileInput');
fileInput.setAttribute('type', 'file');
fileInput.setAttribute('accept', 'image/jpeg, image/png');

fileInput.addEventListener('change', event => {
    const file = event.currentTarget.files[0];
    sendFile(file);
});
document.querySelector('.new').appendChild(fileInput);
document.querySelector('#fileInput').style.position = 'absolute';
document.querySelector('#fileInput').style.width = '100%';
document.querySelector('#fileInput').style.height = '100%';
document.querySelector('#fileInput').style.top = 0;
document.querySelector('#fileInput').style.left = 0;
document.querySelector('#fileInput').style.opacity = 0;

//--------------------SHARE----------------------------------//
copy.addEventListener('click', copyUrl);

function copyUrl() {
    url.select();
    document.execCommand('copy');
}