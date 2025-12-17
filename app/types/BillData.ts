export interface BillData {
  name: string;
  email: string;
  phone: string;
  cfdi: string;
  rfc: string;
  regime: string;
  address: {
    street: string;
    ext_num: string;
    int_num: string;
    neighborhood: string;
    city: string;
    state: string;
    country: string;
    zip: string;
  };
}
