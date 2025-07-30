import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";

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
    try {
      const newItem = await service.add(data);
      if (newItem) {
        updateStateWithList([newItem, ...items]);
        toast.success("Sikeresen hozzáadva!");
      }
    } catch (error) {
      toast.error("Hozzáadás sikertelen!");
      throw error;
    }
  };

  const handleUpdateItem = async (data) => {
    try {
      const updatedItem = await service.update(data);
      if (updatedItem) {
        const updatedList = items.map((item) =>
          item.id === updatedItem.id ? updatedItem : item
        );
        updateStateWithList(updatedList);
        toast.success("Sikeresen módosítva!");
      }
      setEditingId(null);
    } catch (error) {
      toast.error("Módosítás sikertelen!");
      throw error;
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await service.delete(id);
      toast.success("Sikeresen törölve!");
      await fetchItems();
    } catch (error) {
      toast.error("Törlés sikertelen!");
    }
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