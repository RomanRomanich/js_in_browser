//document.addEventListener('click', () => error.classList.add('hidden'));
let href = window.location.href;
//-----------------DRAG--------------------------//

const wrap = document.querySelector('.wrap');
const dragable = document.querySelectorAll('.drag');
const shiftMenu = {x: 0,y: 0};
const menuItems = document.querySelectorAll('.menu__item');

let movedPiece = null;
let bounds;
let maxX;
let maxY;
let minX = wrap.offsetLeft;
let minY = wrap.offsetTop;

//------------------INTERFACE-----------------------//

const burger = document.querySelector('.burger');
const menu = document.querySelector('.menu');
const modes = document.querySelectorAll('.mode');
const comments = document.querySelector('.comments');
const commentsForm = document.querySelectorAll('.comments__form');
const commentsOn = document.getElementById('comments-on');
const commentsOff = document.getElementById('comments-off');
const fileInput = document.createElement('input');

//------------------SERVER-------------------------//

const error = document.querySelector('.error');
const imgLoad = document.querySelector('.image-loader');
const image = document.querySelector('.current-image');
const errorMessage = document.querySelector('.error__message');
const url = document.querySelector('.menu__url');
const share = document.querySelector('.share');
const copy = document.querySelector('.menu_copy');

let connection;
let needReload = false;
let commentId;
let imageId;

//------------------COMMENTS and DRAWING------------------------//
const mask = document.querySelector('.mask');
const drawer = document.querySelector('.draw');
const wrapForCanv = document.createElement('div');
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
const colorButtons = document.querySelector('.draw-tools');

let globalCommentsArray = [];
let countComments;
let curves = [];
let drawing = false;
let needsRepaint = false;
let commentsWrap;
let timer = Date.now();
let now = null;
let color = {'red': '#ea5d56', 'yellow': '#f3d135', 'green': '#6cbe47', 'blue': '#53a7f5', 'purple': '#b36ade'};

const formContainer = document.createElement('div');

burger.addEventListener('click', () => {
    menu.dataset.state = 'default';
    modes.forEach(elem => elem.dataset.state = '');
    error.classList.add('hidden');
    canvas.removeEventListener('mousedown', canvasMouseDown);
    canvas.removeEventListener('mouseup', sendMask);
    canvas.removeEventListener('mousemove', draw);
    canvas.classList.add('hidden');
    checkMenuPosition();
    formContainer.style.zIndex = '2';
});

modes.forEach(elem => {
    if (!elem.classList.contains('new')) {
        elem.addEventListener('click', (event) => {
            menu.dataset.state = 'selected';
            event.currentTarget.dataset.state = 'selected';
            error.classList.add('hidden');
            checkMenuPosition();
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
fileInput.setAttribute('id', 'fileInput');
fileInput.setAttribute('type', 'file');
fileInput.setAttribute('accept', 'image/jpeg, image/png');

fileInput.addEventListener('change', event => {
    const file = event.currentTarget.files[0];
    sendFile(file);
});
document.querySelector('.new').appendChild(fileInput);
const inputMenu = document.querySelector('#fileInput');
inputMenu.style.position = 'absolute';
inputMenu.style.width = '100%';
inputMenu.style.height = '100%';
inputMenu.style.top = 0;
inputMenu.style.left = 0;
inputMenu.style.opacity = 0;

//--------------------SHARE----------------------------------//
copy.addEventListener('click', copyUrl);

function copyUrl() {
    url.select();
    document.execCommand('copy');
}