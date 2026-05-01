import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useRef, useState } from "react";
import { fetchConversation, fetchChatHistory, sendChatMessage } from "../api/aiApi";
import type { ChatMessage, ChatResponse } from "../types";

export const AI_CHAT_KEYS = {
  history: (page: number) => ["ai", "chat", "history", page] as const,
  conversation: (id: number) => ["ai", "chat", "conversation", id] as const,
};

// -----------------------------------------------------------------
// useChatSession — manages local messages + mutation
// -----------------------------------------------------------------
export function useChatSession(sessionId?: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | undefined>(sessionId);
  const [conversationId, setConversationId] = useState<number | undefined>();
  const queryClient = useQueryClient();
  const sessionIdRef = useRef(currentSessionId);
  sessionIdRef.current = currentSessionId;

  const mutation = useMutation({
    mutationFn: sendChatMessage,
    onMutate: (variables) => {
      const userMsg: ChatMessage = {
        role: "user",
        content: variables.message,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMsg]);
    },
    onSuccess: (response: ChatResponse) => {
      setCurrentSessionId(response.sessionId);
      setConversationId(response.conversationId);

      const assistantMsg: ChatMessage = {
        role: "assistant",
        content: response.reply,
        createdAt: new Date().toISOString(),
        tokensUsed: response.tokensUsed,
      };
      setMessages((prev) => [...prev, assistantMsg]);

      queryClient.invalidateQueries({ queryKey: ["ai", "chat", "history"] });
    },
    onError: () => {
      const errMsg: ChatMessage = {
        role: "assistant",
        content: "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại.",
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errMsg]);
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
    setMessages([]);
    setCurrentSessionId(undefined);
    setConversationId(undefined);
  }, []);

  return {
    messages,
    sendMessage,
    clearMessages,
    isLoading: mutation.isPending,
    error: mutation.error,
    sessionId: currentSessionId,
    conversationId,
    lastResponse: mutation.data,
  };
}

// -----------------------------------------------------------------
// useChatHistory — paginated history list
// -----------------------------------------------------------------
export function useChatHistory(page = 0, enabled = true) {
  return useQuery({
    queryKey: AI_CHAT_KEYS.history(page),
    queryFn: () => fetchChatHistory(page),
    enabled,
    staleTime: 1000 * 60 * 2,
  });
}

// -----------------------------------------------------------------
// useConversationDetail — load full messages of one conversation
// -----------------------------------------------------------------
export function useConversationDetail(id: number | undefined) {
  return useQuery({
    queryKey: id ? AI_CHAT_KEYS.conversation(id) : [],
    queryFn: () => fetchConversation(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}
