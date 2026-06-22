function ConfirmBox({ header, message, onConfirm, onCancel, confirmLabel = "Ok", cancelLabel = "Cancel", disabled = false }) {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>{header}</h3> 
                <button className="btn close" onClick={onCancel} disabled={disabled}>Close</button>
                <p>{message}</p>
                <div className="modal-buttons">
                    <button className="btn confirm" onClick={onConfirm} disabled={disabled}>{confirmLabel}</button>
                    <button className="btn cancel" onClick={onCancel} disabled={disabled}>{cancelLabel}</button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmBox;