'use strict';
var wordList = require('word-list-json');
var Engine = require('./modules/engine');

let gameEngine = new Engine({
	playerId: 'jingkai.zhao@foxmail.com',
	url: 'https://strikingly-hangman.herokuapp.com/game/on'
});

let letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G',
	'H', 'I', 'J', 'K', 'L', 'M', 'N',
	'O', 'P', 'Q', 'R', 'S', 'T',
	'U', 'V', 'W', 'X', 'Y', 'Z'];

gameEngine.runWithAlgorithm(guessAlgorithm);

// let numberOfGuessAllowedForEachWord = 0;
// let numberOfWordsToGuess = -1;
// gameEngine.startGame().then(function(data) {
// 	numberOfWordsToGuess = data.numberOfWordsToGuess;
// 	numberOfGuessAllowedForEachWord = data.numberOfGuessAllowedForEachWord;
// 	return next(gameEngine.nextWord(), function(data) {
// 		console.log(data);
// 		let done = numberOfWordsToGuess < 0;
// 		return done;
// 	});
// }).then(function(data) {
// 	console.log(data);
// });

// function guess(promise, resolve) {
// 	return promise.then(resolve).then(function(wrapper) {
// 		if (wrapper.done) {
// 			return next(gameEngine.nextWord(), function(data) {
// 				console.log(data);
// 				let done = numberOfWordsToGuess <= 0;
// 				return done;
// 			});
// 		} else {
// 			let letter = guessAlgorithm(letters);
// 			console.log(`Guess: ${letter}`);
// 			return guess(gameEngine.guessWord(), resolve);
// 		}
// 	});
// }

// function next(promise, resolve) {
// 	return promise.then(resolve).then(function(done) {
// 		if (done) {
// 			return gameEngine.getResult();
// 		} else {
// 			let letter = guessAlgorithm(letters);
// 			console.log(`Guess: ${letter}`);
// 			guess(gameEngine.guessWord(letter), function(data) {
// 				console.log(data);
// 				let guessResult = data.word;
// 				let done = guessResult.indexOf('*') < 0 || data.wrongGuessCountOfCurrentWord >= numberOfGuessAllowedForEachWord;
// 				if (done) numberOfWordsToGuess--;
// 				return {
// 					done: done,
// 					word: guessResult
// 				}
// 			});
// 		}
// 	});
// }

function guessAlgorithm(word) {
	return letters[Math.floor(26 * Math.random())];
}
