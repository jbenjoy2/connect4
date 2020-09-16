/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

let WIDTH = 7;
let HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])
const slide = document.querySelector('#slide');
const p1 = document.querySelector('#player1');
const p2 = document.querySelector('#player2');
const fight = document.querySelector('#fight');
const tie = document.querySelector('#tie');
const playerTurn = document.querySelector('h3');
const start = document.querySelector('button');

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function startGame() {
	makeBoard();
	makeHtmlBoard();
	fight.play();
	playerTurn.innerText = `It's Player ${currPlayer}'s turn!`;
	playerTurn.setAttribute('class', `p${currPlayer}_turn`);
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

/** endGame: announce game end */

function endGame(msg) {
	if (!alert(msg)) {
		window.location.reload();
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
		} else if (currPlayer === 2) {
			p2.play();
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
	start.remove();
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
