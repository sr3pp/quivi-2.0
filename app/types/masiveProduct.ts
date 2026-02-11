export type NameId = { _id: any; name: string };

export type ProductMassiveLookups = {
  segmentIdByName: Map<string, any>;
  brandIdByName: Map<string, any>;
  categoryIdByName: Map<string, any>;
  subcategoryIdByName: Map<string, any>;
  motorIdByName: Map<string, any>;
  carModelIdByName: Map<string, any>;
  carBrandIdByName: Map<string, any>;
};
