import { useEffect, useMemo, useState } from "react";
import ConfirmBox from "../../components/ConfirmBox";
import Toolbar from "../../components/Toolbar";
import NoticeBox from "../../components/NoticeBox"
import TableBulkActions from "../../components/admin/tablepage/TableBulkActions";
import TableList from "../../components/admin/tablepage/TableList";
import AddTableModal from "../../components/admin/tablepage/AddTableModal";
import AddMultipleTablesModal from "../../components/admin/tablepage/AddMultipleTablesModal";
import EditTableModal from "../../components/admin/tablepage/EditTableModal";
import QRPreviewModal from "../../components/admin/tablepage/QRPreviewModal";
import "../../assets/styles/QrcodePage.css";
import {
  createTable,
  createTablesBulk,
  deactivateTable,
  deactivateTables,
  downloadSelectedQR,
  downloadTableQR,
  getTables,
  reactivateTable,
  reactivateTables,
  regenerateTable,
  regenerateTables,
  updateTable
} from "../../services/tableService";

const getTableId = (table) => table?._id || table?.id;

const getErrorMessage = (error, fallback) => error.response?.data?.message || error.message || fallback;

function QrcodePage() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [selectedTableIds, setSelectedTableIds] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [activeModal, setActiveModal] = useState(null);
  const [editingTable, setEditingTable] = useState(null);
  const [previewTable, setPreviewTable] = useState(null);
  const [confirmConfig, setConfirmConfig] = useState(null);
  const [notice, setNotice] = useState({ type: "", message: "" });

  const actionsDisabled = loading || Boolean(actionLoading);

  const fetchTables = async () => {
    setLoading(true);
    setNotice({ type: "", message: "" });
    try {
      const data = await getTables();
      setTables(data.tables || []);
      setSelectedTableIds([]);
    } catch (error) {
      setNotice({ type: "error", message: getErrorMessage(error, "Failed to fetch tables") });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const filteredTables = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    return tables.filter((table) => {
      const statusMatches =
        statusFilter === "all" ||
        (statusFilter === "active" && table.isActive) ||
        (statusFilter === "inactive" && !table.isActive);

      const searchMatches =
        query === "" ||
        table.tableNumber?.toLowerCase().includes(query) ||
        table.tableCode?.toLowerCase().includes(query);

      return statusMatches && searchMatches;
    });
  }, [tables, statusFilter, searchText]);

  const activeTableIds = useMemo(
    () => tables.filter((table) => table.isActive).map(getTableId).filter(Boolean),
    [tables]
  );

  const allTableIds = useMemo(
    () => tables.map(getTableId).filter(Boolean),
    [tables]
  );

  const nextTableNumber = useMemo(() => {
    const maxNumber = tables.reduce((max, table) => {
      const match = /^T(\d+)$/i.exec(table.tableNumber || "");
      return match ? Math.max(max, Number(match[1])) : max;
    }, 0);
    return maxNumber + 1;
  }, [tables]);

  const showSuccess = (message) => setNotice({ type: "success", message });
  const showError = (error, fallback) => setNotice({ type: "error", message: getErrorMessage(error, fallback) });

  const closeModal = () => {
    if (actionLoading) return;
    setActiveModal(null);
    setEditingTable(null);
    setPreviewTable(null);
  };

  const runAction = async (key, action, successMessage, options = {}) => {
    setActionLoading(key);
    setNotice({ type: "", message: "" });
    try {
      await action();
      if (options.refresh !== false) {
        await fetchTables();
      }
      if (successMessage) showSuccess(successMessage);
      if (options.clearSelection) setSelectedTableIds([]);
      if (options.closeModal) closeModal();
    } catch (error) {
      showError(error, options.errorMessage || "Action failed");
    } finally {
      setActionLoading("");
      setConfirmConfig(null);
    }
  };

  const requestConfirm = ({ header, message, onConfirm }) => {
    setConfirmConfig({ header, message, onConfirm });
  };

  const handleSelectTable = (tableId, checked) => {
    setSelectedTableIds((currentIds) => {
      if (checked) return currentIds.includes(tableId) ? currentIds : [...currentIds, tableId];
      return currentIds.filter((currentId) => currentId !== tableId);
    });
  };

  const handleSelectAll = (checked, visibleIds) => {
    setSelectedTableIds((currentIds) => {
      if (!checked) return currentIds.filter((tableId) => !visibleIds.includes(tableId));
      return Array.from(new Set([...currentIds, ...visibleIds]));
    });
  };

  const handleCreateTable = (payload) => {
    runAction("create", () => createTable(payload), "Table created successfully", { closeModal: true });
  };

  const handleCreateTablesBulk = (payload) => {
    runAction("createBulk", () => createTablesBulk(payload), "Tables created successfully", { closeModal: true });
  };

  const handleUpdateTable = (table, payload) => {
    const tableId = getTableId(table);
    runAction("update", () => updateTable(tableId, payload), "Table updated successfully", { closeModal: true });
  };

  const handleDownloadTable = (table) => {
    runAction("download", () => downloadTableQR(table), "QR download started", { refresh: false });
  };

  const handleDownloadMany = (tableIds, filename) => {
    if (tableIds.length === 0) return;
    runAction("downloadMany", () => downloadSelectedQR(tableIds, filename), "QR ZIP download started", { refresh: false });
  };

  const confirmSingleGenerate = (table) => {
    requestConfirm({
      header: "Regenerate QR",
      message: "Regenerate QR for " + table.tableNumber + "? The table code will stay the same and the version will increase.",
      onConfirm: () => runAction("generate", () => regenerateTable(getTableId(table)), "QR regenerated successfully")
    });
  };

  const confirmDeactivate = (table) => {
    requestConfirm({
      header: "Deactivate Table",
      message: "Deactivate " + table.tableNumber + "? This keeps the record but marks it inactive.",
      onConfirm: () => runAction("deactivate", () => deactivateTable(getTableId(table)), "Table deactivated successfully", { clearSelection: true })
    });
  };

  const confirmReactivate = (table) => {
    requestConfirm({
      header: "Reactivate Table",
      message: "Reactivate " + table.tableNumber + "?",
      onConfirm: () => runAction("reactivate", () => reactivateTable(getTableId(table)), "Table reactivated successfully")
    });
  };

  const confirmGenerateAll = () => {
    if (activeTableIds.length === 0) return;
    requestConfirm({
      header: "Generate All QR Codes",
      message: "Regenerate QR codes for " + activeTableIds.length + " active tables?",
      onConfirm: () => runAction("generateAll", () => regenerateTables(activeTableIds), "All active QR codes regenerated successfully")
    });
  };

  const confirmGenerateSelected = () => {
    if (selectedTableIds.length === 0) return;
    requestConfirm({
      header: "Generate Selected QR Codes",
      message: "Regenerate QR codes for " + selectedTableIds.length + " selected tables?",
      onConfirm: () => runAction("generateSelected", () => regenerateTables(selectedTableIds), "Selected QR codes regenerated successfully")
    });
  };

  const confirmDeactivateSelected = () => {
    if (selectedTableIds.length === 0) return;
    requestConfirm({
      header: "Deactivate Selected Tables",
      message: "Deactivate " + selectedTableIds.length + " selected tables?",
      onConfirm: () => runAction("deactivateSelected", () => deactivateTables(selectedTableIds), "Selected tables deactivated successfully", { clearSelection: true })
    });
  };

  const confirmReactivateSelected = () => {
    if (selectedTableIds.length === 0) return;
    requestConfirm({
      header: "Reactivate Selected Tables",
      message: "Reactivate " + selectedTableIds.length + " selected tables?",
      onConfirm: () => runAction("reactivateSelected", () => reactivateTables(selectedTableIds), "Selected tables reactivated successfully", { clearSelection: true })
    });
  };

  const tools = [
        {
          index: "add",
          label: "Add Table",
          onClick: () => setActiveModal("add"),
          disabled: actionsDisabled,
          className: "primary-btn"
        },
        {
          index: "addMultiple",
          label: "Add Multiple",
          onClick: () => setActiveModal("addMultiple"),
          disabled: actionsDisabled,
          className: "secondary-btn"
        },
        {
          index: "generateAll",
          label: "Generate All",
          onClick: confirmGenerateAll,
          disabled: actionsDisabled || activeTableIds.length === 0,
          className: "secondary-btn"
        },
        {
          index:"downloadAll",
          label: "Download All",
          onClick: () => handleDownloadMany(allTableIds, "all-table-qrcodes.zip"),
          disabled: actionsDisabled || allTableIds.length === 0,
          className: "secondary-btn"
        }
      ];

  return (
    <div className="qrcode-page">
      <header className="qrcode-header">
        <div>
          <h2>Tables & QR Management</h2>
          <p>Create tables, manage status, regenerate QR codes, and download printable assets.</p>
        </div>
        {actionLoading && <span className="loading-chip">Working...</span>}
      </header>

      {notice.message && <NoticeBox message={notice.message} type={notice.type} />}
      
      <Toolbar tools={tools}/>
      
      <TableBulkActions
        selectedCount={selectedTableIds.length}
        onGenerate={confirmGenerateSelected}
        onDownload={() => handleDownloadMany(selectedTableIds, "selected-table-qrcodes.zip")}
        onDeactivate={confirmDeactivateSelected}
        onReactivate={confirmReactivateSelected}
        disabled={actionsDisabled}
      />

      <main className="table-panel">
        {loading ? (
          <div className="table-loading">Loading tables...</div>
        ) : tables.length === 0 ? (
          <div className="table-empty-state">
            <h3>No tables found.</h3>
            <p>Create your first table or generate multiple tables.</p>
            <div>
              <button type="button" className="primary-btn" onClick={() => setActiveModal("add")}>Add Table</button>
              <button type="button" className="secondary-btn" onClick={() => setActiveModal("addMultiple")}>Add Multiple</button>
            </div>
          </div>
        ) : filteredTables.length === 0 ? (
          <div className="table-empty-state compact">
            <h3>No matching tables</h3>
            <p>Try a different search or filter.</p>
          </div>
        ) : (
          <TableList
            tables={filteredTables}
            selectedTableIds={selectedTableIds}
            onSelectTable={handleSelectTable}
            onSelectAll={handleSelectAll}
            actionsDisabled={actionsDisabled}
            onEdit={(table) => { setEditingTable(table); setActiveModal("edit"); }}
            onPreview={(table) => setPreviewTable(table)}
            onGenerate={confirmSingleGenerate}
            onDownload={handleDownloadTable}
            onDeactivate={confirmDeactivate}
            onReactivate={confirmReactivate}
          />
        )}
      </main>

      {activeModal === "add" && (
        <AddTableModal onClose={closeModal} onSubmit={handleCreateTable} loading={actionLoading === "create"} />
      )}

      {activeModal === "addMultiple" && (
        <AddMultipleTablesModal
          onClose={closeModal}
          onSubmit={handleCreateTablesBulk}
          loading={actionLoading === "createBulk"}
          nextTableNumber={nextTableNumber}
        />
      )}

      {activeModal === "edit" && editingTable && (
        <EditTableModal table={editingTable} onClose={closeModal} onSubmit={handleUpdateTable} loading={actionLoading === "update"} />
      )}

      {previewTable && (
        <QRPreviewModal table={previewTable} onClose={closeModal} onDownload={handleDownloadTable} loading={actionLoading === "download"} />
      )}

      {confirmConfig && (
        <ConfirmBox
          header={confirmConfig.header}
          message={confirmConfig.message}
          onConfirm={confirmConfig.onConfirm}
          onCancel={() => !actionLoading && setConfirmConfig(null)}
          confirmLabel={actionLoading ? "Working..." : "Ok"}
          disabled={Boolean(actionLoading)}
        />
      )}
    </div>
  );
}

export default QrcodePage;
