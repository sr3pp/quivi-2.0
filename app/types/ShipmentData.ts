import type { Address } from "./Address";

export interface ShipmentData {
  name: string;
  last_name: string;
  email: string;
  phone: string;
  address: Address;
}
