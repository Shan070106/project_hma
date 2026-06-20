import api from "./api";

export function getMenuItems() {
  return api.get("/menu/list");
}

export function createMenuItem(menuData) {
  return api.post("/menu/create", menuData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export function updateMenuItem(itemId, menuData) {
  return api.put(`/menu/${itemId}`, menuData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export function deleteMenuItem(itemId) {
  return api.delete(`/menu/${itemId}`);
}

export function deleteMultipleMenuItems(itemIds) {
  return Promise.all(itemIds.map((itemId) => deleteMenuItem(itemId)));
}
