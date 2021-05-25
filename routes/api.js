"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {});

  app
    .route("/api/solve")
    // You can POST /api/solve with form data containing puzzle which
    // will be a string containing a combination of numbers (1-9) and
    // periods . to represent empty spaces. The returned object will contain
    // a solution property with the solved puzzle.
    .post((req, res) => {
      let responseObject = solver.validate(req.body.puzzle);

      if (responseObject.hasOwnProperty("error")) {
        return res.json(responseObject);
      }
    });
};
