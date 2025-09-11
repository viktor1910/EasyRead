# EasyRead Frontend AI Instructions

## Project Overview

EasyRead is a React-based web application built with Vite, focusing on providing a reading platform with features like PDF reading, book categories, and user management. The project uses modern React patterns, Material-UI for styling, React Query for state management, and React Hook Form for form handling.

## Key Architecture Components

### Core Technologies

- React with Vite for fast development and build optimization
- react-router (not react-router-dom) for navigation
- Material-UI (@mui) for component library and theming
- PDF.js for PDF document handling
- TanStack Query (React Query) for server state management and caching
- React Hook Form for form validation and state management

### Project Structure

```
src/
├── components/     # Reusable UI components
├── context/       # React context providers (Auth, Cart, Query)
├── layout/        # Page layout components
├── pages/         # Route-based page components
│   └── Admin/     # Admin panel components
│       └── Books/ # Books management
│           ├── hooks/        # Custom React Query hooks
│           └── components/   # Feature-specific components
├── theme/         # MUI theme customization
└── utils/         # API utilities and helpers
```

### Critical Patterns

1. **Protected Routes**

   - Authentication/authorization handled via `ProtectedRoute` component in `context/PermissionContext`
   - Example: Admin and user account pages use this wrapper

   ```jsx
   <ProtectedRoute>
     <PageLayout>
       <Component />
     </PageLayout>
   </ProtectedRoute>
   ```

2. **Page Layout Structure**

   - All pages use the `PageLayout` wrapper from `layout/PageLayout.jsx`
   - Provides consistent header/footer and layout structure

3. **Component Organization**

   - Feature-first organization under `pages/`
   - Shared components in `components/`
   - Page-specific components nested under respective page directories

4. **State Management Patterns**

   - **Server State**: Use React Query for all API data fetching and caching
   - **Form State**: Use React Hook Form for form validation and submission
   - **Client State**: Use React Context for authentication, cart, and global UI state

   ```jsx
   // Example React Query usage
   const { data, isLoading, error } = useBooksQuery(params);

   // Example React Hook Form usage
   const {
     register,
     handleSubmit,
     formState: { errors },
   } = useForm();
   ```

5. **API Integration**

   - All API calls are handled through `utils/api.js`
   - Use custom hooks for reusable query logic
   - Implement proper error handling and loading states

6. **Custom Hooks Pattern**

   - Create custom hooks for complex logic reuse
   - Organize hooks in `hooks/` folders within feature directories
   - Example: `useBooksQuery.js`, `useCategoriesQuery.js`

   ```jsx
   // Custom hook usage example
   import { useBooksQuery, useCreateBookMutation } from "./hooks/useBooksQuery";
   import { useCategoriesQuery } from "./hooks/useCategoriesQuery";

   const MyComponent = () => {
     const { data: books, isLoading } = useBooksQuery({ page: 1, limit: 10 });
     const { data: categories } = useCategoriesQuery();
     const createMutation = useCreateBookMutation();

     const handleCreate = (data) => {
       createMutation.mutate(data, {
         onSuccess: () => console.log("Book created!"),
         onError: (error) => console.error(error),
       });
     };
   };
   ```

## Development Workflow

### Common Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint
```

### Key Integration Points

- PDF reading functionality through `PDFReader` component
- Material-UI theme customization in `theme/palette.js`
- Route protection via `usePermission` hook
- API integration through centralized `utils/api.js`
- Query client setup in `context/QueryProvider.tsx`

### Book Management Features

The Admin Books management system includes:

- **Book Model Fields**: `title`, `slug`, `price`, `discount`, `stock`, `status`, `description`, `image_url`, `category_id`
- **Form Management**: React Hook Form with validation
- **Auto-slug Generation**: Automatic slug creation from book title
- **Status Management**: Active/Inactive/Draft status options
- **Category Integration**: Dynamic category dropdown loading
- **Real-time Updates**: Optimistic updates with React Query cache invalidation

## Best Practices

1. Keep page-specific components in the respective page directory
2. Use Material-UI components for consistent styling
3. Implement protected routes for authenticated features
4. Follow the established component directory structure with index.jsx as entry points
5. Use React Query for all server state management and API calls
6. Implement custom hooks for reusable query logic
7. Use React Hook Form for all form handling with proper validation
8. Organize hooks in dedicated `hooks/` folders within feature directories
9. Implement proper loading states and error handling for all async operations
10. Use optimistic updates and cache invalidation for better UX

### React Query Best Practices

- Use descriptive query keys: `['books', { page, limit }]`
- Implement proper cache invalidation after mutations
- Set appropriate stale times for different data types
- Use custom hooks to encapsulate query logic
- Handle loading and error states consistently

### Form Handling Best Practices

- Use React Hook Form for all forms
- Implement client-side validation with proper error messages
- Auto-generate slugs for SEO-friendly URLs
- Format numeric inputs properly before API submission
- Reset forms after successful submission

## Note

This is a frontend-only project. Backend integration points should be handled according to the corresponding backend API documentation.
