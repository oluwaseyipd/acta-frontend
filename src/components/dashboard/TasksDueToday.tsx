import { motion, AnimatePresence } from "framer-motion";
import { Clock, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { usePopSound } from "@/hooks/use-sound";
import { toast } from "sonner";
import { useState, useCallback, forwardRef } from "react";
import { format } from "date-fns";
import { TaskDetailModal } from "@/components/dashboard/TaskDetailModal";

interface Task {
  id: string;
  title: string;
  priority: "low" | "medium" | "high";
  completed: boolean;
  dueTime?: string;
  createdAt?: string;
  dueDate?: string;
  description?: string;
  status?: "todo" | "in_progress" | "completed";
}

// Full task type for the modal
interface FullTask {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  status: "todo" | "in_progress" | "completed";
  createdAt: string;
  dueDate: string;
  dueTime?: string;
}

interface TasksDueTodayProps {
  tasks: Task[];
  onToggleComplete?: (id: string) => void;
}

const priorityColors = {
  low: "text-info",
  medium: "text-warning",
  high: "text-destructive",
};

const priorityBg = {
  low: "bg-info/10",
  medium: "bg-warning/10",
  high: "bg-destructive/10",
};

export const TasksDueToday = forwardRef<HTMLDivElement, TasksDueTodayProps>(
  function TasksDueToday({ tasks: initialTasks, onToggleComplete }, ref) {
    const [tasks, setTasks] = useState(initialTasks);
    const [completingTasks, setCompletingTasks] = useState<Set<string>>(
      new Set(),
    );
    const [selectedTask, setSelectedTask] = useState<FullTask | null>(null);
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const { playPop } = usePopSound();

    const handleTaskClick = (task: Task) => {
      // Convert to full task format for the modal
      const fullTask: FullTask = {
        id: task.id,
        title: task.title,
        description: task.description || "",
        priority: task.priority,
        status: task.status || (task.completed ? "completed" : "todo"),
        createdAt: task.createdAt || format(new Date(), "yyyy-MM-dd"),
        dueDate: task.dueDate || format(new Date(), "yyyy-MM-dd"),
        dueTime: task.dueTime,
      };
      setSelectedTask(fullTask);
      setDetailModalOpen(true);
    };

    const handleSaveTask = (updatedTask: FullTask) => {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === updatedTask.id
            ? {
                ...t,
                title: updatedTask.title,
                priority: updatedTask.priority,
                completed: updatedTask.status === "completed",
                dueTime: updatedTask.dueTime,
                dueDate: updatedTask.dueDate,
                description: updatedTask.description,
                status: updatedTask.status,
              }
            : t,
        ),
      );
    };

    const container = {
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: {
          staggerChildren: 0.05,
        },
      },
    };

    const item = {
      hidden: { opacity: 0, x: -20 },
      show: { opacity: 1, x: 0 },
    };

    const handleToggle = useCallback(
      (taskId: string) => {
        const task = tasks.find((t) => t.id === taskId);
        if (!task) return;

        if (!task.completed) {
          setCompletingTasks((prev) => new Set(prev).add(taskId));
          playPop();

          setTimeout(() => {
            setTasks((prev) =>
              prev.map((t) =>
                t.id === taskId ? { ...t, completed: true } : t,
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
                      t.id === taskId ? { ...t, completed: false } : t,
                    ),
                  );
                  toast.info("Task restored");
                },
              },
              position: "bottom-center",
            });

            onToggleComplete?.(taskId);
          }, 400);
        } else {
          setTasks((prev) =>
            prev.map((t) => (t.id === taskId ? { ...t, completed: false } : t)),
          );
          toast.info("Task marked as incomplete", {
            action: {
              label: "UNDO",
              onClick: () => {
                setTasks((prev) =>
                  prev.map((t) =>
                    t.id === taskId ? { ...t, completed: true } : t,
                  ),
                );
              },
            },
            position: "bottom-center",
          });
          onToggleComplete?.(taskId);
        }
      },
      [tasks, playPop, onToggleComplete],
    );

    const formatDate = (dateStr?: string) => {
      if (!dateStr) return "";
      try {
        return format(new Date(dateStr), "MMM d");
      } catch {
        return dateStr;
      }
    };

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Tasks Due Today</h3>
          <span className="text-sm text-muted-foreground">
            {tasks.length} tasks
          </span>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-3"
        >
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No tasks due today. Great job!</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {tasks
                .filter((t) => !completingTasks.has(t.id) || !t.completed)
                .map((task) => (
                  <motion.div
                    key={task.id}
                    variants={item}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{
                      opacity: completingTasks.has(task.id) ? 0 : 1,
                      x: completingTasks.has(task.id) ? -100 : 0,
                    }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-xl transition-all duration-200 cursor-pointer",
                      "hover:bg-secondary/50",
                      task.completed && "opacity-60",
                    )}
                    onClick={() => handleTaskClick(task)}
                  >
                    {/* Checkbox */}
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => handleToggle(task.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="mt-0.5 h-5 w-5"
                    />

                    {/* Task Info */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          "font-medium truncate",
                          task.completed &&
                            "line-through text-muted-foreground",
                        )}
                      >
                        {task.title}
                      </p>

                      {/* Dates */}
                      <div className="flex items-center gap-3 mt-1">
                        {task.createdAt && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {formatDate(task.createdAt)}
                          </span>
                        )}
                        {task.dueTime && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {task.dueTime}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Priority Badge */}
                    <div
                      className={cn(
                        "px-2 py-1 rounded-md text-xs font-medium capitalize shrink-0",
                        priorityColors[task.priority],
                        priorityBg[task.priority],
                      )}
                    >
                      {task.priority}
                    </div>
                  </motion.div>
                ))}
            </AnimatePresence>
          )}
        </motion.div>

        {/* Task Detail Modal */}
        <TaskDetailModal
          task={selectedTask}
          open={detailModalOpen}
          onOpenChange={setDetailModalOpen}
          onSave={handleSaveTask}
        />
      </motion.div>
    );
  },
);
