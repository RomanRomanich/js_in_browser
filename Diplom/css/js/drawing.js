image.addEventListener('load', () => {
        createCanvas();
});
drawer.addEventListener('click', clickModeDraw);
colorButtons.addEventListener('click', colorSelect);


function colorSelect(event) {
    if (event.target.name === 'color') {
        const currentColor = document.querySelector('.menu__color[checked]');
        currentColor.removeAttribute('checked');
        event.target.setAttribute('checked', '');
    }
}

function getColor() {
    const currentColor = document.querySelector('.menu__color[checked]').value;
    return color[currentColor];
}

function clickModeDraw() { 
    menu.dataset.state = 'selected';
    drawer.dataset.state = 'selected';
    drawMode();
}


function createCanvas() {
    const width = getComputedStyle(wrap.querySelector('.current-image')).width.slice(0, -2);
    const height = getComputedStyle(wrap.querySelector('.current-image')).height.slice(0, -2);
    canvas.width = width;
    canvas.height = height;
    canvas.style.position = 'absolute';
    canvas.style.top = '50%';
    canvas.style.left = '50%';
    canvas.style.transform = 'translate(-50%, -50%)';
    canvas.style.display = 'block';
    canvas.style.zIndex = '1';


    wrap.appendChild(canvas);

    curves = [];
    drawing = false;
    needsRepaint = false;
}


function drawMode() {
    canvas.classList.remove('hidden');
    canvas.addEventListener('mousedown', canvasMouseDown);
    canvas.addEventListener('mouseup', sendMask);
    resizeCanvas();
}

function resizeCanvas() {
    canvas.width = mask.width = document.querySelector('.current-image').width;
    canvas.height =  mask.height = document.querySelector('.current-image').height;
}

function canvasMouseDown(event) {
    x = event.offsetX;
    y = event.offsetY;
    draw(event);
    canvas.addEventListener('mousemove', draw);
}

function draw(event) {
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.lineWidth = 4;
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = getColor();
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.closePath();
    ctx.stroke();
    x = event.offsetX;
    y = event.offsetY;
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