import fs from "fs";
import { join } from "pathe";
const dir = process.cwd();

const parseJsonName = (name: string) => {
  return name.replace("index", "").replace(".json", "");
};

const buildName = (url: string): string => {
  const arr = url.split("/");
  const last = arr.pop();
  return last?.includes("index") ? "home" : String(last);
};

const getNav = (url: string) => {
  const read = fs.readFileSync(url, "utf-8");
  const { navigation: nav } = JSON.parse(read);
  return nav;
};

const getData = (file: any, url: string) => {
  const stats = fs.statSync(url);
  // Skip if it's a directory, index.json, or not a JSON file
  if (stats.isDirectory() || file === "index.json" || !file.endsWith(".json")) {
    return {
      label: "",
      url: "",
      order: 0,
    };
  }

  const read = fs.readFileSync(url, "utf-8");
  const data = JSON.parse(read);
  return {
    label: data.card?.label || data.navigation?.label || data.label,
    url: url.replace(dir, "").replace("/content", "").replace(".json", ""),
    order: data.card?.order || data.order,
  };
};

export default defineEventHandler((e: any) => {
  return [
    {
      order: 0,
      label: "Home",
      url: "/",
    },
    {
      order: 2,
      label: "Catalogo",
      url: "/catalogo",
      items: [
        {
          label: "Acumuladores",
          url: "/catalogo/acumuladores",
          order: 1,
        },
        {
          label: "Filtros Sakura",
          url: "/catalogo/filtros",
          order: 2,
        },
        {
          label: "Plafones Record",
          url: "/catalogo/plafones",
          order: 3,
        },
        {
          label: "Productos Luk",
          url: "/catalogo/luk",
          order: 4,
        },
        {
          label: "Rodamientos FAG",
          url: "/catalogo/rodamientos_fag",
          order: 5,
        },
        {
          label: "Productos INA",
          url: "/catalogo/ina",
          order: 6,
        },
        {
          label: "Frenos FAG",
          url: "/catalogo/frenos_fag",
          order: 7,
        },
        {
          label: "Bases y Soportes Eagle",
          url: "/catalogo/bases_soportes_eagle",
          order: 8,
        },
      ],
    },
    {
      order: 3,
      label: "Nosotros",
      url: "/nosotros",
      items: [],
    },
    {
      order: 3,
      label: "Compra Aqui",
      highLight: true,
      url: "/tienda",
      items: [],
    },
  ];
});
