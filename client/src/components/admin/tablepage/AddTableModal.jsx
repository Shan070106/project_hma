import { useState } from "react";

function AddTableModal({ onClose, onSubmit, loading }) {
  const [tableNumber, setTableNumber] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ tableNumber: tableNumber.trim() });
  };

  return (
    <div className="table-modal-backdrop" role="presentation">
      <form className="table-modal" onSubmit={handleSubmit} role="dialog" aria-modal="true" aria-labelledby="add-table-title">
        <div className="modal-header-row">
          <h3 id="add-table-title">Add Table</h3>
          <button type="button" className="icon-close" onClick={onClose} disabled={loading} aria-label="Close">x</button>
        </div>

        <label className="form-field">
          <span>Table Number</span>
          <input
            type="text"
            value={tableNumber}
            onChange={(event) => setTableNumber(event.target.value)}
            placeholder="T1"
            disabled={loading}
            autoFocus
          />
        </label>

        <div className="modal-actions">
          <button type="button" className="secondary-btn" onClick={onClose} disabled={loading}>Cancel</button>
          <button type="submit" className="primary-btn" disabled={loading || tableNumber.trim() === ""}>{loading ? "Creating..." : "Create"}</button>
        </div>
      </form>
    </div>
  );
}

export default AddTableModal;
