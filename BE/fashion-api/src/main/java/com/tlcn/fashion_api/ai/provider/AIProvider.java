package com.tlcn.fashion_api.ai.provider;

import java.util.List;

public interface AIProvider {

    ChatCompletion complete(List<Message> messages, CompletionOptions options);

    record Message(String role, String content) {
        public static Message system(String content) { return new Message("system", content); }
        public static Message user(String content)   { return new Message("user",   content); }
        public static Message assistant(String content) { return new Message("assistant", content); }
    }

    record CompletionOptions(int maxTokens, double temperature) {
        public static CompletionOptions defaults() { return new CompletionOptions(1024, 0.7); }
        public static CompletionOptions precise()  { return new CompletionOptions(2048, 0.3); }
        public static CompletionOptions creative() { return new CompletionOptions(1500, 0.9); }
    }

    record ChatCompletion(String content, int promptTokens, int completionTokens, String modelUsed) {
        public int totalTokens() { return promptTokens + completionTokens; }
    }
}
