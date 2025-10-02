# Categories API Update Summary

## Những thay đổi đã thực hiện:

### 1. Cập nhật Categories Service (`src/services/categories/categoriesService.ts`)

- ✅ **Endpoints**: Thêm trailing slash `/` cho tất cả endpoints

  - GET `/categories/`
  - POST `/categories/`
  - GET `/categories/{id}/`
  - PUT `/categories/{id}/`
  - DELETE `/categories/{id}/`

- ✅ **Request Format**: Thay đổi từ FormData sang JSON body

  - Create category: Sử dụng JSON thay vì FormData
  - Update category: Sử dụng PUT method với JSON body
  - Loại bỏ multipart/form-data headers

- ✅ **Data Structure**: Cập nhật theo API specification
  - `image` field nhận URL string thay vì File object
  - Đảm bảo tất cả fields được xử lý đúng format

### 2. Cập nhật Type Definitions (`src/types/api/books.ts`)

- ✅ **CreateCategoryRequest**: Thay đổi `image?: File` thành `image?: string`
- ✅ **UpdateCategoryRequest**: Kế thừa từ CreateCategoryRequest với optional fields
- ✅ Giữ nguyên Category interface với các fields:
  - `name`, `slug`, `description`, `image_url`, `books_count`

### 3. Cập nhật Legacy Compatibility (`src/pages/Admin/Books/hooks/useCategoriesQuery.js`)

- ✅ Re-export các hooks từ categoriesService chính
- ✅ Đảm bảo backward compatibility cho existing components
- ✅ Loại bỏ duplicate code và sử dụng central service

### 4. Tạo Test Component

- ✅ Tạo `CategoriesTestComponent.jsx` để test tích hợp API mới
- ✅ Test các operations: Create, Read, Update, Delete
- ✅ Form để test create/update với các fields mới

## API Endpoints mới (theo Postman collection):

```
GET /categories/
Response: Array of Category objects

POST /categories/
Body: {
  "name": "Engine Parts",
  "slug": "engine-parts",
  "image": "https://example.com/engine-parts.jpg",
  "description": "Optional description"
}

GET /categories/{id}/
Response: Single Category object

PUT /categories/{id}/
Body: {
  "name": "Updated Engine Parts",
  "slug": "updated-engine-parts",
  "image": "https://example.com/updated-engine-parts.jpg",
  "description": "Updated description"
}

DELETE /categories/{id}/
Response: 204 No Content
```

## Cấu trúc Category Object:

```json
{
  "id": 1,
  "name": "Engine Parts",
  "slug": "engine-parts",
  "description": "Motorcycle engine components",
  "image_url": "https://example.com/engine-parts.jpg",
  "books_count": 15,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

## React Query Hooks Available:

### Primary Hooks:

- `useCategories()` - Fetch all categories
- `useCategory(id)` - Fetch single category
- `useCreateCategory()` - Create new category
- `useUpdateCategory()` - Update existing category
- `useDeleteCategory()` - Delete category

### Legacy Hooks (for backward compatibility):

- `useCategoriesQuery()` - Alias for useCategories
- `useCreateCategoryMutation()` - Alias for useCreateCategory
- `useUpdateCategoryMutation()` - Alias for useUpdateCategory
- `useDeleteCategoryMutation()` - Alias for useDeleteCategory

## Lưu ý:

- Image field giờ đây nhận URL string thay vì File upload
- Tất cả endpoints sử dụng JSON body thay vì FormData
- PUT method được sử dụng cho update thay vì POST
- Trailing slash bắt buộc cho tất cả endpoints
- Backward compatibility được đảm bảo qua legacy hooks
