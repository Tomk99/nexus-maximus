import styled, { css } from "styled-components";

export const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const ListItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
  font-size: 14px;
  border-bottom: 1px solid #374151;
  padding-bottom: 12px;
  position: relative;

  &:last-child {
    border-bottom: none;
  }

  /* --- ITT A JAVÍTÁS --- */
  /* Ha a lista elem aktív (mert a színválasztó nyitva van),
     akkor megemeljük a z-indexét, hogy a többi elem fölé kerüljön. */
  ${(props) =>
    props.$isActive &&
    css`
      z-index: 20;
    `}
`;

export const Badge = styled.span`
  font-family: monospace;
  background-color: rgba(59, 130, 246, 0.2);
  color: #93c5fd;
  font-size: 12px;
  font-weight: bold;
  padding: 4px 8px;
  border-radius: 6px;
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-shrink: 0;
`;

export const ActionButton = styled.button`
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  padding: 4px;
  border-radius: 4px;
  transition: color 0.2s, background-color 0.2s;
  &:hover {
    color: white;
    background-color: #374151;
  }
`;

export const DateColumn = styled.div`
  flex-shrink: 0;
  width: 120px;
  p {
    margin: 0;
  }
  p:first-child {
    margin-bottom: 4px;
  }
`;

export const Description = styled.p`
  flex-grow: 1;
  text-align: left;
  margin: 0;
  word-break: break-word;
`;