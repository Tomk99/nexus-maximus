import styled from "styled-components";

export const PageWrapper = styled.main`
  min-height: 100vh;
  background-color: #111827;
  color: #e5e7eb;
  padding: 32px;
  @media (max-width: 640px) {
    padding: 16px;
  }
`;

export const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
`;

export const Title = styled.h1`
  font-size: 36px;
  font-weight: bold;
  color: white;
  margin-bottom: 32px;
`;

export const Grid = styled.div`
  display: grid;
  gap: 24px;
  grid-template-columns: 1fr;
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  @media (min-width: 1024px) {
    grid-column: span ${(props) => props.$span || 1};
  }
`;