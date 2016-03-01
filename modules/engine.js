'use strict';
var request = require('request');

let GAME_ACTIONS = {
	START: 'startGame',
	NEXT: 'nextWord',
	GUESS: 'guessWord',
	RESULT: 'getResult',
	SUBMIT: 'submitResult'
}

function Engine(options, start) {
	this.playerId = options && options.playerId;
	this.url = options && options.url;
	this.brain = options && options.brain;
	this.currWord = '';
	this.wordsToGuess = 80;
	this.guessAllowedEach = 0;
	this.currWrongGuess = 0;
}

Engine.prototype = {

	runWithBrain: function(brain) {
		this.brain = brain;
		this.startGame().then((data) => {
			this.wordsToGuess = data.numberOfWordsToGuess;
			this.guessAllowedEach = data.numberOfGuessAllowedForEachWord;
			return this._next(this.nextWord(), this._hasNext.bind(this));
		}).catch((e) => {
			console.log(e);
		});
	},

	setBrain: function(brain) {
		this.brain = brain;
	},

	_guess: function(promise, resolve) {
		return promise.then(resolve).then((wrapper) => {
			if (wrapper.done) {
				// if current word cannot guess or already have the right answer,
				// get next word
				this.wordsToGuess--;
				return this._next(this.nextWord(), this._hasNext.bind(this));
			} else {
				// if still need guess, get a letter based on current word and guess
				let letter = this.brain.guess(wrapper.word, false);
				console.log(`Guess: ${letter}`);
				return this._guess(this.guessWord(), resolve);
			}
		});
	},

	_next: function(promise, resolve) {
		return promise.then(resolve).then((wrapper) => {
			if (wrapper.done) {
				// if no word to guess, return result promise
				return this.getResult();
			} else {
				// if has word to guess, guess
				let letter = this.brain.guess(wrapper.word, true);
				console.log(`Guess: ${letter}`);
				this._guess(this.guessWord(letter), this._willGuess.bind(this));
			}
		});
	},

	_willGuess: function(data) {
		console.log('----------------------------------');
		console.log(`Current word: ${data.word}`);
		console.log(`Guessed words: ${data.totalWordCount}`);
		console.log(`Wrong guess count: ${data.wrongGuessCountOfCurrentWord}`);
		let guessResult = data.word;
		let done = guessResult.indexOf('*') < 0 || data.wrongGuessCountOfCurrentWord >= this.guessAllowedEach;
		return {
			done: done,
			word: guessResult
		}
	},

	_hasNext: function(data) {
		console.log('----------------------------------');
		console.log(`Current word: ${data.word}`);
		console.log(`Guessed words: ${data.totalWordCount}`);
		console.log(`Wrong guess count: ${data.wrongGuessCountOfCurrentWord}`);
		let done = this.wordsToGuess < 0;
		return {
			done: done,
			word: data.word
		};
	},

	startGame: function() {
		let postData = {
			"playerId": this.playerId,
			"action" : GAME_ACTIONS.START
		};
		return new Promise((resolve, reject) => {
			this._postRequest(postData, resolve, reject);
		});
	},

	nextWord: function() {
		if (!this.sessionId) {
			console.log('Game not started!');
			return;
		}
		let postData = {
			"sessionId": this.sessionId,
  			"action" : GAME_ACTIONS.NEXT
		};
		return new Promise((resolve, reject) => {
			this._postRequest(postData, resolve, reject);
		});
	},

	guessWord: function(letter) {
		if (!this.sessionId) {
			console.log('Game not started!');
			return;
		}
		let postData = {
			"sessionId": this.sessionId,
			"action" : GAME_ACTIONS.GUESS,
			"guess" : letter
		};
		return new Promise((resolve, reject) => {
			this._postRequest(postData, resolve, reject);
		});
	},

	getResult: function() {
		if (!this.sessionId) {
			console.log('Game not started!');
			return;
		}
		let postData = {
			"sessionId": this.sessionId,
			"action" : GAME_ACTIONS.RESULT
		};
		return new Promise((resolve, reject) => {
			this._postRequest(postData, resolve, reject);
		});
	},

	_postRequest: function(postData, resolve, reject) {
		request(this._requestOptions(postData), (error, response, body) => {
			if (!error && response.statusCode == 200) {
				this.sessionId = body && body.sessionId;
				resolve(body.data);
			} else {
				reject(response);
			}
		});
	},

	_requestOptions: function(data) {
		return {
			url: this.url,
			method: 'POST',
			json: true,
			body: data,
			headers: {
		    	'Content-Type': 'application/json'
			}
		};
	}
}

module.exports = Engine;
