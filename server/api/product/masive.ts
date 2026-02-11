import readXlsxFile from "read-excel-file/node";
import {
  Category,
  Subcategory,
  Motor,
  CarModel,
  CarBrand,
  ProductBrand,
  Segment,
  Product as ProductModel,
} from "~~/server/Models";
import type { Product } from "~~/app/types/product";
import type { NameId, ProductMassiveLookups } from "~~/app/types/masiveProduct";

const processName = (name: string) => {
  return String(name).toLowerCase().trim();
};

const isValidCell = (v: any) =>
  v !== "-" && v !== null && v !== undefined && String(v).trim() !== "";

const splitCSV = (v: any) =>
  processName(String(v))
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

const chunk = <T>(arr: T[], size: number): T[][] => {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};

const bulkWriteBatched = async (
  model: any,
  operations: any[],
  batchSize = 1000,
) => {
  if (!operations.length) return;
  for (const batch of chunk(operations, batchSize)) {
    await model.bulkWrite(batch, { ordered: false });
  }
};

const toIdMap = (docs: NameId[]) => new Map(docs.map((d) => [d.name, d._id]));

const processRelation = async (rows: any[], model: any, idx: number) => {
  const names = Array.from(
    new Set(
      rows
        .map((row: any) => row?.[idx])
        .filter(isValidCell)
        .map((v: any) => processName(String(v))),
    ),
  );

  if (names.length) {
    const operations = names.map((name) => ({
      updateOne: {
        filter: { name },
        update: { $setOnInsert: { name } },
        upsert: true,
      },
    }));

    await bulkWriteBatched(model, operations, 2000);
  }

  return await model
    .find({ name: { $in: names } })
    .select(["_id", "name"])
    .lean();
};

const processMultipleRelations = async (
  rows: any[],
  model: any,
  idx: number,
) => {
  const names = Array.from(
    new Set(
      rows
        .map((row: any) => row?.[idx])
        .filter(isValidCell)
        .flatMap((v: any) => splitCSV(v)),
    ),
  );

  if (names.length) {
    const operations = names.map((name) => ({
      updateOne: {
        filter: { name },
        update: { $setOnInsert: { name } },
        upsert: true,
      },
    }));

    await bulkWriteBatched(model, operations, 2000);
  }

  return await model
    .find({ name: { $in: names } })
    .select(["_id", "name"])
    .lean();
};

