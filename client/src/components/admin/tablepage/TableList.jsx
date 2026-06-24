import TableRow from "./TableRow";

function TableList({ tables, selectedTableIds, onSelectTable, onSelectAll, actionsDisabled, onEdit, onPreview, onGenerate, onDownload, onDeactivate, onReactivate }) {
  const visibleIds = tables.map((table) => table._id || table.id).filter(Boolean);
  const allSelected = visibleIds.length > 0 && visibleIds.every((tableId) => selectedTableIds.includes(tableId));

  return (
    <div className="table-list-wrap">
      <table className="table-list">
        <thead>
          <tr>
            <th className="checkbox-cell">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={(event) => onSelectAll(event.target.checked, visibleIds)}
                disabled={actionsDisabled || visibleIds.length === 0}
                aria-label="Select all visible tables"
              />
            </th>
            <th>Table Number</th>
            <th>Table Code</th>
            <th>QR Preview</th>
            <th>Version</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tables.map((table) => {
            const tableId = table._id || table.id;
            return (
              <TableRow
                key={tableId}
                table={table}
                selected={selectedTableIds.includes(tableId)}
                onSelect={onSelectTable}
                onEdit={onEdit}
                onPreview={onPreview}
                onGenerate={onGenerate}
                onDownload={onDownload}
                onDeactivate={onDeactivate}
                onReactivate={onReactivate}
                disabled={actionsDisabled}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default TableList;
