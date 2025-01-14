import '../styles/Grid.css';
import React, { useState } from "react";

const Grid = ({ grid, handleCellClick, handleCellChange }) => {
  const [dragStart, setDragStart] = useState(null); // Starting point of drag
  const [dragEnd, setDragEnd] = useState(null); // End point of drag
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (row, col) => {
    setDragStart({ row, col });
    setDragEnd({ row, col });
    setIsDragging(true);
  };

  const handleMouseMove = (row, col) => {
    if (isDragging) {
      setDragEnd({ row, col });
    }
  };

  const handleMouseUp = () => {
    if (dragStart && dragEnd) {
      const { row: startRow, col: startCol } = dragStart;
      const { row: endRow, col: endCol } = dragEnd;

      const newGrid = [...grid]; // Create a copy of the grid

      const valueToCopy = grid[startRow][startCol];

      for (let r = Math.min(startRow, endRow); r <= Math.max(startRow, endRow); r++) {
        for (let c = Math.min(startCol, endCol); c <= Math.max(startCol, endCol); c++) {
          if (newGrid[r] && newGrid[r][c] !== undefined) {
            newGrid[r][c] = valueToCopy;
          }
        }
      }

      // Ensure updatedGrid is passed to the parent component via handleCellChange
      handleCellChange(newGrid);  // Pass the updated grid as an argument
    }
    setIsDragging(false);
    setDragStart(null);
    setDragEnd(null);
  };

  const isCellSelected = (row, col) => {
    if (!dragStart || !dragEnd) return false;
    const { row: startRow, col: startCol } = dragStart;
    const { row: endRow, col: endCol } = dragEnd;
    return (
      row >= Math.min(startRow, endRow) &&
      row <= Math.max(startRow, endRow) &&
      col >= Math.min(startCol, endCol) &&
      col <= Math.max(startCol, endCol)
    );
  };

  // Render column headers (A, B, C, ...)
  const renderColumnHeaders = () => {
    if (grid.length === 0 || !Array.isArray(grid[0])) {
      return null; // Return null or a fallback UI if grid is not properly initialized
    }
  
    const letters = Array(grid[0].length)
      .fill(null)
      .map((_, index) => String.fromCharCode(65 + index)); // A, B, C, ...
  
    return (
      <tr>
        <th></th>
        {letters.map((letter, index) => (
          <th key={index}>{letter}</th>
        ))}
      </tr>
    );
  };
  

  return (
    <div className="grid-container">
      <table className="grid">
        <thead>{renderColumnHeaders()}</thead>
        <tbody>
          {grid.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <th>{rowIndex + 1}</th> {/* Row number */}
              {row.map((cell, colIndex) => (
                <td
                  key={colIndex}
                  className={isCellSelected(rowIndex, colIndex) ? "selected" : ""}
                  onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                  onMouseMove={() => handleMouseMove(rowIndex, colIndex)}
                  onMouseUp={handleMouseUp}
                >
                  <input
                    type="text"
                    value={cell}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                    onChange={(e) =>
                      handleCellChange(rowIndex, colIndex, e.target.value)
                    }
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Grid;
