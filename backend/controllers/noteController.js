const Note = require("../models/Note");

// @desc    Create a new note
// @route   POST /api/notes
const createNote = async (req, res) => {
  try {
    const note = await Note.create(req.body);
    res.status(201).json(note);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all notes (with search, tag filter, sort)
// @route   GET /api/notes
const getNotes = async (req, res) => {
  try {
    const { search, tag, sort, category } = req.query;
    const filters = [];

    if (search) {
      filters.push({
        $or: [
          { title: { $regex: search, $options: "i" } },
          { content: { $regex: search, $options: "i" } },
          {
            tags: {
              $elemMatch: { $regex: search, $options: "i" },
            },
          },
        ],
      });
    }

    if (tag) {
      filters.push({
        tags: {
          $elemMatch: { $regex: tag, $options: "i" },
        },
      });
    }

    if (category && category !== "ALL") {
      if (category === "DSA") {
        filters.push({
          $or: [{ category: "DSA" }, { category: { $exists: false } }],
        });
      } else {
        filters.push({ category });
      }
    }

    const query = filters.length ? { $and: filters } : {};

    // Sort: default latest first
    const sortOrder = sort === "oldest" ? { createdAt: 1 } : { createdAt: -1 };

    const notes = await Note.find(query).sort(sortOrder);
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single note by ID
// @route   GET /api/notes/:id
const getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a note
// @route   PUT /api/notes/:id
const updateNote = async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.status(200).json(note);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a note
// @route   DELETE /api/notes/:id
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
};
