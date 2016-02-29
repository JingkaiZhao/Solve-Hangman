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
	this.currWord = '';
	this.totalWordCount = 0;
	this.currWrongGuess = 0;
	if (start) {
		this.startGame().then((data) => {
			console.log(data);
		}).catch((error) => {
			console.log(error);
		});
	}
}

Engine.prototype = {

	runWithAlgorithm: function(algorithm) {
		this.guessAlgorithm = algorithm;
		this.startGame().then((data) => {
			this.numberOfWordsToGuess = data.numberOfWordsToGuess;
			this.numberOfGuessAllowedForEachWord = data.numberOfGuessAllowedForEachWord;
			return this._next(this.nextWord(), (data) => {
				console.log(data);
				let done = this.numberOfWordsToGuess < 0;
				return done;
			});
		}).then((data) => {
			console.log(data);
		});
	},

	setAlgorithm: function(algorithm) {
		this.guessAlgorithm = algorithm;
	},

	_guess: function(promise, resolve) {
		return promise.then(resolve).then((wrapper) => {
			if (wrapper.done) {
				this.numberOfWordsToGuess--;
				return this._next(this.nextWord(), function(data) {
					console.log(data);
					let done = this.numberOfWordsToGuess < 0;
					return done;
				});
			} else {
				let letter = guessAlgorithm();
				console.log(`Guess: ${letter}`);
				return this._guess(this.guessWord(), resolve);
			}
		});
	},

	_next: function(promise, resolve) {
		return promise.then(resolve).then((done) => {
			if (done) {
				return this.getResult();
			} else {
				let letter = guessAlgorithm();
				console.log(`Guess: ${letter}`);
				this._guess(this.guessWord(letter), (data) => {
					console.log(data);
					let guessResult = data.word;
					let done = guessResult.indexOf('*') < 0 || data.wrongGuessCountOfCurrentWord >= this.numberOfGuessAllowedForEachWord;
					return {
						done: done,
						word: guessResult
					}
				});
			}
		});
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
