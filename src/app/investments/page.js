"use client";

import { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { worksheetService } from "@/services/worksheetService";
import { getInvestmentService } from "@/services/investmentService";
import { getAssetTypeService } from "@/services/assetTypeService";
import { useCrud } from "@/hooks/useCrud";
import { InvestmentChart } from "@/components/InvestmentChart";
import { InvestmentForm } from "@/components/InvestmentForm";
import { AssetManager } from "@/components/AssetManager";
import { Card } from "@/components/Card";
import { Modal } from "@/components/Modal";
import { WorksheetManager } from "@/components/WorksheetManager";
import {
  PageWrapper,
  Container,
  Title,
  Grid,
  Column,
} from "@/components/Layout";
import { PrimaryButton } from "@/components/FormElements";
import {
  List,
  ListItem,
  ActionButton,
  ActionButtons,
  DateColumn,
} from "@/components/ListElements";

// ... a styled komponensek (Header, WorksheetSelector, stb.) változatlanok ...

export default function InvestmentsPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [activeWorksheetId, setActiveWorksheetId] = useState(null);
  const [isManagerOpen, setIsManagerOpen] = useState(false);
  const [editingColorForAssetId, setEditingColorForAssetId] = useState(null);

  // A worksheet-eket külön kezeljük, mert ez a fő vezérlő állapot
  const {
    items: worksheets,
    handleAddItem: handleAddWorksheet,
    handleUpdateItem: handleUpdateWorksheet,
    handleDeleteItem: handleDeleteWorksheetInternal,
  } = useCrud(worksheetService);

  useEffect(() => {
    setIsMounted(true);
    if (worksheets.length > 0 && !activeWorksheetId) {
      setActiveWorksheetId(worksheets[0].id);
    }
  }, [worksheets, activeWorksheetId]);

  const activeInvestmentService = useMemo(
    () =>
      activeWorksheetId ? getInvestmentService(activeWorksheetId) : null,
    [activeWorksheetId]
  );

  const activeAssetTypeService = useMemo(
    () => (activeWorksheetId ? getAssetTypeService(activeWorksheetId) : null),
    [activeWorksheetId]
  );

  const {
    items: assetTypes,
    handleAddItem: handleAddAssetType,
    handleUpdateItem: handleUpdateAssetType,
    handleDeleteItem: handleDeleteAssetType,
  } = useCrud(activeAssetTypeService);

  const {
    items: investments,
    itemToEdit: investmentToEdit,
    handleAddItem: handleAddInvestment,
    handleUpdateItem: handleUpdateInvestment,
    handleDeleteItem: handleDeleteInvestment,
    handleStartEdit: handleStartEditInvestment,
    handleCancelEdit: handleCancelEditInvestment,
  } = useCrud(activeInvestmentService);

  const handleAddWorksheetAndClose = (data) => {
    handleAddWorksheet(data);
    setIsManagerOpen(false);
  };

  const handleDeleteWorksheet = (idToDelete) => {
    if (
      !window.confirm(
        'Biztosan törlöd ezt a munkalapot? A hozzá tartozó ÖSSZES adat véglegesen törlődni fog!'
      )
    )
      return;
    
    handleDeleteWorksheetInternal(idToDelete);
    if (activeWorksheetId === idToDelete) {
      // A useCrud useEffect-je majd beállítja a következőt, ha van
      setActiveWorksheetId(null);
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <PageWrapper>
      <Container>
        <Header>
          <Title style={{ marginBottom: 0 }}>Befektetések</Title>
          {worksheets.length > 0 && (
            <WorksheetSelector
              value={activeWorksheetId || ""}
              onChange={(e) => setActiveWorksheetId(e.target.value)}
            >
              {worksheets.map((ws) => (
                <option key={ws.id} value={ws.id}>
                  {ws.name}
                </option>
              ))}
            </WorksheetSelector>
          )}
          <PrimaryButton
            onClick={() => setIsManagerOpen(true)}
            style={{ flexGrow: 0 }}
          >
            Munkalapok Kezelése
          </PrimaryButton>
        </Header>

        {activeWorksheetId ? (
          <Grid>
            {/* ... a JSX többi része változatlan ... */}
          </Grid>
        ) : (
          <p>
            {'Nincs megjeleníthető munkalap. Hozz létre egyet a "Munkalapok Kezelése" gombbal!'}
          </p>
        )}

        <Modal isOpen={isManagerOpen} onClose={() => setIsManagerOpen(false)}>
          <WorksheetManager
            worksheets={worksheets}
            onAdd={handleAddWorksheetAndClose}
            onUpdate={handleUpdateWorksheet}
            onDelete={handleDeleteWorksheet}
          />
        </Modal>
      </Container>
    </PageWrapper>
  );
}