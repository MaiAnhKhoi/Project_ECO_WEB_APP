export interface AddressRequest {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  city: string;
  region: string;   // country
  province?: string;
  phone: string;
  isDefault: boolean;
}

export interface AddressResponse {
  id: number;
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  city: string;
  region: string;   // country
  province?: string;
  phone: string;
  isDefault: boolean;
}
