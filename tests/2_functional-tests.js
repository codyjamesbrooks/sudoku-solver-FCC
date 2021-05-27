const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");
const puzzles = require("../controllers/puzzle-strings").puzzlesAndSolutions;

chai.use(chaiHttp);

suite("Functional Tests", () => {
  suite("Testing POST requests to /api/solve", () => {
    test("solve a puzzle with a valid puzzle string", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle: puzzles[0][0] })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.deepEqual(res.body, { solution: puzzles[0][1] });
          done();
        });
    });
    test("POST req missing puzzle parameter", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.deepEqual(res.body, { error: "Required field missing" });
          done();
        });
    });
    let puzzleStringInvalidChar = "A" + puzzles[0][0].slice(1);
    test("POST req with invalid characters in puzzle string", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle: puzzleStringInvalidChar })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.deepEqual(res.body, { error: "Invalid characters in puzzle" });
          done();
        });
    });
    let puzzleStringInvalidLength = puzzles[0][0].slice(1);
    test("POST req with puzzle string having an incorrect length", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle: puzzleStringInvalidLength })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.deepEqual(res.body, {
            error: "Expected puzzle to be 81 characters long",
          });
          done();
        });
    });
    let puzzleStringNotSolvable = ".".repeat(81);
    test("POST req with puzzle that can't be solved to", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle: puzzleStringNotSolvable })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.deepEqual(res.body, { error: "Puzzle cannot be solved" });
          done();
        });
    });
  });
  suite("Testing POST requests to /api/check all fields provided", () => {
    let validCheckObject = {
      puzzle: puzzles[0][0],
      coordinate: "A1",
      value: puzzles[0][1].charAt(0),
    };
    test("Valid placement, no conflicts", (done) => {
      chai
        .request(server)
        .post("api/check")
        .send(validCheckObject)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.deepEqual(res.body, { valid: true });
          done();
        });
    });
    test("Invalid placement, 1 conflict", (done) => {
      // Check a puzzle placement with single placement conflict: POST request to /api/check
      done();
    });
    test("Invalid placement, 2 conflicts", (done) => {
      // Check a puzzle placement with multiple placement conflicts: POST request to /api/check
      done();
    });
    test("Invalid placement, 3 conflict (max conflicts)", (done) => {
      // Check a puzzle placement with all placement conflicts: POST request to /api/check
      done();
    });
  });
  suite(
    "Testing POST requests to /api/check with missing/invalid fields",
    () => {
      test("POST req missing puzzle parameter", (done) => {
        // Check a puzzle placement with missing required fields: POST request to /api/check
        done();
      });
      test("POST req missing value and coordinate parameter", (done) => {
        done();
      });
      test("POST req with puzzle containing invalid characters", (done) => {
        // Check a puzzle placement with invalid characters: POST request to /api/check
        done();
      });
      test("POST req with puzzle string having incorrect length", (done) => {
        // Check a puzzle placement with incorrect length: POST request to /api/check
        done();
      });
      test("POST req with invalid placement coordinate", (done) => {
        // Check a puzzle placement with invalid placement coordinate: POST request to /api/check
        done();
      });
      test("POST req with invalid value parameter", (done) => {
        // Check a puzzle placement with invalid placement value: POST request to /api/check
        done();
      });
    }
  );
});
