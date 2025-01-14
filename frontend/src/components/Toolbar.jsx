
import React from "react";
import { FaBold, FaItalic, FaUndo, FaRedo, FaPlusSquare, FaPlus } from "react-icons/fa";

const Toolbar = ({ addRow, addColumn, undo, redo }) => {
  return (
    <div className="toolbar">
      <button onClick={addRow}>
        <FaPlusSquare /> Add Row
      </button>
      <button onClick={addColumn}>
        <FaPlus /> Add Column
      </button>
      <button onClick={undo}>
        <FaUndo /> Undo
      </button>
      <button onClick={redo}>
        <FaRedo /> Redo
      </button>
      <button onClick={() => alert("Bold clicked!")}>
        <FaBold />
      </button>
      <button onClick={() => alert("Italic clicked!")}>
        <FaItalic />
      </button>
    </div>
  );
};

export default Toolbar;


