import { httpClient } from "@/lib/httpClient";

export type ContactMessagePayload = {
  name: string;
  email: string;
  message: string;
};

export const contactMessageApi = {
  submit: (payload: ContactMessagePayload) =>
    httpClient.post("/contact-messages", payload),
};

