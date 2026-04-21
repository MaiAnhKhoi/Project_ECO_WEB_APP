# 📮 Hướng dẫn sử dụng Postman Collection - Fashion API

## 📥 Import vào Postman

### Bước 1: Import Collection
1. Mở Postman
2. Click **Import** (góc trên bên trái)
3. Chọn file `Fashion-API.postman_collection.json`
4. Click **Import**

### Bước 2: Import Environment (Optional nhưng khuyến nghị)
1. Click **Import** lần nữa
2. Chọn file `Fashion-API.postman_environment.json`
3. Click **Import**
4. Chọn environment **"Fashion API - Local"** từ dropdown ở góc trên bên phải

## 🚀 Cách sử dụng

### 1. Kiểm tra Base URL
- Đảm bảo server đang chạy tại `http://localhost:8080`
- Nếu server chạy ở port khác, cập nhật biến `baseUrl` trong Environment hoặc Collection Variables

### 2. Flow Test cơ bản

#### A. Đăng ký và Xác thực Email (Customer Self-Signup)

**Bước 1: Đăng ký tài khoản mới**
```
POST /api/auth/register
Body:
{
  "name": "Nguyễn Văn A",
  "email": "nguyenvana@gmail.com",
  "password": "123456",
  "passwordConfirm": "123456",
  "phone": "0327793283"
}
```

**Bước 2: Kiểm tra email và lấy mã OTP**
- Hệ thống sẽ gửi email chứa mã OTP 6 chữ số
- Kiểm tra console hoặc email của bạn

**Bước 3: Xác thực email với OTP**
```
POST /api/auth/verify-email
Body:
{
  "email": "nguyenvana@gmail.com",
  "code": "123456"
}
```

#### B. Đăng nhập và Sử dụng Token

**Bước 1: Đăng nhập**
```
POST /api/auth/login
Body:
{
  "email": "nguyenvana@gmail.com",
  "password": "123456"
}
```

**✨ Auto-save Token:**
Collection đã được cấu hình để tự động lưu `accessToken` và `refreshToken` vào biến sau khi đăng nhập thành công!

**Bước 2: Test các API yêu cầu authentication**
- Tất cả các request khác sẽ tự động sử dụng token đã lưu
- Ví dụ: `GET /api/auth/me` để lấy thông tin user hiện tại

#### C. Refresh Token khi Access Token hết hạn

```
POST /api/auth/refresh-token
Body:
{
  "refreshToken": "{{refreshToken}}"
}
```
Access token mới sẽ tự động được lưu vào biến.

#### D. Đăng xuất

```
POST /api/auth/logout
```
Token hiện tại sẽ bị thu hồi.

### 3. Quên mật khẩu Flow

**Bước 1: Yêu cầu reset password**
```
POST /api/auth/forgot-password
Body:
{
  "email": "nguyenvana@gmail.com"
}
```

**Bước 2: Kiểm tra email và lấy mã reset**

