export interface User {
  _id?: string;
  email: string | { type: StringConstructor; unique: true };
  password?: string | { type: StringConstructor; bcrypt: true; select: false };
  admin_level: number | { type: NumberConstructor; default: number };
  profile: {
    name: string | { type: StringConstructor; required: true };
    lastname: string | { type: StringConstructor; required: true };
    phone: string | { type: StringConstructor; required: true };
  };
  token?: string;
  verifyPasswordSync: (password: string) => Promise<boolean>;
}
