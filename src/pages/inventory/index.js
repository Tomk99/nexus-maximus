import { useState } from "react";
import Link from "next/link";
import { useCrud } from "@/hooks/useCrud";
import { boxService } from "@/services/inventoryService";
import { Container, Title, Grid, Column } from "@/components/Layout";
import { Card } from "@/components/Card";
import {
  FormContainer,
  FormGroup,
  Label,
  Input,
  TextArea,
  PrimaryButton,
} from "@/components/FormElements";
import styled from "styled-components";
import { Modal } from "@/components/Modal";
import { QrScanner } from "@/components/QrScanner";
import { BoxEditForm } from "@/components/BoxEditForm";
import { ActionButton, ActionButtons } from "@/components/ListElements";
import toast from "react-hot-toast";

const BoxGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
`;

const BoxCard = styled(Card)`
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const BoxLink = styled.a`
  text-decoration: none;
  color: inherit;
  display: block;
  flex-grow: 1;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
`;

const BoxContent = styled.div`
  h3 {
    margin-top: 0;
    color: white;
  }
  p {
    margin-bottom: 0;
    color: #9ca3af;
  }
`;

export default function InventoryPage() {
  const {
    items: boxes,
    handleAddItem: handleAddBox,
    handleUpdateItem: handleUpdateBox,
    handleDeleteItem: handleDeleteBox,
    isLoading,
  } = useCrud(boxService);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [editingBox, setEditingBox] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      alert("A doboz nevének megadása kötelező!");
      return;
    }
    await handleAddBox({ name, description });
    setName("");
    setDescription("");
  };

  const handleUpdateAndClose = async (boxData) => {
    await handleUpdateBox(boxData);
    setEditingBox(null);
  };

  const handleDelete = (e, boxId) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("Biztosan törlöd ezt a dobozt és a teljes tartalmát?")) {
      handleDeleteBox(boxId);
    }
  };

  return (
    <main style={{ padding: "32px" }}>
      <Container>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "32px",
          }}
        >
          <Title style={{ marginBottom: 0 }}>Leltár - Dobozok</Title>
          <PrimaryButton
            onClick={() => setShowScanner(true)}
            style={{
              padding: "8px 16px",
              fontSize: "14px",
              maxWidth: "150px",
            }}
          >
            QR Kód Beolvasása
          </PrimaryButton>
        </div>

        <Grid>
          <Column $span={1}>
            <Card>
              <FormContainer onSubmit={handleSubmit}>
                <h2
                  style={{
                    color: "white",
                    fontSize: "24px",
                    fontWeight: 600,
                  }}
                >
                  Új doboz
                </h2>
                <FormGroup>
                  <Label htmlFor="box-name">Doboz neve</Label>
                  <Input
                    id="box-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="pl. Konyhai eszközök"
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="box-desc">Leírás (opcionális)</Label>
                  <TextArea
                    id="box-desc"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="pl. Törékeny porcelánok"
                  />
                </FormGroup>
                <PrimaryButton type="submit">Hozzáadás</PrimaryButton>
              </FormContainer>
            </Card>
          </Column>

          <Column $span={2}>
            <BoxGrid>
              {isLoading && <p>Dobozok betöltése...</p>}

              {!isLoading && boxes.length === 0 && (
                <Card>
                  <p>Még nincsenek dobozok. Hozz létre egyet!</p>
                </Card>
              )}

              {boxes.map((box) => (
                <BoxCard key={box.id}>
                  <Link href={`/inventory/box/${box.id}`} passHref legacyBehavior>
                    <BoxLink>
                      <BoxContent>
                        <h3>{box.name}</h3>
                        <p>{box.description || "Nincs leírás."}</p>
                      </BoxContent>
                    </BoxLink>
                  </Link>
                  <ActionButtons
                    style={{
                      marginTop: "16px",
                      borderTop: "1px solid #374151",
                      paddingTop: "16px",
                    }}
                  >
                    <ActionButton onClick={() => setEditingBox(box)}>
                      Szerkeszt
                    </ActionButton>
                    <ActionButton onClick={(e) => handleDelete(e, box.id)}>
                      Töröl
                    </ActionButton>
                  </ActionButtons>
                </BoxCard>
              ))}
            </BoxGrid>
          </Column>
        </Grid>
      </Container>

      <Modal isOpen={showScanner} onClose={() => setShowScanner(false)}>
        <h2 style={{ textAlign: "center", color: "white" }}>QR Kód Scanner</h2>
        <p
          style={{
            textAlign: "center",
            color: "#9ca3af",
            marginTop: "-10px",
            marginBottom: "20px",
          }}
        >
          Irányítsd a kamerát a dobozra ragasztott kódra.
        </p>
        {showScanner && (
          <QrScanner
            onScanSuccess={() => setShowScanner(false)}
            onScanError={(errorMessage) => toast.error(errorMessage)}
          />
        )}
      </Modal>

      <Modal isOpen={!!editingBox} onClose={() => setEditingBox(null)}>
        <BoxEditForm
          box={editingBox}
          onUpdate={handleUpdateAndClose}
          onCancel={() => setEditingBox(null)}
        />
      </Modal>
    </main>
  );
}