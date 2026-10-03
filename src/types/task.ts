export type Priority = "low" | "medium" | "high";
export type Status = "todo" | "in_progress" | "completed";

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status?: Status;
  createdAt?: string;
  created_at?: string;
  due_date?: string;
  dueDate?: string;
  dueTime?: string;
  due_time?: string;
  completed_at?: string;
  completedAt?: string;
  category?: string;
}
