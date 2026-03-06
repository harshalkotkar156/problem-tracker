const Problem = require("../models/Problem");

// @desc    Create a new problem
// @route   POST /api/problems
const createProblem = async (req, res) => {
  try {
    // Check for duplicate problem number (only if number is provided)
    const { number } = req.body;
    if (number && number.trim() !== "") {
      const existing = await Problem.findOne({ number: number.trim() });
      if (existing) {
        return res.status(409).json({
          message: `Problem #${number.trim()} already exists: "${existing.name}"`,
        });
      }
    }

    const problem = await Problem.create(req.body);
    res.status(201).json(problem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all problems (with search, filter, sort)
// @route   GET /api/problems
const getProblems = async (req, res) => {
  try {
    const { search, topic, sort } = req.query;
    const query = {};

    // Search by name (case-insensitive)
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    // Filter by topic
    if (topic) {
      query.topics = { $in: [topic] };
    }

    // Sort: default latest first
    const sortOrder = sort === "oldest" ? { createdAt: 1 } : { createdAt: -1 };

    const problems = await Problem.find(query).sort(sortOrder);
    res.status(200).json(problems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single problem by ID
// @route   GET /api/problems/:id
const getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }
    res.status(200).json(problem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a problem
// @route   PUT /api/problems/:id
const updateProblem = async (req, res) => {
  try {
    // Check for duplicate problem number (only if number is provided)
    const { number } = req.body;
    if (number && number.trim() !== "") {
      const existing = await Problem.findOne({
        number: number.trim(),
        _id: { $ne: req.params.id },
      });
      if (existing) {
        return res.status(409).json({
          message: `Problem #${number.trim()} already exists: "${existing.name}"`,
        });
      }
    }

    const problem = await Problem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }
    res.status(200).json(problem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a problem
// @route   DELETE /api/problems/:id
const deleteProblem = async (req, res) => {
  try {
    const problem = await Problem.findByIdAndDelete(req.params.id);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }
    res.status(200).json({ message: "Problem deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProblem,
  getProblems,
  getProblemById,
  updateProblem,
  deleteProblem,
};
