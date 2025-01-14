import React, { useState, useEffect } from 'react';
import '../styles/Cell.css';
import { calculateFormula } from '../helpers/FormulaHelper';

const Cell = ({ rowIndex, colIndex, value, onCellChange, formula }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const [errorMessage, setErrorMessage] = useState(''); 

  useEffect(() => {
    if (formula) {
      try {
        const calculatedValue = calculateFormula(formula, rowIndex, colIndex); 
        setLocalValue(calculatedValue);
        setErrorMessage(''); 
      } catch (error) {
        setLocalValue('Error');
        setErrorMessage(error.message); 
      }
    }
  }, [formula]); 

  const handleEdit = () => {
    setIsEditing(true);
    setErrorMessage(''); 
  };

  const handleBlur = () => {
    setIsEditing(false);

    if (formula && !isValidFormula(formula)) {
      setErrorMessage('Invalid formula');
      return;
    }

    onCellChange(rowIndex, colIndex, localValue, formula); 
  };

  const handleChange = (event) => {
    const newValue = event.target.value;
    if (isNumericCell(newValue) && isNaN(newValue)) {
      setErrorMessage('Please enter a number');
      return;
    }
    setLocalValue(newValue);
    setErrorMessage(''); 
  };

  return (
    <div className="cell">
      {isEditing ? (
        <div>
          <input 
            type="text" 
            value={localValue} 
            onChange={handleChange} 
            onBlur={handleBlur} 
          />
          {errorMessage && <div className="error">{errorMessage}</div>} 
        </div>
      ) : (
        <span 
          onDoubleClick={handleEdit} 
        >
          {localValue} 
        </span>
      )}
    </div>
  );
};

function isNumericCell(value) {
  // Determine if the cell should contain only numbers 
  // (e.g., based on cell formatting, user settings)
  // For now, let's assume all cells are numeric by default
  return true; 
}

function isValidFormula(formula) {
  // Basic formula validation (can be improved)
  if (!formula.startsWith('=')) {
    return true; // Not a formula, no need to validate
  }
  // Add more sophisticated formula validation rules here
  return true; 
}

export default Cell;