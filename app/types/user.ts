export interface User {
  [key: string]: string | number | { type: any; unique: boolean } | unknown;
  _id?: string;
  email: string | { type: StringConstructor; unique: true };
  password?: string | { type: StringConstructor; bcrypt: true; select: false };
  admin_level: number | { type: NumberConstructor; default: number };
  profile: {
    [key: string]: string | number | { type: any; unique: boolean } | unknown;
    name: string | { type: StringConstructor; required: true };
    lastname: string | { type: StringConstructor; required: true };
    phone: string | { type: StringConstructor; required: true };
  };
  save: () => Promise<void>;
}
