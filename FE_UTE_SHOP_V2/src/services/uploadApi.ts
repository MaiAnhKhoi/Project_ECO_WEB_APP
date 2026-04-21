import api from "@/config/api";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface UploadModelResponse {
  url: string;
}

const uploadApi = {
  uploadModelImage(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    return api.post<ApiResponse<UploadModelResponse>>(
      "/virtual-tryon/upload-model",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 600000, // ⬅️ THÊM DÒNG NÀY (10 phút)
      }
    );
  },

  validateModelImage(file: File, productId: number) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("productId", productId.toString());

    return api.post<ApiResponse<{ valid: boolean }>>(
      "/virtual-tryon/validate-model-image",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 600000, // 2 phút (đủ thời gian cho Replicate API polling)
      }
    );
  },
};

export default uploadApi;
