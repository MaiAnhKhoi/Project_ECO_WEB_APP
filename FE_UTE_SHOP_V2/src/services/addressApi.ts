import api from "@/config/api";
import { AddressRequest, AddressResponse } from "@/types/address";

const addressApi = {
  // Lấy danh sách địa chỉ của user
  getMyAddresses() {
    return api.get<AddressResponse[]>("/addresses");
  },

  // Thêm địa chỉ mới
  createAddress(data: AddressRequest) {
    return api.post<AddressResponse>("/addresses", data);
  },

  // Cập nhật địa chỉ
  updateAddress(id: number, data: AddressRequest) {
    return api.put<AddressResponse>(`/addresses/${id}`, data);
  },

  // Xóa địa chỉ
  deleteAddress(id: number) {
    return api.delete(`/addresses/${id}`);
  },

  // Set địa chỉ mặc định
  setDefault(id: number) {
    return api.put<AddressResponse>(`/addresses/${id}/default`);
  },
    getDefault() {
    return api.get<AddressResponse>("/addresses/default");
  },
};

export default addressApi;
