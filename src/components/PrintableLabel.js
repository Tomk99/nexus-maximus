import styled from "styled-components";
import API_URL from "@/config";

const PrintableWrapper = styled.div`
  /* Alapértelmezetten teljesen rejtve van a képernyőn */
  display: none;

  /* Nyomtatáskor aktiválódik */
  @media print {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  }
`;

const LabelContent = styled.div`
  border: 2px dashed #333;
  padding: 20px 30px;
  text-align: center;
  background-color: #fff; /* Biztosítja, hogy ne legyen átlátszó */
`;

const BoxName = styled.h1`
  font-size: 28px;
  margin: 0 0 10px 0;
  color: #000;
  font-weight: 600;
`;

const BoxId = styled.h2`
  font-size: 20px;
  margin: 0 0 15px 0;
  color: #555;
  font-weight: 500;
`;

const QrCodePrint = styled.img`
  width: 150px;
  height: 150px;
`;

export function PrintableLabel({ box }) {
  if (!box) return null;

  return (
    <PrintableWrapper className="printable-content">
      <LabelContent>
        <BoxName>{box.name}</BoxName>
        <BoxId>Azonosító: #{box.id}</BoxId>
        <QrCodePrint
          src={`${API_URL}/inventory/boxes/${box.id}/qrcode`}
          alt={`QR kód a(z) ${box.name} dobozhoz`}
        />
      </LabelContent>
    </PrintableWrapper>
  );
}