import API_URL from "@/config";

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Network response was not ok");
  }
  if (response.status === 204) return null;
  return response.json();
};

export const getInvestmentService = (worksheetId) => {
  if (!worksheetId) return null;

  return {
    get: () =>
      fetch(`${API_URL}/worksheets/${worksheetId}/snapshots`).then(
        handleResponse
      ),
    add: (data) =>
      fetch(`${API_URL}/worksheets/${worksheetId}/snapshots`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then(handleResponse),
    
    // --- ITT A JAVÍTÁS: Az update metódus implementálása ---
    update: (data) =>
      fetch(`${API_URL}/snapshots/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then(handleResponse),

    delete: (id) =>
      fetch(`${API_URL}/snapshots/${id}`, {
        method: "DELETE",
      }).then(handleResponse),
  };
};