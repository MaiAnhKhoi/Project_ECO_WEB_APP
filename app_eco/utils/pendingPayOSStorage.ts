import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "pendingPayOSPayment";

export type PendingPayOSPayment = {
  from: "checkout" | "orders";
  orderId: number;
  checkoutUrl: string | null;
  qrUrl: string | null;
  expiresAt: string | null;
};

export async function savePendingPayOS(data: PendingPayOSPayment): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(data));
}

export async function loadPendingPayOS(): Promise<PendingPayOSPayment | null> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PendingPayOSPayment;
  } catch {
    await AsyncStorage.removeItem(KEY);
    return null;
  }
}

export async function clearPendingPayOS(): Promise<void> {
  await AsyncStorage.removeItem(KEY);
}
