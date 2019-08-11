
const initMouse = { x:0, y:0 };
const curMouse = { x:0, y:0 };
let canvasContext;

function paintModeHandler() {
  const paintCanvas = $('.canvas_image_draw');
  const	picture = $('.picture_wrap');
  canvasContext = paintCanvas.getContext('2d');	
	
  canvasContext.strokeStyle = 'green';
  canvasContext.lineWidth = 5;
	
  paintCanvas.addEventListener('mousedown', function(event) {
    initMouse.x = event.offsetX;
    initMouse.y = event.offsetY;
    paintCanvas.addEventListener('mousemove', onPaint, false);
	}, false);
	
  paintCanvas.addEventListener('mouseup', function() {
    paintCanvas.removeEventListener('mousemove', onPaint, false);
    sendCanvas();
	}, false);
	
  const menuColor = document.getElementsByClassName('menu__color');
  for (let i = 0; i < menuColor.length; i++) {
    menuColor[i].addEventListener('click', changeColor, false);
  };
};

function onPaint(event) {
  curMouse.x = event.offsetX;
  curMouse.y = event.offsetY;
  with (canvasContext) {
    beginPath();
    lineJoin = 'round';
    moveTo(initMouse.x, initMouse.y);
    lineTo(curMouse.x, curMouse.y);
    closePath();
    stroke();
  };
  initMouse.x = curMouse.x;
  initMouse.y = curMouse.y;
};

function changeColor(event) {
  canvasContext.strokeStyle = event.target.getAttribute('value');
  canvasContext.globalCompositeOperation = 'source-over';
  canvasContext.lineWidth = 5;
};

eraserEl.addEventListener('click', eraser, false); 

function eraser() {
  canvasContext.globalCompositeOperation = 'destination-out';
  canvasContext.lineWidth = 10;
};

function resetCanvas() {
  const resetMask = $('.canvas_mask');
  const canvasContextReset = resetMask.getContext('2d');
    canvasContextReset.clearRect(0, 0, resetMask.width, resetMask.height);
  const resetImageDraw = $('.canvas_image_draw');
  const canvasContextResetImg = resetImageDraw.getContext('2d');
    canvasContextResetImg.clearRect(0, 0, resetImageDraw.width, resetImageDraw.height);
};

window.addEventListener('resize', resizeCanvas, false);

function resizeCanvas() {		
  const imageDraw = $('.canvas_image_draw');
  const imageDrawContext = imageDraw.getContext('2d');
    imageDraw.width = $('.picture_wrap').clientWidth;
    imageDraw.height = $('.picture_wrap').clientHeight;
    imageDrawContext.clearRect(0, 0, imageDraw.width, imageDraw.height);
    imageDrawContext.strokeStyle = 'green';
    imageDrawContext.lineWidth = 5;
  const colors = document.getElementsByClassName('menu__color');
  const colorsArr = Array.from(colors);
  for (let i = 0; i < colorsArr.length; i++) {
    if(colorsArr[i].checked) {
      imageDrawContext.strokeStyle = `${colorsArr[i].defaultValue}`; 
    }
  };
};
