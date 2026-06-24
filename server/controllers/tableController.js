import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import { createRequire } from "module";
import asyncHandler from "express-async-handler";
import Hotel from "../models/Hotel.js";
import Table from "../models/Table.js";
import generateTableAndQR from "../utils/generateTableAndQR.js";

const require = createRequire(import.meta.url);
const archiver = require("archiver");
const MAX_BULK_TABLES = 100;

const getUserHotel = async (req) => {
    const userId = req.user?.id;

    if (!userId) {
        const err = new Error("Not authenticated");
        err.status = 401;
        throw err;
    }

    const hotel = await Hotel.findOne({ user: userId });
    if (!hotel) {
        const err = new Error("Hotel not found or create hotel first");
        err.status = 404;
        throw err;
    }

    return hotel;
};

const throwError = (status, message) => {
    const err = new Error(message);
    err.status = status;
    throw err;
};

const normalizeTableNumber = (tableNumber) => {
    if (typeof tableNumber !== "string" || tableNumber.trim() === "") {
        throwError(400, "tableNumber is required");
    }

    return tableNumber.trim();
};

const validateObjectId = (id, label = "table id") => {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        throwError(400, `Valid ${label} is required`);
    }
};

const validateTableIds = (tableIds) => {
    if (!Array.isArray(tableIds) || tableIds.length === 0) {
        throwError(400, "tableIds must be a non-empty array");
    }

    tableIds.forEach((tableId) => validateObjectId(tableId));
    return [...new Set(tableIds)];
};

const getOwnedTable = async (hotelId, tableId) => {
    validateObjectId(tableId);

    const table = await Table.findOne({ _id: tableId, hotel: hotelId });
    if (!table) {
        throwError(404, "Table not found");
    }

    return table;
};

const ensureNoActiveDuplicate = async (hotelId, tableNumber, excludeId) => {
    const query = {
        hotel: hotelId,
        tableNumber,
        isActive: true
    };

    if (excludeId) {
        query._id = { $ne: excludeId };
    }

    const duplicate = await Table.exists(query);
    if (duplicate) {
        throwError(400, "Active tableNumber already exists for this hotel");
    }
};

const removeFileIfExists = async (filePath) => {
    if (!filePath) return;

    const absolutePath = path.resolve(filePath);
    if (fs.existsSync(absolutePath)) {
        await fs.promises.unlink(absolutePath);
    }
};

const regenerateTableQR = async (table, hotelId) => {
    const oldImagePath = table.qrImagePath;
    const generated = await generateTableAndQR({
        hotelId,
        tableNumber: table.tableNumber,
        tableCode: table.tableCode
    });

    table.qrData = generated.qrData;
    table.qrImagePath = generated.qrImagePath;
    table.qrVersion += 1;

    await table.save();
    await removeFileIfExists(oldImagePath);

    return table;
};

const addTable = asyncHandler(async (req, res) => {
    const hotel = await getUserHotel(req);
    const tableNumber = normalizeTableNumber(req.body?.tableNumber);

    await ensureNoActiveDuplicate(hotel._id, tableNumber);

    const generated = await generateTableAndQR({
        hotelId: hotel._id.toString(),
        tableNumber
    });

    const table = await Table.create(generated);

    res.status(201).json({
        success: true,
        message: "Table created successfully",
        table
    });
});

const addTablesBulk = asyncHandler(async (req, res) => {
    const hotel = await getUserHotel(req);
    const count = Number(req.body?.count);
    const startNumber = req.body?.startNumber === undefined ? 1 : Number(req.body.startNumber);

    if (!Number.isInteger(count) || count <= 0) {
        throwError(400, "count must be a positive integer");
    }

    if (count > MAX_BULK_TABLES) {
        throwError(400, `count cannot be greater than ${MAX_BULK_TABLES}`);
    }

    if (!Number.isInteger(startNumber) || startNumber <= 0) {
        throwError(400, "startNumber must be a positive integer");
    }

    const tableNumbers = Array.from({ length: count }, (_, index) => `T${startNumber + index}`);
    const existingTables = await Table.find({
        hotel: hotel._id,
        tableNumber: { $in: tableNumbers },
        isActive: true
    }).select("tableNumber");

    if (existingTables.length > 0) {
        throwError(400, "One or more active tableNumbers already exist for this hotel");
    }

    const generatedTables = await Promise.all(
        tableNumbers.map((tableNumber) => generateTableAndQR({
            hotelId: hotel._id.toString(),
            tableNumber
        }))
    );

    const tables = await Table.insertMany(generatedTables, { ordered: true });

    res.status(201).json({
        success: true,
        message: "Tables created successfully",
        createdCount: tables.length,
        tables
    });
});

const getTables = asyncHandler(async (req, res) => {
    const hotel = await getUserHotel(req);

    const tables = await Table.find({ hotel: hotel._id })
        .select("tableNumber tableCode qrImagePath qrVersion isActive createdAt updatedAt")
        .sort({ tableNumber: 1 })
        .collation({ locale: "en", numericOrdering: true });

    res.status(200).json({
        success: true,
        message: "Tables fetched successfully",
        tables
    });
});

