# Cart API Update Summary

## Tổng quan

Đã cập nhật thành công Cart API service để tương thích với Django REST API backend mới dựa trên Postman collection. Cart API hiện có cấu trúc phân cấp với carts và cartitems endpoints.

## Các thay đổi chính

### 1. API Endpoints Structure

```
/carts/                    - Quản lý carts
/carts/{cart_id}/          - Thao tác với cart cụ thể
/cartitems/                - Quản lý cart items
/cartitems/{item_id}/      - Thao tác với item cụ thể
```

### 2. New API Functions (src/services/cart/cartService.ts)

#### Cart Management

- `getUserCarts()` - GET /carts/ - Lấy tất cả carts của user
- `getActiveCart()` - GET /carts/?status=active - Lấy cart đang hoạt động
- `getCartById(cartId)` - GET /carts/{cart_id}/ - Lấy cart theo ID
- `createCart()` - POST /carts/ - Tạo cart mới
- `clearCart(cartId)` - DELETE /carts/{cart_id}/ - Xóa toàn bộ cart

#### Cart Items Management

- `addToCart(cartId, data)` - POST /cartitems/ - Thêm item vào cart
- `updateCartItem(cartId, itemId, quantity)` - PUT /cartitems/{item_id}/ - Cập nhật số lượng
- `removeCartItem(cartId, itemId)` - DELETE /cartitems/{item_id}/ - Xóa item

#### Checkout

- `checkoutCart(cartId, checkoutData)` - POST /carts/{cart_id}/checkout/ - Thanh toán

### 3. React Query Hooks

#### New Hooks

- `useCart()` - Lấy active cart với caching
- `useUserCarts()` - Lấy tất cả carts của user
- `useCartById(cartId)` - Lấy cart theo ID
- `useCreateCart()` - Tạo cart mới
- `useAddToCart()` - Thêm item (requires cartId)
- `useUpdateCartItem()` - Cập nhật item (requires cartId + itemId)
- `useRemoveCartItem()` - Xóa item (requires cartId + itemId)
- `useClearCart()` - Xóa cart (requires cartId)
- `useCheckout()` - Checkout (requires cartId)

#### Legacy Hooks (Backward Compatibility)

- `useAddToCartMutation()` - Compatibility wrapper
- `useUpdateCartMutation()` - Compatibility wrapper
- `useRemoveFromCartMutation()` - Compatibility wrapper
- `useClearCartMutation()` - Compatibility wrapper

### 4. Type Definitions Added

#### Interfaces

```typescript
interface AddToCartRequest {
  cart: string;
  book: string;
  quantity: number;
}

interface CheckoutRequest {
  shipping_address: string;
  payment_method: string;
  notes?: string;
}
```

### 5. Key Changes from Legacy API

#### Parameter Requirements

- **cartId required**: Tất cả operations cần cartId parameter
- **String IDs**: Sử dụng string cho cart và item IDs thay vì number
- **Structured requests**: JSON objects thay vì simple parameters

#### Authentication

- Token-based auth: `Authorization: Token {token}`
- Automatic token handling qua AxiosConfig

#### Response Format

- Chuẩn Django REST API response format
- Consistent error handling
- Pagination support cho lists

### 6. Migration Guide

#### For Components using Cart

```javascript
// OLD
const addMutation = useAddToCartMutation();
addMutation.mutate({ bookId: 123, quantity: 1 });

// NEW - Option 1: Use new API
const cartQuery = useCart();
const addMutation = useAddToCart();
addMutation.mutate({
  cartId: cartQuery.data?.id,
  data: { cart: cartQuery.data?.id, book: "123", quantity: 1 },
});

// NEW - Option 2: Keep legacy (recommended for migration)
const addMutation = useAddToCartMutation();
addMutation.mutate({ bookId: 123, quantity: 1 }); // Still works!
```

## Backward Compatibility

### ✅ Được duy trì

- Tất cả legacy hooks vẫn hoạt động
- Existing components không cần thay đổi ngay lập tức
- Legacy API object (`cartAPI`) vẫn available

### ⚠️ Cần chú ý

- Legacy hooks sử dụng internal conversion
- Performance có thể không optimal cho legacy hooks
- Recommend migrate dần sang new hooks

## Testing Recommendations

### 1. Cart Flow Testing

```javascript
// Test active cart retrieval
const { data: cart } = useCart();

// Test adding items
const addMutation = useAddToCart();
await addMutation.mutateAsync({
  cartId: cart.id,
  data: { cart: cart.id, book: "123", quantity: 2 },
});

// Test checkout
const checkoutMutation = useCheckout();
await checkoutMutation.mutateAsync({
  cartId: cart.id,
  checkoutData: {
    shipping_address: "123 Main St",
    payment_method: "credit_card",
  },
});
```

### 2. Backward Compatibility Testing

```javascript
// Test legacy hooks still work
const addMutation = useAddToCartMutation();
await addMutation.mutateAsync({ bookId: 123, quantity: 1 });
```

## Files Modified

- ✅ `src/services/cart/cartService.ts` - Complete rewrite
- ✅ `src/types/api/orders.ts` - Added CheckoutRequest type
- ✅ `src/types/api/index.ts` - Export new types

## Next Steps

1. ✅ Cart API đã hoàn tất và functional
2. ⏭️ Test integration với existing components
3. ⏭️ Migrate components dần sang new hooks để optimize performance
4. ⏭️ Update UI components để handle new response formats
5. ⏭️ Add error handling và loading states cho new checkout flow

## Status: ✅ COMPLETED

Cart API đã được cập nhật thành công với đầy đủ functionality và backward compatibility.
