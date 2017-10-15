// Get the modal
var modal = document.getElementById('info-modal');

var endgame = document.querySelector(".endgame");

var endgameText = document.querySelector(".endgame .text");

//var indexDiv = document.getElementById(index);

var symbolSelect = document.querySelector(".select-symbol");

window.onload = function() {
    //document.getElementById("myBtn").onclick = function () {
        //document.getElementById('myModal').style.display = "none"

        modal.style.display = "block"
    //};
};





// Get the button that opens the modal
var btn = document.getElementById("myButton");

// Get the <span> element that closes the modal
// TODO get rid of extra span 
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
btn.onclick = function() {
    modal.style.display = "block";
    startGame();
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
// window.onclick = function(event) {
//     if (event.target == modal) {
//         modal.style.display = "none";
//     }
// }





let originalBoard; //original board, array that keeps track of what is in the square
//var squareTarget = square.target.id;
let humanPlayer = "O";
let aiPlayer = "X";
//combos that mean that the game is won
const winCombos =[
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 4, 8],
  [6, 4, 2],
  [2, 5, 8],
  [1, 4, 7],
  [0, 3, 6]
];

const cells = document.querySelectorAll(".cell");
startGame();

function selectSym(sym){
  humanPlayer = sym;
  aiPlayer = sym === "O" ? "X" : "O";
  originalBoard = Array.from(Array(9).keys());
  for (let i = 0; i < cells.length; i++) {
    cells[i].addEventListener("click", turnClick, false);
  }
  if (aiPlayer === "X") {
    turn(bestSpot(), aiPlayer);
  }
  //document.querySelector(".selectSym").style.display = "none";
  modal.style.display = "none";
}

function startGame() {
  endgame.style.display = "none";
  endgameText.innerText = "";
  //document.querySelector(".selectSym").style.display = "block";
  modal.style.display = "block";
  //create array and give it a number
  //originalBoard = Array.from(Array(9).keys());
  //console.log(originalBoard);
  //To DO: replaces this for loop?
  for (let i = 0; i < cells.length; i++) {
    cells[i].innerText = "";
    cells[i].style.removeProperty("background-color");
    //cells[i].addEventListener("click", turnClick, false);
  }
}

function turnClick(square) {
  //prevent clicking on spots already clicked
  if (typeof originalBoard[square.target.id] === "number") {
    //call turn function, pass in humanPlayer
    turn(square.target.id, humanPlayer);
    //console.log(square.target.id);
    //before the AI plays, check if it is a tie
    //if(!checkTie()) turn(bestSpot(), aiPlayer);
    if (!checkWin(originalBoard, humanPlayer) && !checkTie())
      turn(bestSpot(), aiPlayer);
  }
}

function turn(squareId, player) {
  originalBoard[squareId] = player;
  document.getElementById(squareId).innerHTML = player;
  //check if player has on
  //if won has been won, call gameOver
  let gameWon = checkWin(originalBoard, player);
  //pass into gameOver
  //if gameWon, then gameOver
  if (gameWon) gameOver(gameWon);
  checkTie();
}

function checkWin(board, player) {
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
    if (win.every(elem => plays.indexOf(elem) > -1)) {
      gameWon = {index: index, player: player};
      break;
    }
  }
  return gameWon;
}

function gameOver(gameWon){
  //highlight winning combo, disable clicking
  for (let index of winCombos[gameWon.index]) {
    document.getElementById(index).style.backgroundColor = gameWon.player === humanPlayer ? "blue" : "red";
  }
  for (let i = 0; i < cells.length; i++) {
    cells[i].removeEventListener("click", turnClick, false);
  }
  declareWinner(gameWon.player === humanPlayer ? "You win!" : "You lose");
}

function declareWinner(who) {
  endgame.style.display = "block";
  endgameText.innerText = who;
}
function emptySquares() {
  //if squares are numbers, they are empty (vs X or O)
  //return originalBoard.filter(s => typeof s == "number");
  return originalBoard.filter((elm, i) => i === elm);
}

function bestSpot() {
  //use .index to tell computer what space to play in
  return minimax(originalBoard, aiPlayer).index;
  //return emptySquares()[0];
}

function checkTie() {
  //if all squares are filled and no winner, it is a tie
  if (emptySquares().length === 0){
    for (cell of cells) {
      cell.style.backgroundColor = "green";
      cell.removeEventListener("click",turnClick, false);
    }
    declareWinner("Tie game");
    return true;
  }
  return false;
}

function minimax(newBoard, player) {
  var availableSpots = emptySquares(newBoard);
  if (checkWin(newBoard, humanPlayer)) {
    return {score: -10};
  } else if (checkWin(newBoard, aiPlayer)) {
    return {score: 10};
  } else if (availableSpots.length === 0) {
    return {score: 0};
  }

  var moves = [];
  for (let i = 0; i < availableSpots.length; i ++) {
    var move = {};
    move.index = newBoard[availableSpots[i]];
    newBoard[availableSpots[i]] = player;

    if (player === aiPlayer)
      move.score = minimax(newBoard, humanPlayer).score;
    else
       move.score =  minimax(newBoard, aiPlayer).score;
    newBoard[availableSpots[i]] = move.index;
    if ((player === aiPlayer && move.score === 10) || (player === humanPlayer && move.score === -10))
      return move;
    else
      moves.push(move);
  }

  let bestMove, bestScore;
  if (player === aiPlayer) {
    bestScore = -1000;
    for(let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
      bestScore = 1000;
      for(let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }
  return moves[bestMove];
}
