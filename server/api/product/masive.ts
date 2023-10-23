import { Product } from "~/types";
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
} from "~/server/Models";

const processRelation = async (rows: any[], model: any, idx: number) => {
  const operations = rows.map((row: any) => {
    const elName = row[idx].toLowerCase();
    return {
      updateOne: {
        filter: { name: elName },
        update: { name: elName },
        upsert: true,
      },
    };
  });

  await model.bulkWrite(operations);

  return await model
    .find({
      $in: {
        name: rows.map((row: any) => {
          return { name: row[idx].toLowerCase() };
        }),
      },
    })
    .select(["_id", "name"]);
};

const processMultipleRelations = async (
  rows: any[],
  model: any,
  idx: number,
) => {
  const operations: any = [];
  rows.forEach((row: any) => {
    const elName = String(row[idx]).toLowerCase();
    const names = elName.split(",");
    names.forEach((name: string) => {
      operations.push({
        updateOne: {
          filter: { name },
          update: { name },
          upsert: true,
        },
      });
    });
  });

  await model.bulkWrite(operations);

  return await model
    .find({
      $in: {
        name: rows.map((row: any) => {
          return { name: String(row[idx]).toLowerCase() };
        }),
      },
    })
    .select(["_id", "name"]);
};

export default defineEventHandler(async (event) => {
  const products: Product[] = [];
  const files = (await readMultipartFormData(event)) as any[];
  const file = files[0];
  const rows = await readXlsxFile(file.data);
  rows.splice(0, 1)[0];

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

  //file required fields
  //no spaces and names in lowercase and with underscore
  //discount must be a number only

  const categories = await processRelation(rows, Category, 3);
  const subcategries = await processRelation(rows, Subcategory, 4);
  const brands = await processRelation(rows, ProductBrand, 8);
  const segments = await processRelation(rows, Segment, 0);

  const motors = await processMultipleRelations(rows, Motor, 5);
  const models = await processMultipleRelations(rows, CarModel, 2);
  const carBrands = await processMultipleRelations(rows, CarBrand, 1);

  rows.forEach((row: any) => {
    const product: any = {};
    product.thumbs = [];
    headerNames.forEach(async (key: string, index: number) => {
      if (key === "segment") {
        const segment: any = segments.find(
          (segment: any) => segment.name === row[index].toLowerCase(),
        );
        product[key] = segment._id;
      } else if (key === "brand") {
        const brand: any = brands.find(
          (brand: any) => brand.name === row[index].toLowerCase(),
        );
        product[key] = brand._id;
      } else if (key === "category") {
        const category: any = categories.find(
          (cat: any) => cat.name === row[index].toLowerCase(),
        );
        product[key] = category._id;
      } else if (key === "subcategory") {
        const subcategory: any = subcategries.find(
          (subcat: any) => subcat.name === row[index].toLowerCase(),
        );
        product[key] = subcategory._id;
      } else if (key === "motors") {
        const _motors: any = motors.filter((motor: any) => {
          const motorNames = String(row[index]).toLowerCase().split(",");
          return motorNames.includes(motor.name);
        });
        product[key] = _motors.map((motor: any) => motor._id);
      } else if (key === "models") {
        const _models: any = models.filter((model: any) => {
          const modelNames = String(row[index]).toLowerCase().split(",");
          return modelNames.includes(model.name);
        });
        product[key] = _models.map((model: any) => model._id);
      } else if (key === "car_brands") {
        const _carBrands: any = carBrands.filter((carBrand: any) => {
          const carBrandNames = String(row[index]).toLowerCase().split(",");
          return carBrandNames.includes(carBrand.name);
        });
        product[key] = _carBrands.map((carBrand: any) => carBrand._id);
      } else if (key === "years") {
        product[key] = String(row[index])
          .split(",")
          .map((year: string) => Number(year))
          .filter((year) => !isNaN(year));
      } else if (key === "discount") {
        product[key] =
          row[index] !== null ? Number(row[index].replace("%", "")) : 0;
      } else if (key.includes("thumb")) {
        product.thumbs.push(row[index]);
      } else if (key === "priority") {
        product[key] = row[index] !== null ? Number(row[index]) : 99;
      } else {
        product[key] = row[index] !== null ? row[index] : "";
      }
    });
    products.push(product);
  });

  try {
    const operations: any = products.map((product) => ({
      updateOne: {
        filter: { web: product.web },
        update: product,
        upsert: true,
      },
    }));

    await ProductModel.bulkWrite(operations);

    return true;
  } catch (error) {
    return error;
  }
});
