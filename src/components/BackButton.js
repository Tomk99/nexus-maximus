"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styled from "styled-components";

const BackButtonWrapper = styled(Link)`
  position: fixed;
  top: 32px;
  left: 32px;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background-color: rgba(75, 85, 99, 0.5);
  border-radius: 50%;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: rgba(75, 85, 99, 0.8);
    transform: scale(1.1);
  }

  @media (max-width: 640px) {
    top: 16px;
    left: 16px;
  }
`;

const ArrowIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15 18L9 12L15 6"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export function BackButton() {
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  if (pathname === "/") {
    return null;
  }

  return (
    <BackButtonWrapper href="/">
      <ArrowIcon />
    </BackButtonWrapper>
  );
}