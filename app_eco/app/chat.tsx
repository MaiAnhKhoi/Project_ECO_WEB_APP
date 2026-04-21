import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Image } from "expo-image";

import "@/global.css";

import { AppIcon } from "@/components/ui/AppIcon";
import { CustomButton } from "@/components/ui/CustomButton";
import { CustomIconButton } from "@/components/ui/CustomIconButton";
import { CustomInput } from "@/components/ui/CustomInput";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useAppColors } from "@/hooks/use-app-colors";
import { chatApi, type MessageDto } from "@/services/chatApi";
import { useAuthStore } from "@/store/authStore";
import { useChatStore } from "@/store/chatStore";
import { navLockRun } from "@/utils/navLock";

type PendingMessage = {
  tempId: string;
  threadId: number;
  senderName: string;
  contentText?: string;
  createdAt: string;
  mine: true;
  status: "sending" | "sent" | "failed";
  localImages: Array<{ uri: string }>;
};

function toUploadFile(asset: ImagePicker.ImagePickerAsset, index: number) {
  const uri = asset.uri;
  const ext = uri.split(".").pop() || "jpg";
  const type = asset.mimeType || `image/${ext === "jpg" ? "jpeg" : ext}`;
  return {
    uri,
    name: `image_${Date.now()}_${index}.${ext}`,
    type,
  };
}

