'use strict';

/**
 * @ngdoc overview
 * @name twentyfourtyeightApp
 * @description
 * # twentyfourtyeightApp
 *
 * Main module of the application.
 */
angular
.module('twentyfourtyeightApp', ['Game', 'Grid', 'Keyboard'])
.controller('GameController', function(GameManager, KeyboardService) {
  this.game = GameManager;

  // Create a new game
  this.newGame = function() {
    KeyboardService.init();
    this.game.newGame();
    this.startGame();
    console.log('game started');
  };

  this.startGame = function() {
    var self = this;
    KeyboardService.on(function(key) {
      self.game.move(key);
    });
  };

  // Create a new game on boot
  this.newGame();
});

