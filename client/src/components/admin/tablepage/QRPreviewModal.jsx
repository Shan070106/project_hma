import { useEffect, useState } from "react";
import { getTableQRBlob } from "../../../services/tableService";

function QRPreviewModal({ table, onClose, onDownload, loading }) {
  const [imageUrl, setImageUrl] = useState("");
  const [previewLoading, setPreviewLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let objectUrl = "";
    let mounted = true;

    async function loadPreview() {
      setPreviewLoading(true);
      setError("");
      try {
        const { blob } = await getTableQRBlob(table._id || table.id);
        objectUrl = URL.createObjectURL(blob);
        if (mounted) setImageUrl(objectUrl);
      } catch (err) {
        if (mounted) setError(err.response?.data?.message || "Unable to load QR preview");
      } finally {
        if (mounted) setPreviewLoading(false);
      }
    }

    loadPreview();

    return () => {
      mounted = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [table]);

  return (
    <div className="table-modal-backdrop" role="presentation">
      <div className="table-modal qr-preview-modal" role="dialog" aria-modal="true" aria-labelledby="qr-preview-title">
        <div className="modal-header-row">
          <h3 id="qr-preview-title">QR Preview</h3>
          <button type="button" className="icon-close" onClick={onClose} disabled={loading} aria-label="Close">x</button>
        </div>

        <div className="qr-preview-meta">
          <strong>{table.tableNumber}</strong>
          <code>{table.tableCode}</code>
          <span>v{table.qrVersion}</span>
        </div>

        <div className="qr-preview-frame">
          {previewLoading && <p>Loading QR...</p>}
          {!previewLoading && error && <p className="error-text">{error}</p>}
          {!previewLoading && !error && imageUrl && <img src={imageUrl} alt={"QR code for " + table.tableNumber} />}
        </div>

        <div className="modal-actions">
          <button type="button" className="secondary-btn" onClick={onClose} disabled={loading}>Close</button>
          <button type="button" className="primary-btn" onClick={() => onDownload(table)} disabled={loading || previewLoading || Boolean(error)}>{loading ? "Downloading..." : "Download"}</button>
        </div>
      </div>
    </div>
  );
}

export default QRPreviewModal;
