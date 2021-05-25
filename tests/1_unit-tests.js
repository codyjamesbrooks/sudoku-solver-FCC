const chai = require("chai");
const assert = chai.assert;

const Solver = require("../controllers/sudoku-solver.js");
const puzzleAndSolutions = require("../controllers/puzzle-strings.js");
let solver = new Solver();

const invalidCharacters =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()/-[]{} :\"',0";
let invalidPuzzle;

suite("UnitTests", () => {
  suite("testing Solver validate method", function () {
    test("correctly validates valid puzzles", () => {
      for (let i = 0; i < puzzleAndSolutions.length; i++) {
        assert.deepEqual(
          solver.validate(puzzleAndSolutions[i][0]),
          {
            valid: true,
          },
          `validate method output: ${solver.validate(puzzleAndSolutions[i][0])}`
        );
      }
    });

    test("returns error msg when puzzle string has invalid characters", () => {
      for (let i = 0; i < puzzleAndSolutions.length; i++) {
        invalidPuzzle = puzzleAndSolutions[i][0].slice();
        randomSliceIndex = Math.floor(Math.random() * 81);
        randomInvalidChar = invalidCharacters.charAt(
          Math.floor(Math.random() * 75)
        );
        invalidPuzzle =
          invalidPuzzle.slice(0, randomSliceIndex) +
          randomInvalidChar +
          invalidPuzzle.slice(randomSliceIndex + 1);

        assert.deepEqual(
          solver.validate(invalidPuzzle),
          {
            error: "Invalid characters in puzzle",
          },
          `invalid puzzle: ${invalidPuzzle}`
        );
      }
    });
  });

  // Logic handles a puzzle string that is not 81 characters in length
  // Logic handles a valid row placement
  // Logic handles an invalid row placement
  // Logic handles a valid column placement
  // Logic handles an invalid column placement
  // Logic handles a valid region (3x3 grid) placement
  // Logic handles an invalid region (3x3 grid) placement
  // Valid puzzle strings pass the solver
  // Invalid puzzle strings fail the solver
  // Solver returns the the expected solution for an incomplete puzzle
});
