# Hướng dẫn thay đổi Logo

## Cách 1: Thay file logo (Khuyến nghị)
1. Thay thế file logo hiện tại tại: `public/images/logo/logo.svg`
2. Giữ nguyên tên file `logo.svg`
3. Logo sẽ tự động cập nhật

## Cách 2: Thay đổi đường dẫn logo
1. Mở file `src/config/shop.ts`
2. Tìm phần `logo`:
```typescript
logo: {
  src: "/images/logo/logo.svg",  // Thay đổi đường dẫn ở đây
  alt: "logo",
  width: 148,
  height: 44,
},
```
3. Cập nhật:
   - `src`: Đường dẫn đến file logo mới
   - `alt`: Text mô tả logo (cho accessibility)
   - `width`: Chiều rộng logo (pixels)
   - `height`: Chiều cao logo (pixels)

## Lưu ý
- Logo được sử dụng tự động ở Header và Footer
- Không cần thay đổi code ở các component khác
- Đảm bảo file logo có kích thước phù hợp với width/height đã set

