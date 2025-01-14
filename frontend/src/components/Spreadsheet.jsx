import "../styles/Spreadsheet.css";
import React, { useState, useEffect } from "react";
import Toolbar from "./Toolbar";
import { handleMathFunctions } from './Util';
import FormulaBar from "./FormulaBar";
import Grid from "./Grid";
import { debounce } from 'lodash';
import axios from "axios";

//REACT_APP_API_URL= "http://localhost:5000";


const Spreadsheet = () => {
  const [rows, setRows] = useState(10);
  const [cols, setCols] = useState(10);
  const [grid, setGrid] = useState(
    Array(20).fill(null).map(() => Array(10).fill(""))
  );
  const [selectedCell, setSelectedCell] = useState({ row: 0, col: 0 });
  const [formula, setFormula] = useState("");
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [cellDependencies, setCellDependencies] = useState({}); // Store dependencies
  const [isGridLoaded, setIsGridLoaded] = useState(false); // Flag to check if the grid is loaded

  const generateColumnLabels = (colCount) => {
    const labels = [];
    for (let i = 0; i < colCount; i++) {
      let label = "";
      let n = i;
      while (n >= 0) {
        label = String.fromCharCode((n % 26) + 65) + label;
        n = Math.floor(n / 26) - 1;
      }
      labels.push(label);
    }
    return labels;
  };

  const columnLabels = generateColumnLabels(cols);

  // Fetch grid data from the backend when the component mounts
  // useEffect(() => {
  //   axios.get("http://localhost:5000/api/grid")
  //     .then((response) => {
  //       setGrid(response.data.grid || []);
  //       setRows(response.data.rows || 10);
  //       setCols(response.data.cols || 10);
  //       setIsGridLoaded(true);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching grid data:", error);
  //     });
  // }, []);

   // Fetch grid data from the backend
   useEffect(() => {
    const fetchGridData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/grid`);
        const data = await response.json();
        if (data.grid) {
          setGridData(data);
          setGrid(data.grid);
          setRows(data.rows);
          setCols(data.cols);
        }
      } catch (err) {
        console.error('Error fetching grid data:', err);
      }
    };

    fetchGridData();
  }, []);

  const handleFormulaChange = (value) => {
    setFormula(value);
  };

  

  const applyFormula = () => {
    const { row, col } = selectedCell;
    const newGrid = [...grid];
    newGrid[row][col] = formula;
    updateGrid(newGrid);
  };

  const handleCellClick = (row, col) => {
    setSelectedCell({ row, col });
    setFormula(grid[row][col]);
  };

  const handleCellChange = (rowIndex, colIndex, value) => {
    console.log("Grid before update:", grid);

    // Check for undefined or null value
    if (value === undefined || value === null) {
      return; // Exit early if value is invalid
    }

    const updatedGrid = [...grid];
    if (!updatedGrid[rowIndex]) {
      updatedGrid[rowIndex] = [];
    }
    updatedGrid[rowIndex] = [...updatedGrid[rowIndex]];
    updatedGrid[rowIndex][colIndex] = value;

    // Ensure value is a string before calling startsWith
    if (typeof value === 'string' && value.startsWith('=')) {
      updateCellDependencies(rowIndex, colIndex, value);
    }

    const cellRef = `${columnLabels[colIndex]}${rowIndex + 1}`;
    const dependencies = cellDependencies[cellRef] || [];
    dependencies.forEach((dependentCell) => {
      const { rowIndex: depRow, colIndex: depCol } = dependentCell;
      const formula = updatedGrid[depRow][depCol];
      updatedGrid[depRow][depCol] = calculateFormula(formula, depRow, depCol);
    });

    console.log("Grid after update:", updatedGrid);
    setGrid(updatedGrid);
    saveGridToDatabase(updatedGrid); // Save the updated grid to the database
  };

  const updateCellDependencies = (rowIndex, colIndex, formula) => {
    const references = extractCellReferences(formula);
    setCellDependencies((prevDependencies) => {
      const updatedDependencies = { ...prevDependencies };
      references.forEach((ref) => {
        if (!updatedDependencies[ref]) {
          updatedDependencies[ref] = [];
        }
        updatedDependencies[ref].push({ rowIndex, colIndex });
      });
      return updatedDependencies;
    });
  };

  const extractCellReferences = (formula) => {
    const regex = /[A-Z]+\d+/g;
    return formula.match(regex) || [];
  };

  const calculateFormula = (formula, rowIndex, colIndex) => {
    if (formula.startsWith("=")) {
      const expression = formula.slice(1).trim();
      try {
        const regex = /([A-Z]+)(\d+)/g;
         // Handle mathematical functions
      if (/^(SUM|AVERAGE|MAX|MIN|COUNT)\(/i.test(expression)) {
        return handleMathFunctions(expression);
      }

        const evaluatedFormula = expression.replace(regex, (match, col, row) => {
          const colIndex = columnLabels.indexOf(col);
          const rowIndex = parseInt(row) - 1;
          return grid[rowIndex]?.[colIndex] || 0;
        });
        return eval(evaluatedFormula);
      } catch (error) {
        return "Error";
      }
    }
    return formula;
  };

  const updateGrid = (newGrid) => {
    setHistory([...history, grid]);
    setGrid(newGrid);
    setRedoStack([]);
    saveGridToDatabase(newGrid); // Save the updated grid to the database
  };

  const addRow = () => {
    const newGrid = [...grid, Array(cols).fill("")];
    setRows(rows + 1);
    updateGrid(newGrid);
  };

  const addColumn = () => {
    const newGrid = grid.map((row) => [...row, ""]);
    setCols(cols + 1);
    updateGrid(newGrid);
  };

  const deleteRow = () => {
    if (rows > 1) {
      const newGrid = grid.slice(0, rows - 1);
      setRows(rows - 1);
      updateGrid(newGrid);
    }
  };

  const deleteColumn = () => {
    if (cols > 1) {
      const newGrid = grid.map((row) => row.slice(0, cols - 1));
      setCols(cols - 1);
      updateGrid(newGrid);
    }
  };

  const undo = () => {
    if (history.length > 0) {
      const prevState = history[history.length - 1];
      setRedoStack([grid, ...redoStack]);
      setGrid(prevState);
      setHistory(history.slice(0, -1));
    }
  };

  const redo = () => {
    if (redoStack.length > 0) {
      const nextState = redoStack[0];
      setHistory([...history, grid]);
      setGrid(nextState);
      setRedoStack(redoStack.slice(1));
    }
  };

  // Save the grid to the backend (MongoDB)
  // const saveGridToDatabase = (updatedGrid) => {
  //   axios.post("http://localhost:5000/api/grid", {
  //     grid: updatedGrid,
  //     rows: rows,
  //     cols: cols,
  //   }).catch((error) => {
  //     console.error("Error saving grid to the database:", error);
  //   });
  // };
  const saveGridToDatabase = debounce((updatedGrid) => {
    const API_URL = process.env.REACT_APP_API_URL; // Access the environment variable
    axios.post(`${API_URL}/api/grid`, {
      grid: updatedGrid,
      rows: rows,
      cols: cols,
    }).catch((error) => {
      console.error("Error saving grid to the database:", error);
    });
  }, 500); // Debounce with a 500ms delay

  return (
    <div>
      <Toolbar
        addRow={addRow}
        addColumn={addColumn}
        deleteRow={deleteRow}
        deleteColumn={deleteColumn}
        undo={undo}
        redo={redo}
      />
      {/* <FormulaBar
        formula={formula}
        onFormulaChange={handleFormulaChange}
        applyFormula={applyFormula}
        selectedCell={selectedCell}
        columnLabels={columnLabels}
      /> */}

<FormulaBar
  formula={formula}
  onFormulaChange={handleFormulaChange}
  applyFormula={applyFormula}
  selectedCell={selectedCell}
  columnLabels={columnLabels}
  grid={grid} // Pass grid state as a prop
  updateGrid={updateGrid} // Pass updateGrid function as a prop
  updateCellDependencies={updateCellDependencies} // Pass updateCellDependencies function as a prop
/>

      <Grid
        grid={grid}
        selectedCell={selectedCell}
        columnLabels={columnLabels}
        onCellClick={handleCellClick}
        onCellChange={handleCellChange}
        handleCellClick={handleCellClick} // Pass the handleCellClick function here
        handleCellChange={handleCellChange}
      />
    </div>
  );  
};

export default Spreadsheet;
