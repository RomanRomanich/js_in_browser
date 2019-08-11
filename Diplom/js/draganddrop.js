let movedPiece = null; // Начальное значение драг(целевого) элемента    
let minY;
let minX;
let maxX;
let maxY;
let shiftX = 0;
let shiftY = 0;

dragElement.addEventListener('mousedown', dragStart, false);

function dragStart(event) { 
  if (event.which !== 1) { 
    return; 
  };

  movedPiece = menu; 
  minY = wrap.offsetTop + 1; 
  minX = wrap.offsetLeft + 1;
  maxX = wrap.offsetLeft + wrap.offsetWidth - movedPiece.offsetWidth - 1; 
  maxY = wrap.offsetTop + wrap.offsetHeight - movedPiece.offsetHeight - 1; 
  shiftX = event.pageX - event.target.getBoundingClientRect().left - window.pageXOffset; 
  shiftY = event.pageY - event.target.getBoundingClientRect().top - window.pageYOffset; 
};

document.addEventListener('mousemove', event => drag(event.pageX, event.pageY));

function drag(x, y) { 
  if(wrap.offsetWidth === menu.offsetWidth + parseInt(menu.style.left) + 1) {
    drop();
    menu.style.left = (parseInt(menu.style.left) - 2) + 'px';
  } else if(menu.style.left === '1px') {
    drop();
    menu.style.left = (parseInt(menu.style.left) + 2) + 'px';
  } else if(menu.style.top === '1px') {
    drop();
    menu.style.top = (parseInt(menu.style.top) + 2) + 'px';   
  } else if(wrap.offsetHeight === menu.offsetHeight + parseInt(menu.style.top) + 1) {
    drop();
    menu.style.top = (parseInt(menu.style.top) - 2) + 'px';
  };

  if (movedPiece) {
    x = x - shiftX; 
    y = y - shiftY; 
    x = Math.min(x, maxX);  
    y = Math.min(y, maxY); 
    x = Math.max(x, minX); 
    y = Math.max(y, minY); 
    movedPiece.style.left = x + 'px'; 
    movedPiece.style.top = y + 'px'; 
  } else {
    return;
  }
};

dragElement.addEventListener('mouseup', drop, false);

function drop() {
  movedPiece = null; 
};

bodyEl.addEventListener('dragover', dragOverHandler, false);

function dragOverHandler(event) {
  event.preventDefault(); 
};

bodyEl.addEventListener('dragend', dragEndHandler, false);

function dragEndHandler(event) {
  const data = event.dataTransfer;
  if (data.items) {
    for (let i = 0; i < data.items.length; i++) {
      data.items.remove(i);
    }
  } else {
    event.dataTransfer.clearData();
  };
};

bodyEl.addEventListener('drop', dropHandler, false);

function dropHandler(event) {
  event.preventDefault();
  const data = event.dataTransfer;
  
  if (data.items[0].kind === "file" && (data.items[0].type === "image/png"||data.items[0].type === "image/jpeg")) { 
    const dropDateItem = data.items[0].getAsFile(); 
    formatError.classList.add('hidden');                  
    checkForReDownloadThroughDrop(dropDateItem);
  } else {
    formatError.classList.remove('hidden');
  };
};

function checkForReDownloadThroughDrop(dropDateItem) {
  if(image.getAttribute('src') === './pic/image.png') {
    sendImage(dropDateItem);
  } else {  
    repeatDownloadErr.classList.remove('hidden');
  };
};
