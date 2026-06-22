function ConfirmBox({ header, message, onConfirm, onCancel, confirmLabel = "Ok", cancelLabel = "Cancel", disabled = false }) {
    return (
        <div className="modal-overlay">
            <style>
                {`
                    .modal-overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0, 0, 0, 0.5);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        z-index: 1000;
                    }
                    .modal-content {
                        background: white;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                        max-width: 400px;
                        width: 90%;
                    }
                    .modal-buttons {
                        display: flex;
                        justify-content: flex-end;
                        gap: 10px;
                        margin-top: 20px;
                    }
                    .btn {
                        padding: 10px 20px;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                    }
                    .btn.confirm {
                        background: #28a745;
                        color: white;
                    }
                    .btn.cancel {
                        background: #6c757d;
                        color: white;
                    }
                    .btn.close {
                      float: right;
                      min-height: 32px;
                    }
                    .p {
                         clear: both;
                         margin: 18px 0 0;
                         color: #405166;
                    }
                `}
            </style>
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