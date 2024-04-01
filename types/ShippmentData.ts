export interface ShippmentData {
  name: string;
  last_name: string;
  email: string;
  phone: string;
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
