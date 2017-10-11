var originalBoard; //original board, array that keeps track of what is in the square
//var squareTarget = square.target.id;

const humanPlayer = 'O';
const aiPlayer = 'X';
//combos that mean that the game is won
const winCombos = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [6,4,2]
]

const cells = document.querySelectorAll('.cell');
startGame();

function startGame() {
  document.querySelector('.endgame').style.display = 'none';
  //create array and give it a number
  originalBoard =  Array.from(Array(9).keys());
  console.log(originalBoard);
  //To DO: replaces this for loop?
  for (var i= 0; i < cells.length; i++) {
    cells[i].innerText = '';
    cells[i].style.removeProperty('background-color');
    cells[i].addEventListener('click', turnClick, false);
  }
}

function turnClick(square) {
  //prevent clicking on spots already clicked

  //call turn function, pass in humanPlayer
  turn(square.target.id, humanPlayer);
  //console.log(square.target.id);
  //before the AI plays, check if it is a tie
  if(!checkTie()) turn(bestSpot(), aiPlayer);
}

function turn(squareId, player){
  originalBoard[squareId] = player;
  document.getElementById(squareId).innerText = player;
  //check if player has on
  //if won has been won, call gameOver
  let gameWon = checkWin(originalBoard, player)
  //pass into gameOver
  //if gameWon, then gameOver
  if (gameWon) gameOver(gameWon)
}

function checkWin (board, player) {
  //pass in board because will be passing other versions of the board later one
  //accumulator, initialize
  //check the places on the board that have been played in
  //reduce will go through the board array and do something
  // e - element, i - index; take accumulator array and add the index of that array
  //ternary operator: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator
  let plays = board.reduce((a, e, i) => (e === player) ? a.concat(i) : a, []);
  let gameWon = null;
  //check if game has been won
  for (let [index, win] of winCombos.entries()) {
    //for every element of winCombos, check if element is greater then -1
    //has the player played in all these spots?
    if (win.every(elem => plays.indexOf(elem) > -1)){
      gameWon = {index: index, player: player};
      break;
    }
  }
  return gameWon;
}

function gameOver(gameWon) {
  //highlight winning combo, disable clicking
  for (let index of winCombos[gameWon.index]) {
    document.getElementById(index).style.backgroundColor = gameWon.player == humanPlayer ? "blue" : "red";
  }
  for (var i=0; i < cells.length; i++) {
    cells[i].removeEventListener('click', turnClick, false);
  }
}
