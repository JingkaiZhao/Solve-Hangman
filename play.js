'use strict';
var wordList = require('word-list-json');
var Engine = require('./modules/engine');

let gameEngine = new Engine({
	playerId: 'jingkai.zhao@foxmail.com',
	url: 'https://strikingly-hangman.herokuapp.com/game/on'
});

gameEngine.startGame().then(function(data) {
	console.log(data);
	return gameEngine.nextWord();
}).then(function(data) {
	console.log(data);
	return gameEngine.guessWord('A');
}).then(function(data) {
	console.log(data);
	return gameEngine.nextWord();
}).then(function(data) {
	console.log(data);
}).catch(function(error) {
	console.log(error);
});
