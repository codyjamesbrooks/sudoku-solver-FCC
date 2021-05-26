class SudokuSolver {
  onlyUniqueNumbers(puzzleStringSubset) {
    let numbers = puzzleStringSubset.replace(/\./g, "");
    let numbersInString = numbers.length;

    let uniqueNumbers = new Set(numbers.split(""));
    return uniqueNumbers.size === numbers.length ? true : false;
  }

  validate(puzzleString) {
    // function checks if a puzzle is valid. Returns a msg object.
    // Below are the msg options.
    // error: "Required field missing" - Note The puzzle submitted was an empty string
    // error: "Invalid characters in puzzle" - Puzzle has characters other than "." and 1-9
    // error: "Expected puzzle to be 81 characters long"
    // error: "Puzzle cannot be solved"
    // valid: true

    if (puzzleString === "") return { error: "Required field missing" };
    if (/[^\.1-9]/.test(puzzleString))
      return { error: "Invalid characters in puzzle" };
    if (puzzleString.length !== 81)
      return { error: "Expected puzzle to be 81 characters long" };

    // validate rows
    let puzzleRows = "ABCDEFGHI"
      .split("")
      .map((row) => this.getRowValues(puzzleString, row));

    let areRowsValid = new Set(
      puzzleRows.map((rowString) => this.onlyUniqueNumbers(rowString))
    );
    if (areRowsValid.size !== 1 || areRowsValid.has(false))
      return { error: "Puzzle cannot be solved" };

    // validate columns
    let puzzleCols = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((column) =>
      this.getColumnValues(puzzleString, column)
    );
    let areColsValid = new Set(
      puzzleCols.map((colString) => this.onlyUniqueNumbers(colString))
    );
    if (areColsValid.size !== 1 || areColsValid.has(false))
      return { error: "Puzzle cannot be solved" };

    //validate regions
    let puzzleRegions = [
      ["A", 1],
      ["A", 4],
      ["A", 7],
      ["D", 1],
      ["D", 4],
      ["D", 7],
      ["G", 1],
      ["G", 4],
      ["G", 7],
    ].map(([row, column]) => this.getRegionValues(puzzleString, row, column));
    let areRegionsValid = new Set(
      puzzleRegions.map((regionString) => this.onlyUniqueNumbers(regionString))
    );
    if (areRegionsValid.size !== 1 || areRegionsValid.has(false))
      return { error: "Puzzle cannot be solved" };

    return { valid: true };
  }

  checkRowPlacement(puzzleString, row, column, value) {
    let currentRow = this.getRowValues(puzzleString, row);

    let updatedRow =
      currentRow.slice(0, column - 1) + value + currentRow.slice(column);
    return this.onlyUniqueNumbers(updatedRow)
      ? { valid: true }
      : { conflict: "row" };
  }

  checkColPlacement(puzzleString, row, column, value) {
    let currentColumn = this.getColumnValues(puzzleString, column);

    let subPosition = "ABCDEFGHI".indexOf(row);
    let updatedColumn =
      currentColumn.slice(0, subPosition) +
      value +
      currentColumn.slice(subPosition + 1);

    return this.onlyUniqueNumbers(updatedColumn)
      ? { valid: true }
      : { conflict: "column" };
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    let currentRegion = this.getRegionValues(puzzleString, row, column);

    let replaceIndex = ("ABCDEFGHI".indexOf(row) % 3) * 3 + ((column - 1) % 3);
    let updatedRegion =
      currentRegion.slice(0, replaceIndex) +
      value +
      currentRegion.slice(replaceIndex + 1);

    return this.onlyUniqueNumbers(updatedRegion)
      ? { valid: true }
      : { conflict: "region" };
  }

  solve(puzzleString) {
    let solvedPuzzle = (" " + puzzleString).slice(1);
    let solvedNumbers;

    while (/\./.test(solvedPuzzle)) {
      solvedNumbers = 0;

      for (let i = 0; i < solvedPuzzle.length; i++) {
        if (solvedPuzzle[i] !== ".") continue;

        let row = "ABCDEFGHI".charAt(Math.floor(i / 9));
        let column = (i % 9) + 1;

        let options = [1, 2, 3, 4, 5, 6, 7, 8, 9];

        let rowValues = this.getRowValues(solvedPuzzle, row);
        let colValues = this.getColumnValues(solvedPuzzle, column);
        let regionValues = this.getRegionValues(solvedPuzzle, row, column);

        options = options.filter((option) => {
          return (
            rowValues.indexOf(option) < 0 &&
            colValues.indexOf(option) < 0 &&
            regionValues.indexOf(option) < 0
          );
        });

        if (options.length === 1) {
          solvedPuzzle =
            solvedPuzzle.slice(0, i) + options[0] + solvedPuzzle.slice(i + 1);
          solvedNumbers += 1;
        }
      }

      if (!solvedNumbers) return { error: "Puzzle cannot be solved" };
    }

    let validator = this.validate(solvedPuzzle);
    return validator.hasOwnProperty("valid")
      ? { solution: solvedPuzzle }
      : { error: "Puzzle cannot be solved" };
  }

  getRowValues(puzzleString, row) {
    let rowStartIndex = "ABCDEFGHI".indexOf(row) * 9;
    let currentRow = puzzleString.slice(rowStartIndex, rowStartIndex + 9);
    return currentRow;
  }

  getColumnValues(puzzleString, column) {
    let colIndex = column - 1;
    let currentCol = "";

    while (colIndex < puzzleString.length) {
      currentCol += puzzleString[colIndex];
      colIndex += 9;
    }

    return currentCol;
  }

  getRegionValues(puzzleString, row, column) {
    let regionRowStart = Math.floor("ABCDEFGHI".indexOf(row) / 3) * 3;
    let regionColStart = Math.floor((column - 1) / 3) * 3;

    let regionStartingIndex = regionRowStart * 9 + regionColStart;

    let count = 0;
    let currentRegion = "";
    while (count < 3) {
      currentRegion += puzzleString.slice(
        regionStartingIndex,
        regionStartingIndex + 3
      );
      regionStartingIndex += 9;
      count += 1;
    }
    return currentRegion;
  }
}

module.exports = SudokuSolver;
