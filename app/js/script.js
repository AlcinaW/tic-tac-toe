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
  //change to map after?
  for (var i= 0; i < cells.length; i++) {
    cells[i].innerText = '';
    cells[i].style.removeProperty('background-color');
    cells[i].addEventListener('click', turnClick, false);
  }
}

function turnClick(square) {
  //call turn function, pass in humanPlayer
  turn(square.target.id, humanPlayer);
  console.log(square.target.id);
}

function turn(squareId, player){
  originalBoard[squareId] = player;
  document.getElementById(squareId).innerText = player;
}
