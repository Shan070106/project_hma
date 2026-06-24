function TableRow({ table, selected, onSelect, onEdit, onPreview, onGenerate, onDownload, onDeactivate, onReactivate, disabled }) {
  const tableId = table._id || table.id;

  return (
    <tr className={selected ? "selected-row" : ""}>
      <td className="checkbox-cell">
        <input
          type="checkbox"
          checked={selected}
          onChange={(event) => onSelect(tableId, event.target.checked)}
          disabled={disabled}
          aria-label={"Select " + table.tableNumber}
        />
      </td>
      <td>
        <strong>{table.tableNumber}</strong>
      </td>
      <td><code>{table.tableCode}</code></td>
      <td>
        <button type="button" className="link-btn" onClick={() => onPreview(table)} disabled={disabled}>View QR</button>
      </td>
      <td>v{table.qrVersion}</td>
      <td>
        <span className={table.isActive ? "status-pill active" : "status-pill inactive"}>
          {table.isActive ? "Active" : "Inactive"}
        </span>
      </td>
      <td>
        <div className="row-actions">
          <button type="button" onClick={() => onEdit(table)} disabled={disabled}>Edit</button>
          <button type="button" onClick={() => onGenerate(table)} disabled={disabled}>Generate</button>
          <button type="button" onClick={() => onDownload(table)} disabled={disabled}>Download</button>
          {table.isActive ? (
            <button type="button" className="danger-text" onClick={() => onDeactivate(table)} disabled={disabled}>Deactivate</button>
          ) : (
            <button type="button" onClick={() => onReactivate(table)} disabled={disabled}>Reactivate</button>
          )}
        </div>
      </td>
    </tr>
  );
}

export default TableRow;
