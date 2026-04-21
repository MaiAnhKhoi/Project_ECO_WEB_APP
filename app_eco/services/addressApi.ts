import { httpClient } from "@/lib/httpClient";

export type AddressRequest = {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  city: string;
  region: string;
  province?: string;
  phone: string;
  isDefault: boolean;
};

export type AddressResponse = AddressRequest & {
  id: number;
};

export const addressApi = {
  getMyAddresses: (token: string) => httpClient.get<AddressResponse[]>("/addresses", { token }),
  createAddress: (token: string, payload: AddressRequest) =>
    httpClient.post<AddressResponse>("/addresses", payload, { token }),
  updateAddress: (token: string, id: number, payload: AddressRequest) =>
    httpClient.put<AddressResponse>(`/addresses/${id}`, payload, { token }),
  deleteAddress: (token: string, id: number) =>
    httpClient.delete(`/addresses/${id}`, { token }),
  setDefault: (token: string, id: number) =>
    httpClient.put<AddressResponse>(`/addresses/${id}/default`, undefined, { token }),
  getDefault: (token: string) =>
    httpClient.get<AddressResponse>("/addresses/default", { token }),
};

