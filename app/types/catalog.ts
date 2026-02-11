export interface NamedDoc {
  _id: string;
  name: string;
}

export interface CarModelDoc extends NamedDoc {}

export interface CarBrandDoc extends NamedDoc {
  models: CarModelDoc[];
}

export interface MotorDoc extends NamedDoc {
  models: CarModelDoc[];
}
