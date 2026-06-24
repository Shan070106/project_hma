import { useState } from "react";

function EditTableModal({ table, onClose, onSubmit, loading }) {
  const [tableNumber, setTableNumber] = useState(table?.tableNumber || "");

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(table, { tableNumber: tableNumber.trim() });
  };

  return (
    <div className="table-modal-backdrop" role="presentation">
      <form className="table-modal" onSubmit={handleSubmit} role="dialog" aria-modal="true" aria-labelledby="edit-table-title">
        <div className="modal-header-row">
          <h3 id="edit-table-title">Edit Table</h3>
          <button type="button" className="icon-close" onClick={onClose} disabled={loading} aria-label="Close">x</button>
        </div>

        <label className="form-field">
          <span>Table Number</span>
          <input
            type="text"
            value={tableNumber}
            onChange={(event) => setTableNumber(event.target.value)}
            disabled={loading}
            autoFocus
          />
        </label>

        <div className="locked-fields">
          <div><span>Table Code</span><strong>{table?.tableCode}</strong></div>
          <div><span>Version</span><strong>v{table?.qrVersion}</strong></div>
        </div>

        <div className="modal-actions">
          <button type="button" className="secondary-btn" onClick={onClose} disabled={loading}>Cancel</button>
          <button type="submit" className="primary-btn" disabled={loading || tableNumber.trim() === ""}>{loading ? "Saving..." : "Save"}</button>
        </div>
      </form>
    </div>
  );
}

export default EditTableModal;
