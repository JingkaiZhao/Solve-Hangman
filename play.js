'use strict';
var wordList = require('word-list-json');
var Engine = require('./modules/engine');
var Brain = require('./modules/brain');

let letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G',
	'H', 'I', 'J', 'K', 'L', 'M', 'N',
	'O', 'P', 'Q', 'R', 'S', 'T',
	'U', 'V', 'W', 'X', 'Y', 'Z'];

let brain = new Brain(wordList);
let gameEngine = new Engine({
	playerId: 'jingkai.zhao@foxmail.com',
	url: 'https://strikingly-hangman.herokuapp.com/game/on'
});

gameEngine.playWithBrain(brain);

function guessAlgorithm(word) {
	return letters[Math.floor(26 * Math.random())];
}
