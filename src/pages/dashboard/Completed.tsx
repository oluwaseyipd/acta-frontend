import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback } from "react";
import { LayoutList, Kanban, Search, Calendar, Clock } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useUIStore } from "@/store/ui-store";
import { taskApi } from "@/api/tasks";
import { cn } from "@/lib/utils";
import { TaskDetailModal } from "@/components/dashboard/TaskDetailModal";
import { toast } from "sonner"; // Changed to match Tasks.tsx consistency
import { format } from "date-fns";
import PageLoading from "@/components/dashboard/PageLoading";
import { extractTime } from "@/components/utils/date-utils";

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
  due_date?: string; // Support both naming conventions seen in your files
  dueTime?: string;
}

const priorityColors = {
  low: "bg-info/10 text-info border-info/20",
  medium: "bg-warning/10 text-warning border-warning/20",
  high: "bg-destructive/10 text-destructive border-destructive/20",
};

const formatTime = (timeStr?: string) => {
  if (!timeStr) return "";
  const [hours, minutes] = timeStr.split(":");
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

export default function Completed() {
  const { taskViewMode, setTaskViewMode } = useUIStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["tasks"],
    queryFn: taskApi.getAll,
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Status }) =>
      taskApi.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.info("Task moved back to active");
    },
  });

  // 1. Processing Data
  const allTasks = Array.isArray(data) ? data : (data?.results ?? []);

  const completedTasks = allTasks.filter(
    (task: Task) =>
      task.status === "completed" &&
      task.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const groupedByDate = completedTasks.reduce(
  (acc, task) => {
    // 1. Get the raw date string
    const rawDate = task.due_date || task.dueDate;
    
    // 2. Normalize it: Take only the YYYY-MM-DD part
    const dateKey = rawDate ? rawDate.split('T')[0] : "No Due Date";
    
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(task);
    return acc;
  },
  {} as Record<string, Task[]>,
);

  const sortedDates = Object.keys(groupedByDate).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime(), // Completed usually shows newest first
  );

  const formatColumnDate = (dateStr: string) => {
    if (!dateStr || dateStr === "No Due Date") return "No Due Date";
    try {
      return format(new Date(dateStr), "EEEE, MMM d, yyyy");
    } catch {
      return "Invalid Date";
    }
  };

  const handleTaskClick = (task: Task, e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('[role="checkbox"]')) return;
    setSelectedTask(task);
    setIsDetailModalOpen(true);
  };

  if (isLoading) return <PageLoading />;
  if (error)
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-destructive">Error loading tasks</p>
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full overflow-hidden"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 flex-shrink-0">
        <div>
          <h1 className="text-3xl font-bold">Completed</h1>
          <p className="text-muted-foreground">
            {completedTasks.length} tasks finished
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search completed..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
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

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        {completedTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-12 text-center opacity-60">
            <LayoutList className="h-12 w-12 mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold">No completed tasks</h2>
          </div>
        ) : taskViewMode === "list" ? (
          <div className="space-y-6 overflow-y-auto flex-1">
            {sortedDates.map((dateKey) => (
              <div key={dateKey}>
                <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
                  {formatColumnDate(dateKey)}
                </h3>
                <AnimatePresence mode="popLayout">
                  {groupedByDate[dateKey].map((task) => {
                    const time = extractTime(task.due_date || task.dueDate);
                    return (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        onClick={(e) => handleTaskClick(task, e)}
                        className="p-4 rounded-xl bg-card border border-border shadow-sm hover:shadow-md transition-all cursor-pointer mb-3 opacity-80 hover:opacity-100"
                      >
                        <div className="flex items-start gap-4">
                          <Checkbox
                            checked={true}
                            onCheckedChange={() =>
                              toggleMutation.mutate({
                                id: task.id,
                                status: "todo",
                              })
                            }
                            className="mt-1 h-5 w-5"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold line-through text-muted-foreground">
                              {task.title}
                            </h3>
                            <p className="text-sm text-muted-foreground truncate">
                              {task.description}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              {time && (
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatTime(time)}
                                </span>
                              )}
                              <span
                                className={cn(
                                  "px-2 py-0.5 rounded border capitalize",
                                  priorityColors[task.priority],
                                )}
                              >
                                {task.priority}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            ))}
          </div>
        ) : (
          /* Kanban Mode partitioned by Date */
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin h-full items-start">
            {sortedDates.map((dateKey) => (
              <div
                key={dateKey}
                className="min-w-[320px] max-w-[320px] flex flex-col h-full"
              >
                <div className="p-4 rounded-xl bg-muted/50 border border-border mb-4">
                  <h3 className="font-bold text-sm">
                    {formatColumnDate(dateKey)}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {groupedByDate[dateKey].length} completed
                  </p>
                </div>

                {/* Scrollable Tasks Container for this specific Date */}
                <div
                  className={cn(
                    "space-y-3 pr-2",
                    // Enables vertical scroll only if tasks exceed 4
                    groupedByDate[dateKey].length > 4 
                      ? "overflow-y-auto max-h-[500px] scrollbar-thin" 
                      : "overflow-visible"
                  )}
                  >
                  <AnimatePresence mode="popLayout">
                    {groupedByDate[dateKey].map((task) => {
                      const time = extractTime(task.due_date || task.dueDate);
                      return (
                        <motion.div
                          key={task.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          onClick={(e) => handleTaskClick(task, e)}
                          className="p-4 rounded-xl bg-card border border-border shadow-sm cursor-pointer hover:border-primary/50 transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            <Checkbox
                              checked={true}
                              className="mt-0.5 h-4 w-4"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm line-through text-muted-foreground">
                                {task.title}
                              </h4>
                              <div className="flex justify-between items-center mt-3 text-[10px] text-muted-foreground">
                                {time && (
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />{" "}
                                    {formatTime(time)}
                                  </span>
                                )}
                                <span
                                  className={cn(
                                    "px-1.5 py-0.5 rounded border",
                                    priorityColors[task.priority],
                                  )}
                                >
                                  {task.priority}
                                </span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <TaskDetailModal
        task={selectedTask}
        open={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        onSave={() => {}}
      />
    </motion.div>
  );
}
