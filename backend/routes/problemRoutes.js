const express = require("express");
const router = express.Router();
const {
  createProblem,
  getProblems,
  getProblemById,
  updateProblem,
  deleteProblem,
} = require("../controllers/problemController");

router.route("/").post(createProblem).get(getProblems);
router.route("/:id").get(getProblemById).put(updateProblem).delete(deleteProblem);

module.exports = router;
