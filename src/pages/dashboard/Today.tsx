import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback } from "react";
import { Clock, AlertTriangle, Calendar } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { usePopSound } from "@/hooks/use-sound";
import { toast } from "sonner";
import { format, isToday, isBefore, startOfDay } from "date-fns";
import { TaskDetailModal } from "@/components/dashboard/TaskDetailModal";

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
  {
    id: "1",
    title: "Design system update",
    description: "Update colors and typography",
    priority: "high",
    status: "in_progress",
    createdAt: "2024-12-20",
    dueDate: "2026-01-02",
    dueTime: "14:00",
  },
  {
    id: "2",
    title: "API integration",
    description: "Connect to Django backend",
    priority: "high",
    status: "todo",
    createdAt: "2024-12-21",
    dueDate: "2026-01-02",
    dueTime: "10:00",
  },
  {
    id: "3",
    title: "Write unit tests",
    description: "Cover main components",
    priority: "medium",
    status: "todo",
    createdAt: "2024-12-22",
    dueDate: "2026-01-02",
    dueTime: "16:30",
  },
  {
    id: "4",
    title: "Documentation",
    description: "Update README file",
    priority: "low",
    status: "todo",
    createdAt: "2024-12-18",
    dueDate: "2025-12-30",
    dueTime: "09:00",
  },
  {
    id: "5",
    title: "Performance optimization",
    description: "Reduce bundle size",
    priority: "medium",
    status: "in_progress",
    createdAt: "2024-12-23",
    dueDate: "2025-12-28",
    dueTime: "11:00",
  },
  {
    id: "6",
    title: "Code review",
    description: "Review pull requests",
    priority: "low",
    status: "todo",
    createdAt: "2024-12-24",
    dueDate: "2025-12-25",
    dueTime: "15:00",
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

export default function Today() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [completingTasks, setCompletingTasks] = useState<Set<string>>(
    new Set(),
  );
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const { playPop } = usePopSound();

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setDetailModalOpen(true);
  };

  const handleSaveTask = (updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)),
    );
  };

  const today = startOfDay(new Date());

  // Filter tasks for today and overdue (excluding completed)
  const todayTasks = tasks.filter((task) => {
    const dueDate = new Date(task.dueDate);
    return (
      isToday(dueDate) &&
      task.status !== "completed" &&
      !completingTasks.has(task.id)
    );
  });

  const overdueTasks = tasks.filter((task) => {
    const dueDate = startOfDay(new Date(task.dueDate));
    return (
      isBefore(dueDate, today) &&
      task.status !== "completed" &&
      !completingTasks.has(task.id)
    );
  });

  const handleToggleComplete = useCallback(
    (taskId: string) => {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      const wasCompleted = task.status === "completed";
      const previousStatus = task.status;

      if (!wasCompleted) {
        setCompletingTasks((prev) => new Set(prev).add(taskId));
        playPop();

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

  const formatTime = (timeStr?: string) => {
    if (!timeStr) return "";
    const [hours, minutes] = timeStr.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "MMM d, yyyy");
    } catch {
      return dateStr;
    }
  };

  const TaskCard = ({
    task,
    isOverdue = false,
  }: {
    task: Task;
    isOverdue?: boolean;
  }) => (
    <motion.div
      key={task.id}
      initial={{ opacity: 0, x: -20 }}
      animate={{
        opacity: completingTasks.has(task.id) ? 0 : 1,
        x: completingTasks.has(task.id) ? -100 : 0,
      }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={cn(
        "p-4 rounded-xl bg-card border shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer",
        isOverdue
          ? "border-destructive/30 hover:border-destructive/50"
          : "border-border hover:border-primary/20",
      )}
      onClick={() => handleTaskClick(task)}
    >
      <div className="flex items-start gap-4">
        <Checkbox
          checked={task.status === "completed"}
          onCheckedChange={() => handleToggleComplete(task.id)}
          onClick={(e) => e.stopPropagation()}
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

              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                {isOverdue && (
                  <span className="flex items-center gap-1 text-destructive">
                    <Calendar className="h-3 w-3" />
                    Due: {formatDate(task.dueDate)}
                  </span>
                )}
                {task.dueTime && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatTime(task.dueTime)}
                  </span>
                )}
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
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Today</h1>
        <p className="text-muted-foreground">
          {format(new Date(), "EEEE, MMMM d, yyyy")}
        </p>
      </div>

      {/* Two Column Layout: Overdue (left) | Today (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overdue Column */}
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-destructive text-destructive-foreground shadow-lg">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              <h2 className="font-bold">Overdue</h2>
            </div>
            <p className="text-sm opacity-80 mt-1">
              {overdueTasks.length} task{overdueTasks.length !== 1 ? "s" : ""}{" "}
              overdue
            </p>
          </div>

          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {overdueTasks.length > 0 ? (
                overdueTasks.map((task) => (
                  <TaskCard key={task.id} task={task} isOverdue />
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-8  text-center"
                >
                  <p className="text-muted-foreground">No overdue tasks! 🎉</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Today Column */}
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-primary text-primary-foreground shadow-lg">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <h2 className="font-bold">Today's Tasks</h2>
            </div>
            <p className="text-sm opacity-80 mt-1">
              {todayTasks.length} task{todayTasks.length !== 1 ? "s" : ""} due
              today
            </p>
          </div>

          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {todayTasks.length > 0 ? (
                todayTasks.map((task) => <TaskCard key={task.id} task={task} />)
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-8 rounded-xl bg-card border border-border shadow-md text-center"
                >
                  <p className="text-muted-foreground">
                    No tasks due today. Great job! 🎉
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Task Detail Modal */}
      <TaskDetailModal
        task={selectedTask}
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        onSave={handleSaveTask}
      />
    </motion.div>
  );
}
