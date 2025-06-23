import API_URL from "@/config";

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Network response was not ok");
  }
  if (response.status === 204) return null;
  return response.json();
};

// Ez a függvény egy service objektumot ad vissza a megadott worksheetId-hoz
export const getAssetTypeService = (worksheetId) => {
  if (!worksheetId) return null;

  return {
    get: () =>
      fetch(`${API_URL}/worksheets/${worksheetId}/asset-types`).then(
        handleResponse
      ),
    add: (data) =>
      fetch(`${API_URL}/worksheets/${worksheetId}/asset-types`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then(handleResponse),
    update: (data) =>
      fetch(`${API_URL}/asset-types/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then(handleResponse),
    delete: (id) =>
      fetch(`${API_URL}/asset-types/${id}`, {
        method: "DELETE",
      }).then(handleResponse),
  };
};