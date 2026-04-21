import * as yup from "yup";

export const addressSchema = yup.object({
  firstName: yup.string().trim().required("Vui lòng nhập họ"),
  lastName: yup.string().trim().required("Vui lòng nhập tên"),
  company: yup.string().trim().optional().transform((v) => (v === "" ? undefined : v)),
  address1: yup.string().trim().required("Vui lòng nhập địa chỉ"),
  city: yup.string().trim().required("Vui lòng nhập thành phố/quận/huyện"),
  province: yup.string().trim().optional().transform((v) => (v === "" ? undefined : v)),
  region: yup.string().trim().required("Vui lòng nhập quốc gia/khu vực"),
  phone: yup.string().trim().required("Vui lòng nhập số điện thoại"),
  isDefault: yup.boolean().required(),
});

