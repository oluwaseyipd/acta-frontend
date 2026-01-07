# Acta - Zed AI Rules

## Project Overview

Acta is a modern task management application built with React, TypeScript, and Tailwind CSS. The frontend is designed to connect to a Django REST API backend.

---

## Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: Zustand (persisted to localStorage)
- **Routing**: React Router DOM v6
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Animations**: Framer Motion
- **Forms**: React Hook Form with Zod validation
- **Data Fetching**: TanStack Query (React Query)
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Date Handling**: date-fns
- **Notifications**: Sonner (toast notifications)

### Backend (Planned)
- **Framework**: Django 5.x with Django REST Framework
- **Database**: PostgreSQL
- **Authentication**: JWT (SimpleJWT)
- **API Style**: RESTful

---

## Project Structure

```
src/
├── components/
│   ├── dashboard/       # Dashboard-specific components
│   ├── layout/          # Layout components (Sidebar, TopBar, etc.)
│   ├── providers/       # Context providers (Theme, etc.)
│   ├── settings/        # Settings page components
│   └── ui/              # shadcn/ui components
├── hooks/               # Custom React hooks
├── lib/                 # Utilities and API client
├── pages/
│   ├── auth/            # Authentication pages
│   └── dashboard/       # Dashboard pages
├── store/               # Zustand stores
└── assets/              # Static assets
```

---

## Design System Rules

### CRITICAL: Color Usage

**NEVER use hardcoded colors in components.** Always use semantic design tokens.

```tsx
// ❌ WRONG - Never do this
<div className="bg-blue-500 text-white">
<div className="bg-[#1a1a2e]">

// ✅ CORRECT - Use semantic tokens
<div className="bg-primary text-primary-foreground">
<div className="bg-card text-card-foreground">
<div className="bg-muted text-muted-foreground">
```

### Available Semantic Tokens

```
--background / --foreground       # Main app background
--card / --card-foreground        # Card surfaces
--popover / --popover-foreground  # Popovers and dropdowns
--primary / --primary-foreground  # Primary actions
--secondary / --secondary-foreground  # Secondary elements
--muted / --muted-foreground      # Muted/subtle elements
--accent / --accent-foreground    # Accent highlights
--destructive / --destructive-foreground  # Danger/delete actions
--border                          # Border colors
--input                           # Input field borders
--ring                            # Focus rings
--sidebar-*                       # Sidebar-specific tokens
```

### Theme Support

The app supports multiple theme presets stored in `useUIStore`:
- midnight, forest, sunset, lavender, nordic, cyberpunk

Always ensure components work with both light and dark color modes.

---

## Coding Conventions

### Component Structure

```tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ComponentProps {
  title: string;
  className?: string;
}

export const Component = ({ title, className }: ComponentProps) => {
  const [state, setState] = useState(false);

  return (
    <motion.div 
      className={cn("base-classes", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {title}
    </motion.div>
  );
};
```

### Import Order

1. React imports
2. Third-party libraries
3. UI components (@/components/ui/*)
4. Custom components
5. Hooks
6. Utilities and types
7. Stores

### File Naming

- Components: PascalCase (`TaskCard.tsx`)
- Hooks: camelCase with `use` prefix (`use-sound.ts`)
- Utilities: kebab-case (`api-client.ts`)
- Stores: kebab-case with `-store` suffix (`ui-store.ts`)

---

## State Management

### Zustand Store Pattern

```tsx
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface StoreState {
  value: string;
  setValue: (value: string) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      value: '',
      setValue: (value) => set({ value }),
    }),
    {
      name: 'storage-key',
      partialize: (state) => ({ value: state.value }),
    }
  )
);
```

### UI Store (`useUIStore`)

Manages:
- `sidebarCollapsed`: boolean
- `commandPaletteOpen`: boolean
- `themePreset`: ThemePreset
- `colorMode`: 'light' | 'dark' | 'system'
- `taskViewMode`: 'list' | 'kanban'

---

## Animation Guidelines

Use Framer Motion for all animations:

```tsx
// Page transitions
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>

// Staggered children
<motion.div variants={containerVariants}>
  {items.map((item, i) => (
    <motion.div key={i} variants={itemVariants} />
  ))}
</motion.div>

// Hover effects
<motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
```

---

## API Integration

### Axios Client Pattern

```tsx
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

// Add auth interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### React Query Pattern

```tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Query
const { data, isLoading } = useQuery({
  queryKey: ['tasks'],
  queryFn: () => apiClient.get('/tasks/').then(res => res.data),
});

// Mutation
const queryClient = useQueryClient();
const mutation = useMutation({
  mutationFn: (newTask) => apiClient.post('/tasks/', newTask),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
});
```

---

## Component Guidelines

### Modal Pattern

```tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const Modal = ({ open, onOpenChange }: ModalProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Title</DialogTitle>
      </DialogHeader>
      {/* Content */}
    </DialogContent>
  </Dialog>
);
```

### Form Pattern

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  title: z.string().min(1, 'Required'),
});

type FormData = z.infer<typeof schema>;

export const Form = () => {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { title: '' },
  });

  const onSubmit = (data: FormData) => {
    // Handle submit
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Form fields */}
      </form>
    </Form>
  );
};
```

---

## Task Data Structure

```typescript
interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
  due_date: string; // ISO date
  category?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}
```

---

## Best Practices

### DO
- Use semantic color tokens from the design system
- Keep components small and focused
- Use TypeScript interfaces for all props
- Add motion animations for better UX
- Use `cn()` utility for conditional classes
- Persist user preferences with Zustand
- Use React Query for server state

### DON'T
- Hardcode colors (use tokens)
- Create monolithic components
- Use `any` type
- Skip loading/error states
- Mutate state directly
- Mix server and client state

---

## Accessibility

- Always include `aria-label` for icon-only buttons
- Use semantic HTML elements
- Ensure sufficient color contrast
- Support keyboard navigation
- Include focus indicators

---

## Testing Considerations

- Components should be testable in isolation
- Use data-testid for E2E testing
- Mock API calls in tests
- Test loading and error states

---

## Backend API Endpoints Reference

See `docs/DJANGO_BACKEND_GUIDE.md` for complete API documentation.

Key endpoints:
- `POST /api/v1/auth/register/` - User registration
- `POST /api/v1/auth/login/` - JWT login
- `GET/POST /api/v1/tasks/` - Task CRUD
- `GET /api/v1/tasks/today/` - Today's tasks
- `GET /api/v1/analytics/dashboard/` - Dashboard stats


# Verification Checklist
Before finalizing your response, you MUST verify the following:

- ✅ Are `shadcn/ui` components used for UI where appropriate?  
- ✅ Are keys loaded from `.env.local` and not hardcoded?  
- ✅ Are Tailwind CSS classes used consistently for styling?  
- ✅ Are error states handled gracefully with meaningful feedback?
