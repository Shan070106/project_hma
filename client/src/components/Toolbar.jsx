function Toolbar({ tools }) {
    return (
        <div className="toolbar">
            <style>
            {`
                .toolbar{
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 16px;
                    flex-wrap: wrap;
                }

                .primary-btn {
                    background: #246bfe;
                    border-color: #246bfe;
                    color: #ffffff;
                }

                .secondary-btn {
                    border-color: #cbd5e1;
                }

                .danger-btn {
                    background: #c93737;
                    border-color: #c93737;
                    color: #ffffff;
                }

                .primary-btn,
                .secondary-btn,
                .danger-btn {
                    min-height: 36px;
                    border: 1px solid transparent;
                    border-radius: 6px;
                    padding: 0 12px;
                    font: inherit;
                    font-size: 14px;
                    font-weight: 700;
                    cursor: pointer;
                }

                .primary-btn:hover:not(:disabled),
                .secondary-btn:hover:not(:disabled),
                .danger-btn:hover:not(:disabled) {
                    filter: brightness(0.96);
                }
            }`}
                
            </style>
            {
                tools.map((tool) => (
                    <button 
                        key={tool.index} 
                        onClick={tool.onClick}
                        disabled={tool.disabled}
                        className={tool.className || ''}
                    >
                        {tool.label}
                    </button>
                ))
            }
        </div>
    );
}

export default Toolbar;