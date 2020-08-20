'use strict';
const tetris = () => {
  let get = localStorage.getItem('score');
  let ranking = '';
  try {
    ranking = get.split(',');
  }  catch {
    ranking = [0, 0, 0];
  }
  ranking.sort((a, b) => {
    return b - a;
  });
  const modalShow = document.getElementById('modalShow');
  const rankingFirst = document.getElementById('rankingFirst');
  const rankingSecond = document.getElementById('rankingSecond');
  const rankingThird = document.getElementById('rankingThird');
  rankingFirst.innerHTML = '1st. ' + ranking[0];
  rankingSecond.innerHTML = '2nd.' + ranking[1];
  rankingThird.innerHTML = '3rd.' + ranking[2];
  let gameSpeed = 800;
  let count = 0;
  const score = document.getElementById('scoreVal');
  let scoreVal = 0;
  const line = document.getElementById('lineVal');
  let lineVal = 0;
  const scoreRank = ranking;
  const fieldWidth = 10;
  const fieldHeight = 20;
  const blockSize = 30;//px
  const screenWidth = blockSize * fieldWidth;
  const screenHeight = blockSize * fieldHeight;
  const tetroSize = 4;
  let can = document.getElementById('can');
  let con = can.getContext('2d');
  can.width = screenWidth;
  can.height = screenHeight;
  can.style.border = '4px solid #555';
  can.style.marginRight = '60px';
  let tetro = '';
  const tetroColors = [
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
  const tetroTypes = [
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
  ];
  const startX = fieldWidth/2 - tetroSize/2;
  const startY = 0;
  let tetroX = startX;
  let tetroY = startY;
  let field = [];
  let over = false;
  let tetroT = Math.floor(Math.random() * (tetroTypes.length - 1)) + 1;
  tetro  = tetroTypes[tetroT];
  const startTetro = () => {
    const init = () => {//初期化
      for(let y = 0; y < fieldHeight; y++) {
        field[y] = [];//yが進むごとに配列化
        for(let x = 0; x < fieldWidth; x++) {
          field[y][x] = 0;//20*10に0が入る
        }
      }
    };
    const drawBlock = (x, y, c) => {
      let px = x * blockSize;
      let py = y * blockSize;
      con.fillStyle = tetroColors[c];
      con.fillRect(px ,py, blockSize, blockSize);
      con.strokeStyle = 'black';
      con.strokeRect(px, py, blockSize, blockSize);
    };
    const drawAll = () => {
      con.clearRect(0, 0, screenWidth, screenHeight);
      for(let y = 0; y < fieldHeight; y++) {
        for(let x = 0; x < fieldWidth; x++) {
          if(field[y][x]) {
            drawBlock(x, y, field[y][x]);
          }
        }
      }
      for(let y = 0; y < tetroSize; y++) {
        for(let x = 0; x < tetroSize; x++) {
          if(tetro[y][x]) {
            drawBlock(tetroX + x, tetroY + y, tetroT);
          }
        }
      }
      if(over) {
        window.alert('GAME OVER! please reload(command + R)');
        scoreRank.push(scoreVal);
        scoreRank.sort((a, b) => {
          return b - a;
        });
        localStorage.setItem('score', scoreRank);
        let get = localStorage.getItem('score');
        let ranking = get.split(',');
        rankingFirst.innerHTML = '1st. ' + ranking[0];
        rankingSecond.innerHTML = '2nd.' + ranking[1];
        rankingThird.innerHTML = '3rd.' + ranking[2];
        modalShow.style.display = 'block';
      }
    };
    const checkMove = (mx, my, newTetro) => {//checkMove()の数字が引数
      if(newTetro === undefined) newTetro = tetro;
      for(let y = 0; y < tetroSize; y++) {
        for(let x = 0; x < tetroSize; x++) {
          if(newTetro[y][x]) {
            let nx = tetroX + mx + x;
            let ny = tetroY + my + y;
            if(ny < 0 || nx < 0 || ny >= fieldHeight || nx >= fieldWidth || field[ny][nx]){
              return false;
            }
          }
        }
      }
      return true;
    };
    const rotate = () => {//回転
      let newTetro = [];
      for(let y = 0; y < tetroSize; y++) {
        newTetro[y] = [];
        for(let x = 0; x < tetroSize; x++) {
          newTetro[y][x] = tetro[tetroSize - x - 1 ][y];
        }
      }
      return newTetro;
    };
    const fixTetro = () => {
      for(let y = 0; y < tetroSize; y++) {
        for(let x = 0; x < tetroSize; x++) {
          if(tetro[y][x]) {
            field[tetroY + y][tetroX + x] = tetroT;
          }
        }
      }
    }
    const checkLine = () => {//ラインそろったら
      for(let y = 0; y < fieldHeight; y++) {
        let flag = true;
        for(let x = 0; x < fieldWidth; x++) {
          if(!field[y][x]) {
            flag =  false;
            break;
          }
        }
        if(flag) {
          for(let ny = y; ny > 0; ny--) {
            for(let nx = 0; nx < fieldWidth; nx++) {
              field[ny][nx] = field[ny-1][nx];
            }
          }
          scoreVal = scoreVal + 200;
          score.innerHTML = scoreVal;
          count++;
          lineVal = count;
          line.innerHTML = lineVal;
        }
      }
    };
    const dropTetro = () => {
      if(over) return;
      if(checkMove(0, 1))tetroY++;
      else {
        fixTetro();
        checkLine();
        tetroT = Math.floor(Math.random() * (tetroTypes.length - 1)) + 1;
        tetro  = tetroTypes[tetroT];
        tetroX = startX;
        tetroY = startY;
        if(!checkMove(0, 0)) {
          over = true;
        }
      }
      drawAll();
    };
    init();
    drawAll();
    setInterval(dropTetro, gameSpeed);
    document.onkeydown = (e) => {
      if(over) return;
      switch(e.keyCode) {
        case 37:
          if(checkMove(-1, 0))tetroX--;
          break;
        case 38:
          while(checkMove(0, 1))tetroY++;
          break;
        case 39:
          if(checkMove(1, 0))tetroX++;
          break;
        case 40:
          if(checkMove(0, 1))tetroY++;
          break;
        case 16:
          let newTetro = rotate();
          if(checkMove(0, 0, newTetro))tetro = newTetro;//newTetro
          break;
      }
      drawAll();
    };
  };
  const modal = () => {
    const modal = document.getElementById('modal');
    const fadeIn = (time, opacity) => {
      const begin = new Date() - 0;
      const id = setInterval(() => {
        let current = new Date() - begin;
        let value = current/ time;
        if (value > opacity) {
          clearInterval(id);
          value = opacity;
        }
        modal.style.display = 'block';
        modal.style.opacity = value;
      },10);
    };
    const fadeOut = (time, opacity) => {
      const begin = new Date() - 0;
      const id = setInterval(() => {
        let current = new Date() - begin;
        let value = current/ time;
        if (value > opacity) {
          clearInterval(id);
          value = opacity;
          modal.style.display = 'none';
        }
        modal.style.opacity = opacity - value;
      },10);
    };
    modalShow.addEventListener('click', () => {
      fadeIn(1000, 0.8);
    });
    modal.addEventListener('click', () => {
      fadeOut(1000, 0.8);
    });
  };
  modal();
  const buttons = () => {
    const reload = document.getElementById('reload');
    const start = document.getElementById('start');
    const stop = document.getElementById('stop');
    reload.addEventListener('click', () => {
      location.reload();
    });
    start.addEventListener('click' , () => {
      startTetro();
      modalShow.style.display = 'none';
    });
    stop.addEventListener('click', () => {
      window.alert('stop! click to start');
    });
  };
  buttons();
};
tetris();
