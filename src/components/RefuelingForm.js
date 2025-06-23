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

export function RefuelingForm({
  onAdd,
  onUpdate,
  editingRefueling,
  onCancelEdit,
  // --- ÚJ PROPOK ---
  onCalendarOpen,
  onCalendarClose,
}) {
  const [date, setDate] = useState(new Date());
  const [odometer, setOdometer] = useState("");
  const [liters, setLiters] = useState("");

  useEffect(() => {
    if (editingRefueling) {
      setDate(new Date(editingRefueling.date));
      setOdometer(editingRefueling.odometer);
      setLiters(editingRefueling.liters);
    } else {
      setDate(new Date());
      setOdometer("");
      setLiters("");
    }
  }, [editingRefueling]);

  const formatDateForStorage = (dateObj) => {
    return dateObj.toISOString().split("T")[0];
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!date || !odometer || !liters) {
      alert("Minden mező kitöltése kötelező!");
      return;
    }
    const submissionData = {
      date: formatDateForStorage(date),
      odometer: parseInt(odometer),
      liters: parseFloat(liters),
    };
    if (editingRefueling) {
      onUpdate({ ...submissionData, id: editingRefueling.id });
    } else {
      onAdd(submissionData);
    }
  };

  const isEditing = !!editingRefueling;

  return (
    <FormContainer onSubmit={handleSubmit}>
      <h2 style={{ color: "white", fontSize: "24px", fontWeight: 600 }}>
        {isEditing ? "Tankolás szerkesztése" : "Új tankolás"}
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
            onCalendarOpen={onCalendarOpen} // <-- ITT A JAVÍTÁS
            onCalendarClose={onCalendarClose} // <-- ITT A JAVÍTÁS
          />
        </DatePickerWrapper>
      </FormGroup>
      <FormGroup>
        <Label htmlFor="odometer">Kilométeróra állás</Label>
        <Input
          type="number"
          id="odometer"
          placeholder="pl. 245010"
          value={odometer}
          onChange={(e) => setOdometer(e.target.value)}
        />
      </FormGroup>
      <FormGroup>
        <Label htmlFor="liters">Tankolt mennyiség (liter)</Label>
        <Input
          type="number"
          step="0.01"
          id="liters"
          placeholder="pl. 39.61"
          value={liters}
          onChange={(e) => setLiters(e.target.value)}
        />
      </FormGroup>
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