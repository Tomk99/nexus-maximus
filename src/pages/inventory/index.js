import { useState } from "react";
import Link from "next/link";
import { useCrud } from "@/hooks/useCrud";
import { boxService } from "@/services/inventoryService";
import { Container, Title, Grid } from "@/components/Layout";
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
import toast from "react-hot-toast";

const BoxCard = styled(Card)`
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  display: block;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
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
    isLoading,
  } = useCrud(boxService);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [showScanner, setShowScanner] = useState(false);

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
          <PrimaryButton onClick={() => setShowScanner(true)}>
            QR Kód Beolvasása
          </PrimaryButton>
        </div>

        <Grid>
          <Card>
            <FormContainer onSubmit={handleSubmit}>
              <h2 style={{ color: "white", fontSize: "24px", fontWeight: 600 }}>
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

          {isLoading && <p>Dobozok betöltése...</p>}

          {!isLoading && boxes.length === 0 && (
            <Card>
              <p>Még nincsenek dobozok. Hozz létre egyet!</p>
            </Card>
          )}

          {boxes.map((box) => (
            <Link href={`/inventory/box/${box.id}`} key={box.id} passHref legacyBehavior>
              <BoxCard as="a">
                <h3>{box.name}</h3>
                <p>{box.description || "Nincs leírás."}</p>
              </BoxCard>
            </Link>
          ))}
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
    </main>
  );
}