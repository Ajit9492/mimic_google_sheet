export function calculateFormula(formula, rowIndex, colIndex, data) { 
    if (!formula.startsWith('=')) {
      return formula;
    }
  
    const functionName = formula.substring(1, formula.indexOf('('));
    const args = formula.substring(formula.indexOf('(') + 1, formula.indexOf(')'));
    const cellReferences = args.split(',').map(str => str.trim());
  
    switch (functionName) {
      case 'SUM':
        return sum(cellReferences, data);
      case 'AVERAGE':
        return average(cellReferences, data);
      case 'MAX':
        return max(cellReferences, data);
      case 'MIN':
        return min(cellReferences, data);
      case 'COUNT':
        return count(cellReferences, data);
      default:
        throw new Error('Invalid formula');
    }
  }
  
  function sum(cellReferences, data) {
    return cellReferences
      .map(ref => getCellValue(ref, data))
      .reduce((acc, val) => acc + (isNaN(val) ? 0 : Number(val)), 0);
  }
  
  function average(cellReferences, data) {
    const values = cellReferences
      .map(ref => getCellValue(ref, data))
      .filter(val => !isNaN(val));
    return values.length === 0 ? 0 : values.reduce((acc, val) => acc + val, 0) / values.length;
  }
  
  function max(cellReferences, data) {
    return Math.max(...cellReferences.map(ref => getCellValue(ref, data)));
  }
  
  function min(cellReferences, data) {
    return Math.min(...cellReferences.map(ref => getCellValue(ref, data)));
  }
  
  function count(cellReferences, data) {
    return cellReferences.filter(ref => !isNaN(getCellValue(ref, data))).length;
  }
  
  function getCellValue(ref, data) {
    // Basic implementation - needs improvement
    const [col, row] = ref.match(/([A-Z]+)(\d+)/).slice(1).map
  }