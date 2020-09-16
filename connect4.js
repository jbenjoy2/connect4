/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

let WIDTH = 7;
let HEIGHT = 6;

let p1Wins = 0;
let p2Wins = 0;

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])
const slide = document.querySelector('#slide');
const p1 = document.querySelector('#player1');
const p2 = document.querySelector('#player2');
const fight = document.querySelector('#fight');
const tie = document.querySelector('#tie');
const turn = document.querySelector('h3');
let playerTurn = document.querySelector('h3 span');
const round = document.querySelector('#round');
const start = document.querySelector('#start');
const mute = document.querySelector('#mute');
const buttons = document.querySelector('.buttons');
const p1count = document.querySelector('#p1wins');
const p2count = document.querySelector('#p2wins');
let roundCounter = 1;

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

mute.addEventListener('click', function() {
	if (!mute.classList.contains('muted')) {
		tie.muted = true;
		p1.muted = true;
		p2.muted = true;
		fight.muted = true;
		slide.muted = true;
		mute.classList += 'muted';
	} else {
		tie.muted = false;
		p1.muted = false;
		p2.muted = false;
		fight.muted = false;
		slide.muted = false;
		mute.classList.remove('muted');
	}
});
function startGame() {
	makeBoard();
	makeHtmlBoard();
	fight.play();
	currPlayer = 1;
	playerTurn.innerText = `It's Player ${currPlayer}'s turn!`;
	playerTurn.setAttribute('class', `p${currPlayer}_turn`);
	round.innerText = `Round ${roundCounter}`;
	p1count.innerText = `P1:${p1Wins}`;
	p2count.innerText = `P2:${p2Wins}`;
}

function makeBoard() {
	// TODO: set "board" to empty HEIGHT x WIDTH matrix array
	for (let y = 0; y < HEIGHT; y++) {
		board.push(Array.from({ length: WIDTH }));
	}
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
	// TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
	const htmlBoard = document.getElementById('board');

	//adds the top row to preview the move before you make it
	let top = document.createElement('tr');
	top.setAttribute('id', 'column-top');
	top.addEventListener('click', handleClick);

	for (let x = 0; x < WIDTH; x++) {
		let headCell = document.createElement('td');
		headCell.setAttribute('id', x);
		// headCell.classList.add(`p${currPlayer}`);
		top.append(headCell);
	}

	htmlBoard.append(top);

	// adds the rows in for the board, made up of tds along the width of it
	for (let y = 0; y < HEIGHT; y++) {
		const row = document.createElement('tr');
		for (let x = 0; x < WIDTH; x++) {
			const cell = document.createElement('td');
			cell.setAttribute('id', `${y}-${x}`);
			cell.setAttribute('class', 'space');
			row.append(cell);
		}
		htmlBoard.append(row);
	}
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
	for (let y = HEIGHT - 1; y >= 0; y--) {
		if (!board[y][x]) {
			return y;
		}
	}
	return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
	const playedPiece = document.createElement('div');
	const cell = document.getElementById(`${y}-${x}`);

	playedPiece.classList.add('piece');
	playedPiece.classList.add(`p${currPlayer}`);
	// playedPiece.style.top = -50 * (y + 2);

	cell.append(playedPiece);
}

/** endGame: announce game end  and reset board **/

