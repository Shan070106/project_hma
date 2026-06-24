import { useMemo, useState } from "react";

function AddMultipleTablesModal({ onClose, onSubmit, loading, nextTableNumber }) {
  const [count, setCount] = useState("");
  const numericCount = Number(count);

  const preview = useMemo(() => {
    if (!Number.isInteger(numericCount) || numericCount <= 0) return [];
    return Array.from({ length: Math.min(numericCount, 5) }, (_, index) => "T" + (nextTableNumber + index));
  }, [numericCount, nextTableNumber]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ count: numericCount, startNumber: nextTableNumber });
  };

  return (
    <div className="table-modal-backdrop" role="presentation">
      <form className="table-modal" onSubmit={handleSubmit} role="dialog" aria-modal="true" aria-labelledby="add-many-title">
        <div className="modal-header-row">
          <h3 id="add-many-title">Add Multiple Tables</h3>
          <button type="button" className="icon-close" onClick={onClose} disabled={loading} aria-label="Close">x</button>
        </div>

        <label className="form-field">
          <span>Count</span>
          <input
            type="number"
            min="1"
            max="100"
            value={count}
            onChange={(event) => setCount(event.target.value)}
            placeholder="20"
            disabled={loading}
            autoFocus
          />
        </label>

        {preview.length > 0 && (
          <div className="table-preview-list">
            <span>Will create</span>
            <p>{preview.join(", ")}{numericCount > preview.length ? ", ..." : ""}</p>
          </div>
        )}

        <div className="modal-actions">
          <button type="button" className="secondary-btn" onClick={onClose} disabled={loading}>Cancel</button>
          <button type="submit" className="primary-btn" disabled={loading || !Number.isInteger(numericCount) || numericCount <= 0}>{loading ? "Creating..." : "Create Tables"}</button>
        </div>
      </form>
    </div>
  );
}

export default AddMultipleTablesModal;
