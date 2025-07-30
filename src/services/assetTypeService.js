import { createNestedCrudService } from "./api";

export const getAssetTypeService = (worksheetId) => {
  if (!worksheetId) return null;
  return createNestedCrudService("worksheets", worksheetId, "asset-types");
};