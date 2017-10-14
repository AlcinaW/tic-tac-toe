var originalBoard; //original board, array that keeps track of what is in the square
//var squareTarget = square.target.id;
const huPlayer = 'O';
const aiPlayer = 'X';
//combos that mean that the game is won
const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2]
]

const cells = document.querySelectorAll('.cell');
startGame();

function startGame() {
  document.querySelector(".endgame").style.display = "none";
  //create array and give it a number
  originalBoard = Array.from(Array(9).keys());
  //console.log(originalBoard);
  //To DO: replaces this for loop?
  for (var i = 0; i < cells.length; i++) {
    cells[i].innerText = '';
    cells[i].style.removeProperty('background-color');
    cells[i].addEventListener('click', turnClick, false);
  }
}

function turnClick(square) {
  //prevent clicking on spots already clicked
  if (typeof originalBoard[square.target.id] == 'number') {
  //call turn function, pass in humanPlayer
  turn(square.target.id, huPlayer)
  //console.log(square.target.id);
  //before the AI plays, check if it is a tie
  //if(!checkTie()) turn(bestSpot(), aiPlayer);
  if (!checkWin(originalBoard, huPlayer) && !checkTie()) turn(bestSpot(), aiPlayer);
  }
}

function turn(squareId, player) {
  originalBoard[squareId] = player;
  document.getElementById(squareId).innerText = player;
  //check if player has on
  //if won has been won, call gameOver
  let gameWon = checkWin(originalBoard, player)
  //pass into gameOver
  //if gameWon, then gameOver
  if (gameWon) gameOver(gameWon)
}

function checkWin(board, player) {
  //pass in board because will be passing other versions of the board later one
  //accumulator, initialize
  //check the places on the board that have been played in
  //reduce will go through the board array and do something
  // e - element, i - index; take accumulator array and add the index of that array
  //ternary operator: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator
  let plays = board.reduce((a, e, i) =>
  (e === player) ? a.concat(i) : a, []);
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

function gameOver(gameWon) {
  //highlight winning combo, disable clicking
  for (let index of winCombos[gameWon.index]) {
    document.getElementById(index).style.backgroundColor =
    gameWon.player == huPlayer ? "blue" : "red";
  }
  for (var i = 0; i < cells.length; i++) {
    cells[i].removeEventListener('click', turnClick, false);
  }
  declareWinner(gameWon.player == huPlayer ? "You win!" : "You lose.");
}

function declareWinner(who) {
  document.querySelector(".endgame").style.display = "block";
  document.querySelector(".endgame .text").innerText = who;
}

function emptySquares() {
  //if squares are numbers, they are empty (vs X or O)
  return originalBoard.filter(s => typeof s == 'number');
}

function bestSpot() {
  //use .index to tell computer what space to play in
  return minimax(originalBoard, aiPlayer).index;
  //return emptySquares()[0];
}

function checkTie() {
  //if all squares are filled and no winner, it is a tie
  if (emptySquares().length == 0) {
    for (var i = 0; i < cells.length; i++) {
    cells[i].style.backgroundColor = "green";
    cells[i].removeEventListener('click', turnClick, false);
    }
  declareWinner("Tie Game!")
  return true;
  }
  return false;
}

function minimax(newBoard, player) {
	var availSpots = emptySquares(newBoard);

	if (checkWin(newBoard, huPlayer)) {
		return {score: -10};
	} else if (checkWin(newBoard, aiPlayer)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == aiPlayer) {
			var result = minimax(newBoard, huPlayer);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, aiPlayer);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if(player === aiPlayer) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}
	return moves[bestMove];
}
