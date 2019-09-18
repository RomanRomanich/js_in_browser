let href = window.location.href;

//-----------------DRAG--------------------------//

const wrap = document.querySelector('.wrap');
const dragable = document.querySelectorAll('.drag');
const shiftMenu = {x: 0,y: 0};

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

//------------------SERVER-------------------------//

const error = document.querySelector('.error');
const imgLoad = document.querySelector('.image-loader');
const image = document.querySelector('.current-image');
const errorMessage = document.querySelector('.error__message');
const url = document.querySelector('.menu__url');
const share = document.querySelector('.share');
const copy = document.querySelector('.menu_copy');

let connection;
let imageId;

//------------------COMMENTS and DRAWING------------------------//
const mask = document.querySelector('.mask');
const drawer = document.querySelector('.draw');
const wrapForCanv = document.createElement('div');
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
const colorButtons = document.querySelector('.draw-tools');


let curves = [];
let drawing = false;
let needsRepaint = false;
let commentsWrap;
let timer = Date.now();
let now = null;
let color = {'red': '#ea5d56', 'yellow': '#f3d135', 'green': '#6cbe47', 'blue': '#53a7f5', 'purple': '#b36ade'};

