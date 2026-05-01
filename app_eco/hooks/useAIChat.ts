import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useRef, useState } from "react";

import { sendAIChat } from "@/services/aiApi";
import type { ChatMessage, ChatResponse } from "@/types/ai";
import { AI_QUERY_KEYS } from "@/queries/aiQueries";

// ============================================================
// useAIChat
//
// Quản lý phiên chat AI: local messages + mutation gửi tin.
// Logic giống hệt web useChatSession — chỉ dùng RN state.
// ============================================================

export function useAIChat(initialSessionId?: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessionId, setSessionId] = useState<string | undefined>(initialSessionId);
  const [conversationId, setConversationId] = useState<number | undefined>();
  const [error, setError] = useState<string | null>(null);

  const sessionIdRef = useRef(sessionId);
  sessionIdRef.current = sessionId;

  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: sendAIChat,

    onMutate: (variables) => {
      setError(null);
      const userMsg: ChatMessage = {
        role: "user",
        content: variables.message,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMsg]);
    },

    onSuccess: (response: ChatResponse) => {
      setSessionId(response.sessionId);
      setConversationId(response.conversationId);

      const assistantMsg: ChatMessage = {
        role: "assistant",
        content: response.reply,
        createdAt: new Date().toISOString(),
        tokensUsed: response.tokensUsed,
      };
      setMessages((prev) => [...prev, assistantMsg]);

      qc.invalidateQueries({ queryKey: ["ai", "chat", "history"] });
    },

    onError: (e: any) => {
      const errMsg: ChatMessage = {
        role: "assistant",
        content: "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại.",
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errMsg]);
      setError(e?.message || "Không thể gửi tin nhắn");
    },
  });

  const sendMessage = useCallback(
    (message: string) => {
      if (!message.trim() || mutation.isPending) return;
      mutation.mutate({
        message: message.trim(),
        sessionId: sessionIdRef.current,
        conversationId,
      });
    },
    [mutation, conversationId]
  );

  const clearMessages = useCallback(() => {
    mutation.reset();
    setMessages([]);
    setSessionId(undefined);
    setConversationId(undefined);
    setError(null);
  }, [mutation]);

  return {
    messages,
    sendMessage,
    clearMessages,
    isLoading: mutation.isPending,
    error,
    sessionId,
    conversationId,
    lastResponse: mutation.data,
  };
}
