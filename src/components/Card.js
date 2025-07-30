import styled from "styled-components";

export const Card = styled.div`
  background-color: rgba(31, 41, 55, 0.8);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.2);
  position: relative;
  z-index: ${(props) => (props.$isActive ? 50 : "auto")};
`;