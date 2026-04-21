// ===============================
//        ATTRIBUTE TYPES
// ===============================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

export interface AttributeValueDto {
  id: number;
  value: string;
  code?: string | null;        // ✅ backend có field code
  sortOrder?: number | null;

  // dùng cho màu sắc
  colorCssClass?: string | null; // "bg-danger", "bg-dark", ...
  colorHex?: string | null;      // "#ff0000"
}

export interface AttributeDto {
  id: number;
  name: string;
  code: string;                 // ví dụ: "COLOR", "SIZE"
  sortOrder?: number | null;    // ✅ backend có sortOrder
  type?: string | null;         // text / color / size ... (backend chưa có nhưng optional ok)
  values: AttributeValueDto[];
}

// Request tạo attribute
export interface CreateAttributeRequest {
  name: string;
  code: string;
  sortOrder?: number | null;    // ✅ gửi cho backend nếu bạn cho nhập
  type?: string | null;         // FE dùng, backend hiện tại sẽ ignore
}

// Request tạo value cho attribute
export interface CreateAttributeValueRequest {
  value: string;
  code?: string | null;         // ✅ backend có field code
  sortOrder?: number | null;
  colorCssClass?: string | null;
  colorHex?: string | null;
}

// Response alias cho attribute
export type AttributeListResponse = ApiResponse<AttributeDto[]>;
export type AttributeDetailResponse = ApiResponse<AttributeDto>;
export type AttributeValueResponse = ApiResponse<AttributeValueDto>;
