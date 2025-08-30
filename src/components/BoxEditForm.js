"use client";

import { useState, useEffect } from "react";
import {
  FormContainer,
  FormGroup,
  Label,
  Input,
  TextArea,
  PrimaryButton,
  SecondaryButton,
} from "./FormElements";

export function BoxEditForm({ box, onUpdate, onCancel }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    // Amikor a 'box' prop megváltozik (mert a felhasználó egy másik szerkesztésére kattint),
    // frissítjük a form állapotát.
    if (box) {
      setName(box.name);
      setDescription(box.description || "");
    }
  }, [box]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      alert("A doboz nevének megadása kötelező!");
      return;
    }
    // Meghívjuk a szülőtől kapott onUpdate függvényt a frissített adatokkal.
    onUpdate({ id: box.id, name, description });
  };

  // Ha nincs szerkesztendő doboz, nem jelenítünk meg semmit.
  if (!box) return null;

  return (
    <FormContainer onSubmit={handleSubmit}>
      <h2 style={{ color: "white", fontSize: "24px", fontWeight: 600 }}>
        Doboz szerkesztése
      </h2>
      <FormGroup>
        <Label htmlFor="edit-box-name">Doboz neve</Label>
        <Input
          id="edit-box-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </FormGroup>
      <FormGroup>
        <Label htmlFor="edit-box-desc">Leírás (opcionális)</Label>
        <TextArea
          id="edit-box-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </FormGroup>
      <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
        <PrimaryButton type="submit">Módosítás mentése</PrimaryButton>
        <SecondaryButton type="button" onClick={onCancel}>
          Mégse
        </SecondaryButton>
      </div>
    </FormContainer>
  );
}