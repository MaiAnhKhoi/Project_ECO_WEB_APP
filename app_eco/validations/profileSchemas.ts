import * as yup from "yup";

export const updateProfileSchema = yup.object({
  name: yup.string().trim().required("Vui lòng nhập họ và tên").min(2, "Tên quá ngắn"),
  username: yup
    .string()
    .trim()
    .optional()
    .matches(/^[A-Za-z0-9_]*$/, "Username chỉ gồm chữ, số và dấu gạch dưới")
    .transform((v) => (v === "" ? undefined : v)),
  phone: yup.string().trim().default(""),
  gender: yup.mixed<"male" | "female" | "other">().oneOf(["male", "female", "other"]).optional(),
  dateOfBirth: yup
    .string()
    .trim()
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Ngày sinh theo định dạng YYYY-MM-DD")
    .optional()
    .transform((v) => (v === "" ? undefined : v)),
  avatarUrl: yup.string().trim().url("Avatar URL không hợp lệ").optional().transform((v) => (v === "" ? undefined : v)),
});

