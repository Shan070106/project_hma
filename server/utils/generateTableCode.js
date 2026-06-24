import crypto from "crypto";
import Table from "../models/Table.js";

const buildCode = (length = 5) => `tbl_${crypto.randomBytes(4).toString("hex").slice(0, length)}`;

const generateTableCode = async () => {
    for (let attempt = 0; attempt < 10; attempt += 1) {
        const code = buildCode(attempt < 8 ? 5 : 8);
        const exists = await Table.exists({ tableCode: code });

        if (!exists) {
            return code;
        }
    }

    return `tbl_${crypto.randomUUID().replace(/-/g, "").slice(0, 12)}`;
};

export default generateTableCode;
