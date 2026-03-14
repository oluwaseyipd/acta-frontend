import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback } from "react";
import { Clock, AlertTriangle, Calendar } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { usePopSound } from "@/hooks/use-sound";
import { toast } from "sonner";
import { format, isToday, isBefore, startOfDay } from "date-fns";
import { TaskDetailModal } from "@/components/dashboard/TaskDetailModal";
import PageLoading from "@/components/dashboard/PageLoading";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taskApi } from "@/api/tasks";
import { extractTime } from "@/components/utils/date-utils";


type Priority = "low" | "medium" | "high";
type Status = "todo" | "in_progress" | "completed";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  created_at: string;
  due_date: string;
  due_time?: string;
}

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
  const [completingTasks, setCompletingTasks] = useState<Set<string>>(
    new Set(),
  );
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  // 2. All TanStack Hooks
  const queryClient = useQueryClient();
  const { playPop } = usePopSound();

  const { data, isLoading, error } = useQuery({
    queryKey: ["tasks"],
    queryFn: taskApi.getAll,
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Status }) =>
      taskApi.update(id, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const updateTaskMutation = useMutation({
    mutationFn: (updatedTask: Task) =>
      taskApi.update(updatedTask.id, updatedTask),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task updated!");
    },
  });

  // 3. Handlers (Updated to use Mutations)
  const handleSaveTask = (updatedTask: Task) => {
    updateTaskMutation.mutate(updatedTask);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setDetailModalOpen(true);
  };

  const handleToggleComplete = useCallback(
    (taskId: string) => {
      const tasksArray = Array.isArray(data) ? data : (data?.results ?? []);
      const task = tasksArray.find((t: any) => t.id === taskId);
      if (!task) return;

      const wasCompleted = task.status === "completed";

      if (!wasCompleted) {
        setCompletingTasks((prev) => new Set(prev).add(taskId));
        playPop();

        setTimeout(() => {
          toggleMutation.mutate({ id: taskId, status: "completed" });
          setCompletingTasks((prev) => {
            const next = new Set(prev);
            next.delete(taskId);
            return next;
          });

          toast.success("Task completed!", {
            action: {
              label: "UNDO",
              onClick: () =>
                toggleMutation.mutate({ id: taskId, status: "todo" }),
            },
          });
        }, 400);
      } else {
        toggleMutation.mutate({ id: taskId, status: "todo" });
      }
    },
    [data, playPop, toggleMutation],
  );

  // 5. Data Filtering Logic
  const allTasks = Array.isArray(data) ? data : (data?.results ?? []);
  const now = new Date();
  const todayStart = startOfDay(now);

  // Helper to handle both 'dueDate' and 'due_date' depending on your API serializer
  const getTaskDate = (task: any) =>
    startOfDay(new Date(task.due_date || task.dueDate));

  const todayTasks = allTasks.filter((task) => {
    const taskDate = getTaskDate(task);
    return (
      isToday(taskDate) &&
      task.status !== "completed" &&
      !completingTasks.has(task.id)
    );
  });

  const overdueTasks = allTasks.filter((task) => {
    const taskDate = getTaskDate(task);
    return (
      isBefore(taskDate, todayStart) &&
      task.status !== "completed" &&
      !completingTasks.has(task.id)
    );
  });
  if (isLoading) return <PageLoading />;

  if (error)
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-destructive">Error loading tasks</p>
      </div>
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

  //Truncate long descriptions for better card display
  const truncateDescription = (text: string, maxWords: number = 10) => {
    if (!text) return "No description provided.";
    const words = text.split(" ");
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(" ") + "...";
  };

  const TaskCard = ({
    task,
    isOverdue = false,
  }: {
    task: Task;
    isOverdue?: boolean;
  }) => {
    const time = extractTime(task.due_date);
    return (
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
                  {truncateDescription(task.description)}
                </p>

                {/* Time & Status */}
                <div className="flex flex-row justify-between gap-2 mt-2 text-xs text-muted-foreground">
                  {time && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatTime(time)}
                    </span>
                  )}
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
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 flex flex-col h-[calc(100vh-12rem)]"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Today</h1>
        <p className="text-muted-foreground">
          {format(new Date(), "EEEE, MMMM d, yyyy")}
        </p>
      </div>

      {/* Two Column Layout: Overdue (left) | Today (right) */}
      <div className="flex-1 flex gap-6 overflow-x-auto pb-6 scrollbar-thin snap-x">
        {/* Overdue Column */}
        <div className="w-[300px] md:w-[650px] shrink-0 flex flex-col snap-start">
          <div className="p-4 rounded-xl bg-destructive text-destructive-foreground shadow-lg mb-4 sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              <h2 className="font-bold">Overdue</h2>
            </div>
            <p className="text-sm opacity-80 mt-1">
              {overdueTasks.length} task{overdueTasks.length !== 1 ? "s" : ""}{" "}
              overdue
            </p>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-none">
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
        <div className="w-[300px] md:w-[650px] shrink-0 flex flex-col snap-start">
          <div className="p-4 rounded-xl bg-primary text-primary-foreground shadow-lg mb-4 sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <h2 className="font-bold">Today's Tasks</h2>
            </div>
            <p className="text-sm opacity-80 mt-1">
              {todayTasks.length} task{todayTasks.length !== 1 ? "s" : ""} due
              today
            </p>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-none">
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
