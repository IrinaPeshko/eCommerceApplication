export enum FieldTypes {
  Text = "text",
  Password = "password",
  Email = "email",
  Date = "date",
}
export type Obj = Record<string, string>;

export interface BadRequest {
  body: object;
  headers: object;
  originalRequest: object;
  code: number;
  statusCode: number;
  status: number;
  message: string;
  name: string;
}
export interface Address {
  key: string;
  country: string;
  city: string;
  postalCode: string;
  streetName: string;
  building?: string;
  apartment?: string;
}
