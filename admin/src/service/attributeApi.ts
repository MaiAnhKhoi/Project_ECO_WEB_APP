// src/service/attributeApi.ts
import axiosAdmin from "./axiosAdmin";
import type {
  ApiResponse,
  AttributeDto,
  AttributeValueDto,
  CreateAttributeRequest,
  CreateAttributeValueRequest,
} from "../type/attribute";

const attributeApi = {
  // Lấy toàn bộ attributes + values (GET /api/admin/attributes)
  getAll() {
    return axiosAdmin.get<ApiResponse<AttributeDto[]>>("/admin/attributes");
  },

  // ✅ Lấy chi tiết 1 attribute (GET /api/admin/attributes/{id})
  getById(id: number) {
    return axiosAdmin.get<ApiResponse<AttributeDto>>(`/admin/attributes/${id}`);
  },

  // Tạo attribute mới (POST /api/admin/attributes)
  createAttribute(payload: CreateAttributeRequest) {
    return axiosAdmin.post<ApiResponse<AttributeDto>>(
      "/admin/attributes",
      payload,
    );
  },

  // Cập nhật attribute (PUT /api/admin/attributes/{id})
  updateAttribute(id: number, payload: CreateAttributeRequest) {
    return axiosAdmin.put<ApiResponse<AttributeDto>>(
      `/admin/attributes/${id}`,
      payload,
    );
  },

  // Tạo value cho attribute (POST /api/admin/attributes/{attributeId}/values)
  createValue(attributeId: number, payload: CreateAttributeValueRequest) {
    return axiosAdmin.post<ApiResponse<AttributeValueDto>>(
      `/admin/attributes/${attributeId}/values`,
      payload,
    );
  },

  // Cập nhật value (PUT /api/admin/attributes/values/{valueId})
  updateValue(valueId: number, payload: CreateAttributeValueRequest) {
    return axiosAdmin.put<ApiResponse<AttributeValueDto>>(
      `/admin/attributes/values/${valueId}`,
      payload,
    );
  },

  // Xoá attribute (DELETE /api/admin/attributes/{id})
  deleteAttribute(id: number) {
    return axiosAdmin.delete<ApiResponse<null>>(`/admin/attributes/${id}`);
  },

  // Xoá value (DELETE /api/admin/attributes/values/{valueId})
  deleteValue(valueId: number) {
    return axiosAdmin.delete<ApiResponse<null>>(
      `/admin/attributes/values/${valueId}`,
    );
  },
};

export default attributeApi;