export default defineEventHandler(async (event) => {
  const products: Product[] = [];

  const files = (await readMultipartFormData(event)) as any[];
  const file = files?.[0];
  if (!file?.data) throw new Error("Missing upload file");

  const rows = await readXlsxFile(file.data);
  // remove header row
  rows.splice(0, 1);

  const headerNames: string[] = [
    "segment",
    "car_brands",
    "models",
    "category",
    "subcategory",
    "motors",
    "years",
    "name",
    "brand",
    "sae",
    "web",
    "line",
    "price",
    "description",
    "priority",
    "thumb_1",
    "thumb_2",
    "thumb_3",
    "thumb_4",
    "extra",
    "meassure_unity",
    "discount",
  ];

  const categories = await processRelation(rows, Category, 3);
  const subcategries = await processRelation(rows, Subcategory, 4);
  const brands = await processRelation(rows, ProductBrand, 8);
  const segments = await processRelation(rows, Segment, 0);

  const motors = await processMultipleRelations(rows, Motor, 5);
  const models = await processMultipleRelations(rows, CarModel, 2);
  const carBrands = await processMultipleRelations(rows, CarBrand, 1);

  const categoryIdByName = toIdMap(categories as any);
  const subcategoryIdByName = toIdMap(subcategries as any);
  const brandIdByName = toIdMap(brands as any);
  const segmentIdByName = toIdMap(segments as any);
  const motorIdByName = toIdMap(motors as any);
  const carModelIdByName = toIdMap(models as any);
  const carBrandIdByName = toIdMap(carBrands as any);

  const lookups: ProductMassiveLookups = {
    segmentIdByName,
    brandIdByName,
    categoryIdByName,
    subcategoryIdByName,
    motorIdByName,
    carModelIdByName,
    carBrandIdByName,
  };

  const buildCarBrandModelOps = (
    row: any,
    carModelIdByName: Map<string, any>,
  ) => {
    const rawModel = row?.[2];
    const rawBrand = row?.[1];
    if (!isValidCell(rawModel)) return [];
    if (!isValidCell(rawBrand)) return [];

    const modelNames = splitCSV(rawModel);
    if (!modelNames.length) return [];

    const brandName = processName(String(rawBrand));

    const ops: any[] = [];
    for (const mn of modelNames) {
      const modelId = carModelIdByName.get(mn);
      if (!modelId) continue;
      ops.push({
        updateOne: {
          filter: { name: brandName },
          update: { $addToSet: { models: modelId } },
          upsert: true,
        },
      });
    }

    return ops;
  };

  const buildMotorModelOps = (row: any, carModelIdByName: Map<string, any>) => {
    const rawMotors = row?.[5];
    const rawModel = row?.[2];
    if (!isValidCell(rawMotors)) return [];
    if (!isValidCell(rawModel)) return [];

    const modelName = processName(String(rawModel)).trim();
    const modelId = carModelIdByName.get(modelName);
    if (!modelId) return [];

    const motorNames = splitCSV(rawMotors);
    if (!motorNames.length) return [];

    return motorNames.map((name) => ({
      updateOne: {
        filter: { name },
        update: { $addToSet: { models: modelId } },
        upsert: true,
      },
    }));
  };

  const processProduct = (
    product: any,
    row: any,
    key: string,
    index: number,
    l: ProductMassiveLookups,
  ) => {
    const cell = row?.[index];

    if (key === "segment") {
      if (!isValidCell(cell)) return;
      const id = l.segmentIdByName.get(processName(cell));
      if (id) product[key] = id;
      return;
    }

    if (key === "brand") {
      if (!isValidCell(cell)) return;
      const id = l.brandIdByName.get(processName(cell));
      if (id) product[key] = id;
      return;
    }

    if (key === "category") {
      if (!isValidCell(cell)) return;
      const id = l.categoryIdByName.get(processName(cell));
      if (id) product[key] = id;
      return;
    }

    if (key === "subcategory") {
      if (!isValidCell(cell)) return;
      const id = l.subcategoryIdByName.get(processName(cell));
      if (id) product[key] = id;
      return;
    }

    if (key === "motors") {
      if (!isValidCell(cell)) {
        product[key] = [];
        return;
      }
      const ids: any[] = [];
      for (const name of splitCSV(cell)) {
        const id = l.motorIdByName.get(name);
        if (id) ids.push(id);
      }
      product[key] = ids;
      return;
    }

    if (key === "models") {
      if (!isValidCell(cell)) {
        product[key] = [];
        return;
      }
      const ids: any[] = [];
      for (const name of splitCSV(cell)) {
        const id = l.carModelIdByName.get(name);
        if (id) ids.push(id);
      }
      product[key] = ids;
      return;
    }

    if (key === "car_brands") {
      if (!isValidCell(cell)) {
        product[key] = [];
        return;
      }
      const ids: any[] = [];
      for (const name of splitCSV(cell)) {
        const id = l.carBrandIdByName.get(name);
        if (id) ids.push(id);
      }
      product[key] = ids;
      return;
    }

    if (key === "years") {
      product[key] = String(cell ?? "")
        .split(",")
        .map((year: string) => Number(year))
        .filter((year) => !isNaN(year));
      return;
    }

    if (key === "discount") {
      product[key] = isValidCell(cell)
        ? Number(String(cell).replace("%", ""))
        : 0;
      return;
    }

    if (key.includes("thumb")) {
      if (isValidCell(cell)) product.thumbs.push(cell);
      return;
    }

    if (key === "priority") {
      product[key] = isValidCell(cell) ? Number(cell) : 99;
      return;
    }

    product[key] = cell !== null && cell !== undefined ? cell : "";
  };

  const carBrandOps: any[] = [];
  const motorOps: any[] = [];

  for (const row of rows) {
    const product: any = { thumbs: [] };

    for (let i = 0; i < headerNames.length; i++) {
      const key = headerNames[i];
      try {
        processProduct(product, row, key, i, lookups);
      } catch (error) {
        console.log(error);
      }
    }

    products.push(product);

    carBrandOps.push(...buildCarBrandModelOps(row, carModelIdByName));
    motorOps.push(...buildMotorModelOps(row, carModelIdByName));
  }

  await bulkWriteBatched(CarBrand, carBrandOps, 2000);
  await bulkWriteBatched(Motor, motorOps, 2000);

  try {
    const operations: any = products
      .filter((p: any) => p?.web)
      .map((product) => ({
        updateOne: {
          filter: { web: product.web },
          update: product,
          upsert: true,
        },
      }));

    await bulkWriteBatched(ProductModel, operations, 1000);

    return true;
  } catch (error) {
    return error;
  }
});
