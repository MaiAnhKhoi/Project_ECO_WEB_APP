import { useLocalSearchParams, useRouter } from "expo-router";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useMemo } from "react";
import { FlatList, Pressable, RefreshControl, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Controller, useForm } from "react-hook-form";
import type * as yup from "yup";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Image } from "expo-image";

import "@/global.css";

import { AppIcon } from "@/components/ui/AppIcon";
import { CustomButton } from "@/components/ui/CustomButton";
import { CustomIconButton } from "@/components/ui/CustomIconButton";
import { CustomInput } from "@/components/ui/CustomInput";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useAppColors } from "@/hooks/use-app-colors";
import { useAsideStore } from "@/store/asideStore";
import { blogApi } from "@/services/blogApi";
import type { BlogCommentResponse } from "@/types/blog";
import { useAuthStore } from "@/store/authStore";
import { navLockRun } from "@/utils/navLock";
import { blogCommentSchema } from "@/validations/blogSchemas";

function stripHtml(input: string) {
  return input
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export default function BlogDetailScreen() {
  const router = useRouter();
  const colors = useAppColors();
  const openAside = useAsideStore((s) => s.openAside);
  const params = useLocalSearchParams<{ id?: string; from?: string }>();
  const token = useAuthStore((s) => s.accessToken);
  const user = useAuthStore((s) => s.user);
  const qc = useQueryClient();

  const id = useMemo(() => {
    const raw = params?.id;
    const n = raw ? Number(raw) : NaN;
    return Number.isFinite(n) ? n : null;
  }, [params?.id]);

  const q = useQuery({
    queryKey: ["blogDetail", id],
    enabled: !!id,
    queryFn: async () => blogApi.getBlogById(id!),
  });

  const data = q.data;
  const createdAt = data?.createdAt
    ? new Date(data.createdAt).toLocaleDateString("vi-VN")
    : "";
  const contentText = data?.content ? stripHtml(data.content) : "";

  const commentPageSize = 10;
  const commentsQ = useInfiniteQuery({
    queryKey: ["blogComments", id],
    enabled: !!id,
    initialPageParam: 0,
    queryFn: async ({ pageParam }) =>
      blogApi.getBlogComments(id!, pageParam as number, commentPageSize),
    getNextPageParam: (lastPage) =>
      lastPage.last ? undefined : lastPage.pageable.pageNumber + 1,
  });

  const comments = useMemo<BlogCommentResponse[]>(
    () => commentsQ.data?.pages.flatMap((p) => p.content) ?? [],
    [commentsQ.data]
  );

  type FormValues = yup.InferType<typeof blogCommentSchema>;
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: yupResolver(blogCommentSchema) as any,
    defaultValues: { content: "" },
    mode: "onTouched",
  });

  const addM = useMutation({
    mutationFn: async (values: FormValues) => {
      if (!token) throw new Error("Bạn cần đăng nhập để bình luận");
      return blogApi.addComment(token, id!, values.content);
    },
    onSuccess: () => {
      reset({ content: "" });
      qc.invalidateQueries({ queryKey: ["blogComments", id] });
      qc.invalidateQueries({ queryKey: ["blogDetail", id] });
    },
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
      <LoadingSpinner visible={q.isFetching} message="Đang tải bài viết…" fullscreen />

      <View className="px-4 pb-2 pt-2">
        <View className="flex-row items-center justify-between">
          <CustomIconButton
            onPress={() =>
              navLockRun(() => {
                if (params?.from === "aside") {
                  router.back();
                  setTimeout(() => openAside(), 0);
                  return;
                }
                router.back();
              })
            }
            accessibilityLabel="Trở lại"
          >
            <AppIcon name="chevron-left" size={22} color={colors.text} />
          </CustomIconButton>
          <Text className="text-[16px] font-semibold" style={{ color: colors.text }}>
            Chi tiết blog
          </Text>
          <View style={{ width: 40, height: 40 }} />
        </View>
      </View>

      {q.error ? (
        <View className="flex-1 px-4 pt-6">
          <View className="rounded-2xl p-4" style={{ backgroundColor: colors.surfaceMuted }}>
            <Text className="text-base font-semibold" style={{ color: colors.text }}>
              Không thể tải bài viết
            </Text>
            <Text className="mt-1 text-sm" style={{ color: colors.mutedText }}>
              {(q.error as any)?.message || "Vui lòng thử lại."}
            </Text>
            <View className="mt-4">
              <CustomButton title="Tải lại" onPress={() => q.refetch()} />
            </View>
          </View>
        </View>
      ) : null}

      {!q.isFetching && !q.error && !data ? (
        <View className="flex-1 px-4 pt-6">
          <View className="rounded-2xl p-4" style={{ backgroundColor: colors.surfaceMuted }}>
            <Text className="text-base font-semibold" style={{ color: colors.text }}>
              Không tìm thấy bài viết
            </Text>
            <View className="mt-4">
              <CustomButton title="Quay lại" onPress={() => navLockRun(() => router.back())} />
            </View>
          </View>
        </View>
      ) : null}

      {data ? (
        <FlatList
          data={comments}
          keyExtractor={(it) => String(it.id)}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
          refreshControl={
            <RefreshControl
              refreshing={commentsQ.isRefetching}
              onRefresh={() => commentsQ.refetch()}
              tintColor={colors.tint}
            />
          }
          onEndReachedThreshold={0.4}
          onEndReached={() => {
            if (commentsQ.hasNextPage && !commentsQ.isFetchingNextPage) {
              commentsQ.fetchNextPage();
            }
          }}
          ListHeaderComponent={
            <View>
          {data.featuredImage ? (
            <View className="mt-4 overflow-hidden rounded-2xl" style={{ backgroundColor: colors.surfaceMuted }}>
              <Image
                source={{ uri: data.featuredImage }}
                style={{ width: "100%", height: 210 }}
                contentFit="cover"
              />
            </View>
          ) : null}

          <Text className="mt-4 text-[20px] font-bold" style={{ color: colors.text }}>
            {data.title}
          </Text>

          <View className="mt-2 flex-row flex-wrap items-center">
            <Text className="text-xs" style={{ color: colors.mutedText }}>
              {createdAt ? `Ngày đăng: ${createdAt}` : " "}
            </Text>
            <Text className="mx-2 text-xs" style={{ color: colors.mutedText }}>
              •
            </Text>
            <Text className="text-xs" style={{ color: colors.mutedText }}>
              {data.category?.name ? `Chủ đề: ${data.category.name}` : " "}
            </Text>
          </View>

          {data.excerpt ? (
            <Text className="mt-4 text-sm" style={{ color: colors.mutedText }}>
              {data.excerpt}
            </Text>
          ) : null}

          <View className="mt-4 rounded-2xl p-4" style={{ backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border }}>
            <Text className="text-base font-semibold" style={{ color: colors.text }}>
              Nội dung
            </Text>
            <Text className="mt-3 text-[14px] leading-6" style={{ color: colors.text }}>
              {contentText || "Bài viết chưa có nội dung."}
            </Text>
          </View>

          <View className="mt-4 rounded-2xl p-4" style={{ backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border }}>
            <Text className="text-base font-semibold" style={{ color: colors.text }}>
              Bình luận
            </Text>
            <Text className="mt-1 text-sm" style={{ color: colors.mutedText }}>
              {typeof data.commentCount === "number"
                ? `${data.commentCount} bình luận`
                : " "}
            </Text>

            {!user ? (
              <View className="mt-4 rounded-2xl p-4" style={{ backgroundColor: colors.surfaceMuted }}>
                <Text className="text-sm" style={{ color: colors.text }}>
                  Bạn cần đăng nhập để viết bình luận.
                </Text>
                <View className="mt-3">
                  <CustomButton
                    title="Đăng nhập"
                    onPress={() =>
                      navLockRun(() =>
                        router.push({ pathname: "/auth/login", params: { next: `/blog/${id}` } } as any)
                      )
                    }
                  />
                </View>
              </View>
            ) : (
              <View className="mt-4">
                <Controller
                  control={control}
                  name="content"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <CustomInput
                      label="Viết bình luận"
                      placeholder="Nhập bình luận của bạn..."
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      error={errors.content?.message}
                      multiline
                      numberOfLines={4}
                      style={{ minHeight: 96, textAlignVertical: "top" } as any}
                    />
                  )}
                />
                {addM.error ? (
                  <Text className="mt-2 text-sm" style={{ color: colors.danger }}>
                    {(addM.error as any)?.message || "Không thể gửi bình luận"}
                  </Text>
                ) : null}
                <View className="mt-3">
                  <CustomButton
                    title={addM.isPending ? "Đang gửi..." : "Gửi bình luận"}
                    onPress={handleSubmit((v: FormValues) => addM.mutateAsync(v))}
                    loading={addM.isPending}
                  />
                </View>
              </View>
            )}
          </View>

          {commentsQ.error ? (
            <View className="mt-4 rounded-2xl p-4" style={{ backgroundColor: colors.surfaceMuted }}>
              <Text className="text-sm font-semibold" style={{ color: colors.text }}>
                Không thể tải bình luận
              </Text>
              <Text className="mt-1 text-sm" style={{ color: colors.mutedText }}>
                {(commentsQ.error as any)?.message || "Vui lòng thử lại."}
              </Text>
              <View className="mt-4">
                <CustomButton title="Tải lại bình luận" onPress={() => commentsQ.refetch()} />
              </View>
            </View>
          ) : null}

          {comments.length === 0 && !commentsQ.isFetching ? (
            <View className="mt-4 rounded-2xl p-4" style={{ backgroundColor: colors.surfaceMuted }}>
              <Text className="text-sm" style={{ color: colors.mutedText }}>
                Chưa có bình luận nào. Hãy là người đầu tiên bình luận.
              </Text>
            </View>
          ) : null}
            </View>
          }
          renderItem={({ item }) => {
            const when = item.createdAt
              ? new Date(item.createdAt).toLocaleString("vi-VN")
              : "";
            return (
              <View
                className="mt-3 rounded-2xl p-4"
                style={{ backgroundColor: colors.surfaceMuted, borderWidth: 1, borderColor: colors.border }}
              >
                <View className="flex-row items-start justify-between">
                  <View style={{ flex: 1, paddingRight: 10 }}>
                    <Text className="text-sm font-semibold" style={{ color: colors.text }}>
                      {item.userName}
                    </Text>
                    <Text className="mt-1 text-xs" style={{ color: colors.mutedText }}>
                      {when}
                    </Text>
                  </View>
                </View>
                <Text className="mt-3 text-sm leading-6" style={{ color: colors.text }}>
                  {item.content}
                </Text>
              </View>
            );
          }}
          ListFooterComponent={
            commentsQ.isFetchingNextPage ? (
              <View className="py-6">
                <Text className="text-center text-sm" style={{ color: colors.mutedText }}>
                  Đang tải thêm bình luận…
                </Text>
              </View>
            ) : null
          }
        />
      ) : null}
    </SafeAreaView>
  );
}

