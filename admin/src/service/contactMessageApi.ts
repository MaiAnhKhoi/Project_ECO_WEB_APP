import axiosAdmin from "./axiosAdmin";
import type {
  ContactMessageDto,
  ContactMessagePageResponse,
} from "../type/contactMessage";

export interface ContactMessageQuery {
  page?: number;
  size?: number;
  status?: string;
  keyword?: string;
}

const contactMessageApi = {
  list(params: ContactMessageQuery) {
    return axiosAdmin.get<{ success: boolean; data: ContactMessagePageResponse }>(
      "/admin/contact-messages",
      { params }
    );
  },
  getById(id: number) {
    return axiosAdmin.get<{ success: boolean; data: ContactMessageDto }>(
      `/admin/contact-messages/${id}`
    );
  },
  updateStatus(id: number, status: string, note?: string) {
    return axiosAdmin.put<{ success: boolean; data: ContactMessageDto }>(
      `/admin/contact-messages/${id}/status`,
      { status, note }
    );
  },
};

export default contactMessageApi;

