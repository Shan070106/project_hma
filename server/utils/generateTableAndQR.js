import fs from "fs";
import path from "path";
import QRCode from "qrcode";
import generateTableCode from "./generateTableCode.js";

const qrUploadDir = path.resolve("uploads", "qrcodes");

const ensureQrUploadDir = () => {
    if (!fs.existsSync(qrUploadDir)) {
        fs.mkdirSync(qrUploadDir, { recursive: true });
    }
};

const getClientUrl = () => {
    const url = process.env.CLIENT_URL || process.env.FRONTEND_URL || process.env.APP_URL || "https://yourapp.com";
    return url.replace(/\/$/, "");
};

const generateTableAndQR = async ({ hotelId, tableNumber, tableCode }) => {
    const code = tableCode || await generateTableCode();
    const qrData = `${getClientUrl()}/menu/${hotelId}?table=${code}`;
    const fileName = `${hotelId}-${code}-${Date.now()}.png`;
    const qrImagePath = path.join("uploads", "qrcodes", fileName).replace(/\\/g, "/");

    ensureQrUploadDir();
    await QRCode.toFile(path.resolve(qrImagePath), qrData, {
        type: "png",
        errorCorrectionLevel: "M",
        margin: 2,
        width: 512
    });

    return {
        hotel: hotelId,
        tableNumber,
        tableCode: code,
        qrData,
        qrImagePath
    };
};

export { qrUploadDir };
export default generateTableAndQR;
