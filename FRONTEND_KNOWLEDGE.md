# Acta Frontend - Architecture & Integration Knowledge Base

This document maps out the frontend structure, authentication flows, API contracts, client-side computations, and configurations for **Acta** (formerly TaskTide). Use this to align and compare with backend implementations.

---

## 🛠️ Technology Stack
* **Framework**: React + TypeScript (Vite bundler)
* **Remote State & Caching**: TanStack Query v5 (React Query)
* **Local UI State**: Zustand (`useUIStore`)
* **Styling**: Tailwind CSS + custom glassmorphic variables (`src/index.css`)
* **Animations**: Framer Motion
* **Forms & Validation**: React Hook Form + Zod Resolvers

---

## 🔑 Authentication Flow & Tokens

The frontend uses standard token-based OAuth and JWT auth.

### Local Storage Tokens
* `access_token`: Stored in `localStorage`.
* `refresh_token`: Stored in `localStorage`.

### Interceptors (`src/lib/api-client.ts`)
1. **Request Interceptor**: Automatically attaches `Authorization: Bearer <access_token>` to every request if the token exists.
2. **Response Interceptor (Token Refresh)**:
   * Catches `401 Unauthorized` responses.
   * If a `401` is received, it executes a single retry attempt by sending a `POST` request with the `refresh_token` payload (`{ refresh: refreshToken }`) to `/auth/token/refresh/`.
   * On success: Updates `access_token` in `localStorage` and retries the original request.
   * On failure (refresh expired): Clears local tokens and redirects the user to `/auth/signin`.

### Third-Party / Social Logins
* **Google OAuth Flow**:
  1. Frontend requests the authorization URL from `GET` `/auth/google/url/` and redirects the user to Google.
  2. On success, Google redirects back to `/auth/google/callback` with a `code` query parameter.
  3. The frontend callback page extracts the `code` and sends a `POST` to `/auth/google/callback/` with payload `{ code }` to exchange it for `access` and `refresh` tokens.
* **Facebook Login**: Entirely **removed** from the frontend codebase.

---

