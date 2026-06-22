import api from "./api";

const getFilenameFromHeaders = (headers, fallback) => {
  const disposition = headers?.["content-disposition"] || headers?.["Content-Disposition"];
  const match = disposition?.match(/filename="?([^";]+)"?/i);
  return match?.[1] || fallback;
};

const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export const getTables = () => api.get("/tables/").then((response) => response.data);

export const createTable = (payload) => api.post("/tables/", payload).then((response) => response.data);

export const createTablesBulk = (payload) => api.post("/tables/bulk", payload).then((response) => response.data);

export const updateTable = (tableId, payload) => api.patch("/tables/" + tableId, payload).then((response) => response.data);

export const deactivateTable = (tableId) => api.patch("/tables/" + tableId + "/deactivate").then((response) => response.data);

export const deactivateTables = (tableIds) => api.patch("/tables/deactivate-many", { tableIds }).then((response) => response.data);

export const reactivateTable = (tableId) => api.patch("/tables/" + tableId + "/reactivate").then((response) => response.data);

export const reactivateTables = (tableIds) => Promise.all(tableIds.map((tableId) => reactivateTable(tableId)));

export const regenerateTable = (tableId) => api.patch("/tables/" + tableId + "/regenerate").then((response) => response.data);

export const regenerateTables = (tableIds) => api.patch("/tables/regenerate-many", { tableIds }).then((response) => response.data);

export const getTableQRBlob = async (tableId) => {
  const response = await api.get("/tables/" + tableId + "/download", { responseType: "blob" });
  return {
    blob: response.data,
    filename: getFilenameFromHeaders(response.headers, "table-qr.png")
  };
};

export const downloadTableQR = async (table) => {
  const tableId = table?._id || table?.id || table;
  const response = await api.get("/tables/" + tableId + "/download", { responseType: "blob" });
  const fallback = typeof table === "object" ? (table.tableNumber || "table") + "-" + (table.tableCode || "qr") + ".png" : "table-qr.png";
  downloadBlob(response.data, getFilenameFromHeaders(response.headers, fallback));
};

export const downloadSelectedQR = async (tableIds, filename = "table-qrcodes.zip") => {
  const response = await api.post("/tables/download-many", { tableIds }, { responseType: "blob" });
  downloadBlob(response.data, getFilenameFromHeaders(response.headers, filename));
};
