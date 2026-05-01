/** Liên hệ + thông tin shop (màn contact) */

export interface ContactMessagePayload {
  name: string;
  email: string;
  message: string;
}

export interface ShopSettingResponse {
  shopName: string;
  logoUrl: string;
  address: string;
  phone: string;
  email: string;
  openingHours: string;
  mapIframe: string;
  facebookUrl: string;
  instagramUrl: string;
  xUrl: string;
  snapchatUrl: string;
}
