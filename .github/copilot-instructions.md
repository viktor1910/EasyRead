# EasyRead Frontend AI Instructions

## Project Overview

EasyRead is a React-based web application built with Vite, focusing on providing a reading platform with features like PDF reading, book categories, and user management. The project uses modern React patterns and Material-UI for styling.

## Key Architecture Components

### Core Technologies

- React with Vite for fast development and build optimization
- react-router (not react-router-dom) for navigation
- Material-UI (@mui) for component library and theming
- PDF.js for PDF document handling

### Project Structure

```
src/
├── components/     # Reusable UI components
├── context/       # React context providers
├── layout/        # Page layout components
├── pages/         # Route-based page components
└── theme/         # MUI theme customization
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

## Best Practices

1. Keep page-specific components in the respective page directory
2. Use Material-UI components for consistent styling
3. Implement protected routes for authenticated features
4. Follow the established component directory structure with index.jsx as entry points

## Note

This is a frontend-only project. Backend integration points should be handled according to the corresponding backend API documentation.
