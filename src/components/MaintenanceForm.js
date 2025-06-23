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
  TextArea,
  DatePickerWrapper,
  SuccessButton,
  SecondaryButton,
} from "./FormElements";

registerLocale("hu", hu);

export function MaintenanceForm({
  onAdd,
  onUpdate,
  editingMaintenance,
  onCancelEdit,
  // --- ÚJ PROPOK ---
  onCalendarOpen,
  onCalendarClose,
}) {
  const [date, setDate] = useState(new Date());
  const [odometer, setOdometer] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (editingMaintenance) {
      setDate(new Date(editingMaintenance.date));
      setOdometer(editingMaintenance.odometer || "");
      setDescription(editingMaintenance.description);
    } else {
      setDate(new Date());
      setOdometer("");
      setDescription("");
    }
  }, [editingMaintenance]);

  const formatDateForStorage = (dateObj) => {
    return dateObj.toISOString().split("T")[0];
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!date || !description) {
      alert("A dátum és a leírás kitöltése kötelező!");
      return;
    }
    const submissionData = {
      date: formatDateForStorage(date),
      odometer: odometer ? parseInt(odometer) : null,
      description,
    };
    if (editingMaintenance) {
      onUpdate({ ...submissionData, id: editingMaintenance.id });
    } else {
      onAdd(submissionData);
    }
  };

  const isEditing = !!editingMaintenance;

  return (
    <FormContainer onSubmit={handleSubmit}>
      <h2 style={{ color: "white", fontSize: "24px", fontWeight: 600 }}>
        {isEditing ? "Karbantartás szerkesztése" : "Új karbantartás"}
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
        <Label htmlFor="maint-odometer">Kilométeróra állás (opcionális)</Label>
        <Input
          type="number"
          id="maint-odometer"
          placeholder="pl. 268058"
          value={odometer}
          onChange={(e) => setOdometer(e.target.value)}
        />
      </FormGroup>
      <FormGroup>
        <Label htmlFor="maint-description">Leírás</Label>
        <TextArea
          id="maint-description"
          placeholder="pl. Olaj-, olajszűrőcsere"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </FormGroup>
      <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
        <SuccessButton type="submit">
          {isEditing ? "Módosítás mentése" : "Hozzáadás"}
        </SuccessButton>
        {isEditing && (
          <SecondaryButton type="button" onClick={onCancelEdit}>
            Mégse
          </SecondaryButton>
        )}
      </div>
    </FormContainer>
  );
}