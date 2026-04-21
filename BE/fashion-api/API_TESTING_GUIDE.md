# 🧪 API Testing Guide - User Management APIs

## ✅ Hoàn thành 100% - Sẵn sàng test!

Tất cả services đã được implement đầy đủ. Bạn có thể start application và test các APIs ngay bây giờ.

---

## 🚀 Bước 1: Start Application

```bash
# Clean và build project
mvn clean install

# Start application
mvn spring-boot:run

# Hoặc
./mvnw spring-boot:run
```

Application sẽ chạy trên: `http://localhost:8080`

---

## 📖 Bước 2: Xem API Documentation (Swagger)

Mở browser và truy cập:
```
http://localhost:8080/swagger-ui.html
```

Tại đây bạn sẽ thấy tất cả 43 endpoints được document đầy đủ.

---

## 🧪 Bước 3: Test APIs với Postman/cURL

### 3.1. Register (Customer Self-Signup)

**POST** `/api/auth/register`

```json
{
  "name": "Nguyễn Văn A",
  "email": "customer@example.com",
  "password": "Password123",
  "passwordConfirm": "Password123",
  "phone": "0123456789"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Registration successful. Please check your email to verify your account.",
  "data": {
    "id": 1,
    "name": "Nguyễn Văn A",
    "email": "customer@example.com",
    "status": "PENDING",
    "emailVerified": false
  },
  "timestamp": 1699876543210
}
```

**Email sent** với OTP code: `123456`

---

### 3.2. Verify Email

**POST** `/api/auth/verify-email`

```json
{
  "email": "customer@example.com",
  "code": "123456"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Email verified successfully",
  "data": null,
  "timestamp": 1699876543210
}
```

Sau khi verify, user status → `ACTIVE`

---

### 3.3. Login

**POST** `/api/auth/login`

```json
{
  "identifier": "customer@example.com",
  "password": "Password123",
  "rememberMe": false
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzUxMiJ9...",
    "refreshToken": "eyJhbGciOiJIUzUxMiJ9...",
    "tokenType": "Bearer",
    "expiresIn": 3600,
    "user": {
      "id": 1,
      "name": "Nguyễn Văn A",
      "email": "customer@example.com",
      "status": "ACTIVE",
      "roles": [
        {
          "id": 7,
          "code": "USER",
          "name": "Customer"
        }
      ]
    }
  },
  "timestamp": 1699876543210
}
```

**Lưu accessToken** để sử dụng cho các requests tiếp theo!

---

### 3.4. Get Current User Profile (Authenticated)

**GET** `/api/auth/me`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9...
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Nguyễn Văn A",
    "email": "customer@example.com",
    "emailVerified": true,
    "status": "ACTIVE",
    "roles": [...]
  },
  "timestamp": 1699876543210
}
```

---

## 👨‍💼 Flow 2: Admin Invite Staff

### 4.1. Admin Login (tạo admin user trước trong DB)

Trước tiên cần tạo admin user trong database:

```sql
-- Insert admin user
INSERT INTO users (name, email, password_hash, status, email_verified_at, created_at) 
VALUES ('Admin User', 'admin@fashionshop.com', '$2a$10$...', 'ACTIVE', NOW(), NOW());

-- Insert ADMIN role
INSERT INTO roles (code, name) VALUES ('ADMIN', 'Administrator');

-- Assign ADMIN role to user
INSERT INTO user_roles (user_id, role_id) VALUES (1, 1);
```

Sau đó login:

**POST** `/api/auth/login`
```json
{
  "identifier": "admin@fashionshop.com",
  "password": "AdminPassword123"
}
```

---

### 4.2. Invite Staff

**POST** `/api/roles/invite`

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Body:**
```json
{
  "email": "staff@fashionshop.com",
  "roleIds": [2, 3],
  "message": "Welcome to our team!"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Invitation sent successfully",
  "data": {
    "id": 1,
    "email": "staff@fashionshop.com",
    "status": "PENDING",
    "roles": [
      {"id": 2, "code": "PRODUCT_MANAGER", "name": "Product Manager"},
      {"id": 3, "code": "ORDER_MANAGER", "name": "Order Manager"}
    ],
    "expiresAt": "2024-11-15T10:00:00",
    "createdAt": "2024-11-14T10:00:00"
  },
  "timestamp": 1699876543210
}
```

**Email sent** với link: `http://localhost:3000/accept-invitation?token=abc123...`

---

### 4.3. Accept Invitation

**POST** `/api/roles/invitations/{token}/accept`

**Body:**
```json
{
  "token": "abc123...",
  "name": "Nguyễn Văn B",
  "password": "StaffPass123",
  "passwordConfirm": "StaffPass123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Invitation accepted successfully. You can now login.",
  "data": {
    "id": 1,
    "email": "staff@fashionshop.com",
    "status": "ACCEPTED",
    "usedAt": "2024-11-14T11:00:00"
  },
  "timestamp": 1699876543210
}
```

User được tạo với:
- Status: `ACTIVE` (auto-verified)
- Roles: `PRODUCT_MANAGER`, `ORDER_MANAGER`

---

## 🔑 Flow 3: Password Reset

### 5.1. Forgot Password

**POST** `/api/auth/forgot-password`

```json
{
  "email": "customer@example.com"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password reset code sent to your email",
  "timestamp": 1699876543210
}
```

**Email sent** với reset code: `987654`

