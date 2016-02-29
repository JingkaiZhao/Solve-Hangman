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
		this.startGame().then((function(data) {
			console.log(data);
		}).bind(this)).catch(function(error) {
			console.log(error);
		});
	}
}

Engine.prototype = {

	startGame: function() {
		let postData = {
			"playerId": this.playerId,
			"action" : GAME_ACTIONS.START
		};
		return new Promise((function(resolve, reject) {
			this._postRequest(postData, resolve, reject);
		}).bind(this));
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
		return new Promise((function(resolve, reject) {
			this._postRequest(postData, resolve, reject);
		}).bind(this));
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
		return new Promise((function(resolve, reject) {
			this._postRequest(postData, resolve, reject);
		}).bind(this));
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
		return new Promise((function(resolve, reject) {
			this._postRequest(postData, resolve, reject);
		}).bind(this));
	},

	_postRequest: function(postData, resolve, reject) {
		request(this._requestOptions(postData), (function(error, response, body) {
			if (!error && response.statusCode == 200) {
				this.sessionId = body && body.sessionId;
				resolve(body.data);
			} else {
				reject(response);
			}
		}).bind(this));
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
