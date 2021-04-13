let model = {
	boardSize: 7,
	numShips: 3,
	shipLength: 3,
	shipsSunk: 0,

	ships: [
			{locations: [0, 0, 0], hits: ["", "", ""]},
			{locations: [0, 0, 0], hits: ["", "", ""]},
			{locations: [0, 0, 0], hits: ["", "", ""]}
	],

	fire: function(guess) {
		for (let i = 0; i < this.numShips; i++) {
			let ship = this.ships[i];
			let index = ship.locations.indexOf(guess);
			if (index >= 0) {
				ship.hits[index] = "hit";
				view.displayHit(guess);
				view.displayMessage("HIT!");
				if (this.isSunk(ship)) {
					view.displayMessage("You sank my ship!!!");
					this.shipsSunk++;
				}
				return true;
			}
		}
		view.displayMiss(guess);
		view.displayMessage("Missed.");
		return false;
	},
	isSunk: function(ship) {
		for (let i = 0; i < this.shipLength; i++) {
			if (ship.hits[i] != "hit") {
				return false;
			}
		}
		return true;
	},
	generateShipLocations: function() {
		let locations;
		for (let i = 0; i < this.numShips; i++) {
			do {
				locations = this.generateShip();
			} while (this.collision(locations));
			this.ships[i].locations = locations;
		}
	},

	generateShip: function() {
		let direction = Math.floor(Math.random() * 2);
		let row, col;

		if (direction == 1) { // horizontal
			col = Math.floor(Math.random() * this.boardSize);
			row = Math.floor(Math.random() * this.boardSize - this.shipLength);
		} else { // vertical
			col = Math.floor(Math.random() * this.boardSize - this.shipLength);
			row = Math.floor(Math.random() * this.boardSize);
		}

		let newShipLocations = [];
		for (let i = 0; i < this.shipLength; i++) {
			if (direction == 1) {
				newShipLocations.push(col + "" + (row + i));
			} else {
				newShipLocations.push((col + i) + "" + row);
			}
		}
		return newShipLocations;
	},

	collision: function(locations) {
		for (let i = 0; i < this.numShips; i++) {
			let ship = this.ships[i];
			for (let j = 0; j < locations.length; j++) {
				if (ship.locations.indexOf(locations[j]) >= 0) {
					return true;
				}
			}
		}
		return false;
	},
}

let view = {
	displayMessage: function(msg) {
		let messageArea = document.getElementById('messageArea');
		messageArea.innerHTML = msg;
	},

	displayHit: function(location) {
		let area = document.getElementById(location);
		area.setAttribute("class", "hit");
	},

	displayMiss: function(location) {
		let area = document.getElementById(location);
		area.setAttribute("class", "miss");
	}
};

let controller = {
	guesses: 0,
	processGuess: function(guess) {
		let location = parseGuess(guess);
		if (location) {
			this.guesses++;
			let hit = model.fire(location);
			if (hit && model.shipsSunk == model.numShips) {
				view.displayMessage(`You sank all my battleships` +
				                    ` in ${this.guesses} guesses!`);
				document.getElementById('inputForm').style.display = 'none';
			}
		} else {

		}

	}
};

function parseGuess(guess) {
	let alphabet = ["A", "B", "C", "D", "E", "F", "G"];
	if (guess == null || guess.length != 2) {
		alert("Please, enter valid values!");
	} else {
		let firstChar = guess.charAt(0);
		let row = alphabet.indexOf(firstChar);
		let column = guess.charAt(1);

		if (isNaN(row) || isNaN(column)) {
			alert("Sorry, that isn't on the board");
		} else if (row < 0 || row > model.boardSize || column < 0 || column > model.boardSize) {
			alert("Sorry, that's off the board!");
		} else {
			return "" + row + column;
		}	
	}
	return null;
}

function handleFireButton() {
	let guessInput = document.getElementById('guessInput');
	let guess = guessInput.value;
	controller.processGuess(guess);

	guessInput.value = ""; // for an empty input after click
}

function handleKeyPress(e) {
	let fireButton = document.getElementById('fireButton');
	if (e.keyCode == 13) {
		fireButton.click();
		return false;
	}
}

function init() {
	let fireButton = document.getElementById('fireButton');
	fireButton.onclick = handleFireButton;

	let guessInput = document.getElementById('guessInput');
	guessInput.onkeypress = handleKeyPress;

	model.generateShipLocations();
}

window.onload = init;