import api from "@/config/api";

export interface ContactMessagePayload {
  name: string;
  email: string;
  message: string;
}

const contactMessageApi = {
  submit(payload: ContactMessagePayload) {
    return api.post("/contact-messages", payload);
  },
};

export default contactMessageApi;

