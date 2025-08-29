import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { inventoryService } from "@/services/inventoryService";
import API_URL from "@/config";
import { Container, Title, Grid, Column } from "@/components/Layout";
import { Card } from "@/components/Card";
import {
  List,
  ListItem,
  Badge,
  ActionButtons,
  Description,
} from "@/components/ListElements";
import {
  FormContainer,
  FormGroup,
  Label,
  Input,
  PrimaryButton,
} from "@/components/FormElements";
import styled from "styled-components";
import toast from "react-hot-toast";

const QrCodeImage = styled.img`
  width: 200px;
  height: 200px;
  background-color: white;
  padding: 10px;
  border-radius: 8px;
  display: block;
  margin: 0 auto;
`;

export default function BoxDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [box, setBox] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [itemName, setItemName] = useState("");
  const [itemQuantity, setItemQuantity] = useState(1);

  const fetchBoxDetails = useCallback(async () => {
    if (router.isReady && id) {
      try {
        setIsLoading(true);
        const data = await inventoryService.getBoxById(id);
        setBox(data);
      } catch (error) {
        console.error("Failed to fetch box details:", error);
        toast.error("A doboz adatainak betöltése sikertelen.");
        setBox(null);
      } finally {
        setIsLoading(false);
      }
    }
  }, [id, router.isReady]);

  useEffect(() => {
    fetchBoxDetails();
  }, [fetchBoxDetails]);

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!itemName) {
      alert("A tárgy nevének megadása kötelező!");
      return;
    }
    try {
      await inventoryService.addItemToBox(id, {
        name: itemName,
        quantity: itemQuantity,
      });
      toast.success("Tárgy sikeresen hozzáadva!");
      setItemName("");
      setItemQuantity(1);
      fetchBoxDetails();
    } catch (error) {
      toast.error("Hiba történt a tárgy hozzáadásakor.");
      console.error(error);
    }
  };

  if (isLoading) {
    return <p style={{ textAlign: "center", padding: "40px" }}>Töltés...</p>;
  }
  if (!box) {
    return <p style={{ textAlign: "center", padding: "40px" }}>Doboz nem található.</p>;
  }

  return (
    <main style={{ padding: "32px" }}>
      <Container>
        <Title>{box.name}</Title>
        <p style={{ marginTop: "-20px", marginBottom: "32px", color: "#9ca3af" }}>
          {box.description}
        </p>
        <Grid>
          <Column $span={1}>
            <Card>
              <h2 style={{ color: "white", textAlign: "center" }}>QR Kód</h2>
              <QrCodeImage
                src={`${API_URL}/inventory/boxes/${id}/qrcode`}
                alt={`QR kód a(z) ${box.name} dobozhoz`}
              />
            </Card>
            <Card>
              <FormContainer onSubmit={handleAddItem}>
                <h2 style={{ color: "white" }}>Új tárgy hozzáadása</h2>
                <FormGroup>
                  <Label htmlFor="item-name">Tárgy neve</Label>
                  <Input
                    id="item-name"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    placeholder="pl. Porcelán tányér"
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="item-qty">Mennyiség</Label>
                  <Input
                    id="item-qty"
                    type="number"
                    min="1"
                    value={itemQuantity}
                    onChange={(e) => setItemQuantity(parseInt(e.target.value))}
                  />
                </FormGroup>
                <PrimaryButton type="submit">Tárgy hozzáadása</PrimaryButton>
              </FormContainer>
            </Card>
          </Column>
          <Column $span={2}>
            <Card>
              <h2 style={{ color: "white" }}>Doboz tartalma</h2>
              {box.items && box.items.length > 0 ? (
                <List>
                  {box.items.map((item) => (
                    <ListItem key={item.id}>
                      <Description>{item.name}</Description>
                      <ActionButtons>
                        <Badge>{item.quantity} db</Badge>
                      </ActionButtons>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <p style={{ color: "#9ca3af" }}>Ez a doboz még üres. Adj hozzá tárgyakat!</p>
              )}
            </Card>
          </Column>
        </Grid>
      </Container>
    </main>
  );
}