 import { motion, AnimatePresence } from "framer-motion";
 import { useState, useCallback } from "react";
import {
  LayoutList,
  Kanban,
  Search,
  Calendar,
  Clock,
} from "lucide-react";
import { 
  useQuery,
  useMutation, 
  useQueryClient
} from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useUIStore } from "@/store/ui-store";
import { taskApi } from "@/api/tasks";
import { cn } from "@/lib/utils";
import { TaskDetailModal } from "@/components/dashboard/TaskDetailModal";
import { toast } from "@/components/ui/sonner";
import { format } from "date-fns";



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


 export default function Completed() {
    const { taskViewMode, setTaskViewMode } = useUIStore();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    

  // 2. All TanStack Hooks (Keep these at the top!)
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["tasks"],
    queryFn: taskApi.getAll, 
  });


  // Simple mutation to un-complete a task
  const toggleMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Status }) =>
      taskApi.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.info("Task moved back to active");
    },
  });


  // 1. Filter: Completed AND matching search
  const completedTasks = (data ?? []).filter(
    (task) =>
      task.status === "completed" &&
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 2. Group for the UI
  const groupedByDate = completedTasks.reduce((acc, task) => {
    const dateKey = task.dueDate;
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  const sortedDates = Object.keys(groupedByDate).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime() // Newest at top
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
  
    // 2. The wrapper function
const handleSaveTask = (updatedTask: Task) => {
//   updateTaskMutation.mutate(updatedTask);
};

  
  
  
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


    if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full"> 
        <p className="text-destructive">Error loading tasks</p>
      </div>
    );
  }

    return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full overflow-hidden"
    >
        {/* Header - Fixed */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 flex-shrink-0">
            <div>
                <h1 className="text-3xl font-bold">Completed</h1>
                <p className="text-muted-foreground">
                    {completedTasks.length} completed tasks
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

                <div className="flex items-center gap-3">
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
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ duration: 0.35, ease: "easeOut" }}
                            onClick={(e) => handleTaskClick(task, e)}
                            className="p-4 rounded-xl bg-card border border-border shadow-md hover:shadow-lg hover:border-primary/20 transition-all duration-200 cursor-pointer mb-3"
                          >
                            <div className="flex items-start gap-4">
                              {/* Checkbox */}
                              <Checkbox
                                checked={task.status === "completed"}
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
                              exit={{ opacity: 0, x: -100 }}
                              transition={{ duration: 0.35, ease: "easeOut" }}
                              onClick={(e) => handleTaskClick(task, e)}
                              className="p-4 rounded-xl bg-card border border-border shadow-md hover:shadow-lg hover:border-primary/20 transition-all duration-200 cursor-pointer"
                            >
                              <div className="flex items-start gap-3">
                                <Checkbox
                                  checked={task.status === "completed"}
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
    </motion.div>

    )
 }