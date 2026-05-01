import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo } from "react";
import { FlatList, Pressable, RefreshControl, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Image } from "expo-image";

import "@/global.css";

import { AppIcon } from "@/components/ui/AppIcon";
import { CustomButton } from "@/components/ui/CustomButton";
import { CustomIconButton } from "@/components/ui/CustomIconButton";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useAppColors } from "@/hooks/use-app-colors";
import { useAsideStore } from "@/store/asideStore";
import { blogApi } from "@/services/blogApi";
import type { BlogResponse } from "@/types/blog";
import { navLockRun } from "@/utils/navLock";

function stripHtml(input: string) {
  return input
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export default function BlogScreen() {
  const router = useRouter();
  const colors = useAppColors();
  const openAside = useAsideStore((s) => s.openAside);
  const params = useLocalSearchParams<{ from?: string }>();

  const pageSize = 10;
  const q = useInfiniteQuery({
    queryKey: ["blogs", "all"],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => blogApi.getAllBlogs(pageParam as number, pageSize),
    getNextPageParam: (lastPage) => (lastPage.last ? undefined : lastPage.pageable.pageNumber + 1),
  });

  const items = useMemo<BlogResponse[]>(
    () => q.data?.pages.flatMap((p) => p.content) ?? [],
    [q.data]
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
      <LoadingSpinner visible={q.isFetching && items.length === 0} message="Đang tải blog…" fullscreen />

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
            Blog
          </Text>
          <View style={{ width: 40, height: 40 }} />
        </View>
      </View>

      {q.error ? (
        <View className="flex-1 px-4 pt-4">
          <View className="rounded-2xl p-4" style={{ backgroundColor: colors.surfaceMuted }}>
            <Text className="text-base font-semibold" style={{ color: colors.text }}>
              Không thể tải blog
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

      <FlatList
        data={items}
        keyExtractor={(it) => String(it.id)}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        refreshControl={
          <RefreshControl
            refreshing={q.isRefetching}
            onRefresh={() => q.refetch()}
            tintColor={colors.tint}
          />
        }
        onEndReachedThreshold={0.4}
        onEndReached={() => {
          if (q.hasNextPage && !q.isFetchingNextPage) q.fetchNextPage();
        }}
        ListHeaderComponent={
          items.length ? (
            <Text className="mt-2 text-sm" style={{ color: colors.mutedText }}>
              Khám phá những bài viết mới nhất.
            </Text>
          ) : null
        }
        ListEmptyComponent={
          !q.isFetching && !q.error ? (
            <View className="mt-6 rounded-2xl p-5" style={{ backgroundColor: colors.surfaceMuted }}>
              <Text className="text-base font-semibold" style={{ color: colors.text }}>
                Chưa có bài viết nào
              </Text>
              <Text className="mt-1 text-sm" style={{ color: colors.mutedText }}>
                Vui lòng quay lại sau.
              </Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => {
          const createdAt = item.createdAt
            ? new Date(item.createdAt).toLocaleDateString("vi-VN")
            : "";
          const excerpt = item.excerpt || stripHtml(item.content || "").slice(0, 140);
          return (
            <Pressable
              onPress={() => navLockRun(() => router.push(`/blog/${item.id}` as any))}
              className="mt-4 overflow-hidden rounded-2xl active:opacity-90"
              style={{ backgroundColor: colors.surfaceMuted, borderWidth: 1, borderColor: colors.border }}
              accessibilityRole="button"
              accessibilityLabel={`Mở bài viết ${item.title}`}
            >
              {item.featuredImage ? (
                <Image source={{ uri: item.featuredImage }} style={{ width: "100%", height: 170 }} contentFit="cover" />
              ) : null}
              <View className="p-4">
                <View className="flex-row items-center justify-between">
                  <Text className="text-xs" style={{ color: colors.mutedText }}>
                    {item.category?.name || "Blog"}
                  </Text>
                  <Text className="text-xs" style={{ color: colors.mutedText }}>
                    {createdAt}
                  </Text>
                </View>
                <Text className="mt-2 text-[16px] font-semibold" style={{ color: colors.text }}>
                  {item.title}
                </Text>
                {excerpt ? (
                  <Text className="mt-2 text-sm" style={{ color: colors.mutedText }}>
                    {excerpt}
                    {excerpt.length >= 140 ? "…" : ""}
                  </Text>
                ) : null}
                <View className="mt-3 flex-row items-center">
                  <Text className="text-sm font-semibold" style={{ color: colors.tint }}>
                    Đọc tiếp
                  </Text>
                  <View className="ml-2">
                    <AppIcon name="chevron-right" size={18} color={colors.tint} />
                  </View>
                </View>
              </View>
            </Pressable>
          );
        }}
        ListFooterComponent={
          q.isFetchingNextPage ? (
            <View className="py-6">
              <Text className="text-center text-sm" style={{ color: colors.mutedText }}>
                Đang tải thêm…
              </Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}
