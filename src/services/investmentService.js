import { createNestedCrudService } from "./api";

export const getInvestmentService = (worksheetId) => {
  if (!worksheetId) return null;
  return createNestedCrudService("worksheets", worksheetId, "snapshots");
};