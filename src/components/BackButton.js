"use client";

import { useRouter } from "next/router";
import styled from "styled-components";

// Az SVG-t közvetlenül a komponensbe helyezzük a tisztább kódért
const BackIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15 18L9 12L15 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const BackButtonWrapper = styled.button`
  position: fixed;
  top: 32px;
  left: 32px;
  z-index: 100;
  
  /* Gomb stílusok resetelése */
  background: rgba(31, 41, 55, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 8px;
  border-radius: 50%;
  cursor: pointer;
  
  display: flex;
  align-items: center;
  justify-content: center;
  
  color: #e5e7eb;
  backdrop-filter: blur(5px);
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: rgba(55, 65, 81, 0.8);
  }

  @media (max-width: 640px) {
    top: 16px;
    left: 16px;
  }
`;

export function BackButton() {
  const router = useRouter();

  return (
    <BackButtonWrapper onClick={() => router.back()} aria-label="Vissza">
      <BackIcon />
    </BackButtonWrapper>
  );
}