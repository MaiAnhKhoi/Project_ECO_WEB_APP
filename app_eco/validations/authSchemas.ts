import * as yup from "yup";

export const loginSchema = yup.object({
  email: yup.string().trim().email("Email không hợp lệ").required("Vui lòng nhập email"),
  password: yup.string().required("Vui lòng nhập mật khẩu").min(8, "Mật khẩu tối thiểu 8 ký tự"),
});

export const registerSchema = yup.object({
  name: yup.string().trim().required("Vui lòng nhập họ và tên").min(2, "Tên quá ngắn"),
  email: yup.string().trim().email("Email không hợp lệ").required("Vui lòng nhập email"),
  phone: yup.string().trim().default(""),
  password: yup.string().required("Vui lòng nhập mật khẩu").min(8, "Mật khẩu tối thiểu 8 ký tự"),
  passwordConfirm: yup
    .string()
    .required("Vui lòng xác nhận mật khẩu")
    .oneOf([yup.ref("password")], "Mật khẩu xác nhận không khớp"),
});

export const forgotPasswordSchema = yup.object({
  email: yup.string().trim().email("Email không hợp lệ").required("Vui lòng nhập email"),
});

export const verifyEmailSchema = yup.object({
  email: yup.string().trim().email("Email không hợp lệ").required("Thiếu email"),
  code: yup.string().required("Vui lòng nhập mã").matches(/^\d{6}$/, "Mã gồm 6 chữ số"),
});

export const resetPasswordSchema = yup.object({
  email: yup.string().trim().email("Email không hợp lệ").required("Thiếu email"),
  code: yup.string().required("Vui lòng nhập mã").matches(/^\d{6}$/, "Mã gồm 6 chữ số"),
  newPassword: yup.string().required("Vui lòng nhập mật khẩu mới").min(8, "Mật khẩu tối thiểu 8 ký tự"),
  newPasswordConfirm: yup
    .string()
    .required("Vui lòng xác nhận mật khẩu mới")
    .oneOf([yup.ref("newPassword")], "Mật khẩu xác nhận không khớp"),
});

