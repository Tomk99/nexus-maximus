"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styled from "styled-components";
import { Card } from "@/components/Card";
import { Container, Title } from "@/components/Layout";

const ModuleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
`;

const ModuleLink = styled(Link)`
  /* --- JAVÍTÁSOK --- */
  text-decoration: none; /* Eltávolítja a link aláhúzását */
  color: inherit;       /* A szöveg színe öröklődik, így nem lesz kék */
  
  display: block;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.2),
      0 8px 10px -6px rgb(0 0 0 / 0.2);
  }
`;

const ModuleTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
  color: white;
`;

const ModuleDescription = styled.p`
  font-size: 16px;
  color: #d1d5db;
  line-height: 1.6;
`;

export default function HomePage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <main style={{ padding: "32px" }}>
      <Container>
        <Title>Nexus Maximus</Title>
        <ModuleGrid>
          <ModuleLink href="/car">
            <Card style={{ height: '100%' }}>
              <ModuleTitle>🚗 Autó Nyilvántartó</ModuleTitle>
              <ModuleDescription>
                Tankolások, fogyasztás és karbantartások követése egy helyen.
              </ModuleDescription>
            </Card>
          </ModuleLink>

          <ModuleLink href="/investments">
            <Card style={{ height: '100%' }}>
              <ModuleTitle>📈 Befektetés Követő</ModuleTitle>
              <ModuleDescription>
                Portfóliód értékének vizualizálása és nyomon követése.
              </ModuleDescription>
            </Card>
          </ModuleLink>

          <ModuleLink href="/inventory">
            <Card style={{ height: '100%' }}>
              <ModuleTitle>📦 Leltár Kezelő</ModuleTitle>
              <ModuleDescription>
                Dobozok és tartalmuk nyilvántartása QR kódokkal.
              </ModuleDescription>
            </Card>
          </ModuleLink>
        </ModuleGrid>
      </Container>
    </main>
  );
}