'use strict';

angular.module('Game', ['Grid'])
.service('GameManager', function(GridService) {

  this.grid = GridService.grid;
  this.tiles = GridService.tiles;
  this.gameSize = GridService.getSize();

  this.winningValue = 2048;

  // reset the game
  this.reinit = function() {
    this.gameOver = false;
    this.win = false;
    this.currentScore = 0;
  };
  this.reinit();

  // Create a new game
  this.newGame = function() {
    GridService.buildEmptyGameBoard();
    GridService.buildStartingPosition();
    this.reinit();
  };

  // Handle the move action
  this.move = function() {};
  // Update the score
  this.updateScore = function(newScore) {
    console.log(newScore);
  };
  // Are there moves left?
  this.movesAvailable = function() {
    return GridService.anyCellsAvailable() || 
            GridService.tileMatchesAvailable();
  };
});