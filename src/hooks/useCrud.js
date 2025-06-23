import { useState, useEffect, useCallback } from "react";

export const useCrud = (service) => {
  // --- ITT A JAVÍTÁS: A kezdeti állapot mindig egy üres tömb ---
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const updateStateWithList = (list) => {
    if (Array.isArray(list)) {
      if (list.length > 0 && list[0].date) {
        list.sort((a, b) => new Date(b.date) - new Date(a.date));
      }
      setItems(list);
    } else {
      // Ha a service nem listát ad vissza (pl. egyetlen objektumot), akkor is kezeljük
      setItems(prevItems => prevItems.map(item => item.id === list.id ? list : item));
    }
  };

  // --- ITT A JAVÍTÁS: useCallback a felesleges újrafuttatás elkerülésére ---
  const fetchItems = useCallback(async () => {
    if (!service) {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      const data = await service.get();
      // Biztosítjuk, hogy mindig tömbbel dolgozzunk
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch items:", err);
      setError(err.message);
      setItems([]); // Hiba esetén is üres tömböt állítunk be
    } finally {
      setIsLoading(false);
    }
  }, [service]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleAddItem = async (data) => {
    const newItem = await service.add(data);
    // A backend általában a létrehozott elemet adja vissza, ezt hozzáadjuk a listához
    setItems(prevItems => [newItem, ...prevItems]);
    await fetchItems(); // Vagy egyszerűen újra lekérjük a teljes listát
  };

  const handleUpdateItem = async (data) => {
    await service.update(data);
    setEditingId(null);
    await fetchItems(); // Frissítjük a listát
  };

  const handleDeleteItem = async (id) => {
    await service.delete(id);
    await fetchItems(); // Frissítjük a listát
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