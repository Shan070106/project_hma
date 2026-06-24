function TableBulkActions({ selectedCount, onGenerate, onDownload, onDeactivate, onReactivate, disabled }) {
  if (selectedCount === 0) return null;

  return (
    <section className="table-bulk-actions" aria-label="Bulk table actions">
      <strong>Selected: {selectedCount} tables</strong>
      <div>
        <button type="button" className="secondary-btn" onClick={onGenerate} disabled={disabled}>Generate Selected</button>
        <button type="button" className="secondary-btn" onClick={onDownload} disabled={disabled}>Download Selected</button>
        <button type="button" className="danger-btn" onClick={onDeactivate} disabled={disabled}>Deactivate Selected</button>
        <button type="button" className="secondary-btn" onClick={onReactivate} disabled={disabled}>Reactivate Selected</button>
      </div>
    </section>
  );
}

export default TableBulkActions;
