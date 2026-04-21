# 📦 Hệ thống E-commerce TLCN Demo

Hệ thống thương mại điện tử hoàn chỉnh với đầy đủ tính năng từ quản lý sản phẩm, đơn hàng, thanh toán đến AI và marketing.

## 📋 Mục lục

- [Tổng quan](#tổng-quan)
- [Cấu trúc Database](#cấu-trúc-database)
- [Phân chia tính năng theo nhóm](#phân-chia-tính-năng-theo-nhóm)
- [Chia nhiệm vụ](#chia-nhiệm-vụ)
- [Cài đặt](#cài-đặt)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)

---

## 🎯 Tổng quan

Hệ thống bao gồm **40 Story Points (SD)** được chia thành **8 nhóm chức năng** chính:

- 👥 **Nhóm 1**: Người dùng & Phân quyền (4 SD) Huy
- 🏪 **Nhóm 2**: Cấu hình & Cửa hàng (3 SD) Chung
- 📦 **Nhóm 3**: Sản phẩm & Kho (7 SD)
- 🛒 **Nhóm 4**: Đơn hàng & Thanh toán (8 SD)   Chung
- 💬 **Nhóm 5**: CSKH & Review (5 SD) Huy
- 📢 **Nhóm 6**: Marketing (3 SD)
- 🛍️ **Nhóm 7**: Khách hàng (6 SD)
- 🤖 **Nhóm 8**: Hệ thống & AI (4 SD)

---

## 🗄️ Cấu trúc Database

Database được thiết kế với **50+ bảng** bao gồm:

### Bảng chính:
- **Người dùng**: `users`, `roles`, `permissions`, `user_roles`, `access_tokens`, `refresh_tokens`
- **Sản phẩm**: `products`, `product_variants`, `categories`, `brands`, `product_images`, `stocks`
- **Đơn hàng**: `orders`, `order_items`, `payments`, `refunds`, `shipments`
- **Giỏ hàng**: `carts`, `cart_items`, `wishlists`, `wishlist_items`
- **Marketing**: `coupons`, `coupon_usages`, `banners`
- **CSKH**: `tickets`, `ticket_messages`, `returns`, `reviews`
- **AI & Hệ thống**: `ai_prompts`, `ai_runs`, `recommendations`, `embeddings`, `events`

Xem file `tlcn_demo_complete.sql` để xem chi tiết schema.

### 🔐 Giải thích về Token (Quan trọng!)

Có **2 loại token khác nhau** trong hệ thống, **KHÔNG xung đột**:

#### 1. **Token của Hệ thống** (JWT Authentication)
- **`access_tokens`** (bảng riêng): Lưu JWT access token do hệ thống tự sinh ra
  - Dùng để authenticate user khi gọi API của hệ thống
  - Có thời hạn ngắn (ví dụ: 15 phút - 1 giờ)
  - Lưu dạng hash để bảo mật
  
- **`refresh_tokens`** (bảng riêng): Lưu JWT refresh token do hệ thống tự sinh ra
  - Dùng để renew access token khi hết hạn
  - Có thời hạn dài hơn (ví dụ: 7-30 ngày)
  - Lưu dạng hash để bảo mật

**Mục đích**: Xác thực user khi họ gọi API của hệ thống (ví dụ: `GET /api/products`, `POST /api/orders`)

#### 2. **Token từ OAuth Provider** (Social Login)
- **`social_accounts.access_token`** (trường trong bảng): Token từ Google/Facebook/Zalo
  - Nhận được sau khi user đăng nhập OAuth
  - Dùng để gọi API của provider (nếu cần lấy thông tin thêm)
  - Nên encrypt trước khi lưu
  
- **`social_accounts.refresh_token`** (trường trong bảng): Refresh token từ provider
  - Dùng để renew access token của provider
  - Nên encrypt trước khi lưu

**Mục đích**: Lưu trữ token từ bên thứ 3 (Google/Facebook) để có thể gọi API của họ sau này (ví dụ: lấy avatar, đồng bộ danh bạ)

**Tóm lại**: 
- `access_tokens`/`refresh_tokens` (bảng) = Token của **HỆ THỐNG** → Dùng cho API của mình
- `social_accounts.access_token`/`refresh_token` (trường) = Token từ **PROVIDER** → Dùng cho API của Google/Facebook

**Không có xung đột** vì mục đích và phạm vi sử dụng hoàn toàn khác nhau!

---

## 📊 Phân chia tính năng theo nhóm

### 👥 Nhóm 1 – Người dùng & Phân quyền (4 SD)

#### 1. Đăng ký / Đăng nhập
- **Bảng liên quan**: `users`, `access_tokens`, `refresh_tokens`, `login_history`, `verification_codes`, `social_accounts`
- **Chức năng**:
  - Đăng ký tài khoản (email/phone)
  - Xác thực email/phone qua OTP
  - Đăng nhập (email/username + password)
  - Đăng nhập OAuth (Google, Facebook, Zalo)
  - Ghi nhận lịch sử đăng nhập
  - Xử lý khóa tài khoản sau nhiều lần đăng nhập sai

#### 2. Gán vai trò cho nhân viên
- **Bảng liên quan**: `users`, `roles`, `permissions`, `user_roles`, `role_permissions`
- **Chức năng**:
  - Tạo và quản lý vai trò (admin, staff, manager)
  - Gán quyền cho từng vai trò
  - Gán vai trò cho người dùng
  - Kiểm tra quyền truy cập theo vai trò

#### 3. Cập nhật thông tin tài khoản
- **Bảng liên quan**: `users`, `addresses`, `social_accounts`
- **Chức năng**:
  - Cập nhật thông tin cá nhân (tên, email, phone, avatar)
  - Quản lý địa chỉ giao hàng
  - Đổi mật khẩu
  - Bật/tắt xác thực 2 yếu tố (2FA)

#### 4. Đăng xuất và hủy token
- **Bảng liên quan**: `access_tokens`, `refresh_tokens`
- **Chức năng**:
  - Đăng xuất (revoke access token)
  - Hủy refresh token
  - Xem danh sách thiết bị đã đăng nhập
  - Đăng xuất từ xa

---

### 🏪 Nhóm 2 – Cấu hình & Cửa hàng (3 SD)

#### 5. Cập nhật thông tin cửa hàng
- **Bảng liên quan**: `shop_settings`
- **Chức năng**:
  - Cập nhật tên cửa hàng, logo
  - Cấu hình tiền tệ, múi giờ
  - Cấu hình thuế, email gửi đi
  - Xem và chỉnh sửa thông tin liên hệ

#### 6. Cấu hình phương thức thanh toán
- **Bảng liên quan**: `payment_methods`
- **Chức năng**:
  - Thêm/sửa/xóa phương thức thanh toán
  - Cấu hình thông tin kết nối (API keys, webhook URLs)
  - Bật/tắt phương thức thanh toán
  - Xem lịch sử giao dịch theo phương thức

#### 7. Cấu hình phương thức vận chuyển
- **Bảng liên quan**: `shipping_methods`
- **Chức năng**:
  - Thêm/sửa/xóa phương thức vận chuyển
  - Cấu hình phí vận chuyển (theo khu vực, trọng lượng)
  - Bật/tắt phương thức vận chuyển
  - Tích hợp API vận chuyển bên thứ 3

---

### 📦 Nhóm 3 – Sản phẩm & Kho (7 SD)

#### 8. Tạo danh mục sản phẩm
- **Bảng liên quan**: `categories`, `product_categories`
- **Chức năng**:
  - Tạo danh mục cha/con
  - Upload ảnh danh mục
  - Sắp xếp thứ tự hiển thị
  - SEO (slug, meta title, description)

#### 9. Tạo thương hiệu (Brand)
- **Bảng liên quan**: `brands`
- **Chức năng**:
  - Tạo/sửa/xóa thương hiệu
  - Upload logo thương hiệu
  - Quản lý danh sách sản phẩm theo thương hiệu

#### 10. Tạo sản phẩm
- **Bảng liên quan**: `products`, `product_categories`, `product_relations`
- **Chức năng**:
  - Tạo sản phẩm với đầy đủ thông tin (tên, mô tả, SEO)
  - Gán danh mục, thương hiệu
  - Thêm tags, material, care instructions
  - Đánh dấu sản phẩm nổi bật
  - Quản lý sản phẩm liên quan (upsell, cross-sell)

#### 11. Upload ảnh và gán ảnh chính
- **Bảng liên quan**: `medias`, `product_images`
- **Chức năng**:
  - Upload nhiều ảnh cho sản phẩm
  - Đặt ảnh chính (primary image)
  - Sắp xếp thứ tự ảnh
  - Tối ưu và resize ảnh tự động
  - Lưu trữ trên cloud storage

#### 12. Tạo biến thể & giá
- **Bảng liên quan**: `product_variants`, `attributes`, `attribute_values`, `variant_attribute_values`
- **Chức năng**:
  - Tạo biến thể sản phẩm (size, color, material)
  - Đặt giá cho từng biến thể
  - Quản lý SKU
  - So sánh giá (compare_at_price)
  - Giá vốn (cost_price)

#### 13. Cập nhật tồn kho
- **Bảng liên quan**: `stocks`, `inventory_reservations`
- **Chức năng**:
  - Cập nhật số lượng tồn kho
  - Đặt mức tồn kho an toàn (safety stock)
  - Xem lịch sử nhập/xuất kho
  - Tự động giữ hàng khi có đơn (reservation)
  - Cảnh báo hết hàng

#### 14. Import sản phẩm từ CSV
- **Bảng liên quan**: `products`, `product_variants`, `stocks`
- **Chức năng**:
  - Upload file CSV
  - Validate dữ liệu
  - Import hàng loạt sản phẩm, biến thể, giá, tồn kho
  - Báo cáo kết quả import (thành công/lỗi)
  - Template CSV mẫu

---

### 🛒 Nhóm 4 – Đơn hàng & Thanh toán (8 SD)

#### 15. Tạo đơn hàng (checkout)
- **Bảng liên quan**: `orders`, `order_items`, `carts`, `cart_items`, `inventory_reservations`
- **Chức năng**:
  - Chuyển giỏ hàng thành đơn hàng
  - Chọn địa chỉ giao hàng
  - Chọn phương thức thanh toán & vận chuyển
  - Áp dụng mã giảm giá
  - Tính toán tổng tiền (subtotal, discount, tax, shipping, grand total)
  - Tạo mã đơn hàng duy nhất
  - Giữ hàng trong kho (reservation)

#### 16. Xác nhận thanh toán online (webhook)
- **Bảng liên quan**: `payments`, `orders`, `idempotency_keys`
- **Chức năng**:
  - Nhận webhook từ payment gateway
  - Xác thực chữ ký webhook
  - Cập nhật trạng thái thanh toán
  - Xử lý idempotency (tránh xử lý trùng)
  - Cập nhật trạng thái đơn hàng
  - Gửi email xác nhận

#### 17. Xác nhận thanh toán COD
- **Bảng liên quan**: `payments`, `orders`
- **Chức năng**:
  - Xác nhận đã nhận tiền COD
  - Cập nhật trạng thái thanh toán
  - Ghi nhận thời gian xác nhận
  - Cập nhật trạng thái đơn hàng

#### 18. Cập nhật trạng thái vận chuyển
- **Bảng liên quan**: `shipments`, `orders`
- **Chức năng**:
  - Tạo shipment cho đơn hàng
  - Cập nhật tracking number
  - Cập nhật trạng thái (ready, shipped, delivered)
  - Ghi nhận thời gian giao hàng
  - Gửi thông báo cho khách hàng

#### 19. Hủy đơn hàng chưa thanh toán
- **Bảng liên quan**: `orders`, `inventory_reservations`, `stocks`
- **Chức năng**:
  - Hủy đơn hàng ở trạng thái pending/unpaid
  - Trả lại hàng vào kho (release reservation)
  - Ghi nhận lý do hủy
  - Gửi thông báo cho khách hàng

#### 20. Hoàn tiền toàn phần
- **Bảng liên quan**: `refunds`, `payments`, `orders`
- **Chức năng**:
  - Tạo yêu cầu hoàn tiền toàn bộ
  - Xử lý hoàn tiền qua payment gateway
  - Cập nhật trạng thái refund
  - Gửi thông báo cho khách hàng

#### 21. Hoàn tiền một phần
- **Bảng liên quan**: `refunds`, `payments`, `orders`, `return_items`
- **Chức năng**:
  - Tạo yêu cầu hoàn tiền một phần
  - Tính toán số tiền hoàn lại
  - Xử lý hoàn tiền
  - Cập nhật trạng thái

#### 22. Tự động hủy đơn quá hạn (cron)
- **Bảng liên quan**: `orders`, `inventory_reservations`
- **Chức năng**:
  - Chạy cron job định kỳ
  - Tìm đơn hàng quá hạn thanh toán
  - Tự động hủy và trả hàng vào kho
  - Gửi thông báo cho khách hàng

---

### 💬 Nhóm 5 – CSKH & Review (5 SD)

#### 23. Tạo ticket hỗ trợ
- **Bảng liên quan**: `tickets`, `ticket_messages`
- **Chức năng**:
  - Khách hàng tạo ticket hỗ trợ
  - Gán nhân viên xử lý
  - Đặt mức độ ưu tiên
  - Theo dõi trạng thái (open, in_progress, resolved, closed)

#### 24. Phản hồi ticket (chat nhân viên – khách)
- **Bảng liên quan**: `ticket_messages`, `tickets`
- **Chức năng**:
  - Nhân viên và khách hàng chat trong ticket
  - Gửi tin nhắn text
  - Upload file đính kèm
  - Đánh dấu đã đọc
  - Cập nhật trạng thái ticket

#### 25. Tạo yêu cầu đổi trả
- **Bảng liên quan**: `returns`, `return_items`, `orders`
- **Chức năng**:
  - Khách hàng tạo yêu cầu đổi trả
  - Chọn sản phẩm cần đổi trả
  - Nhập lý do đổi trả
  - Upload ảnh minh chứng
  - Theo dõi trạng thái yêu cầu

#### 26. Duyệt/khước từ yêu cầu đổi trả
- **Bảng liên quan**: `returns`, `return_items`, `refunds`
- **Chức năng**:
  - Nhân viên xem danh sách yêu cầu
  - Duyệt hoặc từ chối yêu cầu
  - Tự động tạo refund khi duyệt
  - Gửi thông báo cho khách hàng

#### 27. Duyệt & ẩn review vi phạm
- **Bảng liên quan**: `reviews`, `moderation_flags`
- **Chức năng**:
  - Xem danh sách review chờ duyệt
  - Duyệt review hợp lệ
  - Ẩn/xóa review vi phạm
  - Gắn cờ vi phạm (spam, inappropriate content)
  - Cập nhật trạng thái review (pending, approved, hidden)

---

### 📢 Nhóm 6 – Marketing (3 SD)

#### 28. Tạo coupon giảm giá
- **Bảng liên quan**: `coupons`
- **Chức năng**:
  - Tạo mã giảm giá (code)
  - Chọn loại giảm giá (% hoặc số tiền cố định)
  - Đặt điều kiện (min order, max discount)
  - Thiết lập thời gian hiệu lực
  - Giới hạn số lần sử dụng
  - Giới hạn số lần sử dụng/người dùng

#### 29. Theo dõi sử dụng coupon
- **Bảng liên quan**: `coupon_usages`, `coupons`
- **Chức năng**:
  - Xem danh sách coupon đã sử dụng
  - Thống kê số lần sử dụng
  - Xem đơn hàng đã áp dụng coupon
  - Báo cáo hiệu quả coupon

#### 30. Tạo banner quảng cáo
- **Bảng liên quan**: `banners`
- **Chức năng**:
  - Tạo banner quảng cáo
  - Upload ảnh banner
  - Đặt link khi click
  - Chọn vị trí hiển thị (home, category, product)
  - Bật/tắt banner
  - Sắp xếp thứ tự hiển thị

---

### 🛍️ Nhóm 7 – Khách hàng (6 SD)

#### 31. Duyệt sản phẩm & lọc tìm kiếm
- **Bảng liên quan**: `products`, `product_variants`, `categories`, `brands`
- **Chức năng**:
  - Xem danh sách sản phẩm
  - Lọc theo danh mục, thương hiệu, giá
  - Tìm kiếm sản phẩm
  - Sắp xếp (mới nhất, giá, bán chạy)
  - Phân trang
  - Xem chi tiết sản phẩm

#### 32. Thêm vào wishlist
- **Bảng liên quan**: `wishlists`, `wishlist_items`
- **Chức năng**:
  - Thêm sản phẩm vào wishlist
  - Xem danh sách wishlist
  - Xóa sản phẩm khỏi wishlist
  - Chuyển từ wishlist sang giỏ hàng

#### 33. Thêm vào giỏ hàng
- **Bảng liên quan**: `carts`, `cart_items`
- **Chức năng**:
  - Thêm sản phẩm vào giỏ hàng
  - Chọn biến thể (size, color)
  - Cập nhật số lượng
  - Xóa sản phẩm khỏi giỏ hàng
  - Xem tổng tiền giỏ hàng
  - Lưu giỏ hàng cho user đã đăng nhập

#### 34. Áp mã giảm giá
- **Bảng liên quan**: `coupons`, `coupon_usages`, `carts`
- **Chức năng**:
  - Nhập mã giảm giá
  - Validate mã (còn hiệu lực, đủ điều kiện)
  - Tính toán giảm giá
  - Áp dụng vào giỏ hàng
  - Hiển thị tổng tiền sau giảm giá

#### 35. Thanh toán (checkout flow đầy đủ)
- **Bảng liên quan**: `orders`, `order_items`, `payments`, `addresses`
- **Chức năng**:
  - Chọn địa chỉ giao hàng
  - Chọn phương thức thanh toán
  - Chọn phương thức vận chuyển
  - Xem lại đơn hàng
  - Xác nhận đặt hàng
  - Chuyển hướng thanh toán (nếu online)
  - Xác nhận đơn hàng thành công

#### 36. Viết review + upload hình ảnh
- **Bảng liên quan**: `reviews`, `review_media`, `medias`, `order_items`
- **Chức năng**:
  - Viết đánh giá sản phẩm (chỉ sau khi mua)
  - Chọn sao (1-5)
  - Upload ảnh minh họa
  - Xem review của người khác
  - Like/helpful review

---

### 🤖 Nhóm 8 – Hệ thống & AI (4 SD)

#### 37. Gợi ý sản phẩm theo hành vi (recommendation)
- **Bảng liên quan**: `recommendations`, `events`, `embeddings`, `products`
- **Chức năng**:
  - Thu thập hành vi người dùng (view, add to cart, purchase)
  - Tính toán điểm gợi ý dựa trên hành vi
  - Hiển thị sản phẩm gợi ý
  - Sử dụng embedding vectors cho similarity search
  - Cập nhật gợi ý định kỳ

#### 38. Sinh mô tả sản phẩm bằng AI
- **Bảng liên quan**: `ai_prompts`, `ai_runs`, `products`
- **Chức năng**:
  - Nhập thông tin cơ bản sản phẩm
  - Gọi AI API để sinh mô tả
  - Lưu prompt và kết quả
  - Chỉnh sửa mô tả sau khi sinh
  - Lưu lịch sử sử dụng AI

#### 39. Tự động dọn giỏ hàng/đơn hàng hết hạn
- **Bảng liên quan**: `carts`, `orders`, `inventory_reservations`
- **Chức năng**:
  - Cron job dọn giỏ hàng cũ (không hoạt động > 30 ngày)
  - Tự động hủy đơn hàng quá hạn thanh toán
  - Giải phóng reservation hàng hóa
  - Gửi email nhắc nhở trước khi xóa

#### 40. Phát hiện & cảnh báo thanh toán bất thường
- **Bảng liên quan**: `payments`, `orders`, `events`, `audit_logs`
- **Chức năng**:
  - Theo dõi pattern thanh toán
  - Phát hiện giao dịch bất thường (số tiền lớn, tần suất cao)
  - Gửi cảnh báo cho admin
  - Tạm khóa thanh toán nếu nghi ngờ
  - Ghi log audit

---

## 👥 Chia nhiệm vụ

### 📅 Thời gian: 1 tuần

| Người | Phạm vi | Số SD | Ghi chú |
|-------|---------|-------|---------|
| **A – Backend chính** | Phân quyền, cửa hàng, sản phẩm, đơn hàng, AI nền | **~22 SD** | Dùng Postman để test API song song |
| **B – Frontend chính** | Giỏ hàng, khách hàng, CSKH, marketing, giao diện | **~18 SD** | Dùng React/Tailwind/Refine Devtools |

### Chi tiết phân công:

#### 👨‍💻 Người A – Backend chính (~22 SD)

**Nhóm 1 – Người dùng & Phân quyền (4 SD)**
- ✅ SD 1: Đăng ký / đăng nhập
- ✅ SD 2: Gán vai trò cho nhân viên
- ✅ SD 3: Cập nhật thông tin tài khoản
- ✅ SD 4: Đăng xuất và hủy token

**Nhóm 2 – Cấu hình & Cửa hàng (3 SD)**
- ✅ SD 5: Cập nhật thông tin cửa hàng
- ✅ SD 6: Cấu hình phương thức thanh toán
- ✅ SD 7: Cấu hình phương thức vận chuyển

**Nhóm 3 – Sản phẩm & Kho (7 SD)**
- ✅ SD 8: Tạo danh mục sản phẩm
- ✅ SD 9: Tạo thương hiệu (Brand)
- ✅ SD 10: Tạo sản phẩm
- ✅ SD 11: Upload ảnh và gán ảnh chính
- ✅ SD 12: Tạo biến thể & giá
- ✅ SD 13: Cập nhật tồn kho
- ✅ SD 14: Import sản phẩm từ CSV

**Nhóm 4 – Đơn hàng & Thanh toán (8 SD)**
- ✅ SD 15: Tạo đơn hàng (checkout)
- ✅ SD 16: Xác nhận thanh toán online (webhook)
- ✅ SD 17: Xác nhận thanh toán COD
- ✅ SD 18: Cập nhật trạng thái vận chuyển
- ✅ SD 19: Hủy đơn hàng chưa thanh toán
- ✅ SD 20: Hoàn tiền toàn phần
- ✅ SD 21: Hoàn tiền một phần
- ✅ SD 22: Tự động hủy đơn quá hạn (cron)

**Nhóm 8 – Hệ thống & AI (4 SD)**
- ✅ SD 37: Gợi ý sản phẩm theo hành vi (recommendation)
- ✅ SD 38: Sinh mô tả sản phẩm bằng AI
- ✅ SD 39: Tự động dọn giỏ hàng/đơn hàng hết hạn
- ✅ SD 40: Phát hiện & cảnh báo thanh toán bất thường

**Công việc:**
- Thiết kế và implement REST API
- Xử lý business logic
- Tích hợp payment gateway
- Xử lý webhook
- Tạo cron jobs
- Tích hợp AI services
- Test API bằng Postman

---

#### 👩‍💻 Người B – Frontend chính (~18 SD)

**Nhóm 5 – CSKH & Review (5 SD)**
- ✅ SD 23: Tạo ticket hỗ trợ
- ✅ SD 24: Phản hồi ticket (chat nhân viên – khách)
- ✅ SD 25: Tạo yêu cầu đổi trả
- ✅ SD 26: Duyệt/khước từ yêu cầu đổi trả
- ✅ SD 27: Duyệt & ẩn review vi phạm

**Nhóm 6 – Marketing (3 SD)**
- ✅ SD 28: Tạo coupon giảm giá
- ✅ SD 29: Theo dõi sử dụng coupon
- ✅ SD 30: Tạo banner quảng cáo

**Nhóm 7 – Khách hàng (6 SD)**
- ✅ SD 31: Duyệt sản phẩm & lọc tìm kiếm
- ✅ SD 32: Thêm vào wishlist
- ✅ SD 33: Thêm vào giỏ hàng
- ✅ SD 34: Áp mã giảm giá
- ✅ SD 35: Thanh toán (checkout flow đầy đủ)
- ✅ SD 36: Viết review + upload hình ảnh

**Công việc:**
- Thiết kế UI/UX
- Implement React components
- Sử dụng Tailwind CSS cho styling
- Tích hợp Refine Devtools
- Xử lý state management
- Tích hợp API từ backend
- Responsive design
- Xử lý upload file (ảnh)

---

## 🚀 Cài đặt

### Yêu cầu hệ thống:
- Node.js >= 18.x
- MySQL/MariaDB >= 10.4
- PHP >= 8.0 (nếu dùng Laravel)
- Composer (nếu dùng Laravel)

### Cài đặt Database:

```bash
# Import database schema
mysql -u root -p < tlcn_demo_complete.sql
```

### Cài đặt Backend:

```bash
# Clone repository
git clone <repo-url>
cd backend

# Cài đặt dependencies
npm install  # hoặc composer install

# Cấu hình .env
cp .env.example .env
# Chỉnh sửa thông tin database, JWT secret, etc.

# Chạy migrations (nếu có)
npm run migrate  # hoặc php artisan migrate

# Chạy server
npm run dev  # hoặc php artisan serve
```

### Cài đặt Frontend:

```bash
# Clone repository
git clone <repo-url>
cd frontend

# Cài đặt dependencies
npm install

# Cấu hình .env
cp .env.example .env
# Chỉnh sửa API endpoint

# Chạy dev server
npm run dev
```

---

## 🛠️ Công nghệ sử dụng

### Backend:
- **Framework**: Laravel / Express.js / NestJS
- **Database**: MySQL/MariaDB
- **Authentication**: JWT (access token + refresh token)
- **Payment**: Stripe / PayPal / VNPay
- **File Storage**: AWS S3 / Cloudinary / Local
- **AI Services**: OpenAI API / Google AI
- **Queue**: Redis / RabbitMQ
- **Cron**: Laravel Scheduler / node-cron

### Frontend:
- **Framework**: React.js
- **UI Library**: Tailwind CSS
- **State Management**: Redux / Zustand / React Query
- **Form Handling**: React Hook Form
- **API Client**: Axios / Fetch
- **Dev Tools**: Refine Devtools
- **Build Tool**: Vite / Create React App

---

## 📝 Ghi chú

- Tất cả API cần có authentication (JWT)
- Implement rate limiting để tránh abuse
- Log tất cả các thao tác quan trọng vào `audit_logs`
- Sử dụng transaction cho các thao tác liên quan đến tiền
- Validate input từ phía client và server
- Xử lý lỗi một cách graceful
- Document API bằng Swagger/OpenAPI

---

## 📞 Liên hệ

Nếu có thắc mắc, vui lòng tạo issue hoặc liên hệ team.

---

**Version**: 1.0.0  
**Last Updated**: 2025

