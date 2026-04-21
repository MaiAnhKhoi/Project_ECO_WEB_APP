import * as yup from "yup";

export const contactSchema = yup.object({
  name: yup.string().trim().required("Vui lòng nhập tên của bạn"),
  email: yup
    .string()
    .trim()
    .email("Email không hợp lệ")
    .required("Vui lòng nhập email"),
  message: yup.string().trim().required("Vui lòng nhập tin nhắn"),
});

