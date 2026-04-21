import * as yup from "yup";

export const blogCommentSchema = yup.object({
  content: yup.string().trim().required("Vui lòng nhập bình luận"),
});

