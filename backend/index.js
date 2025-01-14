const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// Define Grid Schema
const gridSchema = new mongoose.Schema({
  grid: [[String]], // 2D array for the grid
  rows: { type: Number, required: true },
  cols: { type: Number, required: true }
});

// Create a Grid model
const Grid = mongoose.model('Grid', gridSchema);

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json()); // to parse JSON body

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/spreadsheet', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));

// Route to get grid data
app.get('/api/grid', async (req, res) => {
  try {
    const gridData = await Grid.findOne();
    if (gridData) {
      res.status(200).json(gridData);
    } else {
      res.status(404).json({ message: 'Grid not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching grid data' });
  }
});

// Route to save grid data
app.post('/api/grid', async (req, res) => {
  const { grid, rows, cols } = req.body;
  
  try {
    let gridData = await Grid.findOne();
    
    if (gridData) {
      // If grid data exists, update it
      gridData.grid = grid;
      gridData.rows = rows;
      gridData.cols = cols;
      await gridData.save();
    } else {
      // If no data exists, create a new grid document
      gridData = new Grid({ grid, rows, cols });
      await gridData.save();
    }

    res.status(200).json({ message: 'Grid saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving grid data' });
  }
});

// Set up the server to listen on a specific port
const port = 5000;
app.listen(port, () => {
  console.log(`Backend server is running on port ${port}`);
});
