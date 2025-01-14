const express = require("express");
const router = express.Router();
const Spreadsheet = require("../models/Spreadsheet");

// Get the spreadsheet
router.get("/spreadsheet", async (req, res) => {
  try {
    const spreadsheet = await Spreadsheet.findOne();
    res.json(spreadsheet);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update the spreadsheet
router.put("/spreadsheet", async (req, res) => {
  try {
    const { grid, formula, history, redoStack, selectedCell, cellDependencies } = req.body;
    const updatedSpreadsheet = await Spreadsheet.findOneAndUpdate(
      {},
      { grid, formula, history, redoStack, selectedCell, cellDependencies },
      { new: true }
    );
    res.json(updatedSpreadsheet);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
