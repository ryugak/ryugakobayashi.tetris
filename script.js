'use strict';
const tetris = () => {
  const score = document.getElementById('scoreVal');
  let scoreVal = 0;
  window.alert('click to start')
  let gameSpeed = 800;
  const fieldWidth = 10;//col
  const fieldHeight = 20;//row
  const blockSize = 30;
  const screenWidth = blockSize * fieldWidth;
  const screenHeight = blockSize * fieldHeight;
  const tetroSize = 4;
  let can = document.getElementById('can');
  let con = can.getContext('2d');
  can.width = screenWidth;
  can.height = screenHeight;
  can.style.border = '4px solid #555';
  //ブロック本体
  const tetroColor = [
    '000',
    '#6cf',
    '#f92',
    '#66f',
    '#c5c',
    '#fd2',
    '#f44',
    '#5b5',
    '#b0b0b0',
  ];
  const tetroType = [
    [],
    [
      [0,0,0,0],
      [1,1,1,1],
      [0,0,0,0],
      [0,0,0,0]
    ],
    [
      [0,1,0,0],
      [0,1,0,0],
      [0,1,1,0],
      [0,0,0,0]
    ],
    [
      [0,0,1,0],
      [0,0,1,0],
      [0,1,1,0],
      [0,0,0,0]
    ],
    [
      [0,1,0,0],
      [0,1,1,0],
      [0,1,0,0],
      [0,0,0,0]
    ],
    [
      [0,0,0,0],
      [0,1,1,0],
      [0,1,1,0],
      [0,0,0,0]
    ],
    [
      [0,0,0,0],
      [1,1,0,0],
      [0,1,1,0],
      [0,0,0,0]
    ],
    [
      [0,0,0,0],
      [0,1,1,0],
      [1,1,0,0],
      [0,0,0,0]
    ],
    [
      [0,0,0,0],
      [0,1,1,0],
      [0,1,0,0],
      [0,0,0,0]
    ],
  ]
  const startX = fieldWidth/2 - tetroSize/2;
  const startY = 0;
  let tetro = [];
  //座標
  let tetroX = startX;
  let tetroY = startY;
  //フィールド本体
  let field = [];
  let tetroT = [];
  let over = false;
  tetroT = Math.floor(Math.random() * (tetroType.length -1))+1;
  tetro = tetroType[tetroT];
  init();
  drawAll();
  setInterval(dropTetro, gameSpeed);
  function init() {
    for(let y= 0; y < fieldHeight; y++) {
      field[y] = [];
      for(let x = 0; x < fieldWidth; x++) {
        field[y][x] = 0;
      }
    }
  }
  function drawBlock(x,y,c) {
    let px = x * blockSize;
    let py = y * blockSize;
    con.fillStyle = tetroColor[c];
    con.fillRect(px, py, blockSize, blockSize);
    con.strokeStyle = 'black';
    con.strokeRect(px, py, blockSize, blockSize);
  }
  function drawAll() {
    con.clearRect(0, 0, screenWidth, screenHeight);
    for(let y= 0; y < fieldHeight; y++) {
      for(let x = 0; x < fieldWidth; x++) {
        if(field[y][x]) {
          drawBlock(x,y, field[y][x]);
        }
      }
    }
    for(let y= 0; y < tetroSize; y++) {
      for(let x = 0; x < tetroSize; x++) {
        if(tetro[y][x] === 1) {
          drawBlock(tetroX+x, tetroY+y, tetroT);
        }
      }
    }
    if(over) {
      window.alert('GAME OVER! please reload(command + R)');
    }
  }
  function checkMove(mx, my, nTetro) {
    if(nTetro === undefined) nTetro = tetro;
    for(let y= 0; y < tetroSize; y++) {
      for(let x = 0; x < tetroSize; x++) {
        if(nTetro[y][x]) {
          let nx = tetroX + mx + x;
          let ny = tetroY + my + y;
          if(ny < 0 || nx < 0 || ny >= fieldHeight || nx >= fieldWidth || field[ny][nx]) return false;
        }
      }
    }
    return true;
  }
  function rotate() {
    let nTetro = [];
    for(let y= 0; y < tetroSize; y++) {
      nTetro[y] = [];
      for(let x = 0; x < tetroSize; x++) {
        nTetro[y][x] = tetro[tetroSize-x-1][y];
      }
    }
    return nTetro;
  }
  function fixTetro() {
    for(let y= 0; y < tetroSize; y++) {
      for(let x = 0; x < tetroSize; x++) {
        if(tetro[y][x]) {
          field[tetroY+y][tetroX+x] = tetroT;
        }
      }
    }
  }
  function checkLine() {
    for(let y= 0; y < fieldHeight; y++) {
      let flag = true;
      for(let x = 0; x < fieldWidth; x++) {
        if(!field[y][x]) {
          flag = false;
          break;
        }
      }
      if(flag) {
        for(let ny = y; ny > 0; ny--){
          for(let nx = 0; nx < fieldWidth; nx++) {
            field[ny][nx] = field[ny-1][nx];
          }
        }
        scoreVal = scoreVal + 200;
        score.innerHTML = scoreVal;
      }
    }
  }
  function dropTetro() {
    if(over)return;
    if(checkMove(0, 1))tetroY++;
    else {
      fixTetro();
      checkLine();
      tetroT = Math.floor(Math.random() * (tetroType.length -1))+1;
      tetro = tetroType[tetroT];
      tetroX = startX;
      tetroY = startY;
      if(!checkMove(0,0)){
        over = true
      }
    }
    drawAll();
  }
  document.onkeydown = function(e) {
    if(over)return;
    switch(e.keyCode) {
      case 37://左
        if(checkMove(-1, 0))tetroX--;
        break;
      case 38://上
        while(checkMove(0, 1))tetroY++;
        break;
      case 39://右
        if(checkMove(1, 0))tetroX++;
        break;
      case 40://下
        if(checkMove(0, 1))tetroY++;
        break;
      case 32://スペース
        let nTetro = rotate();
        if(checkMove(0, 0, nTetro)) tetro = rotate();
        break;
    }
    drawAll();
  }
}
tetris();
