"use strict";

const { restart } = require("nodemon");
const SudokuSolver = require("../controllers/sudoku-solver.js");
const { response } = require("../server.js");
// const { response } = require("../server.js");

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {
    // Ensure requred fields were submitted
    if (!req.body.puzzle || !req.body.coordinate || !req.body.value) {
      return res.json({ error: "Required field(s) missing " });
    }

    // Ensure the puzzle submitted was valid;
    let validatePuzzle = solver.validate(req.body.puzzle);
    if (validatePuzzle.hasOwnProperty("error")) {
      return res.json({ error: validatePuzzle.error });
    }

    // Ensure coordinate submitted is valid.
    let row, column;
    [row, column] = req.body.coordinate.split(/(\d+)/);
    if (!row.match(/^[A-I]$/) || !column.match(/^[1-9]$/)) {
      return res.json({ error: "Invalid coordinate" });
    }

    // Ensure value submitted is valid.
    let value = req.body.value;
    if (!value.match(/^[1-9]$/)) {
      return res.json({ error: "Invalid value" });
    }

    let conflictArray = [];
    let rowConflict = solver.checkRowPlacement(
      req.body.puzzle,
      row,
      column,
      value
    );
    let colConflict = solver.checkColPlacement(
      req.body.puzzle,
      row,
      column,
      value
    );
    let regionConflict = solver.checkRegionPlacement(
      req.body.puzzle,
      row,
      column,
      value
    );

    if (rowConflict.hasOwnProperty("error"))
      conflictArray.push(rowConflict.error);
    if (colConflict.hasOwnProperty("error"))
      conflictArray.push(colConflict.error);
    if (regionConflict.hasOwnProperty("error"))
      conflictArray.push(regionConflict.error);
    if (conflictArray.length > 0)
      return res.json({ valid: false, conflict: conflictArray });

    return res.json({ valid: true });
  });

  app
    .route("/api/solve")
    // You can POST /api/solve with form data containing puzzle which
    // will be a string containing a combination of numbers (1-9) and
    // periods . to represent empty spaces. The returned object will contain
    // a solution property with the solved puzzle.
    .post((req, res) => {
      let responseObject = solver.validate(req.body.puzzle);

      if (responseObject.hasOwnProperty("error")) {
        return res.json({ error: responseObject.error });
      }

      responseObject = solver.solve(req.body.puzzle);
      return res.json(responseObject);
    });
};
