import * as soap from "soap";

export class saeHelper {
  client: any = null;
  qty: number = 0;
  constructor() {}

  async init(url: string) {
    this.client = await soap.createClientAsync(url);
  }

  sendOrder = async (data: any, partidas: string[]) => {
    const [order] = await this.client.guardarAsync({
      oc: data,
      partidas,
      BD: "1",
    });
    return order.guardarResult.mensaje;
  };

  getExistances = async (sae: string, tipo: string) => {
    return new Promise((resolve: any, reject: any) => {
      this.client.ObtenerExistencias(
        {
          cveProducto: sae,
          tipoArticulo: tipo,
          BD: "1",
        },
        (err: any, { ObtenerExistenciasResult }: any) => {
          if (err) reject(err);
          const { existencia } = ObtenerExistenciasResult;
          resolve(existencia);
        },
      );
    });
  };

  getShipping = async (sae: string) => {
    const shipping = await this.client.ObtenerMensajeriaAsync({
      pedido: sae,
      BD: "1",
    });

    return shipping[0].ObtenerMensajeriaResult;
  };
}
