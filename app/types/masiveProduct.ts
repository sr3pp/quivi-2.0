export type NameId = { _id: unknown; name: string };

export type ProductMassiveLookups = {
  segmentIdByName: Map<string, unknown>;
  brandIdByName: Map<string, unknown>;
  categoryIdByName: Map<string, unknown>;
  subcategoryIdByName: Map<string, unknown>;
  motorIdByName: Map<string, unknown>;
  carModelIdByName: Map<string, unknown>;
  carBrandIdByName: Map<string, unknown>;
};
