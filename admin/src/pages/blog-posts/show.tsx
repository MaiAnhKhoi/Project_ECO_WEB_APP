import { DateField, MarkdownField, Show, TextField } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography, Image } from "antd";

const { Title } = Typography;

export const BlogPostShow = () => {
  const {
    query: { data, isLoading },
  } = useShow({
    resource: "blog_posts",
  });

  const blogPost = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Title level={5}>{"ID"}</Title>
      <TextField value={blogPost?.id} />

      <Title level={5}>{"Title"}</Title>
      <TextField value={blogPost?.title} />

      <Title level={5}>{"Slug"}</Title>
      <TextField value={blogPost?.slug} />

      <Title level={5}>{"Content"}</Title>
      <MarkdownField value={blogPost?.content} />

      <Title level={5}>{"Excerpt"}</Title>
      <TextField value={blogPost?.excerpt || "-"} />

      <Title level={5}>{"Featured Image"}</Title>
      {blogPost?.featuredImage ? (
        <Image src={blogPost.featuredImage} width={300} />
      ) : (
        <TextField value="(No image)" />
      )}

      <Title level={5}>{"Category"}</Title>
      <TextField value={blogPost?.category?.name || "-"} />

      <Title level={5}>{"Tags"}</Title>
      <TextField value={blogPost?.tags || "-"} />

      <Title level={5}>{"Status"}</Title>
      <TextField value={blogPost?.status} />

      <Title level={5}>{"View Count"}</Title>
      <TextField value={blogPost?.viewCount || 0} />

      <Title level={5}>{"Comment Count"}</Title>
      <TextField value={blogPost?.commentCount || 0} />

      <Title level={5}>{"Created At"}</Title>
      <DateField value={blogPost?.createdAt} />

      <Title level={5}>{"Updated At"}</Title>
      <DateField value={blogPost?.updatedAt} />

      <Title level={5}>{"Published At"}</Title>
      <DateField value={blogPost?.publishedAt} />
    </Show>
  );
};
