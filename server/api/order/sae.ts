import { saeHelper } from "~/server/utilities";
import { saeOrder } from "~/types";

export default defineEventHandler(async (event) => {
  const { public: config } = useRuntimeConfig();
  const data = await readBody(event);

  const saeData: saeOrder = {
    calle: "test",
    codigoPostal: "08980",
    colonia: "test",
    correo: "test",
    cveCliente: "",
    estado: "",
    municipio: "",
    nombreCliente: "test",
    numExterior: "test",
    numInterior: "",
    pais: "",
    rfcCliente: "",
    telefono: "",
    calleEnvio: "test",
    codigoPostalEnvio: "test",
    coloniaEnvio: "test",
    elaboraFactura: "false",
    estadoEnvio: "test",
    formaPago: "TRN",
    importeTotal: "2000",
    impuestoTotal: "200",
    metodoPago: "PUE",
    municipioEnvio: "test",
    nombreEnvio: "test",
    numExteriorEnvio: "test",
    numInteriorEnvio: "test",
    numOrdenCompraPortal: "test",
    paisEnvio: "MEXICO",
    referenciaPago: "Compra en quivi.mx",
    registrado: "false",
    telefonoEnvio: "test",
    usoCFDI: "",
  };

  //partidas, deben contener numero de sae valido
  const partidas = data.partidas.join("|");
  //Send data to SAE
  try {
    const SAE = new saeHelper();
    await SAE.init(config.sae.url);
    const order = await SAE.sendOrder(saeData, partidas);
    return order;
  } catch (err) {
    return err;
  }
});
