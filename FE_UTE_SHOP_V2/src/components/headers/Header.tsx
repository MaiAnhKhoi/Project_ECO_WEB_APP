// src/components/layout/Header.tsx
"use client";

import Nav from "./Nav";
import { Link, useLocation } from "react-router-dom";
import CartLength from "../common/CartLength";
import WishlistLength from "../common/WishlistLength";
import { shopConfig } from "@/config/shop";
import { useEffect, useRef, useState } from "react";
import ChatSupportModal from "@/components/modals/ChatSupportModal";
import chatApi from "@/services/chatApi";
import type { MessageDto } from "@/types/chat";
import { Client, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export default function Header({
  parentClass = "header-default",
  fullWidth = false,
}) {
  const { pathname } = useLocation();
  const [chatOpen, setChatOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const isLoggedIn = Boolean(localStorage.getItem("access_token"));
  
  // Kiểm tra kích thước màn hình để ẩn/hiện mobile menu
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // lưu info user để so sánh
  const [currentUserName, setCurrentUserName] = useState<string | null>(null);
  useEffect(() => {
    const raw = localStorage.getItem("refine-user");
    if (!raw) return;
    try {
      const user = JSON.parse(raw);
      const name =
        user.name || user.fullName || user.username || user.email || null;
      setCurrentUserName(name);
    } catch (e) {
      console.error("Parse refine-user error", e);
    }
  }, []);

  // 🔥 Hàm load số tin chưa đọc
  const loadUnreadCount = async () => {
    if (!isLoggedIn) {
      setUnreadCount(0);
      return;
    }

    try {
      const lastReadRaw = localStorage.getItem("customerChatLastReadId");
      const lastReadId = lastReadRaw ? Number(lastReadRaw) : 0;

      const res = await chatApi.getMyMessages(0, 50);
      const list: MessageDto[] = res.data.data.content ?? [];

      const unread = list.filter((m) => {
        const isMine =
          currentUserName &&
          m.senderName &&
          m.senderName === currentUserName;
        return m.id > lastReadId && !isMine;
      }).length;

      setUnreadCount(unread);
    } catch (e) {
      console.error("Load unread chat count error", e);
    }
  };

  // 🔁 Load lần đầu khi mount + khi đăng nhập
  useEffect(() => {
    loadUnreadCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, currentUserName]);

  // 🔁 Khi đóng modal thì reload lại unread (vì trong modal đã update lastReadId)
  useEffect(() => {
    if (!chatOpen) {
      setTimeout(() => {
        loadUnreadCount();
      }, 200);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatOpen]);

  // =====================================================
  //  WebSocket ở Header để realtime unread
  // =====================================================
  const [threadId, setThreadId] = useState<number | null>(null);
  const clientRef = useRef<Client | null>(null);
  const subRef = useRef<StompSubscription | null>(null);
  const chatOpenRef = useRef(false);
  const currentUserNameRef = useRef<string | null>(null);

  useEffect(() => {
    chatOpenRef.current = chatOpen;
  }, [chatOpen]);

  useEffect(() => {
    currentUserNameRef.current = currentUserName;
  }, [currentUserName]);

  // Lấy threadId một lần khi đăng nhập
  useEffect(() => {
    if (!isLoggedIn) {
      setThreadId(null);
      return;
    }
    const init = async () => {
      try {
        const res = await chatApi.getOrCreateMyThread();
        setThreadId(res.data.data as number);
      } catch (e) {
        console.error("getOrCreateMyThread error", e);
      }
    };
    init();
  }, [isLoggedIn]);

  // Kết nối WebSocket để nghe tin mới
  useEffect(() => {
    if (!isLoggedIn || !threadId) return;

    const apiBase = import.meta.env.VITE_BASE_URL || "";
    const wsBase = apiBase.replace(/\/api\/?$/, "");
    const socket = new SockJS(`${wsBase}/ws-chat`);

    const client = new Client({
      webSocketFactory: () => socket as any,
      reconnectDelay: 5000,
      debug: () => {},
      onConnect: () => {
        subRef.current?.unsubscribe();
        subRef.current = client.subscribe(
          `/topic/threads/${threadId}`,
          (message) => {
            try {
              const body: MessageDto = JSON.parse(message.body);
              const isMine =
                currentUserNameRef.current &&
                body.senderName &&
                body.senderName === currentUserNameRef.current;

              // Nếu tin mới KHÔNG phải do mình gửi và modal đang ĐÓNG → coi là chưa đọc
              if (!isMine && !chatOpenRef.current) {
                setUnreadCount((prev) => prev + 1);
                // KHÔNG cập nhật lastReadId ở đây vì user chưa đọc
              }
            } catch (err) {
              console.error("Header WS message error", err);
            }
          },
        );
      },
    });

    clientRef.current = client;
    client.activate();

    return () => {
      try {
        subRef.current?.unsubscribe();
      } catch {
        // ignore
      }
      subRef.current = null;

      client.deactivate();
      clientRef.current = null;
    };
  }, [isLoggedIn, threadId]);

  // =====================================================

  return (
    <>
      <header id="header" className={parentClass}>
        <div className={fullWidth ? "container-full" : "container"}>
          <div className="row wrapper-header align-items-center">
            {isMobile && (
              <div className="col-3 mobile-menu-wrapper">
                <a
                  href="#mobileMenu"
                  className="mobile-menu"
                  data-bs-toggle="offcanvas"
                  aria-controls="mobileMenu"
                >
                  <i className="icon icon-categories1" />
                </a>
              </div>
            )}

            <div className="col-xl-2 col-lg-2 col-md-3 col-6 pb-2">
              <Link to={`/`} className="logo-header">
                <img
                  alt={shopConfig.logo.alt}
                  className="logo"
                  src={shopConfig.logo.src}
                  width={shopConfig.logo.width}
                  height={shopConfig.logo.height}
                  style={{
                    height: `${shopConfig.logo.height}px`,
                    width: `${shopConfig.logo.width}px`,
                  }}
                />
              </Link>
            </div>

            <div className="col-xl-8 col-lg-7 col-md-9 d-none d-md-block">
              <nav className="box-navigation text-center">
                <ul className="box-nav-menu">
                  <Nav />
                </ul>
              </nav>
            </div>

            <div className="col-xl-2 col-lg-3 col-md-12 col-3">
              <ul className="nav-icon d-flex justify-content-end align-items-center">
                <li className="nav-search">
                  <a
                    href="#search"
                    data-bs-toggle="modal"
                    className="nav-icon-item"
                  >
                    <i className="icon icon-search" />
                  </a>
                </li>

                {/* Tài khoản */}
                <li className="nav-account">
                  {isLoggedIn ? (
                    <Link to="/account-page" className="nav-icon-item">
                      <i className="icon icon-user" />
                    </Link>
                  ) : (
                    <a
                      href="#login"
                      data-bs-toggle="offcanvas"
                      aria-controls="login"
                      className="nav-icon-item"
                    >
                      <i className="icon icon-user" />
                    </a>
                  )}
                </li>

                {/* CHAT HỖ TRỢ + badge số chưa đọc */}
                {isLoggedIn && (
                  <li className="nav-chat position-relative">
                    <button
                      type="button"
                      className="nav-icon-item btn p-0 border-0"
                      onClick={() => setChatOpen(true)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="currentColor"
                        className="bi bi-chat-dots"
                        viewBox="0 0 16 16"
                      >
                        <path d="M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
                        <path d="m2.165 15.803.02-.004c1.83-.363 2.948-.842 3.468-1.105A9 9 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.4 10.4 0 0 1-.524 2.318l-.003.011a11 11 0 0 1-.244.637c-.079.186.074.394.273.362a22 22 0 0 0 .693-.125m.8-3.108a1 1 0 0 0-.287-.801C1.618 10.83 1 9.468 1 8c0-3.192 3.004-6 7-6s7 2.808 7 6-3.004 6-7 6a8 8 0 0 1-2.088-.272 1 1 0 0 0-.711.074c-.387.196-1.24.57-2.634.893a11 11 0 0 0 .398-2" />
                      </svg>

                      {unreadCount > 0 && (
                        <span className="count-box">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </button>
                  </li>
                )}

                <li className="nav-wishlist">
                  <Link to={`/wish-list`} className="nav-icon-item">
                    <i className="icon icon-heart" />
                    <span className="count-box">
                      <WishlistLength />
                    </span>
                  </Link>
                </li>

                <li className="nav-cart">
                  <a
                    href="#shoppingCart"
                    data-bs-toggle={`${
                      pathname == "/cart-drawer-v2" ? "modal" : "offcanvas"
                    }`}
                    className="nav-icon-item"
                  >
                    <i className="icon icon-cart" />
                    <span className="count-box">
                      <CartLength />
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>

      <ChatSupportModal
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
      />
    </>
  );
}