**Bước 3: Reset password với mã**
```
POST /api/auth/reset-password
Body:
{
  "email": "nguyenvana@gmail.com",
  "code": "123456",
  "newPassword": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

### 4. Đổi mật khẩu (đã đăng nhập)

```
POST /api/auth/change-password
Body:
{
  "oldPassword": "123456",
  "newPassword": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

## 👥 User Management APIs (Cần quyền Admin/Staff)

### Quản lý Users

- **GET /api/users** - Danh sách users (có phân trang)
- **GET /api/users/search?keyword=nguyen** - Tìm kiếm users
- **GET /api/users/{id}** - Chi tiết user
- **POST /api/users** - Tạo user mới
- **PUT /api/users/{id}** - Cập nhật user
- **DELETE /api/users/{id}** - Xóa user

### Quản lý Status

- **PUT /api/users/{id}/status** - Cập nhật status trực tiếp
- **POST /api/users/{id}/activate** - Kích hoạt user
- **POST /api/users/{id}/suspend** - Tạm khóa user
- **POST /api/users/{id}/lock** - Khóa user
- **POST /api/users/{id}/unlock** - Mở khóa user

### Quản lý Roles

- **POST /api/users/{id}/assign-roles** - Gán nhiều roles
- **DELETE /api/users/{id}/roles/{roleId}** - Xóa role

### Khác

- **GET /api/users/{id}/login-history** - Lịch sử đăng nhập
- **POST /api/users/{id}/reset-password** - Admin reset password
- **GET /api/users/by-role/{roleCode}** - Lấy users theo role

## 🔑 Role & Permission Management (Admin Only)

### Role Management

- **GET /api/roles** - Danh sách roles (có phân trang)
- **GET /api/roles/all** - Tất cả roles (không phân trang)
- **GET /api/roles/{id}** - Chi tiết role
- **GET /api/roles/code/{code}** - Lấy role theo code (ADMIN, CUSTOMER, STAFF...)
- **POST /api/roles** - Tạo role mới
- **PUT /api/roles/{id}** - Cập nhật role
- **DELETE /api/roles/{id}** - Xóa role

### Permission Management

- **GET /api/roles/permissions** - Danh sách tất cả permissions
- **POST /api/roles/{roleId}/permissions** - Gán permissions cho role
  ```json
  [1, 2, 3, 4]
  ```
- **DELETE /api/roles/{roleId}/permissions/{permissionId}** - Xóa permission

### Staff Invitation System

**Flow mời nhân viên:**

1. **Admin gửi lời mời:**
```
POST /api/roles/invite
Body:
{
  "email": "staff@example.com",
  "name": "John Doe",
  "roleIds": [2, 3]
}
```

2. **Staff nhận email với link invitation**

3. **Staff accept invitation và đặt password:**
```
POST /api/roles/invitations/{token}/accept
Body:
{
  "password": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

4. **Staff có thể đăng nhập bình thường**

**Quản lý invitations:**
- **GET /api/roles/invitations** - Danh sách invitations
- **GET /api/roles/invitations/status/{status}** - Lọc theo status (PENDING, ACCEPTED, EXPIRED, CANCELLED)
- **GET /api/roles/invitations/{id}** - Chi tiết invitation
- **POST /api/roles/invitations/{id}/resend** - Gửi lại email
- **POST /api/roles/invitations/{id}/cancel** - Hủy invitation

## 🔐 Authentication & Authorization

### Bearer Token
Collection đã được cấu hình sẵn Bearer Token authentication với biến `{{accessToken}}`.

### Public Endpoints (Không cần token)
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh-token`
- `POST /api/auth/verify-email`
- `POST /api/auth/resend-verification`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `POST /api/roles/invitations/{token}/accept`

### Protected Endpoints (Cần token)
Tất cả các endpoint còn lại cần authentication.

### Role-based Access Control
- **Admin**: Full access tất cả APIs
- **Staff**: Tùy thuộc vào permissions được gán
- **Customer**: Chỉ có thể truy cập profile của chính mình

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "timestamp": "2024-11-13T10:30:00"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message here",
  "errors": {
    "field1": "Error detail",
    "field2": "Error detail"
  },
  "timestamp": "2024-11-13T10:30:00"
}
```

### Paginated Response
```json
{
  "success": true,
  "data": {
    "content": [ ... ],
    "page": 0,
    "size": 20,
    "totalElements": 100,
    "totalPages": 5,
    "last": false
  }
}
```

## 🎯 Quick Test Scenarios

### Scenario 1: Tạo Customer Account
1. Register → 2. Verify Email → 3. Login → 4. Get Profile

### Scenario 2: Tạo Staff Account
1. Admin Login → 2. Invite Staff → 3. Staff Accept Invitation → 4. Staff Login

### Scenario 3: Quản lý User
1. Admin Login → 2. Get All Users → 3. Update User → 4. Assign Roles

### Scenario 4: Reset Password
1. Forgot Password → 2. Check Email → 3. Reset Password → 4. Login with new password

## 🔧 Environment Variables

Các biến có thể tùy chỉnh:

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `baseUrl` | API base URL | `http://localhost:8080` |
| `accessToken` | JWT access token | (auto-saved after login) |
| `refreshToken` | JWT refresh token | (auto-saved after login) |
| `userId` | Current user ID | (manual set if needed) |

## ⚠️ Lưu ý

1. **Email Configuration**: Đảm bảo SMTP đã được cấu hình đúng trong `application.properties` để nhận email OTP và invitation.

2. **Token Expiration**: 
   - Access Token: 1 giờ (mặc định)
   - Refresh Token: 30 ngày (mặc định)

3. **Rate Limiting**: Một số endpoints có thể có rate limiting (nếu đã enable).

4. **Database**: Đảm bảo MySQL đang chạy và database đã được tạo.

5. **Redis** (Optional): Nếu sử dụng caching, đảm bảo Redis đang chạy.

## 📝 Common HTTP Status Codes

- **200 OK**: Request thành công
- **201 Created**: Tạo resource thành công
- **400 Bad Request**: Dữ liệu input không hợp lệ
- **401 Unauthorized**: Chưa đăng nhập hoặc token không hợp lệ
- **403 Forbidden**: Không có quyền truy cập
- **404 Not Found**: Resource không tồn tại
- **409 Conflict**: Conflict (ví dụ: email đã tồn tại)
- **500 Internal Server Error**: Lỗi server

## 🆘 Troubleshooting

### Lỗi 403 Forbidden
- Kiểm tra xem endpoint có trong danh sách public endpoints trong `SecurityConfig.java`
- Đảm bảo token đang được gửi đúng cách trong header Authorization

### Token không được auto-save
- Kiểm tra tab "Tests" trong request Login
- Đảm bảo response trả về đúng format với `data.accessToken`

### Email không được gửi
- Kiểm tra cấu hình SMTP trong `application.properties`
- Xem logs để debug lỗi email service

### Database connection error
- Đảm bảo MySQL đang chạy
- Kiểm tra credentials trong `application.properties`

## 📞 Support

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra logs của Spring Boot application
2. Xem API_TESTING_GUIDE.md để biết thêm chi tiết
3. Kiểm tra Swagger UI tại: `http://localhost:8080/swagger-ui.html`

---

**Total APIs**: 43 endpoints
- Authentication: 10 endpoints
- User Management: 16 endpoints  
- Role & Permission: 17 endpoints

Happy Testing! 🚀