export default function ChatScreen() {
  const router = useRouter();
  const colors = useAppColors();
  const token = useAuthStore((s) => s.accessToken);
  const user = useAuthStore((s) => s.user);
  const qc = useQueryClient();
  const lastReadId = useChatStore((s) => s.lastReadId);
  const setLastReadId = useChatStore((s) => s.setLastReadId);
  const setUnreadCount = useChatStore((s) => s.setUnreadCount);
  const setChatOpen = useChatStore((s) => s.setChatOpen);

  useEffect(() => {
    setChatOpen(true);
    return () => setChatOpen(false);
  }, [setChatOpen]);

  useEffect(() => {
    if (user) return;
    navLockRun(() => router.push({ pathname: "/auth/login", params: { next: "/chat" } } as any));
  }, [user, router]);

  const threadQ = useQuery({
    queryKey: ["chatThread"],
    enabled: !!token,
    queryFn: async () => chatApi.getOrCreateMyThread(token!),
  });

  const threadId = threadQ.data?.data ?? null;

  const pageSize = 50;
  const messagesQ = useInfiniteQuery({
    queryKey: ["chatMessages", threadId],
    enabled: !!token && !!threadId,
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const res = await chatApi.getMyMessages(token!, pageParam as number, pageSize);
      return res.data;
    },
    getNextPageParam: (lastPage) => {
      const n = lastPage.number ?? 0;
      const total = lastPage.totalPages ?? 1;
      return n + 1 >= total ? undefined : n + 1;
    },
  });

  const messages = useMemo<MessageDto[]>(() => {
    const raw = messagesQ.data?.pages.flatMap((p) => p.content) ?? [];
    // Dedupe theo id (pagination/refetch đôi khi trả trùng) rồi sort tăng dần
    const map = new Map<number, MessageDto>();
    for (const m of raw) {
      if (!m || typeof m.id !== "number") continue;
      map.set(m.id, m);
    }
    return Array.from(map.values()).sort((a, b) => a.id - b.id);
  }, [messagesQ.data]);

  const listRef = useRef<FlatList<MessageDto> | null>(null);
  useEffect(() => {
    if (!messages.length) return;
    const maxId = Math.max(...messages.map((m) => m.id));
    if (maxId > lastReadId) {
      setLastReadId(maxId);
      setUnreadCount(0);
      if (token) chatApi.markAllAsRead(token).catch(() => {});
    }
  }, [messages, lastReadId, setLastReadId, setUnreadCount, token]);

  const [text, setText] = useState("");
  const [picked, setPicked] = useState<Array<{ uri: string; name: string; type: string }>>([]);
  const [pending, setPending] = useState<PendingMessage[]>([]);

  const pickImages = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.85,
      allowsMultipleSelection: true,
      selectionLimit: 5,
    });
    if (res.canceled) return;
    const files = res.assets.map((a, i) => toUploadFile(a, i));
    setPicked((prev) => [...prev, ...files].slice(0, 5));
  };

  const removePicked = (idx: number) => {
    setPicked((prev) => prev.filter((_, i) => i !== idx));
  };

  const sendM = useMutation({
    mutationFn: async (input: {
      tempId: string;
      text: string;
      files: Array<{ uri: string; name: string; type: string }>;
      threadId: number;
    }) => {
      const res = await chatApi.sendMyMessage(token!, {
        text: input.text || undefined,
        files: input.files.length ? input.files : undefined,
      });
      return res;
    },
    onSuccess: async (_res, vars) => {
      setPending((prev) =>
        prev.map((p) =>
          p.tempId === vars.tempId ? { ...p, status: "sent" } : p
        )
      );
      // đồng bộ lại từ server để lấy attachments URL nếu có
      await qc.invalidateQueries({ queryKey: ["chatMessages", threadId] });
    },
    onError: (_e, vars) => {
      setPending((prev) =>
        prev.map((p) =>
          p.tempId === vars.tempId ? { ...p, status: "failed" } : p
        )
      );
    },
  });

  const combined = useMemo<(MessageDto | (PendingMessage & { id: number }))[]>(() => {
    // Hook phải luôn chạy theo thứ tự; user có thể null trong render đầu.
    const userId = user?.id ?? -999999;
    const pendingAsMsg = pending.map((p, idx) => ({
      ...p,
      id: -1 - idx,
      read: true,
      attachments: [],
      senderId: userId,
    })) as any[];
    return [...messages, ...pendingAsMsg].sort(
      (a: any, b: any) => (a.id ?? 0) - (b.id ?? 0)
    );
  }, [messages, pending, user?.id]);

  const onSend = () => {
    const t = text.trim();
    if (!t && picked.length === 0) return;
    if (!threadId) return;

    const tempId = `${Date.now()}_${Math.random().toString(16).slice(2)}`;
    const now = new Date().toISOString();

    const localImages = picked.map((p) => ({ uri: p.uri }));

    setPending((prev) => [
      ...prev,
      {
        tempId,
        threadId,
        senderName: user?.name ?? "Bạn",
        contentText: t || undefined,
        createdAt: now,
        mine: true,
        status: "sending",
        localImages,
      },
    ]);

    setText("");
    setPicked([]);

    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 30);

    sendM.mutate({ tempId, text: t, files: picked, threadId });
  };

  if (!user) return null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
      <LoadingSpinner
        visible={threadQ.isFetching || (messagesQ.isFetching && combined.length === 0)}
        message="Đang tải…"
        fullscreen
      />

      <View className="px-4 pb-2 pt-2">
        <View className="flex-row items-center justify-between">
          <CustomIconButton
            onPress={() => navLockRun(() => router.back())}
            accessibilityLabel="Trở lại"
          >
            <AppIcon name="chevron-left" size={22} color={colors.text} />
          </CustomIconButton>
          <Text className="text-[16px] font-semibold" style={{ color: colors.text }}>
            Hỗ trợ khách hàng
          </Text>
          <View style={{ width: 40, height: 40 }} />
        </View>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}>
        <FlatList
          ref={(r) => {
            listRef.current = r;
          }}
          data={combined as any}
          keyExtractor={(it: any) => String(it.tempId ?? it.id)}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 12 }}
          refreshControl={
            <RefreshControl refreshing={messagesQ.isRefetching} onRefresh={() => messagesQ.refetch()} tintColor={colors.tint} />
          }
          onEndReachedThreshold={0.3}
          onEndReached={() => {
            // tải trang tiếp theo (tin cũ hơn)
            if (messagesQ.hasNextPage && !messagesQ.isFetchingNextPage) messagesQ.fetchNextPage();
          }}
          onContentSizeChange={() => {
            // auto scroll lần đầu
            if (messages.length <= 8) {
              setTimeout(() => listRef.current?.scrollToEnd({ animated: false }), 20);
            }
          }}
          ListEmptyComponent={
            !messagesQ.isFetching ? (
              <View className="mt-6 rounded-2xl p-4" style={{ backgroundColor: colors.surfaceMuted }}>
                <Text className="text-sm" style={{ color: colors.mutedText }}>
                  Chưa có tin nhắn. Hãy gửi câu hỏi đầu tiên của bạn.
                </Text>
              </View>
            ) : null
          }
          renderItem={({ item }) => {
            const isPending = "tempId" in (item as any);
            const isMine = (item as any).mine;
            const pendingStatus = isPending ? (item as any).status : null;
            const localImages = isPending ? ((item as any).localImages as Array<{ uri: string }>) : [];
            const serverAttachments = !isPending ? ((item as any).attachments as any[]) : [];
            return (
              <View className="mt-3" style={{ alignItems: isMine ? "flex-end" : "flex-start" }}>
                <View
                  className="rounded-2xl px-4 py-3"
                  style={{
                    maxWidth: "82%",
                    backgroundColor: isMine ? "#111827" : colors.surfaceMuted,
                    borderWidth: isMine ? 0 : 1,
                    borderColor: colors.border,
                  }}
                >
                  <Text className="text-xs font-semibold" style={{ color: isMine ? "#E5E7EB" : colors.mutedText }}>
                    {item.senderName}
                  </Text>
                  {item.contentText ? (
                    <Text className="mt-2 text-sm leading-6" style={{ color: isMine ? "#fff" : colors.text }}>
                      {item.contentText}
                    </Text>
                  ) : null}
                  {/* Ảnh đính kèm từ server */}
                  {serverAttachments?.length ? (
                    <View className="mt-3 flex-row flex-wrap gap-2">
                      {serverAttachments
                        .filter((a) => String(a.mimeType || "").startsWith("image/") && a.url)
                        .slice(0, 6)
                        .map((a) => (
                          <View
                            key={String(a.id)}
                            style={{
                              width: 92,
                              height: 92,
                              borderRadius: 14,
                              overflow: "hidden",
                              borderWidth: 1,
                              borderColor: isMine ? "rgba(255,255,255,0.22)" : colors.border,
                            }}
                          >
                            <Image source={{ uri: a.url }} style={{ width: "100%", height: "100%" }} contentFit="cover" />
                          </View>
                        ))}
                    </View>
                  ) : null}
                  {/* Ảnh local khi đang gửi */}
                  {localImages?.length ? (
                    <View className="mt-3 flex-row flex-wrap gap-2">
                      {localImages.slice(0, 6).map((a, idx) => (
                        <View
                          key={`${a.uri}-${idx}`}
                          style={{
                            width: 92,
                            height: 92,
                            borderRadius: 14,
                            overflow: "hidden",
                            borderWidth: 1,
                            borderColor: "rgba(255,255,255,0.22)",
                          }}
                        >
                          <Image source={{ uri: a.uri }} style={{ width: "100%", height: "100%" }} contentFit="cover" />
                        </View>
                      ))}
                    </View>
                  ) : null}
                  <Text className="mt-2 text-[11px]" style={{ color: isMine ? "#D1D5DB" : colors.mutedText, textAlign: "right" }}>
                    {item.createdAt ? new Date(item.createdAt).toLocaleString("vi-VN") : ""}{" "}
                    {isPending ? (pendingStatus === "sending" ? "• Đang gửi" : pendingStatus === "sent" ? "• Đã gửi" : "• Gửi lỗi") : ""}
                  </Text>
                </View>
              </View>
            );
          }}
        />

        <View className="px-4 pb-4 pt-2" style={{ borderTopWidth: 1, borderColor: colors.divider, backgroundColor: colors.background }}>
          {picked.length ? (
            <View className="mb-3">
              <Text className="mb-2 text-xs" style={{ color: colors.mutedText }}>
                Đã chọn {picked.length} ảnh
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {picked.map((f, idx) => (
                  <View
                    key={`${f.uri}-${idx}`}
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: 14,
                      overflow: "hidden",
                      borderWidth: 1,
                      borderColor: colors.border,
                      backgroundColor: colors.surfaceMuted,
                    }}
                  >
                    <Image source={{ uri: f.uri }} style={{ width: "100%", height: "100%" }} contentFit="cover" />
                    <View style={{ position: "absolute", top: 6, right: 6 }}>
                      <CustomIconButton
                        onPress={() => navLockRun(() => removePicked(idx))}
                        accessibilityLabel="Xoá ảnh đã chọn"
                        size={22}
                        style={{ backgroundColor: "rgba(0,0,0,0.65)" }}
                      >
                        <AppIcon name="x" size={12} color="#fff" />
                      </CustomIconButton>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ) : null}
          <View className="flex-row items-end gap-2">
            <CustomIconButton
              onPress={() => navLockRun(pickImages)}
              accessibilityLabel="Chọn ảnh"
              size={44}
              style={{
                backgroundColor: colors.surfaceMuted,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <AppIcon name="plus" size={20} color={colors.text} />
            </CustomIconButton>
            <View style={{ flex: 1 }}>
              <CustomInput
                placeholder="Nhập nội dung ..."
                value={text}
                onChangeText={setText}
                multiline
                numberOfLines={2}
                style={{ minHeight: 44, maxHeight: 110, textAlignVertical: "top" } as any}
              />
            </View>
            <View style={{ width: 110 }}>
              <CustomButton
                title="Gửi"
                onPress={() => navLockRun(onSend)}
                loading={false}
                disabled={!text.trim() && picked.length === 0}
                style={{ paddingVertical: 12, borderRadius: 14 } as any}
              />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

