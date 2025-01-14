import React from "react";

const FormulaBar = ({ selectedCell, columnLabels, formula, onFormulaChange, applyFormula, grid, updateGrid, updateCellDependencies }) => {
  // Ensure that selectedCell is defined before trying to access its properties
  if (!selectedCell) {
    return <div>Loading...</div>;  // You can render a fallback message while waiting for the selected cell
  }

  const { row, col } = selectedCell;
  const handleApplyFormula = () => {
    //const { row, col } = selectedCell;
    const newGrid = [...grid];
    newGrid[row][col] = formula;
    updateGrid(newGrid);
    // Trigger calculation of dependent cells
    updateCellDependencies(row, col, formula);
  };
  

  return (
    <div className="formula-bar">
      {/* Display the selected cell's row and column */}
      <span>
        Cell: {columnLabels[col]}{row + 1} {/* Adjusted row indexing to be 1-based */}
      </span>
      
      {/* Input field for formula or value */}
      <input
        type="text"
        value={formula}
        onChange={(e) => onFormulaChange(e.target.value)}  // Handle formula input changes
        placeholder="Enter formula or value"
      />
      
      {/* Button to apply the formula */}
      <button onClick={applyFormula}>Apply</button>
    </div>
  );
};

export default FormulaBar;

