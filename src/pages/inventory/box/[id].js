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
  ActionButton,
  Description,
} from "@/components/ListElements";
import {
  FormContainer,
  FormGroup,
  Label,
  Input,
  PrimaryButton,
  SecondaryButton,
} from "@/components/FormElements";
import styled from "styled-components";
import toast from "react-hot-toast";
import { PrintableLabel } from "@/components/PrintableLabel";

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

  const [editingItem, setEditingItem] = useState(null);
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

  const handleItemSubmit = async (e) => {
    e.preventDefault();
    if (!itemName) {
      alert("A tárgy nevének megadása kötelező!");
      return;
    }

    const itemData = { name: itemName, quantity: itemQuantity };

    try {
      if (editingItem) {
        await inventoryService.updateItem({ ...itemData, id: editingItem.id });
        toast.success("Tárgy sikeresen módosítva!");
      } else {
        await inventoryService.addItemToBox(id, itemData);
        toast.success("Tárgy sikeresen hozzáadva!");
      }
      resetFormAndState();
      fetchBoxDetails();
    } catch (error) {
      toast.error("Hiba történt a művelet során.");
      console.error(error);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm("Biztosan törlöd ezt a tárgyat?")) {
      try {
        await inventoryService.deleteItem(itemId);
        toast.success("Tárgy sikeresen törölve!");
        fetchBoxDetails();
      } catch (error) {
        toast.error("Hiba történt a törlés során.");
        console.error(error);
      }
    }
  };

  const handleStartEdit = (item) => {
    setEditingItem(item);
    setItemName(item.name);
    setItemQuantity(item.quantity);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetFormAndState = () => {
    setEditingItem(null);
    setItemName("");
    setItemQuantity(1);
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) return <p style={{ textAlign: "center", padding: "40px" }}>Töltés...</p>;
  if (!box) return <p style={{ textAlign: "center", padding: "40px" }}>Doboz nem található.</p>;

  const isEditing = !!editingItem;

  return (
    <>
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
                <h3 style={{ color: "#9ca3af", textAlign: "center", marginTop: "-10px", marginBottom: "20px" }}>
                  Azonosító: #{box.id}
                </h3>
                <QrCodeImage
                  src={`${API_URL}/inventory/boxes/${id}/qrcode`}
                  alt={`QR kód a(z) ${box.name} dobozhoz`}
                />
                <PrimaryButton onClick={handlePrint} style={{ width: '100%', marginTop: '20px' }}>
                  Matrica Nyomtatása
                </PrimaryButton>
              </Card>
              <Card>
                <FormContainer onSubmit={handleItemSubmit}>
                  <h2 style={{ color: "white" }}>
                    {isEditing ? "Tárgy szerkesztése" : "Új tárgy hozzáadása"}
                  </h2>
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
                  <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                    <PrimaryButton type="submit">
                      {isEditing ? "Módosítás mentése" : "Tárgy hozzáadása"}
                    </PrimaryButton>
                    {isEditing && (
                      <SecondaryButton type="button" onClick={resetFormAndState}>
                        Mégse
                      </SecondaryButton>
                    )}
                  </div>
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
                          <ActionButton onClick={() => handleStartEdit(item)}>
                            Szerkeszt
                          </ActionButton>
                          <ActionButton onClick={() => handleDeleteItem(item.id)}>
                            Töröl
                          </ActionButton>
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
      <PrintableLabel box={box} />
    </>
  );
}