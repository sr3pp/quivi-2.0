import { saeHelper } from "~/server/utilities";
import { saeOrder } from "~/types";

export default defineEventHandler(async (event) => {
  const { public: config } = useRuntimeConfig();
  const {
    partidas: _partidas,
    shippmentData,
    billing,
    billSw,
    total,
    user,
    order_id,
    paymentMethod,
  } = await readBody(event);

  const saeData: saeOrder = {
    calle: billing ? billing.address.street : "",
    codigoPostal: billing ? billing.address.zip : "",
    colonia: billing ? billing.address.neighborhood : "",
    correo: billing ? billing.email : "",
    cveCliente: user ? user._id : "",
    estado: billing ? billing.address.state : "",
    municipio: billing ? billing.address.city : "",
    nombreCliente: billing ? billing.name : "",
    numExterior: billing ? billing.address.ext_num : "",
    numInterior: billing ? billing.address.int_num : "",
    pais: "MEXICO",
    rfcCliente: billing ? billing.rfc : "",
    telefono: billing ? billing.phone : "",
    calleEnvio: shippmentData.address.street,
    codigoPostalEnvio: shippmentData.address.zip,
    coloniaEnvio: shippmentData.address.neighborhood,
    elaboraFactura: String(billSw),
    estadoEnvio: shippmentData.address.state,
    formaPago: paymentMethod,
    importeTotal: String(total),
    impuestoTotal: String(total * 0.16),
    metodoPago: "PUE",
    municipioEnvio: shippmentData.address.city,
    nombreEnvio: shippmentData.name,
    numExteriorEnvio: shippmentData.address.ext_num,
    numInteriorEnvio: shippmentData.address.int_num,
    numOrdenCompraPortal: order_id,
    paisEnvio: "MEXICO",
    referenciaPago: `Compra en Quivi.mx. Orden: ${order_id}`,
    registrado: user ? String(true) : String(false),
    telefonoEnvio: shippmentData.phone,
    usoCFDI: billing ? billing.cfdi : "",
  };

  //partidas, deben contener numero de sae valido
  const partidas = _partidas.join("|");

  console.log("saeData", saeData);
  console.log("partidas", partidas);

  if (process.env.NODE_ENV === "production") {
    //Send data to SAE
    try {
      const SAE = new saeHelper();
      await SAE.init(config.sae.url);
      const order = await SAE.sendOrder(saeData, partidas);
      return order;
    } catch (err) {
      return err;
    }
  }
  return String(Date.now());
});
