// src/components/modals/ChatSupportModal.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { MessageDto, MessageAttachment } from "@/types/chat";
import chatApi from "@/services/chatApi";
import { Client, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useAuth } from "@/context/authContext"; // 👈 LẤY USER TỪ FE

export interface ChatSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatSupportModal({
  isOpen,
  onClose,
}: ChatSupportModalProps) {
  const [messages, setMessages] = useState<MessageDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [text, setText] = useState("");
  const [threadId, setThreadId] = useState<number | null>(null);

  /** Files tạm (chưa gửi) */
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const [page] = useState(0);

  /** STOMP client + subscription cho realtime */
  const clientRef = useRef<Client | null>(null);
  const subscriptionRef = useRef<StompSubscription | null>(null);

  /** ✅ Lấy user hiện tại từ FE (authContext) */
  const { user } = useAuth();
  const currentUserId = user?.id ?? null;

  /* ===================================================
   * 1. Load thread + messages khi mở modal
   * =================================================== */
  useEffect(() => {
    if (!isOpen) return;

    const load = async () => {
      try {
        setLoading(true);

        // 1️⃣ đảm bảo thread tồn tại
        const threadRes = await chatApi.getOrCreateMyThread();
        const tId = threadRes.data.data as number;
        setThreadId(tId);

        // 2️⃣ rồi mới load messages
        const msgRes = await chatApi.getMyMessages(page, 50);
        const list = msgRes.data.data.content ?? [];
        setMessages(list);

        // 3️⃣ lưu "đã đọc tới message nào" = max id
        if (list.length > 0) {
          const maxId = Math.max(...list.map((m) => m.id));
          localStorage.setItem("customerChatLastReadId", String(maxId));
        }

        // 4️⃣ đánh dấu đã đọc ở server (không cần chờ)
        chatApi.markAllAsRead().catch(() => {});
      } catch (e) {
        console.error("Load chat messages error", e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [isOpen, page]);

  /* ===================================================
   * 2. Kết nối WebSocket + subscribe theo threadId
   * =================================================== */
  useEffect(() => {
    if (!isOpen || !threadId) return;

    const apiBase = import.meta.env.VITE_BASE_URL || "";
    const wsBase = apiBase.replace(/\/api\/?$/, "");
    const socket = new SockJS(`${wsBase}/ws-chat`);

    const client = new Client({
      webSocketFactory: () => socket as any,
      reconnectDelay: 5000,
      debug: () => {
        // console.log("[STOMP]", str);
      },
      onConnect: () => {
        // Hủy sub cũ nếu có (phòng trường hợp threadId đổi)
        try {
          subscriptionRef.current?.unsubscribe();
        } catch {
          // ignore
        }

        // Subscribe topic của thread
        subscriptionRef.current = client.subscribe(
          `/topic/threads/${threadId}`,
          (message) => {
            try {
              const body: MessageDto = JSON.parse(message.body);

              setMessages((prev) => {
                if (prev.some((m) => m.id === body.id)) return prev;
                const next = [...prev, body];

                // Cập nhật lastReadId vì user đang mở modal → coi như đã đọc
                const lastReadRaw =
                  localStorage.getItem("customerChatLastReadId");
                const lastReadId = lastReadRaw ? Number(lastReadRaw) : 0;
                const newMax = Math.max(lastReadId, body.id);
                localStorage.setItem(
                  "customerChatLastReadId",
                  String(newMax),
                );

                return next;
              });
            } catch (err) {
              console.error("Parse message error", err);
            }
          },
        );
      },
    });

    clientRef.current = client;
    client.activate();

    // cleanup khi đóng modal hoặc đổi thread
    return () => {
      try {
        subscriptionRef.current?.unsubscribe();
      } catch {
        // ignore
      }
      subscriptionRef.current = null;

      client.deactivate();
      clientRef.current = null;
    };
  }, [isOpen, threadId]);

  /* ===================================================
   * 2b. Auto scroll xuống tin nhắn mới khi load / nhận thêm
   * =================================================== */
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!messagesEndRef.current) return;
    messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
  }, [messages.length]);

  /* ===================================================
   * 3. Preview file chọn trước khi gửi
   * =================================================== */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const list = Array.from(e.target.files);

    setFiles((prev) => [...prev, ...list]);

    const newPreviews = list.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  /** ❌ Xoá 1 ảnh trước khi gửi */
  const removePreview = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  /* ===================================================
   * 4. Gửi tin nhắn (text + files)
   * =================================================== */
  const handleSend = async () => {
    if (!text.trim() && files.length === 0) return;

    try {
      setSending(true);

      await chatApi.sendMyMessage({
        text: text.trim() || undefined,
        files,
      });

      // ❗KHÔNG append vào state ở đây, để socket bắn về là đủ
      setText("");
      setFiles([]);
      setPreviews([]);
    } catch (e) {
      console.error("Send message error", e);
    } finally {
      setSending(false);
    }
  };

  const renderAttachmentLabel = (att: MessageAttachment) => {
    if (att.mimeType?.startsWith("image/")) return "Ảnh đính kèm";
    return "Tệp đính kèm";
  };

  /* ===================================================
   * 5. UI
   * =================================================== */
  return (
    <>
      <div
        className={`modal fade modal-chat-support ${
          isOpen ? "show d-block" : ""
        }`}
        tabIndex={-1}
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            {/* HEADER */}
            <div className="modal-header">
              <h5 className="modal-title">Hỗ trợ khách hàng</h5>
              <button type="button" className="btn-close" onClick={onClose} />
            </div>

            {/* BODY */}
            <div
              className="modal-body d-flex flex-column"
              style={{ height: 500 }}
            >
              {/* Danh sách tin nhắn */}
              <div
                className="flex-grow-1 mb-3"
                style={{ overflowY: "auto" }}
                ref={messagesEndRef}
              >
                {loading ? (
                  <p>Đang tải tin nhắn...</p>
                ) : messages.length === 0 ? (
                  <p className="text-muted">
                    Chưa có tin nhắn, hãy gửi câu hỏi đầu tiên của bạn.
                  </p>
                ) : (
                  <div className="d-flex flex-column gap-2">
                    {messages.map((m) => {
                      // ✅ So sánh theo senderId + currentUserId
                      const isMine =
                        currentUserId != null &&
                        (m as any).senderId === currentUserId;

                      return (
                        <div
                          key={m.id}
                          className={`d-flex ${
                            isMine
                              ? "justify-content-end"
                              : "justify-content-start"
                          }`}
                        >
                          <div
                            className={`p-2 rounded-3 ${
                              isMine ? "bg-dark text-white" : "bg-light"
                            }`}
                            style={{ maxWidth: "70%" }}
                          >
                            <div className="small fw-semibold">
                              {m.senderName}
                            </div>

                            {m.contentText && (
                              <div className="mt-1">{m.contentText}</div>
                            )}

                            {m.attachments?.length > 0 && (
                              <div className="mt-2 d-flex flex-column gap-2">
                                {m.attachments.map((att) => (
                                  <div key={att.id}>
                                    {att.mimeType?.startsWith("image/") ? (
                                      <img
                                        src={att.url}
                                        alt="img"
                                        style={{
                                          maxWidth: "150px",
                                          borderRadius: 8,
                                        }}
                                      />
                                    ) : (
                                      <a
                                        href={att.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className={
                                          isMine
                                            ? "text-warning"
                                            : "text-primary"
                                        }
                                      >
                                        {renderAttachmentLabel(att)}
                                      </a>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}

                            <div className="mt-1 text-end">
                              <span className="text-muted small">
                                {new Date(m.createdAt).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Thumbnails PREVIEW */}
              {previews.length > 0 && (
                <div className="mb-2 d-flex gap-2 flex-wrap">
                  {previews.map((src, index) => (
                    <div
                      key={index}
                      className="position-relative"
                      style={{ width: 80, height: 80 }}
                    >
                      <img
                        src={src}
                        alt="preview"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: 6,
                          border: "1px solid #ddd",
                        }}
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-danger position-absolute"
                        style={{
                          top: -8,
                          right: -8,
                          borderRadius: "50%",
                          padding: "2px 6px",
                        }}
                        onClick={() => removePreview(index)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* INPUT */}
              <div>
                <textarea
                  className="form-control mb-2"
                  rows={3}
                  placeholder="Nhập nội dung cần hỗ trợ..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (!sending && (text.trim() || files.length > 0)) {
                        handleSend();
                      }
                    }
                  }}
                />

                <div className="d-flex justify-content-between align-items-center gap-2">
                  <div>
                    <input type="file" multiple onChange={handleFileChange} />
                  </div>

                  <button
                    className="btn btn-dark2"
                    disabled={sending || (!text.trim() && files.length === 0)}
                    onClick={handleSend}
                  >
                    {sending ? "Đang gửi..." : "Gửi"}
                  </button>
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>

      {isOpen && <div className="modal-backdrop fade show"></div>}
    </>
  );
}
