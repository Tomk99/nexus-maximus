import API_URL from "@/config";

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Network response was not ok");
  }
  if (response.status === 204) {
    return null;
  }
  return response.json();
};

export const refuelingService = {
  get: () => fetch(`${API_URL}/refuelings`).then(handleResponse),
  
  add: (data) =>
    fetch(`${API_URL}/refuelings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(handleResponse),
  
  update: (data) =>
    fetch(`${API_URL}/refuelings/${data.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(handleResponse),
  
  delete: (id) =>
    fetch(`${API_URL}/refuelings/${id}`, {
      method: "DELETE",
    }).then(handleResponse),
};