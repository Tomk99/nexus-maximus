import styled from "styled-components";
import DatePicker from "react-datepicker";

export const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const FormGroup = styled.div``;

export const Label = styled.label`
  display: block;
  margin-bottom: 4px;
  font-size: 14px;
  color: #d1d5db;
`;

export const Input = styled.input`
  width: 100%;
  padding: 8px 12px;
  border-radius: 6px;
  background-color: #374151;
  border: 1px solid #4b5563;
  color: #f3f4f6;
  transition: border-color 0.2s, box-shadow 0.2s;
  &:focus {
    outline: none;
    border-color: #60a5fa;
    box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.5);
  }
  &[type="number"] {
    -moz-appearance: textfield;
  }
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  min-height: 80px;
  padding: 8px 12px;
  border-radius: 6px;
  background-color: #374151;
  border: 1px solid #4b5563;
  color: #f3f4f6;
  transition: border-color 0.2s, box-shadow 0.2s;
  resize: vertical;
  &:focus {
    outline: none;
    border-color: #60a5fa;
    box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.5);
  }
`;

export const DatePickerWrapper = styled.div`
  .react-datepicker-wrapper {
    width: 180px;
  }
`;

const ButtonBase = styled.button`
  flex-grow: 1;
  color: white;
  font-weight: bold;
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s, box-shadow 0.2s;
  &:focus {
    outline: none;
  }
`;

export const PrimaryButton = styled(ButtonBase)`
  background-color: #2563eb;
  &:hover {
    background-color: #1d4ed8;
  }
  &:focus {
    box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.5);
  }
`;

export const SuccessButton = styled(ButtonBase)`
  background-color: #16a34a;
  &:hover {
    background-color: #15803d;
  }
  &:focus {
    box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.5);
  }
`;

export const SecondaryButton = styled(ButtonBase)`
  background-color: #4b5563;
  &:hover {
    background-color: #6b7280;
  }
`;