## 📡 API Endpoints Configuration
Mapped in [api-client.ts](file:///d:/OVERSIGHT/acta-frontend/src/lib/api-client.ts):

| Module | Endpoint | Method | Payload / Return Format |
| :--- | :--- | :--- | :--- |
| **Auth** | `/auth/login/` | `POST` | Input: `{ email, password }` <br> Output: `{ access: string, refresh: string }` |
| | `/auth/register/` | `POST` | Input: `{ first_name, last_name, email, password, password_confirm }` <br> Output: `{ access: string, refresh: string }` |
| | `/auth/logout/` | `POST` | Clears tokens. |
| | `/auth/token/refresh/` | `POST` | Input: `{ refresh: string }` <br> Output: `{ access: string }` |
| | `/users/profile/` | `GET` | Returns full user profile object. |
| | `/users/profile/` | `PATCH`| Updates profile. Content-Type: `multipart/form-data`. |
| | `/auth/google/url/` | `GET` | Output: `{ url: string }` |
| | `/auth/google/callback/`| `POST` | Input: `{ code: string }` <br> Output: `{ access: string, refresh: string }` |
| | `/auth/password/reset/` | `POST` | Input: `{ email: string }` (triggers email) |
| | `/auth/password/reset/confirm/`| `POST` | Input: `{ token: string, new_password: string, new_password_confirm: string }` |
| | `/auth/password/change/`| `POST` | Input: `{ old_password: string, new_password: string, new_password_confirm: string }` |
| **Categories**| `/categories/` | `GET` | Fetches categories. *Handles pagination `{ results: Category[] }` or flat array `Category[]`.* |
| | `/categories/` | `POST` | Input: `{ name: string }` |
| **Tasks** | `/tasks/` | `GET` | Fetches all tasks. *Handles pagination `{ results: Task[] }` or flat array `Task[]`.* |
| | `/tasks/` | `POST` | Creates a task. |
| | `/tasks/<id>/` | `PATCH` | Partially updates a task. |
| | `/tasks/<id>/` | `DELETE`| Deletes a task. |
| **Stats (Inactive)**| `/stats/` | `GET` | *Configured but not currently queried.* |
| | `/stats/daily-progress/`| `GET` | *Configured but not currently queried.* |

---

## 🗄️ Data Contracts & Serialization

### 1. User Profile Model
The frontend validation schema (`profileSchema`) parses the profile response and expects:
* `first_name` (string)
* `last_name` (string)
* `email` (string)
* `phone_number` (string \| null \| optional)
* `location` (string \| null \| optional)
* `avatar` (File object / URL string)
* `website` (string \| null \| optional)
* `bio` (string \| null \| optional)

### 2. Category Model
* `id` (string)
* `name` (string)

### 3. Task Model
Mapped in [task.ts](file:///d:/OVERSIGHT/acta-frontend/src/types/task.ts):
```typescript
export type Priority = "low" | "medium" | "high";
export type Status = "todo" | "in_progress" | "completed";

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status?: Status;
  createdAt?: string;
  created_at?: string;     // Support snake_case response
  due_date?: string;       // Primary ISO Date-Time (e.g. "2026-06-20T23:59:59Z")
  dueDate?: string;        // Fallback compatibility
  dueTime?: string;
  due_time?: string;       // Fallback compatibility
  category?: string;       // References Category UUID/ID
}
```

---

## 📊 Client-Side Business Logic & Layouts

### 1. Analytics & Statistics
All metrics displayed in the dashboard and analytics view are computed **entirely client-side** using the raw `/tasks/` list (rather than backend stats endpoints):
* **Completion Rate**: `Math.round((completedTasks / totalTasks) * 100)`
* **Daily Progress**: Ratio of completed tasks due today to total tasks due today.
* **Velocity**: Count of tasks completed in the last `N` days (range options: 7, 30, 90).
* **Overdue Tasks**: Count of tasks where `status !== "completed"` and `due_date` is earlier than today.
* **Streaks**: Calculated by checking consecutive days (from today or yesterday backwards) that have at least one task marked as completed.

### 2. Kanban View
* **Layout Design**: In this application, the Kanban board columns are organized by **due dates** (e.g., "Today", "Tomorrow", "No Due Date", etc.), horizontally arranged, rather than by task statuses (`todo`, `in_progress`, `completed`). Toggle checkboxes allow tasks to be completed directly in their columns.

---

## 📧 External integrations (EmailJS)
Used for the contact form to bypass the need for a mail server in the backend.
* **Config variables**: `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY`.
* **Payload mapping**:
  ```javascript
  {
    from_name: data.name,
    from_email: data.email,
    subject: data.subject,
    message: data.message,
    to_name: 'Acta Team',
    reply_to: data.email,
  }
  ```

---

## ⚠️ Potential Alignment Gaps (Backend Sync Checkpoints)

1. **Task Status Values**:
   * *Status Enums in Frontend UI*: `todo`, `in_progress`, `completed`.
   * *Task Status on Creation*: In [CreateTaskModal.tsx](file:///d:/OVERSIGHT/acta-frontend/src/components/dashboard/CreateTaskModal.tsx), the payload hardcodes `"status": "pending"` during task creation. 
   * **Inconsistency Warning**: If the backend database doesn't support `"pending"` (e.g. if it enforces a Django choice list containing only `todo`, `in_progress`, `completed`), task creation will fail or result in inconsistent states.
2. **Date Keys**:
   * The frontend has compatibility logic mapping both `due_date` (snake_case) and `dueDate` (camelCase) due to history. Ensure the backend expects `due_date` and returns `due_date` and `created_at` in standard ISO formats.
3. **Categories Pagination**:
   * The category fetching code automatically extracts `data.results || data`. Ensure that if pagination is enabled on categories on the backend, it formats as `{ results: [...] }`, or if not, it returns a plain JSON array.
4. **Stats Endpoints**:
   * If you have `/stats/` or `/stats/daily-progress/` endpoints on the backend, note they are currently ignored by the frontend. The dashboard parses stats on-the-fly from the `/tasks/` array.
