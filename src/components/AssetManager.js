"use client";

import { useState, useRef, useEffect } from "react";
import { HexColorPicker } from "react-colorful";
import styled from "styled-components";
import {
  FormGroup,
  Label,
  Input,
  SuccessButton,
} from "@/components/FormElements";
import { ActionButton, List, ListItem } from "@/components/ListElements";

const ColorPickerPopover = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 8px;
  z-index: 100;
  background-color: #1f2937;
  border: 1px solid #4b5563;
  border-radius: 8px;
  padding: 8px;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.2);
`;

export function AssetManager({
  assetTypes,
  onAdd,
  onUpdate,
  onDelete,
  editingColorForAssetId,
  onToggleColorPicker,
}) {
  const [newAssetName, setNewAssetName] = useState("");
  const popoverRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        onToggleColorPicker(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popoverRef, onToggleColorPicker]);

  const handleAdd = () => {
    if (newAssetName.trim() === "") {
      alert("Az eszköz neve nem lehet üres!");
      return;
    }
    const randomColor = `#${Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")}`;
    onAdd({ name: newAssetName.trim(), color: randomColor });
    setNewAssetName("");
  };

  return (
    <div>
      <h3 style={{ color: "white", fontSize: "20px", marginBottom: "16px" }}>
        Eszközök kezelése
      </h3>
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <Input
          type="text"
          placeholder="Új eszköz neve..."
          value={newAssetName}
          onChange={(e) => setNewAssetName(e.target.value)}
        />
        <SuccessButton onClick={handleAdd} style={{ flexGrow: 0 }}>
          Hozzáad
        </SuccessButton>
      </div>
      <List>
        {assetTypes.map((asset) => (
          <ListItem key={asset.id} $isActive={editingColorForAssetId === asset.id}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <button
                onClick={() => onToggleColorPicker(asset.id)}
                style={{
                  width: "20px",
                  height: "20px",
                  backgroundColor: asset.color,
                  borderRadius: "4px",
                  border: "1px solid rgba(255,255,255,0.2)",
                  cursor: "pointer",
                  padding: 0,
                }}
              />
              <span>{asset.name}</span>
            </div>
            <ActionButton onClick={() => onDelete(asset.id)}>
              Töröl
            </ActionButton>

            {editingColorForAssetId === asset.id && (
              <ColorPickerPopover ref={popoverRef}>
                <HexColorPicker
                  color={asset.color}
                  onChange={(newColor) => onUpdate({ ...asset, color: newColor })}
                />
              </ColorPickerPopover>
            )}
          </ListItem>
        ))}
      </List>
    </div>
  );
}