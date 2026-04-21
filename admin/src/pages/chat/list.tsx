// src/pages/chat/list.tsx (AdminChat)
"use client";

import {
  List as RefineList,
  useTable,
} from "@refinedev/antd";
import {
  Table,
  Tabs,
  Layout,
  Typography,
  Badge,
  List,
  Input,
  Button,
  Upload,
  Space,
  Avatar,
  Select,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useMemo, useRef, useState } from "react";
import type { MessageThreadSummary, Message, SimpleUser } from "../../type/chat";
import chatApi from "../../service/chatApi";
import SockJS from "sockjs-client";
import { Client, StompSubscription } from "@stomp/stompjs";


const { Sider, Content } = Layout;
const { Text, Title } = Typography;
const { TextArea } = Input;

type UserRoleCode =
  | "ADMIN"
  | "PRODUCT_MANAGER"
  | "ORDER_MANAGER"
  | "CUSTOMER_SERVICE"
  | "MARKETING_STAFF"
  | "ACCOUNTANT"
  | "USER";

export const AdminChat = () => {
  const [roles, setRoles] = useState<UserRoleCode[]>([]);
  const [activeTab, setActiveTab] = useState<"customer" | "direct">("direct");
  const [selectedThread, setSelectedThread] = useState<MessageThreadSummary | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [selectedThreadUnread, setSelectedThreadUnread] = useState<number>(0);
  const [files, setFiles] = useState<File[]>([]);
  const [readThreadIds, setReadThreadIds] = useState<number[]>([]);

  const [otherUserId, setOtherUserId] = useState<string>("");
  const [creatingDirect, setCreatingDirect] = useState(false);

  const [staffUsers, setStaffUsers] = useState<SimpleUser[]>([]);
  const [loadingStaff, setLoadingStaff] = useState(false);
  const [customerUsers, setCustomerUsers] = useState<SimpleUser[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  /** STOMP client & subscription dùng ref để không trigger re-render */
  const clientRef = useRef<Client | null>(null);
  const subscriptionRef = useRef<StompSubscription | null>(null);


  useEffect(() => {
    if (selectedThread) {
      setSelectedThreadUnread(selectedThread.unreadCount ?? 0);
    } else {
      setSelectedThreadUnread(0);
    }
  }, [selectedThread]);

  /** 🔹 Lấy roles + userId hiện tại */
  useEffect(() => {
    const raw = localStorage.getItem("refine-user");
    if (!raw) return;
    try {
      const user = JSON.parse(raw);
      let roleCodes: UserRoleCode[] = [];
      if (user.roles) roleCodes = user.roles.map((r: any) => r.code);
      else if (user.userRoles)
        roleCodes = user.userRoles.map((ur: any) => ur.role?.code).filter(Boolean);

      setRoles(roleCodes);
      if (user.id) setCurrentUserId(user.id);
    } catch (e) {
      console.error("Cannot parse refine-user", e);
    }
  }, []);

  const canViewCustomer = useMemo(
    () => roles.includes("ADMIN") || roles.includes("CUSTOMER_SERVICE"),
    [roles]
  );
  const canViewDirect = useMemo(
    () =>
      roles.some((r) =>
        ["ADMIN", "PRODUCT_MANAGER", "ORDER_MANAGER", "CUSTOMER_SERVICE", "MARKETING_STAFF", "ACCOUNTANT"].includes(r)
      ),
    [roles]
  );

  /** 🔹 Set tab mặc định theo quyền */
  useEffect(() => {
    if (canViewCustomer) setActiveTab("customer");
    else if (canViewDirect) setActiveTab("direct");
  }, [canViewCustomer, canViewDirect]);

  /** 🔹 useTable cho thread list */
  const { tableProps: customerTableProps } = useTable<MessageThreadSummary>({
    resource: "customer-chat-threads",
    syncWithLocation: false,
    pagination: { pageSize: 20 },
    queryOptions: { enabled: canViewCustomer } as any,
  });

  const { tableProps: directTableProps } = useTable<MessageThreadSummary>({
    resource: "direct-chat-threads",
    syncWithLocation: false,
    pagination: { pageSize: 20 },
    queryOptions: { enabled: canViewDirect } as any,
  });

  const currentTableProps = activeTab === "customer" ? customerTableProps : directTableProps;
  const tabItems = [
    ...(canViewCustomer ? [{ key: "customer", label: "Khách hàng" }] : []),
    ...(canViewDirect ? [{ key: "direct", label: "Nội bộ" }] : []),
  ];

  /** 🔹 Load staff users */
  useEffect(() => {
    if (activeTab !== "direct" || !canViewDirect) return;
    const loadStaff = async () => {
      try {
        setLoadingStaff(true);
        let list = (await chatApi.getStaffUsers()).data.data ?? [];
        if (currentUserId != null) list = list.filter((u: SimpleUser) => u.id !== currentUserId);
        setStaffUsers(list);
      } catch (e) {
        console.error("Load staff users error", e);
      } finally {
        setLoadingStaff(false);
      }
    };
    loadStaff();
  }, [activeTab, canViewDirect, currentUserId]);

  /** 🔹 Load customer users */
  useEffect(() => {
    if (activeTab !== "customer" || !canViewCustomer) return;
    const loadCustomers = async () => {
      try {
        setLoadingCustomers(true);
        const list: SimpleUser[] = (await chatApi.getCustomerUsers()).data.data ?? [];
        setCustomerUsers(list);
      } catch (e) {
        console.error("Load customer users error", e);
      } finally {
        setLoadingCustomers(false);
      }
    };
    loadCustomers();
  }, [activeTab, canViewCustomer]);

  /** 🔹 Load messages lần đầu khi chọn thread */
  useEffect(() => {
    if (!selectedThread) return;
    const load = async () => {
      setLoadingMessages(true);
      try {
        const res = await chatApi.getThreadMessages(selectedThread.id, 0, 50);
        setMessages(res.data.data.content ?? []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingMessages(false);
      }
    };
    load();
  }, [selectedThread]);

  /** 🔹 Realtime với STOMP */
  useEffect(() => {
    if (!selectedThread) return;

    const apiBase = import.meta.env.VITE_BASE_URL || "";
    const wsBase = apiBase.replace(/\/api\/?$/, "");
    const socket = new SockJS(`${wsBase}/ws-chat`);

    const client = new Client({
      webSocketFactory: () => socket as any,
      reconnectDelay: 5000,
      debug: () => {},
      onConnect: () => {
        // Hủy sub cũ nếu có
        try {
          subscriptionRef.current?.unsubscribe();
        } catch {
          // ignore
        }

        subscriptionRef.current = client.subscribe(
          `/topic/threads/${selectedThread.id}`,
          (message) => {
            try {
              const body = JSON.parse(message.body) as Message;
              setMessages((prev) =>
                prev.some((m) => m.id === body.id) ? prev : [...prev, body]
              );
            } catch (err) {
              console.error("Parse message error", err);
            }
          }
        );
      },
    });

    clientRef.current = client;
    client.activate();

    return () => {
      // cleanup khi đổi thread / unmount
      try {
        subscriptionRef.current?.unsubscribe();
      } catch {
        // ignore
      }
      subscriptionRef.current = null;

      client.deactivate();
      clientRef.current = null;
    };
  }, [selectedThread]);

  /** 🔹 Auto scroll xuống tin nhắn mới nhất khi load / nhận thêm */
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!messagesEndRef.current) return;
    messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
  }, [messages.length]);

  /** 🔹 Gửi tin nhắn */
  const handleSend = async () => {
    if (!selectedThread || (!messageText.trim() && files.length === 0)) return;
    try {
      await chatApi.sendMessage(selectedThread.id, {
        text: messageText.trim() || undefined,
        files,
      });

      // ❗ KHÔNG tự setMessages nữa, chờ WebSocket đẩy về
      setMessageText("");
      setFiles([]);
    } catch (e) {
      console.error(e);
    }
  };

  /** 🔹 Tạo cuộc trò chuyện DIRECT */
  const handleCreateDirectThread = async () => {
    if (!otherUserId) return;
    const idNum = Number(otherUserId);
    if (Number.isNaN(idNum) || idNum <= 0) return;
    try {
      setCreatingDirect(true);
      const thread = (await chatApi.createDirectThread(idNum))
        .data.data as MessageThreadSummary;
      setSelectedThread(thread);
      setMessages([]);
    } catch (e) {
      console.error(e);
    } finally {
      setCreatingDirect(false);
    }
  };

  /** 🔹 Tạo cuộc trò chuyện với KH */
  const handleCreateCustomerThread = async () => {
    if (!selectedCustomerId) return;
    const idNum = Number(selectedCustomerId);
    if (Number.isNaN(idNum) || idNum <= 0) return;
    try {
      const thread = (await chatApi.createCustomerSupportThread(idNum))
        .data.data as MessageThreadSummary;
      setSelectedThread(thread);
      setMessages([]);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <RefineList title="Chat hỗ trợ & nội bộ">
      <Layout style={{ background: "transparent", minHeight: 600 }}>
        {/* LEFT: thread list */}
        <Sider
          width={380}
          style={{
            background: "#fff",
            marginRight: 16,
            padding: 16,
            borderRadius: 8,
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
          }}
        >
          <Tabs
            activeKey={activeTab}
            onChange={(key) => {
              setActiveTab(key as "customer" | "direct");
              setSelectedThread(null);
              setMessages([]);
            }}
            style={{ marginBottom: 12 }}
            items={tabItems}
          />

          {/* Tạo conversation KH */}
          {activeTab === "customer" && canViewCustomer && (
            <div
              style={{
                marginBottom: 12,
                padding: 8,
                borderRadius: 8,
                background: "#fafafa",
                border: "1px solid #f0f0f0",
              }}
            >
              <Text strong style={{ fontSize: 12 }}>
                Tạo cuộc trò chuyện với khách hàng
              </Text>
              <Space style={{ marginTop: 8 }}>
                <Select
                  showSearch
                  placeholder="Chọn khách hàng..."
                  style={{ minWidth: 240 }}
                  loading={loadingCustomers}
                  value={selectedCustomerId || undefined}
                  onChange={(value) => setSelectedCustomerId(String(value))}
                  optionFilterProp="label"
                  options={customerUsers.map((u) => ({
                    value: u.id,
                    label: u.email ? `${u.name} (${u.email})` : u.name,
                  }))}
                />
                <Button
                  type="primary"
                  onClick={handleCreateCustomerThread}
                  disabled={!selectedCustomerId}
                >
                  Bắt đầu chat
                </Button>
              </Space>
            </div>
          )}

          {/* Tạo conversation DIRECT */}
          {activeTab === "direct" && canViewDirect && (
            <div
              style={{
                marginBottom: 12,
                padding: 8,
                borderRadius: 8,
                background: "#fafafa",
                border: "1px solid #f0f0f0",
              }}
            >
              <Text strong style={{ fontSize: 12 }}>
                Tạo cuộc trò chuyện nội bộ
              </Text>
              <Space style={{ marginTop: 8 }}>
                <Select
                  showSearch
                  placeholder="Chọn nhân viên nội bộ..."
                  style={{ minWidth: 240 }}
                  loading={loadingStaff}
                  value={otherUserId || undefined}
                  onChange={(value) => setOtherUserId(String(value))}
                  optionFilterProp="label"
                  options={staffUsers.map((u) => ({
                    value: u.id,
                    label: u.email ? `${u.name} (${u.email})` : u.name,
                  }))}
                />
                <Button
                  type="primary"
                  loading={creatingDirect}
                  onClick={handleCreateDirectThread}
                  disabled={!otherUserId}
                >
                  Bắt đầu chat
                </Button>
              </Space>
            </div>
          )}

          {/* Thread Table */}
          <Table<MessageThreadSummary>
            {...currentTableProps}
            rowKey="id"
            size="small"
            pagination={currentTableProps.pagination}
            onRow={(record) => ({
              onClick: async () => {
                setSelectedThread(record);
                setMessages([]);
                if (record.unreadCount > 0) {
                  try {
                    await chatApi.markThreadAsRead(record.id);
                    setReadThreadIds((prev) =>
                      prev.includes(record.id) ? prev : [...prev, record.id]
                    );
                    setSelectedThreadUnread(0);
                  } catch (e) {
                    console.error("Mark thread read error", e);
                  }
                }
                else{
                     setSelectedThreadUnread(record.unreadCount ?? 0);
                }
              },
            })}
            rowClassName={(record) =>
              record.id === selectedThread?.id ? "ant-table-row-selected" : ""
            }
          >
            <Table.Column<MessageThreadSummary>
              dataIndex="otherUserName"
              title={activeTab === "customer" ? "Khách hàng" : "Người dùng"}
              render={(value: string) => (
                <Space>
                  <Avatar>{value?.[0]?.toUpperCase() || "U"}</Avatar>
                  <span>{value}</span>
                </Space>
              )}
            />
            <Table.Column<MessageThreadSummary>
              dataIndex="lastMessagePreview"
              title="Tin gần nhất"
              render={(value: string | null) =>
                value ? (
                  <Text ellipsis style={{ maxWidth: 160 }}>
                    {value}
                  </Text>
                ) : (
                  <Text type="secondary">[Chưa có tin nhắn]</Text>
                )
              }
            />
            <Table.Column<MessageThreadSummary>
              dataIndex="unreadCount"
              title="Chưa đọc"
              width={90}
              align="center"
              render={(value: number, record) => {
                const effectiveUnread = readThreadIds.includes(record.id)
                  ? 0
                  : value;
                return effectiveUnread > 0 ? (
                  <Badge count={effectiveUnread} />
                ) : (
                  <Text type="secondary">0</Text>
                );
              }}
            />
          </Table>
        </Sider>

        {/* RIGHT: message area */}
        <Content
          style={{
            background: "#fff",
            padding: 16,
            borderRadius: 8,
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
          }}
        >
          {selectedThread ? (
            <>
              <div
                style={{
                  borderBottom: "1px solid #f0f0f0",
                  paddingBottom: 8,
                  marginBottom: 8,
                }}
              >
                <Title level={5} style={{ marginBottom: 0 }}>
                  {activeTab === "customer"
                    ? `Khách hàng: ${selectedThread.otherUserName}`
                    : `Nội bộ với: ${selectedThread.otherUserName}`}
                </Title>
                <Text type="secondary">
                  Thread #{selectedThread.id} · {selectedThreadUnread} chưa đọc
                </Text>
              </div>

              <div
                style={{
                  height: 380,
                  overflowY: "auto",
                  marginBottom: 12,
                  paddingRight: 8,
                }}
                ref={messagesEndRef}
              >
                <List<Message>
                dataSource={messages}
                loading={loadingMessages}
                renderItem={(item) => {
                    const isMine = currentUserId != null && item.senderId === currentUserId;

                    return (
                    <List.Item
                        style={{
                        border: "none",
                        justifyContent: isMine ? "flex-end" : "flex-start",
                        }}
                    >
                        <div
                        style={{
                            maxWidth: "70%",
                            padding: 8,
                            borderRadius: 8,
                            background: isMine ? "#e6f7ff" : "#f5f5f5",
                        }}
                        >
                        <Text strong style={{ fontSize: 12 }}>
                            {item.senderName}
                        </Text>

                        {item.contentText && (
                            <div style={{ marginTop: 4 }}>
                            <Text>{item.contentText}</Text>
                            </div>
                        )}

                        {item.attachments?.length > 0 && (
                            <div style={{ marginTop: 6 }}>
                            {item.attachments.map((att) => (
                                <div key={att.id} style={{ marginBottom: 4 }}>
                                {att.mimeType?.startsWith("image/") ? (
                                    <>
                                    <img
                                        src={att.url}
                                        alt={att.altText || "attachment"}
                                        style={{
                                        maxWidth: 200,
                                        maxHeight: 200,
                                        borderRadius: 6,
                                        display: "block",
                                        }}
                                    />
                                    <a
                                        href={att.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        style={{ fontSize: 11 }}
                                    >
                                        Xem ảnh đầy đủ
                                    </a>
                                    </>
                                ) : (
                                    <a href={att.url} target="_blank" rel="noreferrer">
                                    Tệp đính kèm
                                    </a>
                                )}
                                </div>
                            ))}
                            </div>
                        )}

                        <div style={{ marginTop: 4 }}>
                            <Text type="secondary" style={{ fontSize: 11 }}>
                            {new Date(item.createdAt).toLocaleString()}
                            </Text>
                        </div>
                        </div>
                    </List.Item>
                    );
                }}
                />

              </div>

              <div>
                <TextArea
                  rows={3}
                  placeholder="Nhập tin nhắn..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onPressEnter={(e) => {
                    if (e.shiftKey) return;
                    e.preventDefault();
                    handleSend();
                  }}
                />
                <div
                  style={{
                    marginTop: 8,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Upload
                    multiple
                    beforeUpload={(file) => {
                      setFiles((prev) => [...prev, file]);
                      return false;
                    }}
                    fileList={files.map((f, idx) => ({
                      uid: `${f.name}-${idx}`,
                      name: f.name,
                      status: "done",
                    }))}
                    onRemove={(file) =>
                      setFiles((prev) =>
                        prev.filter((f) => f.name !== file.name)
                      )
                    }
                  >
                    <Button icon={<UploadOutlined />}>Đính kèm</Button>
                  </Upload>
                  <Button
                    type="primary"
                    onClick={handleSend}
                    disabled={!messageText.trim() && files.length === 0}
                  >
                    Gửi
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div
              style={{
                height: 430,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text type="secondary">
                Chọn một cuộc trò chuyện ở bên trái để xem tin nhắn, hoặc tạo cuộc
                trò chuyện mới.
              </Text>
            </div>
          )}
        </Content>
      </Layout>
    </RefineList>
  );
};
