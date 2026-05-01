import { httpClient } from "@/lib/httpClient";
import type { ContactMessagePayload } from "@/types/contact";

export const contactMessageApi = {
  submit: (payload: ContactMessagePayload) =>
    httpClient.post("/contact-messages", payload),
};
