const chai = require("chai");
const assert = chai.assert;

const Solver = require("../controllers/sudoku-solver.js");
const puzzles = require("../controllers/puzzle-strings").puzzlesAndSolutions;
let solver = new Solver();

const invalidCharacters =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()/-[]{} :\"',0";
let invalidPuzzle, randomSliceIndex, randomInvalidChar;

suite("UnitTests", () => {
  suite("testing Solver validate() method", () => {
    test("correctly validates valid puzzles", () => {
      for (let i = 0; i < puzzles.length; i++) {
        assert.deepEqual(
          solver.validate(puzzles[i][0]),
          {
            valid: true,
          },
          `validate method output: ${solver.validate(puzzles[i][0])}`
        );
      }
    });

    test("returns error msg when puzzle string has invalid characters", () => {
      for (let i = 0; i < puzzles.length; i++) {
        invalidPuzzle = puzzles[i][0].slice();
        randomSliceIndex = Math.floor(Math.random() * 80);
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
    let invalidShort = puzzles[0][0].slice(1);
    let invalidLong = invalidShort + "..";
    test("returns error msg when puzzle string has incorrect number of chars", () => {
      assert.deepEqual(
        solver.validate(invalidShort),
        {
          error: "Expected puzzle to be 81 characters long",
        },
        "Failed to identify short puzzle"
      );
      assert.deepEqual(
        solver.validate(invalidLong),
        {
          error: "Expected puzzle to be 81 characters long",
        },
        "Failed to identify long puzzle"
      );
    });
  });
  suite("testing Solver checkRowPlacement() method", () => {
    let value, row, column, randomIndex;
    test("Correct response to valid row placement", () => {
      for (let i = 0; i < puzzles.length; i++) {
        randomIndex = Math.floor(Math.random() * 80);
        value = puzzles[i][1].charAt(randomIndex);
        row = "ABCDEFGHI".charAt(Math.floor(randomIndex / 9));
        column = (randomIndex % 9) + 1;

        assert.deepEqual(
          solver.checkRowPlacement(puzzles[i][0], row, column, value),
          {
            valid: true,
          },
          `incorrectly rejected value: ${value} at correct postion: ${row}${column}`
        );
      }
    });
    let rowValues;
    test("Correct response to invalid row placement", () => {
      for (let i = 0; i < puzzles.length; i++) {
        randomIndex = Math.floor(Math.random() * 80);
        row = "ABCDEFGHI".charAt(Math.floor(randomIndex / 9));
        rowValues = solver.getRowValues(puzzles[i][0], row);
        column = rowValues.indexOf(".") + 1;
        value = rowValues.match(/\d/);
        assert.deepEqual(
          solver.checkRowPlacement(puzzles[i][0], row, column, value),
          { conflict: "row" },
          "falied to notice row conflict"
        );
      }
    });
  });
});
// Logic handles an invalid row placement
// Logic handles a valid column placement
// Logic handles an invalid column placement
// Logic handles a valid region (3x3 grid) placement
// Logic handles an invalid region (3x3 grid) placement
// Valid puzzle strings pass the solver
// Invalid puzzle strings fail the solver
// Solver returns the the expected solution for an incomplete puzzle
