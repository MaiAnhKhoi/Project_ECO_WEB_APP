import { httpClient } from "@/lib/httpClient";
import type { AddressRequest, AddressResponse } from "@/types/address";

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
