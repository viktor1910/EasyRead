# Auth API Update Summary

## Những thay đổi đã thực hiện:

### 1. Cập nhật Auth Service (`src/services/auth/authService.ts`)

- ✅ Thay đổi endpoints từ `/login`, `/register`, `/logout` sang `/users/login/`, `/users/register/`, `/users/logout/`
- ✅ Thêm endpoint `/users/me/` để lấy thông tin user hiện tại
- ✅ Giữ nguyên cấu trúc React Query hooks và legacy compatibility

### 2. Cập nhật Type Definitions (`src/types/api/auth.ts`)

- ✅ Cập nhật interface `User`:
  - Thay đổi từ `name` sang `username`, `first_name`, `last_name`
  - Giữ nguyên `email`, `role`, `email_verified_at`
- ✅ Cập nhật interface `RegisterRequest`:
  - Thay đổi từ `name`, `password_confirmation` sang `username`, `first_name`, `last_name`
  - Thêm field `role` (optional)

### 3. Cập nhật AxiosConfig (`src/AxiosConfig.ts`)

- ✅ Thay đổi authorization header từ `Bearer ${token}` sang `Token ${token}`
- ✅ Giữ nguyên request/response interceptors

### 4. Cập nhật AuthContext (`src/context/AuthContext/AuthContext.jsx`)

- ✅ Cập nhật cấu trúc userData trong login function
- ✅ Cập nhật register function để sử dụng parameters mới:
  - `(username, email, password, firstName, lastName)` thay vì `(name, email, password, confirmedPassword)`

### 5. Cập nhật UI Components

- ✅ **RegisterPage** (`src/pages/Auth/RegisterPage.jsx`):

  - Thêm fields: username, firstName, lastName
  - Xóa field confirmedPassword (validation sẽ được handle ở backend)
  - Cập nhật form submission logic

- ✅ **MyAccountPage** (`src/pages/MyAccountPage.jsx`):

  - Thay đổi từ `user.name` sang `user.username`

- ✅ **AdminPage** (`src/pages/Admin/AdminPage.jsx`):
  - Cập nhật table hiển thị từ `user.name` sang `user.username`

### 6. Tạo Test Component

- ✅ Tạo `AuthTestComponent.jsx` để test tích hợp API mới

## API Endpoints mới (theo Postman collection):

```
POST /users/register/
Body: {
  "username": "testuser",
  "email": "testuser@example.com",
  "password": "securepassword123",
  "first_name": "Test",
  "last_name": "User",
  "role": "user"
}

POST /users/login/
Body: {
  "email": "testuser@example.com",
  "password": "securepassword123"
}

POST /users/logout/
Headers: Authorization: Token {token}

GET /users/me/
Headers: Authorization: Token {token}
```

## Response Format:

```json
{
  "token": "authentication_token_here",
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "testuser@example.com",
    "first_name": "Test",
    "last_name": "User",
    "role": "user"
  }
}
```

## Lưu ý:

- Tất cả các component hiện tại sẽ hoạt động với cấu trúc mới
- Legacy hooks vẫn được giữ lại để đảm bảo backward compatibility
- Token format đã được thay đổi từ "Bearer" sang "Token"
- Validation mật khẩu sẽ được handle ở backend thay vì frontend
