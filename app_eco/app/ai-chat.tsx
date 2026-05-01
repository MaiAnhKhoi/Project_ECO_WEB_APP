import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import "@/global.css";
import { AppIcon } from "@/components/ui/AppIcon";
import { CustomButton } from "@/components/ui/CustomButton";
import { CustomIconButton } from "@/components/ui/CustomIconButton";
import { CustomInput } from "@/components/ui/CustomInput";
import { useAppColors } from "@/hooks/use-app-colors";
import { useAIChat } from "@/hooks/useAIChat";
import type { ChatMessage } from "@/types/ai";
import { navLockRun } from "@/utils/navLock";

/** Gợi ý nhanh — giống web QUICK_SUGGESTIONS */
const QUICK_SUGGESTIONS = [
  "Outfit đi biển",
  "Áo nam bán chạy",
  "Đổi trả thế nào",
  "Váy dự tiệc",
  "Sneaker nam hot",
] as const;

export default function AIChatScreen() {
  const router = useRouter();
  const colors = useAppColors();
  const { messages, sendMessage, isLoading, clearMessages } = useAIChat();

  const [input, setInput] = useState("");
  const listRef = useRef<FlatList<ChatMessage>>(null);

  // Auto-scroll xuống cuối khi có tin mới
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 80);
    }
  }, [messages.length]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");
    sendMessage(text);
  };

  const handleSuggestion = (chip: string) => {
    if (isLoading) return;
    sendMessage(chip);
  };

  const goStylist = () => navLockRun(() => router.push("/ai-stylist" as any));

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={["top"]}
    >
      {/* Header */}
      <View
        style={[
          styles.header,
          { borderBottomColor: colors.divider, backgroundColor: colors.background },
        ]}
      >
        <CustomIconButton
          onPress={() => navLockRun(() => router.back())}
          accessibilityLabel="Quay lại"
        >
          <AppIcon name="chevron-left" size={22} color={colors.text} />
        </CustomIconButton>

        <View style={styles.headerCenter}>
          <View
            style={[styles.avatarDot, { backgroundColor: colors.brandAccent }]}
          >
            <AppIcon name="zap" size={14} color="#fff" />
          </View>
          <View>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              UTE Shop AI
            </Text>
            <Text style={[styles.headerSub, { color: "#22C55E" }]}>
              • Trực tuyến
            </Text>
          </View>
        </View>

        <CustomIconButton
          onPress={() => {
            navLockRun(() => {
              clearMessages();
              listRef.current?.scrollToOffset({ offset: 0, animated: true });
            });
          }}
          accessibilityLabel="Làm mới cuộc trò chuyện"
        >
                <AppIcon name="refresh-cw" size={18} color={colors.mutedText} />
        </CustomIconButton>
      </View>

      {/* AI Stylist — một khối CTA rõ ràng, đồng bộ CustomButton */}
      <View
        style={[
          styles.stylistBar,
          {
            backgroundColor: colors.background,
            borderBottomColor: colors.divider,
          },
        ]}
      >
        <View
          style={[
            styles.stylistBarInner,
            {
              backgroundColor: colors.surfaceMuted,
              borderWidth: 1,
              borderColor: colors.border,
            },
          ]}
        >
          <View
            style={[
              styles.stylistAccent,
              { backgroundColor: colors.brandAccent },
            ]}
          />
          <View style={styles.stylistTextCol}>
            <Text style={[styles.stylistKicker, { color: colors.brandAccent }]}>
              AI Stylist
            </Text>
            <Text style={[styles.stylistLead, { color: colors.text }]}>
              Tạo 3 outfit từ sản phẩm trong shop
            </Text>
          </View>
          <View style={styles.stylistCtaWrap}>
            <CustomButton
              title="Tạo outfit"
              onPress={goStylist}
              disabled={isLoading}
              leftIcon={<AppIcon name="layers" size={16} color="#fff" />}
              style={styles.stylistCtaBtn as any}
            />
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
      >
        {/* Danh sách tin nhắn */}
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item, index) =>
            item.id ? String(item.id) : `${item.role}-${index}`
          }
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() => {
            if (messages.length <= 6) {
              listRef.current?.scrollToEnd({ animated: false });
            }
          }}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <View
                style={[
                  styles.emptyCard,
                  { backgroundColor: colors.surfaceMuted, borderColor: colors.border },
                ]}
              >
                <Text style={[styles.emptyGreeting, { color: colors.text }]}>
                  Xin chào! Tôi là UTE Shop AI 👋
                </Text>
                <Text style={[styles.emptyHint, { color: colors.mutedText }]}>
                  Tôi có thể giúp bạn tìm trang phục phù hợp, gợi ý outfit và
                  trả lời câu hỏi về shop.
                </Text>
              </View>

              {/* Quick suggestion chips */}
              <Text style={[styles.chipLabel, { color: colors.mutedText }]}>
                Thử hỏi ngay:
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipRow}
              >
                {QUICK_SUGGESTIONS.map((chip) => (
                  <Pressable
                    key={chip}
                    onPress={() => handleSuggestion(chip)}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: colors.surfaceMuted,
                        borderColor: colors.border,
                      },
                    ]}
                    className="active:opacity-70"
                  >
                    <Text style={[styles.chipText, { color: colors.text }]}>
                      {chip}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          }
          renderItem={({ item }) => <MessageBubble message={item} colors={colors} />}
        />

        {/* Typing indicator khi đang chờ AI trả lời */}
        {isLoading ? (
          <View style={styles.typingWrap}>
            <View
              style={[
                styles.typingBubble,
                { backgroundColor: colors.surfaceMuted, borderColor: colors.border },
              ]}
            >
              <Text style={[styles.typingText, { color: colors.mutedText }]}>
                AI đang soạn trả lời…
              </Text>
            </View>
          </View>
        ) : null}

        {/* Input area */}
        <View
          style={[
            styles.inputArea,
            {
              borderTopColor: colors.divider,
              backgroundColor: colors.background,
            },
          ]}
        >
          <View style={{ flex: 1 }}>
            <CustomInput
              placeholder="Nhập câu hỏi của bạn..."
              value={input}
              onChangeText={setInput}
              multiline
              numberOfLines={2}
              onSubmitEditing={handleSend}
              blurOnSubmit={false}
              style={styles.textInput as any}
            />
          </View>
          <View style={{ width: 80 }}>
            <CustomButton
              title="Gửi"
              onPress={handleSend}
              loading={isLoading}
              disabled={!input.trim() || isLoading}
              style={styles.sendBtn as any}
            />
          </View>
        </View>

        {/* Footer hint — link tới AI Stylist (web: footer-bar "Tạo outfit") */}
        <View
          style={[styles.footerBar, { backgroundColor: colors.background }]}
        >
          <Text style={[styles.footerHint, { color: colors.mutedText }]}>
            Enter để gửi
          </Text>
          <Pressable onPress={goStylist} className="active:opacity-70">
            <Text style={[styles.footerLink, { color: colors.tint }]}>
              Mở AI Stylist
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ============================================================
// MessageBubble — trái (AI) / phải (user), giống chat.tsx
// ============================================================

