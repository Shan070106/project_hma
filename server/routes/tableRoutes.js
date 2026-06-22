import Router from "express";
import requireAuth from "../middleware/authMiddleware.js";
import {
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
} from "../controllers/tableController.js";

const router = Router();

router.post("/", requireAuth, addTable);
router.post("/bulk", requireAuth, addTablesBulk);
router.get("/", requireAuth, getTables);
router.patch("/deactivate-many", requireAuth, deactivateTablesBulk);
router.patch("/regenerate-many", requireAuth, regenerateTablesBulk);
router.post("/download-many", requireAuth, downloadTablesQR);
router.patch("/:tableId", requireAuth, updateTableNumber);
router.patch("/:tableId/deactivate", requireAuth, deactivateTable);
router.patch("/:tableId/reactivate", requireAuth, reactivateTable);
router.patch("/:tableId/regenerate", requireAuth, regenerateTable);
router.get("/:tableId/download", requireAuth, downloadTableQR);

export default router;