const updateTableNumber = asyncHandler(async (req, res) => {
    const hotel = await getUserHotel(req);
    const table = await getOwnedTable(hotel._id, req.params.tableId);
    const tableNumber = normalizeTableNumber(req.body?.tableNumber);

    if (table.isActive) {
        await ensureNoActiveDuplicate(hotel._id, tableNumber, table._id);
    }

    const oldImagePath = table.qrImagePath;
    const generated = await generateTableAndQR({
        hotelId: hotel._id.toString(),
        tableNumber,
        tableCode: table.tableCode
    });

    table.tableNumber = tableNumber;
    table.qrData = generated.qrData;
    table.qrImagePath = generated.qrImagePath;
    table.qrVersion += 1;

    await table.save();
    await removeFileIfExists(oldImagePath);

    res.status(200).json({
        success: true,
        message: "Table number updated successfully",
        table
    });
});

const deactivateTable = asyncHandler(async (req, res) => {
    const hotel = await getUserHotel(req);
    const table = await getOwnedTable(hotel._id, req.params.tableId);

    table.isActive = false;
    await table.save();

    res.status(200).json({
        success: true,
        message: "Table deactivated successfully",
        table
    });
});

const deactivateTablesBulk = asyncHandler(async (req, res) => {
    const hotel = await getUserHotel(req);
    const { tableIds } = req.body || {};

    const uniqueTableIds = validateTableIds(tableIds);

    const result = await Table.updateMany(
        { _id: { $in: uniqueTableIds }, hotel: hotel._id },
        { $set: { isActive: false } }
    );

    res.status(200).json({
        success: true,
        message: "Tables deactivated successfully",
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount
    });
});

const reactivateTable = asyncHandler(async (req, res) => {
    const hotel = await getUserHotel(req);
    const table = await getOwnedTable(hotel._id, req.params.tableId);

    await ensureNoActiveDuplicate(hotel._id, table.tableNumber, table._id);

    table.isActive = true;
    await table.save();

    res.status(200).json({
        success: true,
        message: "Table reactivated successfully",
        table
    });
});

const regenerateTable = asyncHandler(async (req, res) => {
    const hotel = await getUserHotel(req);
    const table = await getOwnedTable(hotel._id, req.params.tableId);

    await regenerateTableQR(table, hotel._id.toString());ensureQrUploadDir

    res.status(200).json({
        success: true,
        message: "QR regenerated successfully",
        table
    });
});

const regenerateTablesBulk = asyncHandler(async (req, res) => {
    const hotel = await getUserHotel(req);
    const { tableIds } = req.body || {};

    const uniqueTableIds = validateTableIds(tableIds);

    const tables = await Table.find({ _id: { $in: uniqueTableIds }, hotel: hotel._id });
    if (tables.length !== uniqueTableIds.length) {
        throwError(404, "One or more tables were not found");
    }

    const regeneratedTables = [];
    for (const table of tables) {
        regeneratedTables.push(await regenerateTableQR(table, hotel._id.toString()));
    }

    res.status(200).json({
        success: true,
        message: "QR codes regenerated successfully",
        updatedCount: regeneratedTables.length,
        tables: regeneratedTables
    });
});

const downloadTableQR = asyncHandler(async (req, res) => {
    const hotel = await getUserHotel(req);
    const table = await getOwnedTable(hotel._id, req.params.tableId);

    if (!table.qrImagePath || !fs.existsSync(path.resolve(table.qrImagePath))) {
        throwError(404, "QR image not found");
    }

    res.download(path.resolve(table.qrImagePath), `${table.tableNumber}-${table.tableCode}.png`);
});

const downloadTablesQR = asyncHandler(async (req, res, next) => {
    const hotel = await getUserHotel(req);
    const { tableIds } = req.body || {};

    const uniqueTableIds = validateTableIds(tableIds);

    const tables = await Table.find({ _id: { $in: uniqueTableIds }, hotel: hotel._id });
    if (tables.length !== uniqueTableIds.length) {
        throwError(404, "One or more tables were not found");
    }

    const files = tables
        .filter((table) => table.qrImagePath)
        .map((table) => ({ table, absolutePath: path.resolve(table.qrImagePath) }))
        .filter(({ absolutePath }) => fs.existsSync(absolutePath));

    if (files.length === 0) {
        throwError(404, "QR images not found");
    }

    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", "attachment; filename=table-qrcodes.zip");

    const archive = archiver("zip", { zlib: { level: 9 } });
    archive.on("error", next);
    archive.pipe(res);

    files.forEach(({ table, absolutePath }) => {
        archive.file(absolutePath, {
            name: `${table.tableNumber}-${table.tableCode}.png`
        });
    });

    await archive.finalize();
});

export {
    addTable,
    addTablesBulk,
    getTables,
    updateTableNumber,
    deactivateTable,
    deactivateTablesBulk,
    reactivateTable,
    regenerateTable,
    regenerateTablesBulk,
    downloadTableQR,
    downloadTablesQR
};
