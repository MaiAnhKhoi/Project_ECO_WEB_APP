/**
 * Banner trang chủ — đồng bộ với FE (`types/banner` + GET `/banners/home`).
 */
export interface BannerItem {
  bgType: string;
  imageSrc: string;
  width: number;
  height: number;
  /** Có thể chứa HTML từ CMS — dùng `stripHtml` khi hiển thị Text */
  heading: string;
  subText?: string | null;
  colClass: string;
  /** Tùy backend: deeplink / URL ngoài */
  redirectLink?: string | null;
}
