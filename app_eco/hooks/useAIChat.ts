import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";

import { AI_QUERY_KEYS } from "@/queries/aiQueries";
import { fetchAIConversation, sendAIChat } from "@/services/aiApi";
import type { ChatMessage, ChatResponse } from "@/types/ai";

export type UseAIChatOptions = {
  resumeConversationId?: number;
};

export function useAIChat(options?: UseAIChatOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessionId, setSessionId] = useState<string | undefined>();
  const [conversationId, setConversationId] = useState<number | undefined>();
  const [error, setError] = useState<string | null>(null);

  const sessionIdRef = useRef(sessionId);
  sessionIdRef.current = sessionId;

  const qc = useQueryClient();
  const resumeId =
    options?.resumeConversationId != null &&
    Number.isFinite(options.resumeConversationId) &&
    options.resumeConversationId > 0
      ? options.resumeConversationId
      : undefined;

  const resumeAppliedRef = useRef(false);

  useEffect(() => {
    resumeAppliedRef.current = false;
  }, [resumeId]);

  const convQuery = useQuery({
    queryKey: resumeId != null ? AI_QUERY_KEYS.conversation(resumeId) : ["ai", "chat", "conversation", "idle"],
    queryFn: () => fetchAIConversation(resumeId!),
    enabled: resumeId != null,
  });

  useEffect(() => {
    if (resumeAppliedRef.current) return;
    if (!convQuery.data || convQuery.isError) return;
    resumeAppliedRef.current = true;
    setSessionId(convQuery.data.sessionId);
    setConversationId(convQuery.data.conversationId);
    setMessages(convQuery.data.messages ?? []);
    setError(null);
  }, [convQuery.data, convQuery.isError]);

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
    resumeAppliedRef.current = true;
  }, [mutation]);

  return {
    messages,
    sendMessage,
    clearMessages,
    isLoading: mutation.isPending || (!!resumeId && !convQuery.isFetched),
    error,
    sessionId,
    conversationId,
    lastResponse: mutation.data,
    resumeError: convQuery.isError,
  };
}