function endGame(msg) {
	if (p1Wins < 3 && p2Wins < 3) {
		if (!alert(msg)) {
			const spaces = document.querySelectorAll('.space');
			const htmlBoard = document.getElementById('board');
			const rows = htmlBoard.querySelectorAll('tr');
			//remove all rows fromw html board
			for (let space of spaces) {
				if (space.hasChildNodes()) {
					const toRemove = space.querySelector('.piece');
					toRemove.remove();
				}
			}
			//reset js board
			board.length = 0;
			for (row of rows) {
				row.remove();
			}
			round.classList.add('hidden');
			turn.classList.add('hidden');

			//remove player turn span
			setTimeout(function() {
				playerTurn.setAttribute('class', `hidden`);
			}, 251);

			//remove mute button position change
			buttons.classList.remove('playing');
			//re-add the start button
			buttons.append(start);
			start.innerText = 'Start Next Round';
			//update round number
			roundCounter++;
			round.innerText = `Round ${roundCounter}`;
			p1count.innerText = `P1:${p1Wins}`;
			p2count.innerText = `P2:${p2Wins}`;
		}
	}
	if (p1Wins >= 3) {
		if (!alert('Player1 has won the battle')) {
			window.location.reload();
		}
	} else if (p2Wins >= 3) {
		if (!alert('Player2 has won the battle')) {
			window.location.reload();
		}
	}
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
	// get x from ID of clicked cell
	let x = +evt.target.id;

	// get next spot in column (if none, ignore click)
	let y = findSpotForCol(x);
	if (y === null) {
		return;
	}

	// place piece in board and add to HTML table
	// TODO: add line to update in-memory board
	board[y][x] = currPlayer;
	slide.play();
	placeInTable(y, x);

	// check for win
	if (checkForWin()) {
		if (currPlayer === 1) {
			p1.play();
			p1Wins++;
		} else if (currPlayer === 2) {
			p2.play();
			p2Wins++;
		}
		setTimeout(function() {
			endGame(`Player ${currPlayer} wins!`);
		}, 250);
	}

	// check for tie
	// TODO: check if all cells in board are filled; if so call, call endGame
	if (board.every((row) => row.every((cell) => cell))) {
		tie.play();
		setTimeout(function() {
			return endGame('TIE!');
		}, 201);
	}
	setTimeout(function() {
		currPlayer = currPlayer === 1 ? 2 : 1;
		playerTurn.innerText = `It's Player ${currPlayer}'s turn!`;
		playerTurn.setAttribute('class', `p${currPlayer}_turn`);
	}, 251);
}

// for (topPiece of topPieces) {
// 	topPiece.addEventListener('mouseover', function() {
// 		if (topPiece.classList.contains('p1')) {
// 			topPiece.style.backgroundColor = 'red';
// 		} else {
// 			topPiece.style.backgroundColor = 'blue';
// 		}
// 	});
// }

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
	function _win(cells) {
		// Check four cells to see if they're all color of current player
		//  - cells: list of four (y, x) cells
		//  - returns true if all are legal coordinates & all match currPlayer

		return cells.every(
			([ y, x ]) => y >= 0 && y < HEIGHT && x >= 0 && x < WIDTH && board[y][x] === currPlayer
		);
	}

	// TODO: read and understand this code. Add comments to help you.
	//for each y coordinate, go through each x coordinate and check 4 consecutive horizontal, vertical, and diagonal divs
	for (let y = 0; y < HEIGHT; y++) {
		for (let x = 0; x < WIDTH; x++) {
			let horiz = [ [ y, x ], [ y, x + 1 ], [ y, x + 2 ], [ y, x + 3 ] ];
			let vert = [ [ y, x ], [ y + 1, x ], [ y + 2, x ], [ y + 3, x ] ];
			let diagDR = [ [ y, x ], [ y + 1, x + 1 ], [ y + 2, x + 2 ], [ y + 3, x + 3 ] ];
			let diagDL = [ [ y, x ], [ y + 1, x - 1 ], [ y + 2, x - 2 ], [ y + 3, x - 3 ] ];

			if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
				return true;
			}
		}
	}
}
start.addEventListener('click', function() {
	startGame();
	buttons.classList.add('playing');
	if (buttons.classList.contains('playing')) {
		start.remove();
	}

	const topPieces = document.querySelectorAll('#column-top td');
	const topRow = document.querySelector('#column-top');
	for (let i = 0; i < topPieces.length; i++) {
		topPieces[i].classList.add(`p${currPlayer}`);
	}

	topRow.addEventListener('click', function(e) {
		for (piece of topPieces) {
			if (piece.classList.contains('p1')) {
				piece.classList.remove('p1');
				piece.classList.add('p2');
			} else {
				piece.classList.remove('p2');
				piece.classList.add('p1');
			}
		}
	});
});
