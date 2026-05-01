import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { authApi } from "@/services/authApi";
import type { User } from "@/types/auth";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";
import { wishlistApi } from "@/services/wishlistApi";
import { cartApi } from "@/services/cartApi";

type AuthState = {
  accessToken: string | null;
  user: User | null;
  bootstrapping: boolean;
  loginLoading: boolean;
  error: string | null;

  bootstrap: () => Promise<void>;
  login: (
    email: string,
    password: string
  ) => Promise<{ ok: boolean; message?: string; emailNotVerified?: boolean }>;
  register: (payload: {
    name: string;
    email: string;
    phone?: string;
    password: string;
    passwordConfirm: string;
  }) => Promise<{ ok: boolean; message?: string }>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,
      bootstrapping: true,
      loginLoading: false,
      error: null,

      bootstrap: async () => {
        try {
          set({ bootstrapping: true, error: null });
          const token = get().accessToken;
          if (!token) {
            set({ user: null });
            return;
          }
          const res = await authApi.me(token);
          if (!res.success) {
            set({ accessToken: null, user: null, error: res.message || "Phiên đăng nhập không hợp lệ" });
            return;
          }
          set({ user: res.data });

          // Khởi động lại dữ liệu server sau khi xác nhận token còn hiệu lực
          _syncServerData(token);
        } catch (e: any) {
          set({ accessToken: null, user: null, error: e?.message || "Không thể kiểm tra đăng nhập" });
        } finally {
          set({ bootstrapping: false });
        }
      },

      login: async (email, password) => {
        set({ loginLoading: true, error: null });
        try {
          const res = await authApi.login({ email, password });
          if (!res.success) {
            set({ error: res.message || "Đăng nhập thất bại" });
            return { ok: false, message: res.message };
          }
          const token = res.data.accessToken;
          const user = res.data.user;
          set({ accessToken: token, user });

          // 1. Gộp wishlist local → server
          try {
            const localWish = useWishlistStore.getState().productIds;
            if (localWish.length) {
              await Promise.allSettled(localWish.map((id) => wishlistApi.addToWishlist(token, id)));
            }
          } catch {
            // bỏ qua
          }

          // 2. Gộp giỏ hàng guest → server
          try {
            const guestItems = useCartStore.getState().guestItems;
            if (guestItems.length) {
              await Promise.allSettled(
                guestItems.map((it) =>
                  cartApi.addToCart(token, {
                    productId: it.productId,
                    quantity: it.quantity,
                    variantId: it.variantId ?? null,
                    color: it.color ?? null,
                  })
                )
              );
              useCartStore.getState().clearGuestCart();
            }
          } catch {
            // bỏ qua
          }

          // 3. Đồng bộ dữ liệu mới nhất từ server
          _syncServerData(token);

          return { ok: true };
        } catch (e: any) {
          const message = e?.message || "Email hoặc mật khẩu không đúng!";
          const emailNotVerified =
            typeof message === "string" &&
            (message.toLowerCase().includes("verify") ||
              message.toLowerCase().includes("xác thực") ||
              message.toLowerCase().includes("pending"));
          set({ error: message });
          return { ok: false, message, emailNotVerified };
        } finally {
          set({ loginLoading: false });
        }
      },

      register: async (payload) => {
        set({ error: null });
        try {
          const res = await authApi.register(payload);
          if (!res.success) {
            set({ error: res.message || "Đăng ký thất bại" });
            return { ok: false, message: res.message };
          }
          return { ok: true, message: res.message };
        } catch (e: any) {
          const message = e?.message || "Có lỗi xảy ra, vui lòng thử lại!";
          set({ error: message });
          return { ok: false, message };
        }
      },

      logout: async () => {
        useCartStore.getState().clearServerCart();
        set({ accessToken: null, user: null, error: null });
      },
    }),
    {
      name: "auth_v1",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ accessToken: s.accessToken, user: s.user }),
    }
  )
);

/** Tải giỏ hàng + wishlist từ server và cập nhật store. */
async function _syncServerData(token: string) {
  try {
    const [cartRes, wlRes] = await Promise.allSettled([
      cartApi.getMyCart(token),
      wishlistApi.getWishlist(token, 0, 200),
    ]);

    if (cartRes.status === "fulfilled" && cartRes.value) {
      useCartStore.getState().setServerCart(cartRes.value as any);
    }

    if (wlRes.status === "fulfilled" && wlRes.value) {
      const page = wlRes.value as any;
      const items: { id: number }[] = page?.content ?? [];
      useWishlistStore.getState().setProductIds(items.map((p) => p.id));
    }
  } catch {
    // silent
  }
}
