"use client";
import { useState } from "react";
import { Input, PrimaryButton } from "./FormElements";
import { List, ListItem, ActionButton } from "./ListElements";

export function WorksheetManager({ worksheets, onAdd, onUpdate, onDelete }) {
  const [newWorksheetName, setNewWorksheetName] = useState("");

  const handleAdd = () => {
    if (newWorksheetName.trim()) {
      onAdd({ name: newWorksheetName.trim() });
      setNewWorksheetName("");
    }
  };

  return (
    <div>
      <h2 style={{ color: "white", fontSize: "24px", marginBottom: "16px" }}>
        Munkalapok Kezelése
      </h2>
      <div style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
        <Input
          type="text"
          placeholder="Új munkalap neve..."
          value={newWorksheetName}
          onChange={(e) => setNewWorksheetName(e.target.value)}
        />
        <PrimaryButton onClick={handleAdd} style={{ flexGrow: 0 }}>
          Létrehoz
        </PrimaryButton>
      </div>
      <List>
        {worksheets.map((ws) => (
          <ListItem key={ws.id}>
            <span>{ws.name}</span>
            <ActionButton
              onClick={() => {
                const newName = prompt("Add meg a munkalap új nevét:", ws.name);
                if (newName && newName.trim()) {
                  onUpdate({ ...ws, name: newName.trim() });
                }
              }}
            >
              Átnevez
            </ActionButton>
            <ActionButton onClick={() => onDelete(ws.id)}>Töröl</ActionButton>
          </ListItem>
        ))}
      </List>
    </div>
  );
}