const mongoose = require("mongoose");

const spreadsheetSchema = new mongoose.Schema({
  grid: { type: Array, required: true },
  formula: { type: String, default: "" },
  history: { type: Array, default: [] },
  redoStack: { type: Array, default: [] },
  selectedCell: { type: Object, default: { row: 0, col: 0 } },
  cellDependencies: { type: Object, default: {} }
});

const Spreadsheet = mongoose.model("Spreadsheet", spreadsheetSchema);

module.exports = Spreadsheet;
