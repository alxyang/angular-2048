/**
 * Responsible for keeping the state of the game, the different movements the user can make, keeping track of the scores, as well as determining when the game is over and if the user has beaten the game or the game has beaten the user.
 */

'use strict';

angular.module('Game', ['Grid'])
.service('GameManager', function($q, $ti dmeout, GridService) {

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

  /*
   * The game loop
   *
   * Inside here, we'll run every 'interesting'
   * event (interesting events are listed in the Keyboard service)
   * For every event, we'll:
   *  1. look up the appropriate vector
   *  2. find the furthest possible locations for each tile and
   *     the next tile over
   *  3. find any spots that can be 'merged'
   *    a. if we find a spot that can be merged:
   *      i. remove both tiles
   *      ii. add a new tile with the double value
   *    b. if we don't find a merge:
   *      i. move the original tile
   */
  this.move = function(key) {
    var self = this; //reference to game manager
    var f = function() {
      if(self.win) { return false; }
      //set up iteration directions
      var positions = GridService.traversalDirections(key);
      var hasMoved = false;
      var hasWon = false;

      // reset tile statuses after each move, basically setting merged status back to null
      GridService.prepareTiles();

      //for every position
      positions.x.forEach(function(x) {
        positions.y.forEach(function(y) {
          var originalPosition = {x:x,y:y};
          var tile = GridService.getCellAt(originalPosition);


          if (tile) {
            var cell = GridService.calculateNextPosition(tile, key);
            var next = cell.next;

            //merge if there is a next tile, its value is the same as current tile, and it hasn't already been merged once
            if (next &&
              next.value === tile.value &&
              !next.merged) {

              var newValue = tile.value * 2;
              var merged = GridService.newTile(tile, newValue);
              merged.merged = [tile, cell.next];

              // Insert the new tile
              GridService.insertTile(mergedTile);
              // Remove the old tile
              GridService.removeTile(tile);
              // Move the location of the mergedTile into the next position
              GridService.moveTile(merged, next);

              // Update the score of the game
              self.updateScore(self.currentScore + newValue);
              // Check for the winning value
              if (merged.value >= self.winningValue) {
                hasWon = true;
              }

              hasMoved = true; // we moved with a merge
            } else {
              //else move cell as far as it can go without merging
              GridService.moveTile(tile, cell.newPosition);
            }

            //check if movement has been made
            if (!GridService.samePositions(originalPosition,cell.newPosition)) {
              hasMoved = true;
            }
          }
        });
      });

      if (hasWon && !self.win) {
        self.win = true;
      }

      if (hasMoved) {
        GridService.randomlyInsertNewTile();

        if (self.win || !self.movesAvailable()) {
          self.gameOver = true;
        }
      }

    };
    return $q.when(f());
  };


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