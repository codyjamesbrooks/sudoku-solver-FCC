class SudokuSolver {
  rowLetterToIndexRange = {
    A: "0-8",
    B: "9-17",
    C: "18-26",
    D: "27-35",
    E: "36-44",
    F: "45-53",
    G: "54-62",
    H: "63-71",
    I: "72-80",
  };

  onlyUniqueNumbers(string) {
    let numbers = string.replaceAll(".", "");
    let numbersInString = numbers.length;

    let uniqueNumbers = new Set(numbers.split(""));
    return uniqueNumbers.size === numbers.length ? true : false;
  }

  validate(puzzleString) {
    let puzzleRows = puzzleString.match(/.{1,9}/g);
    let areRowsValid = new Set(
      puzzleRows.map((rowString) => this.onlyUniqueNumbers(rowString))
    );
    if (areRowsValid.size !== 1 || areRowsValid.has(false)) return false;

    let puzzleCols = [];
    for (let i = 0; i <= 8; i++) {
      let x = 0;
      puzzleCols[i] = [];
      puzzleRows.map((row) => puzzleCols[i].push(row[i]));
      puzzleCols[i] = puzzleCols[i].join("");
    }
    let areColsValid = new Set(
      puzzleCols.map((colString) => this.onlyUniqueNumbers(colString))
    );
    if (areColsValid.size !== 1 || areColsValid.has(false)) return false;

    let puzzleRegions = new Array(9).fill([]);
    for (let i = 0; i <= 8; i++) {
      let rowRegionGroup = puzzleRows[i].match(/.{1,3}/g);
      puzzleRegionIndex = Math.floor(i / 3) * 3;
      rowRegionGroup.forEach((value, index) => {
        puzzleRegions[puzzleRegionIndex + index].push(value);
      });
    }
    let areRegionsValid = new Set(
      puzzleRegions.map((regionString) => this.onlyUniqueNumbers(regionString))
    );
    if (areRegionsValid.size !== 1 || areRegionsValid.has(false)) return false;

    return true;
  }

  // You can POST to /api/check an object containing puzzle, coordinate, and
  // value where the coordinate is the letter A-I indicating the row, followed
  // by a number 1-9 indicating the column, and value is a number from 1-9.

  checkRowPlacement(puzzleString, row, column, value) {
    let rowStartIndex, rowEndIndex;
    [rowStartIndex, rowEndIndex] = this.rowLetterToIndexRange[row].split("-");
    let updatedRow = puzzleString.slice(+rowStartIndex, +rowEndIndex + 1);

    updatedRow = updatedRow.slice(0, col - 1) + value + updatedRow.slice(col);
    return this.onlyUniqueNumbers(updatedRow);
  }

  checkColPlacement(puzzleString, row, column, value) {}

  checkRegionPlacement(puzzleString, row, column, value) {}

  solve(puzzleString) {}
}

module.exports = SudokuSolver;