function MessageBubble({
  message,
  colors,
}: {
  message: ChatMessage;
  colors: ReturnType<typeof useAppColors>;
}) {
  const isUser = message.role === "user";

  return (
    <View
      style={[styles.bubbleRow, { alignItems: isUser ? "flex-end" : "flex-start" }]}
    >
      <View
        style={[
          styles.bubble,
          {
            backgroundColor: isUser ? "#111827" : colors.surfaceMuted,
            borderWidth: isUser ? 0 : 1,
            borderColor: colors.border,
            alignSelf: isUser ? "flex-end" : "flex-start",
          },
        ]}
      >
        <Text
          style={[
            styles.bubbleText,
            { color: isUser ? "#fff" : colors.text },
          ]}
        >
          {message.content}
        </Text>
        {message.createdAt ? (
          <Text
            style={[
              styles.bubbleTime,
              { color: isUser ? "#D1D5DB" : colors.mutedText },
            ]}
          >
            {new Date(message.createdAt).toLocaleTimeString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  headerCenter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatarDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  headerSub: {
    fontSize: 11,
    marginTop: 1,
  },
  stylistBar: {
    borderBottomWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  stylistBarInner: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    overflow: "hidden",
    minHeight: 56,
  },
  stylistAccent: {
    width: 4,
    alignSelf: "stretch",
  },
  stylistTextCol: {
    flex: 1,
    paddingVertical: 10,
    paddingLeft: 12,
    paddingRight: 8,
    minWidth: 0,
  },
  stylistKicker: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.3,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  stylistLead: {
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 19,
  },
  stylistCtaWrap: {
    flexShrink: 0,
    paddingRight: 10,
    paddingVertical: 8,
  },
  stylistCtaBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  messageList: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    flexGrow: 1,
  },
  emptyWrap: {
    paddingTop: 16,
  },
  emptyCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 20,
  },
  emptyGreeting: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
  },
  emptyHint: {
    fontSize: 13,
    lineHeight: 20,
  },
  chipLabel: {
    fontSize: 12,
    marginBottom: 10,
  },
  chipRow: {
    gap: 8,
    paddingRight: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 13,
  },
  typingWrap: {
    paddingHorizontal: 16,
    paddingBottom: 4,
    alignItems: "flex-start",
  },
  typingBubble: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
  },
  typingText: {
    fontSize: 13,
  },
  inputArea: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 8,
    borderTopWidth: 1,
  },
  textInput: {
    minHeight: 44,
    maxHeight: 110,
    textAlignVertical: "top",
  },
  sendBtn: {
    paddingVertical: 12,
    borderRadius: 14,
  },
  footerBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 8,
    paddingTop: 2,
  },
  footerHint: {
    fontSize: 11,
  },
  footerLink: {
    fontSize: 12,
    fontWeight: "600",
  },
  bubbleRow: {
    marginTop: 10,
  },
  bubble: {
    maxWidth: "82%",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 22,
  },
  bubbleTime: {
    fontSize: 10,
    marginTop: 4,
    textAlign: "right",
  },
});
