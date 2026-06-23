function NoticeBox({message, type}){
    return (
    <div className="notice">
        <style>
            {`
                .notice,
                .success,
                .error {
                    margin-bottom: 14px;
                    padding: 12px 14px;
                    border-radius: 6px;
                    font-size: 14px;
                    border: 1px solid transparent;
                }

                .success {
                    background: #eaf7ef;
                    border-color: #b8e3c7;
                    color: #176236;
                }
                
                .error {
                    background: #fdeeee;
                    border-color: #f2b8b8;
                    color: #9c2424;
                }
            `}
        </style>
        <div className={type}>{message}</div>
    </div>
    )
}

export default NoticeBox;
