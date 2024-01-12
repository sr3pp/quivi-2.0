import * as soap from "soap";

export class saeHelper {
  client: any = null;
  constructor() {}

  async init(url: string) {
    this.client = await soap.createClientAsync(url);
  }

  sendOrder = async (data: any, partidas: string[]) => {
    const order = await this.client.guardarAsync({
      oc: data,
      partidas,
      BD: "1",
    });
    return order.guardarResult.mensaje;
  };

  getExistances = async (sae: string, tipo: string) => {
    this.client.ObtenerExistencias(
      {
        cveProducto: sae,
        tipoArticulo: tipo,
        BD: "1",
      },
      (err: any, { ObtenerExistenciasResult }: any) => {
        console.log("error: ", err);
        const { existencia } = ObtenerExistenciasResult;
        console.log("result: ", existencia);
        return existencia;
      },
    );
  };

  getShipping = async (sae: string) => {
    const shipping = await this.client.ObtenerMensajeriaAsync({
      pedido: sae,
      BD: "1",
    });

    return shipping[0].ObtenerMensajeriaResult;
  };
}
