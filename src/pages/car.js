import { useState, useEffect } from "react";
import { refuelingService } from "@/services/refuelingService";
import { maintenanceService } from "@/services/maintenanceService";
import { useCrud } from "@/hooks/useCrud";
import { ConsumptionChart } from "@/components/ConsumptionChart";
import { RefuelingForm } from "@/components/RefuelingForm";
import { MaintenanceForm } from "@/components/MaintenanceForm";
import { Card } from "@/components/Card";
import { Container, Title, Grid, Column } from "@/components/Layout";
import {
  List,
  ListItem,
  Badge,
  ActionButtons,
  ActionButton,
  DateColumn,
  Description,
} from "@/components/ListElements";
import API_URL from "@/config";
import { PrimaryButton } from "@/components/FormElements";

export default function CarPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [activeCalendar, setActiveCalendar] = useState(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const {
    items: refuelings,
    itemToEdit: refuelingToEdit,
    handleAddItem: handleAddRefueling,
    handleUpdateItem: handleUpdateRefueling,
    handleDeleteItem: handleDeleteRefueling,
    handleStartEdit: handleStartEditRefueling,
    handleCancelEdit: handleCancelEditRefueling,
  } = useCrud(refuelingService);

  const {
    items: maintenances,
    itemToEdit: maintenanceToEdit,
    handleAddItem: handleAddMaintenance,
    handleUpdateItem: handleUpdateMaintenance,
    handleDeleteItem: handleDeleteMaintenance,
    handleStartEdit: handleStartEditMaintenance,
    handleCancelEdit: handleCancelEditMaintenance,
  } = useCrud(maintenanceService);

  const handleExport = () => {
    window.location.href = `${API_URL}/car/export/csv`;
  };

  if (!isMounted) {
    return null;
  }

  return (
    <main style={{ padding: "32px" }}>
      <Container>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "32px",
          }}
        >
          <Title style={{ marginBottom: 0 }}>Autó Nyilvántartó</Title>
          <PrimaryButton
            onClick={handleExport}
            style={{
              marginLeft: "auto",
              padding: "6px",
              fontSize: "14px",
              maxWidth: "20%",
            }}
          >
            Export (CSV)
          </PrimaryButton>
        </div>

        <Grid>
          <Column $span={1}>
            <Card $isActive={activeCalendar === "refueling"}>
              <RefuelingForm
                onAdd={handleAddRefueling}
                onUpdate={handleUpdateRefueling}
                editingRefueling={refuelingToEdit}
                onCancelEdit={handleCancelEditRefueling}
                onCalendarOpen={() => setActiveCalendar("refueling")}
                onCalendarClose={() => setActiveCalendar(null)}
              />
            </Card>
            <Card $isActive={activeCalendar === "maintenance"}>
              <MaintenanceForm
                onAdd={handleAddMaintenance}
                onUpdate={handleUpdateMaintenance}
                editingMaintenance={maintenanceToEdit}
                onCancelEdit={handleCancelEditMaintenance}
                onCalendarOpen={() => setActiveCalendar("maintenance")}
                onCalendarClose={() => setActiveCalendar(null)}
              />
            </Card>
          </Column>
          <Column $span={2}>
            <Card>
              <h2
                style={{
                  color: "white",
                  fontSize: "24px",
                  fontWeight: 600,
                  marginBottom: "16px",
                }}
              >
                Fogyasztási Grafikon
              </h2>
              <div style={{ height: "450px" }}>
                <ConsumptionChart data={refuelings} />
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
                Tankolások
              </h2>
              <List>
                {refuelings.map((r) => (
                  <ListItem key={r.id}>
                    <DateColumn>
                      <p>{new Date(r.date).toLocaleDateString("hu-HU")}</p>
                      <p style={{ color: "#9ca3af" }}>{r.odometer} km</p>
                    </DateColumn>
                    <ActionButtons>
                      <Badge>{r.liters.toFixed(2)} L</Badge>
                      <ActionButton onClick={() => handleStartEditRefueling(r)}>
                        Szerkeszt
                      </ActionButton>
                      <ActionButton
                        onClick={() => {
                          if (
                            window.confirm(
                              "Biztosan törölni szeretnéd ezt a tankolást?"
                            )
                          ) {
                            handleDeleteRefueling(r.id);
                          }
                        }}
                      >
                        Töröl
                      </ActionButton>
                    </ActionButtons>
                  </ListItem>
                ))}
              </List>
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
                Karbantartások
              </h2>
              <List>
                {maintenances.map((m) => (
                  <ListItem key={m.id}>
                    <DateColumn>
                      <p>{new Date(m.date).toLocaleDateString("hu-HU")}</p>
                      {m.odometer && (
                        <p style={{ color: "#9ca3af" }}>{m.odometer} km</p>
                      )}
                    </DateColumn>
                    <Description>{m.description}</Description>
                    <ActionButtons>
                      <ActionButton
                        onClick={() => handleStartEditMaintenance(m)}
                      >
                        Szerkeszt
                      </ActionButton>
                      <ActionButton
                        onClick={() => {
                          if (
                            window.confirm(
                              "Biztosan törölni szeretnéd ezt a karbantartást?"
                            )
                          ) {
                            handleDeleteMaintenance(m.id);
                          }
                        }}
                      >
                        Töröl
                      </ActionButton>
                    </ActionButtons>
                  </ListItem>
                ))}
              </List>
            </Card>
          </Column>
        </Grid>
      </Container>
    </main>
  );
}