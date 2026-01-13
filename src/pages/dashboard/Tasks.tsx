import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback } from "react";
import {
  LayoutList,
  Kanban,
  Search,
  Calendar,
  Clock,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useUIStore } from "@/store/ui-store";
import { cn } from "@/lib/utils";
import { usePopSound } from "@/hooks/use-sound";
import { toast } from "sonner";
import { format } from "date-fns";
import { TaskDetailModal } from "@/components/dashboard/TaskDetailModal";
import { CreateTaskModal } from "@/components/dashboard/CreateTaskModal";

type Priority = "low" | "medium" | "high";
type Status = "todo" | "in_progress" | "completed";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  createdAt: string;
  dueDate: string;
  dueTime?: string;
}

const mockTasks: Task[] = [
  // Jan 4
  {
    id: "1",
    title: "Design system update",
    description: "Update colors and typography",
    priority: "high",
    status: "in_progress",
    createdAt: "2024-12-20",
    dueDate: "2026-01-04",
    dueTime: "14:00",
  },
  {
    id: "2",
    title: "API integration",
    description: "Connect to Django backend",
    priority: "high",
    status: "todo",
    createdAt: "2024-12-21",
    dueDate: "2026-01-04",
    dueTime: "10:00",
  },
  // Jan 5
  {
    id: "3",
    title: "Write unit tests",
    description: "Cover main components",
    priority: "medium",
    status: "todo",
    createdAt: "2024-12-22",
    dueDate: "2026-01-05",
    dueTime: "16:30",
  },
  {
    id: "4",
    title: "Documentation",
    description: "Update README file",
    priority: "low",
    status: "completed",
    createdAt: "2024-12-18",
    dueDate: "2026-01-05",
    dueTime: "09:00",
  },
  {
    id: "5",
    title: "Code review session",
    description: "Review pull requests",
    priority: "medium",
    status: "todo",
    createdAt: "2024-12-23",
    dueDate: "2026-01-05",
    dueTime: "11:00",
  },
  {
    id: "6",
    title: "Bug fixes",
    description: "Fix login issues",
    priority: "high",
    status: "todo",
    createdAt: "2024-12-24",
    dueDate: "2026-01-05",
    dueTime: "15:00",
  },
  {
    id: "7",
    title: "Team standup",
    description: "Daily sync meeting",
    priority: "low",
    status: "todo",
    createdAt: "2024-12-24",
    dueDate: "2026-01-05",
    dueTime: "09:30",
  },
  // Jan 6
  {
    id: "8",
    title: "Performance optimization",
    description: "Reduce bundle size",
    priority: "medium",
    status: "in_progress",
    createdAt: "2024-12-23",
    dueDate: "2026-01-06",
    dueTime: "11:00",
  },
  {
    id: "9",
    title: "Database migration",
    description: "Migrate to new schema",
    priority: "high",
    status: "todo",
    createdAt: "2024-12-24",
    dueDate: "2026-01-06",
    dueTime: "15:00",
  },
  // Jan 7
  {
    id: "10",
    title: "User feedback review",
    description: "Analyze survey results",
    priority: "medium",
    status: "todo",
    createdAt: "2024-12-25",
    dueDate: "2026-01-07",
    dueTime: "10:00",
  },
  {
    id: "11",
    title: "Design mockups",
    description: "Create new landing page",
    priority: "high",
    status: "todo",
    createdAt: "2024-12-25",
    dueDate: "2026-01-07",
    dueTime: "14:00",
  },
  {
    id: "12",
    title: "Client meeting",
    description: "Project status update",
    priority: "high",
    status: "todo",
    createdAt: "2024-12-25",
    dueDate: "2026-01-07",
    dueTime: "16:00",
  },
  // Jan 8
  {
    id: "13",
    title: "Security audit",
    description: "Review auth flow",
    priority: "high",
    status: "todo",
    createdAt: "2024-12-26",
    dueDate: "2026-01-08",
    dueTime: "09:00",
  },
  {
    id: "14",
    title: "Feature planning",
    description: "Q1 roadmap review",
    priority: "medium",
    status: "todo",
    createdAt: "2024-12-26",
    dueDate: "2026-01-08",
    dueTime: "11:00",
  },
  {
    id: "15",
    title: "API documentation",
    description: "Update Swagger docs",
    priority: "low",
    status: "todo",
    createdAt: "2024-12-26",
    dueDate: "2026-01-08",
    dueTime: "14:00",
  },
  {
    id: "16",
    title: "Testing session",
    description: "E2E testing",
    priority: "medium",
    status: "todo",
    createdAt: "2024-12-26",
    dueDate: "2026-01-08",
    dueTime: "16:00",
  },
  {
    id: "17",
    title: "Deployment prep",
    description: "Staging environment",
    priority: "high",
    status: "todo",
    createdAt: "2024-12-26",
    dueDate: "2026-01-08",
    dueTime: "17:00",
  },
  // Jan 9
  {
    id: "18",
    title: "Sprint retrospective",
    description: "Team feedback session",
    priority: "medium",
    status: "todo",
    createdAt: "2024-12-27",
    dueDate: "2026-01-09",
    dueTime: "10:00",
  },
  {
    id: "19",
    title: "Infrastructure review",
    description: "AWS cost optimization",
    priority: "low",
    status: "todo",
    createdAt: "2024-12-27",
    dueDate: "2026-01-09",
    dueTime: "14:00",
  },
  // Jan 10
  {
    id: "20",
    title: "Release preparation",
    description: "Version 2.0 release",
    priority: "high",
    status: "todo",
    createdAt: "2024-12-28",
    dueDate: "2026-01-10",
    dueTime: "09:00",
  },
  {
    id: "21",
    title: "Marketing sync",
    description: "Launch campaign review",
    priority: "medium",
    status: "todo",
    createdAt: "2024-12-28",
    dueDate: "2026-01-10",
    dueTime: "11:00",
  },
  {
    id: "22",
    title: "Training session",
    description: "New feature onboarding",
    priority: "low",
    status: "todo",
    createdAt: "2024-12-28",
    dueDate: "2026-01-10",
    dueTime: "15:00",
  },
  // Jan 11
  {
    id: "23",
    title: "Weekend monitoring",
    description: "Check system health",
    priority: "low",
    status: "todo",
    createdAt: "2024-12-29",
    dueDate: "2026-01-11",
    dueTime: "10:00",
  },
  {
    id: "24",
    title: "Backup verification",
    description: "Verify backup integrity",
    priority: "medium",
    status: "todo",
    createdAt: "2024-12-29",
    dueDate: "2026-01-11",
    dueTime: "12:00",
  },
];

