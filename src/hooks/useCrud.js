import { useState, useEffect, useCallback } from "react";

export const useCrud = (service) => {
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const updateStateWithList = useCallback((list) => {
    if (Array.isArray(list)) {
      if (list.length > 0 && list[0].date) {
        list.sort((a, b) => new Date(b.date) - new Date(a.date));
      }
      setItems(list);
    } else {
      console.warn("updateStateWithList did not receive an array:", list);
    }
  }, []);

  const fetchItems = useCallback(async () => {
    if (!service) {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      const data = await service.get();
      updateStateWithList(data || []);
    } catch (err) {
      console.error("Failed to fetch items:", err);
      setError(err.message);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [service, updateStateWithList]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleAddItem = async (data) => {
    const updatedList = await service.add(data);
    updateStateWithList(updatedList);
  };

  const handleUpdateItem = async (data) => {
    const updatedList = await service.update(data);
    await fetchItems();
    setEditingId(null);
  };

  const handleDeleteItem = async (id) => {
    await service.delete(id);
    await fetchItems();
  };

  const handleStartEdit = (item) => {
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  
  const handleCancelEdit = () => setEditingId(null);

  const itemToEdit = editingId ? items.find((i) => i.id === editingId) : null;

  return {
    items,
    setItems,
    itemToEdit,
    isLoading,
    error,
    handleAddItem,
    handleUpdateItem,
    handleDeleteItem,
    handleStartEdit,
    handleCancelEdit,
  };
};