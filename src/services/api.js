import API_URL from "@/config";

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Network response was not ok");
  }
  if (response.status === 204) return null;
  return response.json();
};

export const createCrudService = (endpoint) => ({
  get: () => fetch(`${API_URL}/${endpoint}`).then(handleResponse),
  add: (data) =>
    fetch(`${API_URL}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(handleResponse),
  update: (data) =>
    fetch(`${API_URL}/${endpoint}/${data.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(handleResponse),
  delete: (id) =>
    fetch(`${API_URL}/${endpoint}/${id}`, {
      method: "DELETE",
    }).then(handleResponse),
});

export const createNestedCrudService = (parentEndpoint, parentId, childEndpoint) => {
  const base_url = `${API_URL}/${parentEndpoint}/${parentId}/${childEndpoint}`;
  
  return {
    get: () => fetch(base_url).then(handleResponse),
    add: (data) =>
      fetch(base_url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then(handleResponse),
    update: (data) =>
      fetch(`${API_URL}/${childEndpoint}/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then(handleResponse),
    delete: (id) =>
      fetch(`${API_URL}/${childEndpoint}/${id}`, {
        method: "DELETE",
      }).then(handleResponse),
  };
};