
import React from "react";

const columnLabels = ["A", "B", "C", "D", "E"];

// Helper function to handle mathematical functions
export const handleMathFunctions = (expression, grid) => {
  const funcRegex = /^(SUM|AVERAGE|MAX|MIN|COUNT)\((.*?)\)$/i;
  const match = expression.match(funcRegex);
  if (!match) return "Error: Invalid Function";

  const [, func, range] = match;
  
  // Split range into start and end cells
  const [startCell, endCell] = range.split(":").map((cell) => cell.trim());
  
  // If no range is provided (i.e., only one cell), handle it
  if (!endCell) {
    return "Error: Invalid Range";
  }

  const startCol = columnLabels.indexOf(startCell.match(/[A-Z]+/)[0]);
  const startRow = parseInt(startCell.match(/\d+/)[0]) - 1;
  const endCol = columnLabels.indexOf(endCell.match(/[A-Z]+/)[0]);
  const endRow = parseInt(endCell.match(/\d+/)[0]) - 1;

  const values = [];

  // Loop through the range of cells
  for (let r = Math.min(startRow, endRow); r <= Math.max(startRow, endRow); r++) {
    for (let c = Math.min(startCol, endCol); c <= Math.max(startCol, endCol); c++) {
      const cellValue = grid[r]?.[c];

      // Only include valid numeric values
      if (!isNaN(cellValue) && cellValue !== "") {
        values.push(parseFloat(cellValue));
      }
    }
  }

  // If no valid values are found, return 0 (or another appropriate value)
  if (values.length === 0) {
    return 0;
  }

  switch (func.toUpperCase()) {
    case "SUM":
      return values.reduce((acc, val) => acc + val, 0);
    case "AVERAGE":
      return values.length > 0 ? values.reduce((acc, val) => acc + val, 0) / values.length : 0;
    case "MAX":
      return Math.max(...values);
    case "MIN":
      return Math.min(...values);
    case "COUNT":
      return values.length;
    default:
      return "Error: Invalid Function";
  }
};

//   switch (func.toUpperCase()) {
//     case "SUM":
//       return values.reduce((sum, val) => sum + val, 0);
//     case "AVERAGE":
//       return values.length ? values.reduce((sum, val) => sum + val, 0) / values.length : "Error no values";
//       case "MAX":
//         return values.length ? Math.max(...values) : "Error: No Values";
//       case "MIN":
//         return values.length ? Math.min(...values) : "Error: No Values";
//       case "COUNT":
//         return values.length; // Count the number of valid numeric values
//       default:
//         return "Error: Unsupported Function";
//   }
// };

