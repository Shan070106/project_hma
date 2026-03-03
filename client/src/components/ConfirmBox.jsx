function ConfirmBox({ header, message, onConfirm, onCancel }) {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>{header}</h3> 
                <button className="btn close" onClick={onCancel}>Close</button>
                <p>{message}</p>
                <div className="modal-buttons">
                    <button className="btn confirm" onClick={onConfirm}>Ok</button>
                    <button className="btn cancel" onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmBox;