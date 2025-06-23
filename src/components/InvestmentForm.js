"use client";

import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  FormContainer,
  FormGroup,
  Label,
  Input,
  DatePickerWrapper,
  PrimaryButton,
  SecondaryButton, // Importáljuk a másodlagos gombot
} from "./FormElements";

export function InvestmentForm({
  assetTypes,
  onAdd,
  onUpdate,
  editingSnapshot,
  onCancelEdit,
}) {
  const [date, setDate] = useState(new Date());
  const [values, setValues] = useState({});

  useEffect(() => {
    if (editingSnapshot) {
      // Szerkesztési mód: töltsük be az adatokat
      setDate(new Date(editingSnapshot.date));
      // Az értékeket egy objektumba töltjük, ahol a kulcs az asset ID
      const initialValues = {};
      editingSnapshot.assets.forEach((asset) => {
        initialValues[asset.id] = asset.value;
      });
      setValues(initialValues);
    } else {
      // Hozzáadás mód: ürítsük az űrlapot
      setDate(new Date());
      setValues({});
    }
  }, [editingSnapshot]);

  const handleValueChange = (assetId, value) => {
    setValues((prev) => ({ ...prev, [assetId]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const assetsForStorage = assetTypes.map((asset) => ({
      id: asset.id,
      name: asset.name,
      color: asset.color,
      value: values[asset.id] ? parseFloat(values[asset.id]) : 0,
    }));

    const submissionData = {
      date: date.toISOString().split("T")[0],
      assets: assetsForStorage,
    };

    if (editingSnapshot) {
      onUpdate({ ...submissionData, id: editingSnapshot.id });
    } else {
      onAdd(submissionData);
    }
  };

  const isEditing = !!editingSnapshot;

  return (
    <FormContainer onSubmit={handleSubmit}>
      <h2 style={{ color: "white", fontSize: "24px", fontWeight: 600 }}>
        {isEditing ? "Portfólió adat szerkesztése" : "Új portfólió adat"}
      </h2>
      <FormGroup>
        <Label>Dátum</Label>
        <DatePickerWrapper>
          <DatePicker
            selected={date}
            onChange={(d) => setDate(d)}
            dateFormat="yyyy. MM. dd."
            customInput={<Input />}
            popperPlacement="bottom-start"
            locale="hu"
          />
        </DatePickerWrapper>
      </FormGroup>
      {assetTypes.map((asset) => (
        <FormGroup key={asset.id}>
          <Label htmlFor={asset.id}>{asset.name}</Label>
          <Input
            type="number"
            id={asset.id}
            name={asset.id}
            value={values[asset.id] || ""}
            onChange={(e) => handleValueChange(asset.id, e.target.value)}
          />
        </FormGroup>
      ))}
      <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
        <PrimaryButton type="submit">
          {isEditing ? "Módosítás mentése" : "Hozzáadás"}
        </PrimaryButton>
        {isEditing && (
          <SecondaryButton type="button" onClick={onCancelEdit}>
            Mégse
          </SecondaryButton>
        )}
      </div>
    </FormContainer>
  );
}