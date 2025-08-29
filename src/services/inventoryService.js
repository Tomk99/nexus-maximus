import { createCrudService } from "./api";
import API_URL from "@/config";

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Network response was not ok");
  }
  if (response.status === 204) return null;
  return response.json();
};

const boxServiceInternal = createCrudService("inventory/boxes");
const itemServiceInternal = createCrudService("inventory/items");

export const boxService = {
    get: boxServiceInternal.get,
    add: boxServiceInternal.add,
    update: boxServiceInternal.update,
    delete: boxServiceInternal.delete,
};

export const inventoryService = {
  getAllBoxes: boxService.get,
  createBox: boxService.add,
  updateBox: boxService.update,
  deleteBox: boxService.delete,

  updateItem: itemServiceInternal.update,
  deleteItem: itemServiceInternal.delete,

  getBoxById: (boxId) => {
    return fetch(`${API_URL}/inventory/boxes/${boxId}`).then(handleResponse);
  },
  addItemToBox: (boxId, itemData) => {
    return fetch(`${API_URL}/inventory/boxes/${boxId}/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(itemData),
    }).then(handleResponse);
  },
};