const priorityColors = {
  low: "bg-info/10 text-info border-info/20",
  medium: "bg-warning/10 text-warning border-warning/20",
  high: "bg-destructive/10 text-destructive border-destructive/20",
};

const statusColors = {
  todo: "bg-muted text-muted-foreground",
  in_progress: "bg-primary/10 text-primary",
  completed: "bg-accent/10 text-accent",
};

export default function Tasks() {
  const { taskViewMode, setTaskViewMode } = useUIStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [completingTasks, setCompletingTasks] = useState<Set<string>>(
    new Set(),
  );
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createDefaultDate, setCreateDefaultDate] = useState<Date | undefined>(
    undefined,
  );
  const { playPop } = usePopSound();

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !completingTasks.has(task.id),
  );

  // Group tasks by due date for kanban view
  const groupedByDate = filteredTasks.reduce(
    (acc, task) => {
      const dateKey = task.dueDate;
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(task);
      return acc;
    },
    {} as Record<string, Task[]>,
  );

  // Sort dates chronologically
  const sortedDates = Object.keys(groupedByDate).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime(),
  );

  const formatColumnDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "EEEE, MMM d, yyyy");
    } catch {
      return dateStr;
    }
  };

  const handleTaskClick = (task: Task, e: React.MouseEvent) => {
    // Don't open modal if clicking on checkbox
    if ((e.target as HTMLElement).closest('[role="checkbox"]')) return;
    setSelectedTask(task);
    setIsDetailModalOpen(true);
  };

  const handleSaveTask = (updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)),
    );
    toast.success("Task updated!");
  };

  const handleToggleComplete = useCallback(
    (taskId: string, e?: React.MouseEvent) => {
      if (e) e.stopPropagation();

      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      const wasCompleted = task.status === "completed";
      const previousStatus = task.status;

      if (!wasCompleted) {
        // Mark as completing (trigger animation)
        setCompletingTasks((prev) => new Set(prev).add(taskId));
        playPop();

        // After animation, update status
        setTimeout(() => {
          setTasks((prev) =>
            prev.map((t) =>
              t.id === taskId ? { ...t, status: "completed" as Status } : t,
            ),
          );
          setCompletingTasks((prev) => {
            const next = new Set(prev);
            next.delete(taskId);
            return next;
          });

          toast.success("Task completed!", {
            description: task.title,
            action: {
              label: "UNDO",
              onClick: () => {
                setTasks((prev) =>
                  prev.map((t) =>
                    t.id === taskId ? { ...t, status: previousStatus } : t,
                  ),
                );
                toast.info("Task restored");
              },
            },
            position: "bottom-center",
          });
        }, 400);
      } else {
        // Uncomplete the task
        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId ? { ...t, status: "todo" as Status } : t,
          ),
        );
        toast.info("Task marked as incomplete", {
          action: {
            label: "UNDO",
            onClick: () => {
              setTasks((prev) =>
                prev.map((t) =>
                  t.id === taskId ? { ...t, status: "completed" as Status } : t,
                ),
              );
            },
          },
          position: "bottom-center",
        });
      }
    },
    [tasks, playPop],
  );

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "MMM d, yyyy");
    } catch {
      return dateStr;
    }
  };

  const formatTime = (timeStr?: string) => {
    if (!timeStr) return "";
    const [hours, minutes] = timeStr.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full overflow-hidden"
    >
      {/* Header - Fixed */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 flex-shrink-0">
        <div>
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="text-muted-foreground">
            {filteredTasks.length} tasks total
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-64"
            />
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-secondary">
            <Button
              variant={taskViewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setTaskViewMode("list")}
            >
              <LayoutList className="h-4 w-4" />
            </Button>
            <Button
              variant={taskViewMode === "kanban" ? "default" : "ghost"}
              size="sm"
              onClick={() => setTaskViewMode("kanban")}
            >
              <Kanban className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Task View - Scrollable Area */}
      {taskViewMode === "list" ? (
        <div className="space-y-6 overflow-y-auto flex-1">
          {sortedDates.map((dateKey) => (
            <div key={dateKey}>
              {/* Date Header */}
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                {formatColumnDate(dateKey)}
              </h3>

              <AnimatePresence mode="popLayout">
                {groupedByDate[dateKey].map((task) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{
                      opacity: completingTasks.has(task.id) ? 0 : 1,
                      x: completingTasks.has(task.id) ? -100 : 0,
                    }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    onClick={(e) => handleTaskClick(task, e)}
                    className="p-4 rounded-xl bg-card border border-border shadow-md hover:shadow-lg hover:border-primary/20 transition-all duration-200 cursor-pointer mb-3"
                  >
                    <div className="flex items-start gap-4">
                      {/* Checkbox */}
                      <Checkbox
                        checked={task.status === "completed"}
                        onCheckedChange={() => handleToggleComplete(task.id)}
                        className="mt-1 h-5 w-5"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1 flex-1">
                            <h3
                              className={cn(
                                "font-semibold transition-all",
                                task.status === "completed" &&
                                  "line-through text-muted-foreground",
                              )}
                            >
                              {task.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {task.description}
                            </p>

                            {/* Dates */}
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Created: {formatDate(task.createdAt)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Due: {formatDate(task.dueDate)}{" "}
                                {task.dueTime &&
                                  `at ${formatTime(task.dueTime)}`}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span
                              className={cn(
                                "px-2 py-1 text-xs rounded-md border capitalize",
                                priorityColors[task.priority],
                              )}
                            >
                              {task.priority}
                            </span>
                            <span
                              className={cn(
                                "px-2 py-1 text-xs rounded-md capitalize",
                                statusColors[task.status],
                              )}
                            >
                              {task.status.replace("_", " ")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Add Task Button */}
              <button
                onClick={() => {
                  setCreateDefaultDate(new Date(dateKey));
                  setIsCreateModalOpen(true);
                }}
                className="flex items-center gap-2 mt-1 py-2 text-muted-foreground hover:text-foreground transition-colors group"
              >
                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Plus className="h-4 w-4 text-primary" />
                </span>
                <span className="text-sm">Add Task</span>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin flex-1 min-h-0">
          {sortedDates.map((dateKey) => (
            <div
              key={dateKey}
              className="min-w-[320px] flex-shrink-0 flex flex-col"
            >
              {/* Column Header - Standalone */}
              <div className="p-4 rounded-xl bg-primary text-primary-foreground shadow-lg mb-4">
                <h3 className="font-bold text-sm">
                  {formatColumnDate(dateKey)}
                </h3>
                <p className="text-xs opacity-80 mt-1">
                  {groupedByDate[dateKey].length} tasks
                </p>
              </div>

              {/* Tasks - vertical scroll only when more than 4 tasks */}
              <div
                className={cn(
                  "space-y-3",
                  groupedByDate[dateKey].length > 4 &&
                    "max-h-[520px] overflow-y-auto pr-2 scrollbar-thin",
                )}
              >
                <AnimatePresence mode="popLayout">
                  {groupedByDate[dateKey].map((task) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{
                        opacity: completingTasks.has(task.id) ? 0 : 1,
                        x: completingTasks.has(task.id) ? -100 : 0,
                      }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      onClick={(e) => handleTaskClick(task, e)}
                      className="p-4 rounded-xl bg-card border border-border shadow-md hover:shadow-lg hover:border-primary/20 transition-all duration-200 cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={task.status === "completed"}
                          onCheckedChange={() => handleToggleComplete(task.id)}
                          className="mt-0.5 h-4 w-4"
                        />
                        <div className="flex-1 min-w-0">
                          <h4
                            className={cn(
                              "font-medium text-sm",
                              task.status === "completed" &&
                                "line-through text-muted-foreground",
                            )}
                          >
                            {task.title}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            {task.description}
                          </p>

                          {/* Time & Status */}
                          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                            {task.dueTime && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatTime(task.dueTime)}
                              </span>
                            )}
                            <span
                              className={cn(
                                "px-1.5 py-0.5 rounded capitalize",
                                statusColors[task.status],
                              )}
                            >
                              {task.status.replace("_", " ")}
                            </span>
                          </div>

                          <span
                            className={cn(
                              "mt-2 inline-block px-2 py-0.5 text-xs rounded border capitalize",
                              priorityColors[task.priority],
                            )}
                          >
                            {task.priority}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Add Task Button */}
              <button
                onClick={() => {
                  setCreateDefaultDate(new Date(dateKey));
                  setIsCreateModalOpen(true);
                }}
                className="flex items-center gap-2 mt-5 py-2 text-muted-foreground hover:text-foreground transition-colors group"
              >
                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Plus className="h-4 w-4 text-primary" />
                </span>
                <span className="text-sm">Add Task</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Task Detail Modal */}
      <TaskDetailModal
        task={selectedTask}
        open={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        onSave={handleSaveTask}
      />

      {/* Create Task Modal */}
      <CreateTaskModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        defaultDate={createDefaultDate}
      />
    </motion.div>
  );
}