---

### 5.2. Reset Password

**POST** `/api/auth/reset-password`

```json
{
  "email": "customer@example.com",
  "code": "987654",
  "newPassword": "NewPassword123",
  "newPasswordConfirm": "NewPassword123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password reset successful",
  "timestamp": 1699876543210
}
```

---

## 👥 User Management APIs (Admin Only)

### 6.1. Get All Users (Paginated)

**GET** `/api/users?page=0&size=20`

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "content": [...],
    "page": 0,
    "size": 20,
    "totalElements": 50,
    "totalPages": 3,
    "first": true,
    "last": false
  },
  "timestamp": 1699876543210
}
```

---

### 6.2. Search Users

**GET** `/api/users/search?keyword=nguyen&page=0&size=20`

**Headers:**
```
Authorization: Bearer {admin_token}
```

---

### 6.3. Create User (Admin)

**POST** `/api/users`

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Body:**
```json
{
  "name": "New User",
  "email": "newuser@example.com",
  "password": "Password123",
  "username": "newuser",
  "phone": "0987654321",
  "gender": "male",
  "roleIds": [7]
}
```

---

### 6.4. Update User Status

**PUT** `/api/users/{id}/status`

**Body:**
```json
{
  "status": "SUSPENDED",
  "reason": "Violation of terms"
}
```

---

### 6.5. Assign Roles to User

**POST** `/api/users/{id}/assign-roles`

**Body:**
```json
{
  "roleIds": [2, 3, 4]
}
```

---

## 🎯 Role Management APIs

### 7.1. Get All Roles

**GET** `/api/roles`

**Headers:**
```
Authorization: Bearer {admin_token}
```

---

### 7.2. Create Role

**POST** `/api/roles`

**Body:**
```json
{
  "code": "CUSTOM_ROLE",
  "name": "Custom Role",
  "permissionIds": [1, 2, 3]
}
```

---

### 7.3. Get All Permissions

**GET** `/api/roles/permissions`

---

### 7.4. Assign Permissions to Role

**POST** `/api/roles/{roleId}/permissions`

**Body:**
```json
[1, 2, 3, 4, 5]
```

---

## 🔄 Token Refresh

**POST** `/api/auth/refresh-token`

```json
{
  "refreshToken": "eyJhbGciOiJIUzUxMiJ9..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "new_access_token...",
    "refreshToken": "new_refresh_token...",
    "tokenType": "Bearer",
    "expiresIn": 3600
  }
}
```

---

## 📝 Security Notes

### Authentication
- Tất cả endpoints (trừ public endpoints) require JWT token
- Token phải gửi trong header: `Authorization: Bearer {token}`
- Access token expires sau 1 hour
- Refresh token expires sau 30 days

### Role-Based Access Control
- `USER`: Chỉ truy cập own resources
- `ADMIN`: Full access tất cả endpoints
- Các role khác: Permission-based access

### Error Responses

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "User is not authenticated",
  "timestamp": 1699876543210
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "message": "Access denied: You don't have permission to access this resource",
  "timestamp": 1699876543210
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "User not found with id: 999",
  "timestamp": 1699876543210
}
```

**400 Bad Request (Validation):**
```json
{
  "success": false,
  "message": "Validation failed",
  "data": {
    "email": "Email should be valid",
    "password": "Password must be between 8 and 100 characters"
  },
  "timestamp": 1699876543210
}
```

---

## 🧪 Postman Collection

Bạn có thể import Postman collection với tất cả endpoints đã được setup sẵn.

### Quick Setup:
1. Create new Postman Collection
2. Add environment variables:
   - `base_url`: `http://localhost:8080`
   - `access_token`: (sẽ set sau khi login)
3. Import các requests theo document này

### Auto-save Token:
Sau khi login, thêm script vào Tests tab:
```javascript
var jsonData = pm.response.json();
if (jsonData.success && jsonData.data.accessToken) {
    pm.environment.set("access_token", jsonData.data.accessToken);
}
```

---

## ✅ Testing Checklist

### Customer Flow:
- [ ] Register new customer
- [ ] Verify email with OTP
- [ ] Login với verified account
- [ ] Get current user profile
- [ ] Update profile
- [ ] Change password
- [ ] Forgot password
- [ ] Reset password with code

### Staff Invitation Flow:
- [ ] Admin login
- [ ] Admin invite staff with roles
- [ ] Staff receive email with invitation link
- [ ] Staff accept invitation và set password
- [ ] Staff login với new account
- [ ] Verify staff has correct roles

### Admin User Management:
- [ ] Get all users (paginated)
- [ ] Search users by keyword
- [ ] Create user manually
- [ ] Update user info
- [ ] Update user status (activate/suspend/lock)
- [ ] Assign roles to user
- [ ] Remove role from user
- [ ] View user login history
- [ ] Admin reset user password

### Role Management:
- [ ] Get all roles
- [ ] Create new role
- [ ] Update role
- [ ] Delete role
- [ ] Get all permissions
- [ ] Assign permissions to role
- [ ] Remove permission from role

### Token Management:
- [ ] Refresh access token
- [ ] Logout (revoke token)
- [ ] Access protected endpoint với valid token
- [ ] Access protected endpoint với expired token (should fail)

---

## 🎉 You're All Set!

Application đã hoàn chỉnh và sẵn sàng để test. Happy testing! 🚀


