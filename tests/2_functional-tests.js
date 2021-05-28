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
        .post("/api/check")
        .send(validCheckObject)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.deepEqual(res.body, { valid: true });
          done();
        });
    });
    let oneConflictCheckObject = {
      puzzle: "...1" + ".".repeat(77),
      coordinate: "A1",
      value: "1",
    };
    test("Invalid placement, 1 conflict", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send(oneConflictCheckObject)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.valid, false);
          assert.isArray(res.body.conflict);
          assert.equal(res.body.conflict.length, 1);
          done();
        });
    });
    let twoConflictCheckObject = {
      puzzle: "...1....." + ".".repeat(18) + "1........" + ".".repeat(45),
      coordinate: "A1",
      value: "1",
    };
    test("Invalid placement, 2 conflicts", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send(twoConflictCheckObject)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.valid, false);
          assert.isArray(res.body.conflict);
          assert.equal(res.body.conflict.length, 2);
          done();
        });
    });
    let threeConflictCheckObject = {
      puzzle:
        "...1....." + "..1......" + "........." + "1........" + ".".repeat(45),
      coordinate: "A1",
      value: "1",
    };
    test("Invalid placement, 3 conflict (max conflicts)", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send(threeConflictCheckObject)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.valid, false);
          assert.isArray(res.body.conflict);
          assert.equal(res.body.conflict.length, 3);
          done();
        });
    });
  });
  suite(
    "Testing POST requests to /api/check with missing/invalid fields",
    () => {
      test("POST req missing puzzle parameter", (done) => {
        chai
          .request(server)
          .post("/api/check")
          .send({ coordinate: "A1", value: "1" })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.type, "application/json");
            assert.deepEqual(res.body, { error: "Required field(s) missing" });
            done();
          });
      });
      test("POST req missing value and coordinate parameter", (done) => {
        chai
          .request(server)
          .post("/api/check")
          .send({ puzzle: puzzles[0][0] })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.type, "application/json");
            assert.deepEqual(res.body, { error: "Required field(s) missing" });
            done();
          });
      });
      let invalidCharCheckObject = {
        puzzle: "A" + puzzles[0][0].slice(1),
        coordinate: "A1",
        value: "1",
      };
      test("POST req with puzzle containing invalid characters", (done) => {
        chai
          .request(server)
          .post("/api/check")
          .send(invalidCharCheckObject)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.type, "application/json");
            assert.deepEqual(res.body, {
              error: "Invalid characters in puzzle",
            });
            done();
          });
      });
      let invalidLengthCheckObject = {
        puzzle: puzzles[0][0].slice(1),
        coordinate: "A1",
        value: "1",
      };
      test("POST req with puzzle string having incorrect length", (done) => {
        chai
          .request(server)
          .post("/api/check")
          .send(invalidLengthCheckObject)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.type, "application/json");
            assert.deepEqual(res.body, {
              error: "Expected puzzle to be 81 characters long",
            });
            done();
          });
      });
      let invalidCoordCheckObject = {
        puzzle: puzzles[0][0],
        coordinate: "Z1.5",
        value: "1",
      };
      test("POST req with invalid placement coordinate", (done) => {
        chai
          .request(server)
          .post("/api/check")
          .send(invalidCoordCheckObject)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.type, "application/json");
            assert.deepEqual(res.body, { error: "Invalid coordinate" });
            done();
          });
      });
      let invalidValueCheckObject = {
        puzzle: puzzles[0][0],
        coordinate: "A1",
        value: "0",
      };
      test("POST req with invalid value parameter", (done) => {
        chai
          .request(server)
          .post("/api/check")
          .send(invalidValueCheckObject)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.type, "application/json");
            assert.deepEqual(res.body, { error: "Invalid value" });
            done();
          });
      });
    }
  );
});
