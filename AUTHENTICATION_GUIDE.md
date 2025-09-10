# Hướng dẫn sử dụng Authentication và Role-based Protection

## 1. Cấu trúc User Model

```javascript
const user = {
  name: "Tên người dùng",
  email: "user@example.com",
  password: "hashed_password",
  role: "user", // hoặc "admin", "guest"
};
```

## 2. Trang Login

Trang login đã được tạo tại `/src/pages/Login/index.jsx` với các tính năng:

- Form đăng nhập với email và password
- Validation cơ bản
- Loading state
- Error handling
- Auto redirect dựa trên role sau khi đăng nhập thành công

### Truy cập: `http://localhost:5173/login`

## 3. Đăng nhập và lưu token

```javascript
import { useAuth } from '../context/AuthContext';
import AxiosConfig from '../AxiosConfig';

const LoginComponent = () => {
  const { login } = useAuth();

  const handleLogin = async (credentials) => {
    try {
      const response = await AxiosConfig.post('/login', credentials);
      const { message, user, token } = response.data;

      if (message === 'Login successful') {
        // Lưu user và token
        login(user, token);

        // Redirect dựa trên role
        if (user.role === 'admin') {
          window.location.href = '/admin';
        } else {
          window.location.href = '/';
        }
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    // JSX login form
  );
};
```

## 3. Sử dụng ProtectedRoute

### Bảo vệ trang Admin (chỉ admin):

```jsx
<Route
  path="/admin/*"
  element={
    <ProtectedRoute requiredRole="admin">
      <AdminPage />
    </ProtectedRoute>
  }
/>
```

### Bảo vệ trang yêu cầu đăng nhập:

```jsx
<Route
  path="/my-account"
  element={
    <ProtectedRoute requireAuth={true}>
      <MyAccountPage />
    </ProtectedRoute>
  }
/>
```

### Bảo vệ với nhiều role:

```jsx
<Route
  path="/premium-content"
  element={
    <ProtectedRoute requiredRole={["admin", "premium_user"]}>
      <PremiumContent />
    </ProtectedRoute>
  }
/>
```

## 4. Sử dụng hook trong Component

```jsx
import { useAuth } from "../context/AuthContext";
import { useRoleCheck } from "../hooks/useRoleCheck";

const MyComponent = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { isAdmin, canAccessAdmin } = useRoleCheck();

  return (
    <div>
      {isAuthenticated() && <p>Chào mừng, {user.name}!</p>}

      {isAdmin() && <Button href="/admin">Vào trang Admin</Button>}

      {user && <Button onClick={logout}>Đăng xuất</Button>}
    </div>
  );
};
```

## 5. Kiểm tra Role trong Component

```jsx
import { useAuth } from "../context/AuthContext";

const Navigation = () => {
  const { hasRole, hasAnyRole } = useAuth();

  return (
    <nav>
      <Link to="/">Trang chủ</Link>

      {hasRole("admin") && <Link to="/admin">Quản trị</Link>}

      {hasAnyRole(["user", "admin"]) && <Link to="/my-account">Tài khoản</Link>}
    </nav>
  );
};
```

## 6. Xử lý đăng xuất

```jsx
const { logout } = useAuth();

const handleLogout = () => {
  logout(); // Tự động xóa token và user khỏi localStorage
  window.location.href = "/";
};
```

## Flow hoạt động:

1. User đăng nhập → BE trả về user model và token
2. Frontend lưu user và token vào localStorage
3. AxiosConfig tự động thêm token vào header cho mọi API call
4. ProtectedRoute kiểm tra role của user trước khi render component
5. Nếu không đủ quyền → hiển thị trang 403 NoPermission
6. Nếu token hết hạn → AxiosConfig tự động logout và redirect về login
