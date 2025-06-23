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

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
`;

const WorksheetSelector = styled.select`
  padding: 8px 12px;
  border-radius: 6px;
  background-color: #374151;
  border: 1px solid #4b5563;
  color: #f3f4f6;
  font-size: 16px;
`;

const SnapshotListItem = styled(ListItem)`
  align-items: center;
`;

const TotalValue = styled.span`
  font-weight: 600;
  color: white;
  flex-grow: 1;
  text-align: right;
  margin-right: 24px;
`;

export default function InvestmentsPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [worksheets, setWorksheets] = useState([]);
  const [activeWorksheetId, setActiveWorksheetId] = useState(null);
  const [isManagerOpen, setIsManagerOpen] = useState(false);
  const [editingColorForAssetId, setEditingColorForAssetId] = useState(null);

  useEffect(() => {
    setIsMounted(true);
    const loadedWorksheets = worksheetService.get();
    setWorksheets(loadedWorksheets);
    if (loadedWorksheets.length > 0 && !activeWorksheetId) {
      setActiveWorksheetId(loadedWorksheets[0].id);
    }
  }, [activeWorksheetId]);

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
    setItems: setAssetTypes,
    handleAddItem: handleAddAssetType,
    handleUpdateItem: handleUpdateAssetType,
  } = useCrud(activeAssetTypeService);

  const {
    items: investments,
    setItems: setInvestments,
    itemToEdit: investmentToEdit,
    handleAddItem: handleAddInvestment,
    handleUpdateItem: handleUpdateInvestment,
    handleDeleteItem: handleDeleteInvestment,
    handleStartEdit: handleStartEditInvestment,
    handleCancelEdit: handleCancelEditInvestment,
  } = useCrud(activeInvestmentService);

  const handleAddWorksheet = (data) => {
    worksheetService.add(data).then((updatedList) => {
      setWorksheets(updatedList);
      setActiveWorksheetId(updatedList[updatedList.length - 1].id);
      setIsManagerOpen(false);
    });
  };

  const handleUpdateWorksheet = (data) => {
    worksheetService.update(data).then(setWorksheets);
  };

  const handleDeleteWorksheet = (idToDelete) => {
    if (
      !window.confirm(
        'Biztosan törlöd ezt a munkalapot? A hozzá tartozó ÖSSZES adat véglegesen törlődni fog!'
      )
    )
      return;

    worksheetService.delete(idToDelete).then(() => {
      const updatedList = worksheets.filter((ws) => ws.id !== idToDelete);
      setWorksheets(updatedList);
      if (activeWorksheetId === idToDelete) {
        setActiveWorksheetId(
          updatedList.length > 0 ? updatedList[0].id : null
        );
      }
    });
  };

  const handleDeleteAssetType = (idToDelete) => {
    if (
      !window.confirm(
        'Biztosan törlöd ezt az eszközt? A hozzá tartozó összes adat véglegesen törlődni fog!'
      )
    ) {
      return;
    }
    activeAssetTypeService.delete(idToDelete).then(() => {
      activeAssetTypeService.get().then(setAssetTypes);
      activeInvestmentService.get().then(setInvestments);
    });
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
            <Column $span={1}>
              <Card $isActive={!!editingColorForAssetId}>
                <AssetManager
                  assetTypes={assetTypes}
                  onAdd={handleAddAssetType}
                  onUpdate={handleUpdateAssetType}
                  onDelete={handleDeleteAssetType}
                  editingColorForAssetId={editingColorForAssetId}
                  onToggleColorPicker={setEditingColorForAssetId}
                />
              </Card>
              <Card>
                <InvestmentForm
                  assetTypes={assetTypes}
                  onAdd={handleAddInvestment}
                  onUpdate={handleUpdateInvestment}
                  editingSnapshot={investmentToEdit}
                  onCancelEdit={handleCancelEditInvestment}
                />
              </Card>
            </Column>
            <Column $span={2}>
              <Card>
                <div style={{ height: "500px" }}>
                  <InvestmentChart
                    data={investments}
                    assetTypes={assetTypes}
                  />
                </div>
              </Card>
              <Card>
                <h2
                  style={{
                    color: "white",
                    fontSize: "24px",
                    fontWeight: 600,
                    marginBottom: "16px",
                  }}
                >
                  Napi Portfólió Adatok
                </h2>
                <List>
                  {investments.map((snapshot) => {
                    const total = snapshot.assets.reduce(
                      (sum, asset) => sum + asset.value,
                      0
                    );
                    return (
                      <SnapshotListItem key={snapshot.id}>
                        <DateColumn>
                          <p>
                            {new Date(snapshot.date).toLocaleDateString(
                              "hu-HU"
                            )}
                          </p>
                        </DateColumn>
                        <TotalValue>
                          {new Intl.NumberFormat("hu-HU").format(total)}
                        </TotalValue>
                        <ActionButtons>
                          <ActionButton
                            onClick={() => handleStartEditInvestment(snapshot)}
                          >
                            Szerkeszt
                          </ActionButton>
                          <ActionButton
                            onClick={() => {
                              if (
                                window.confirm(
                                  'Biztosan törlöd ezt a napi bejegyzést?'
                                )
                              ) {
                                handleDeleteInvestment(snapshot.id);
                              }
                            }}
                          >
                            Töröl
                          </ActionButton>
                        </ActionButtons>
                      </SnapshotListItem>
                    );
                  })}
                </List>
              </Card>
            </Column>
          </Grid>
        ) : (
          <p>
            {'Nincs megjeleníthető munkalap. Hozz létre egyet a "Munkalapok Kezelése" gombbal!'}
          </p>
        )}

        <Modal isOpen={isManagerOpen} onClose={() => setIsManagerOpen(false)}>
          <WorksheetManager
            worksheets={worksheets}
            onAdd={handleAddWorksheet}
            onUpdate={handleUpdateWorksheet}
            onDelete={handleDeleteWorksheet}
          />
        </Modal>
      </Container>
    </PageWrapper>
  );
}