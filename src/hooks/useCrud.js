import { useState, useEffect } from "react";

export const useCrud = (service) => {
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const updateStateWithList = (list) => {
    if (list && list.length > 0 && list[0].date) {
      list.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    setItems(list);
  };

  useEffect(() => {
    // Csak akkor töltjük be az adatokat, ha a service létezik
    // (pl. van kiválasztott munkalap)
    if (service) {
      updateStateWithList(service.get());
    } else {
      setItems([]); // Ha nincs service, ürítjük a listát
    }
  }, [service]);

  const handleAddItem = (data) => updateStateWithList(service.add(data));
  const handleUpdateItem = (data) => {
    updateStateWithList(service.update(data));
    setEditingId(null);
  };
  const handleDeleteItem = (id) => updateStateWithList(service.delete(id));
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
    handleAddItem,
    handleUpdateItem,
    handleDeleteItem,
    handleStartEdit,
    handleCancelEdit,
  };
};