/** Địa chỉ giao hàng */

export interface AddressRequest {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  city: string;
  region: string;
  province?: string;  phone: string;
  isDefault: boolean;
}

export interface AddressResponse extends AddressRequest {
  id: number;
}
