"use client";

import { useState, useEffect } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import hu from "date-fns/locale/hu";
import "react-datepicker/dist/react-datepicker.css";
import {
  FormContainer,
  FormGroup,
  Label,
  Input,
  DatePickerWrapper,
  PrimaryButton,
  SecondaryButton,
} from "./FormElements";

registerLocale("hu", hu);

export function InvestmentForm({
  assetTypes,
  onAdd,
  onUpdate,
  editingSnapshot,
  onCancelEdit,
}) {
  const [date, setDate] = useState(new Date());
  const [assetValues, setAssetValues] = useState({});

  useEffect(() => {
    if (editingSnapshot) {
      setDate(new Date(editingSnapshot.date));
      const valuesMap = editingSnapshot.assets.reduce((acc, asset) => {
        acc[asset.assetTypeId] = asset.value;
        return acc;
      }, {});
      setAssetValues(valuesMap);
    } else {
      resetForm();
    }
  }, [editingSnapshot]);

  const resetForm = () => {
    setDate(new Date());
    setAssetValues({});
  };

  const handleValueChange = (assetTypeId, value) => {
    setAssetValues((prev) => ({
      ...prev,
      [assetTypeId]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date) {
      alert("A dátum kitöltése kötelező!");
      return;
    }

    const assetsPayload = Object.entries(assetValues)
      .filter(([, value]) => value && parseFloat(value) > 0)
      .map(([assetTypeId, value]) => ({
        assetTypeId: parseInt(assetTypeId),
        value: parseFloat(value),
      }));

    const submissionData = {
      date: date.toISOString().split("T")[0],
      assets: assetsPayload,
    };

    try {
      if (editingSnapshot) {
        await onUpdate({ ...submissionData, id: editingSnapshot.id });
      } else {
        await onAdd(submissionData);
        resetForm();
      }
    } catch (error) {
      console.error("Investment submission failed:", error);
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
            onChange={(date) => setDate(date)}
            dateFormat="yyyy. MM. dd."
            customInput={<Input />}
            popperPlacement="bottom-start"
            locale="hu"
          />
        </DatePickerWrapper>
      </FormGroup>

      {assetTypes.map((asset) => (
        <FormGroup key={asset.id}>
          <Label htmlFor={`asset-${asset.id}`}>{asset.name}</Label>
          <Input
            type="number"
            step="0.01"
            id={`asset-${asset.id}`}
            placeholder="Érték"
            value={assetValues[asset.id] || ""}
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