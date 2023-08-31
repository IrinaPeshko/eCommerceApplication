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
  id?: string | undefined;
  key: string;
  country: string;
  city: string;
  postalCode: string;
  streetName: string;
  building?: string | undefined;
  apartment?: string | undefined;
}
export interface AddressData {
  countryCode: string,
  streetName: string,
  building: string,
  apartment: string,
  city: string,
  postalCode: string
}
export interface UpdateData {
  action: Actions.firstname | Actions.lastname | Actions.dateofbirth;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  email?: string;
}
export enum Actions {
  firstname = "setFirstName",
  lastname = "setLastName",
  dateofbirth = "setDateOfBirth",
  email = "changeEmail",
  address = "changeAddress",
  removeaddress = "removeAddress",
  addaddress = "addAddress"
}
export enum Countries {
  BY = "Belarus",
  DE = "Germany",
  PL = "Poland",
  GE = "Georgia",
}
export interface UpdateEmail {
  action: Actions.email;
  email: string;
}
export interface ChangeAddress {
  action: Actions.address;
  addressId: string;
  address: Address;
}
export interface RemoveAddress {
  action: Actions.removeaddress;
  addressId: string;
}
export interface AddAddress {
  action: Actions.addaddress;
  address: Address;
}
