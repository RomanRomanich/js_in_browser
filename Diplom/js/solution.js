const $ = function(selector) { 
  return document.querySelector(selector); 
}; 

const $$ = function(selector) { 
  return document.querySelectorAll(selector); 
}; 

const bodyEl = $('body');
const wrap = $('.wrap');
const menu = $('.menu');
const burger = $('.burger');
const newPic = $('.new');
const dragElement = $('.drag');
const paint = $('.menu__item-title');
const pictureWrap = $('.picture_wrap');
const image = $('.current-image');
const imageLoader = $('.image-loader');
const imageUrlEl = $('.menu__url');
const repeatDownloadErr = $('.repeat_download');
const formatError = $('.format_error');
const copyButton = $('.menu_copy');
const comments = $('.comments');
const commentsEl = $('.comments-tools');
const commentsSwitchBtn = $('.menu__toggle-bg');
const commentsOn = $('.menu__toggle');
const commentsLoader = $('.comment_loader');
const newCommentForm = $('.new_comment');
const share = $('.share');
const shareEl = $('.share-tools');
const draw = $('.draw');
const drawEl = $('.draw-tools');
const eraserEl = $('.menu__eraser');
const canvasImageDraw = $('.canvas_image_draw');
const canvasMask = $('.canvas_mask');

document.addEventListener('DOMContentLoaded', function() {
  defaultMenuDisplayStyle();

  if (performance.navigation.type === 1) { // Сохранение отображения ранее загруженного изображения при перезагрузке страницы
    image.src = localStorage.getItem('saveImg');
    image.style.display = 'inline-block';
  };  

  let imageID = getURLParameterByName('id');
  if (imageID) {
    window.imageID = imageID;
    wsConnect();
  }; 
});

function getURLParameterByName(name) {
  let url = window.location.href;
  let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
  let results = regex.exec(url);
  if (!results) 
    return null;
  if (!results[2]) 
    return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
};

function defaultMenuDisplayStyle() {
  menu.style.display = 'inline-block';
  newPic.style.display = 'inline-block';
  burger.style.display = 'none'; 
  share.style.display = 'none';
  comments.style.display = 'none';
  draw.style.display = 'none';
};

function menuBiasCorrection(difference, curMax) {
  if (curMax === parseInt(menu.style.left)) {
    menu.style.left = (parseInt(menu.style.left) - difference) + 'px';
  } else if ((maxX - difference) < parseInt(menu.style.left)) {
    menu.style.left = (curMax - difference) + 'px';
  };
};

burger.addEventListener('click', burgerMode, false);

function burgerMode() { 
  const maxXBurger = wrap.offsetLeft + wrap.offsetWidth - menu.offsetWidth - 1;
  if (commentsEl.style.display === 'inline-block') {
    menuBiasCorrection(49, maxXBurger);
  } else if (drawEl.style.display === 'inline-block') {
    menuBiasCorrection(67, maxXBurger);
  };

  burgerDisplayStyle(); 
};

function burgerDisplayStyle() {
  burger.style.display = 'none';
  newPic.style.display = 'inline-block';
  share.style.display = 'inline-block';
  shareEl.style.display = 'none';
  comments.style.display = 'inline-block';
  commentsEl.style.display = 'none';
  draw.style.display = 'inline-block'; 
  drawEl.style.display = 'none';
};

function displayStyleChange(event) {
  try {
    burger.style.display = 'inline-block';
    newPic.style.display = 'none';
    share.style.display = 'none';
    shareEl.style.display = 'none';
    comments.style.display = 'none';
    commentsEl.style.display = 'none';
    draw.style.display = 'none'; 
    drawEl.style.display = 'none';
    event.currentTarget.style.display = 'inline-block';
    event.currentTarget.nextElementSibling.style.display = 'inline-block';
  } catch(err) {
    share.style.display = 'inline-block';
    shareEl.style.display = 'inline-block';
  }
};

share.addEventListener('click', shareMode, false); 

function shareMode(event) { 
  const maxXShare = wrap.offsetLeft + wrap.offsetWidth - menu.offsetWidth - 1;
  if(newPic.style.display === 'inline-block' && share.style.display === 'none') {    
    menuBiasCorrection(567, maxXShare); 
  } else {
    menuBiasCorrection(189, maxXShare);
  };
   
  displayStyleChange(event);   
};

comments.addEventListener('click', commentMode, false);

function commentMode(event) { 
  displayStyleChange(event);
  $('.canvas_image_draw').style.display = 'none';
};

draw.addEventListener('click', paintMode, false); 

function paintMode(event) {
  displayStyleChange(event);
  $('.canvas_image_draw').style.display = '';
  paintModeHandler();
};

const input = document.createElement('input'); 
  input.type = 'file'; 
  input.id = 'inputFile';
  input.classList.add('hidden_input'); 
  input.classList.add('hidden'); 
  input.accept = '.jpg, .png'; 
newPic.appendChild(input); 

newPic.addEventListener('click', openFileDialog, false);

function openFileDialog() {
  $('.hidden_input').click();
};

copyButton.addEventListener('click', copyLinkToClipboard, false);

function copyLinkToClipboard() {
  let link = imageUrlEl;
  link.select();
  document.execCommand("Copy");
};
