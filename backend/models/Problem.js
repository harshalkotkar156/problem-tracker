const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Problem name is required"],
      trim: true,
    },
    number: {
      type: String,
      trim: true,
      default: "",
    },
    topics: {
      type: [String],
      default: [],
    },
    approach: {
      type: String,
      default: "",
    },
    intuition: {
      type: String,
      default: "",
    },
    notes: {
      type: String,
      default: "",
    },
    timeComplexity: {
      type: String,
      default: "",
    },
    spaceComplexity: {
      type: String,
      default: "",
    },
    leetcodeLink: {
      type: String,
      default: "",
    },
    gfgLink: {
      type: String,
      default: "",
    },
    isImportant: {
      type: Boolean,
      default: false,
    },
    code: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Problem", problemSchema);
