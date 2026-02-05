export interface User {
  id?: string;
  _id?: string;
  email: string;
  name?: string;
  admin_level?: number;
  profile: {
    name: string;
    lastname: string;
    phone: string;
    rfc?: string;
  };
}
