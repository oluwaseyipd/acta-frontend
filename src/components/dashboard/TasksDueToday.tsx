import { motion, AnimatePresence } from "framer-motion";
import { Clock, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { usePopSound } from "@/hooks/use-sound";
import { toast } from "sonner";
import { useState, useCallback, forwardRef, useMemo } from "react";
import { format, parseISO, isToday } from "date-fns";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taskApi } from "@/api/tasks";
import { TaskDetailModal } from "@/components/dashboard/TaskDetailModal";
import { extractTime } from "../utils/date-utils";
import { Task, Status } from "@/types/task";

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

export const TasksDueToday = forwardRef<HTMLDivElement, { tasks: Task[] }>(
  function TasksDueToday({ tasks }, ref) {
    const queryClient = useQueryClient();
    const { playPop } = usePopSound();

    // Local State
    const [completingTasks, setCompletingTasks] = useState<Set<string>>(new Set());
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [detailModalOpen, setDetailModalOpen] = useState(false);

    // Fetch all tasks to ensure we have the most current data for toggling
    const { data } = useQuery({
      queryKey: ["tasks"],
      queryFn: taskApi.getAll,
    });

    // Mutations
    const toggleMutation = useMutation({
      mutationFn: ({ id, status }: { id: string; status: Status }) =>
        taskApi.update(id, { status }),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
    });

    const updateTaskMutation = useMutation({
      mutationFn: (updatedTask: Task) => taskApi.update(updatedTask.id, updatedTask),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
        toast.success("Task updated!");
      },
    });

    // Handlers
    const handleSaveTask = (updatedTask: Task) => {
      updateTaskMutation.mutate(updatedTask);
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
                onClick: () => toggleMutation.mutate({ id: taskId, status: "todo" }),
              },
            });
          }, 400);
        } else {
          toggleMutation.mutate({ id: taskId, status: "todo" });
        }
      },
      [data, playPop, toggleMutation]
    );

    // Filter Logic: Filter the tasks passed via props for Today's date
    const filteredTasks = useMemo(() => {
      return tasks.filter((task) => {
        if (!task.due_date) return false;
        return (
          isToday(parseISO(task.due_date)) &&
          task.status !== "completed" &&
          !completingTasks.has(task.id)
        );
      });
    }, [tasks, completingTasks]);



    // Formatters
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
        ref={ref}
        className="glass-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Tasks Due Today</h3>
          <span className="text-sm text-muted-foreground">
            {filteredTasks.length} tasks
          </span>
        </div>

        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-10 w-10 mx-auto mb-2 opacity-20" />
              <p>Nothing due today!</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredTasks.map((task) =>{
                const time = extractTime(task.due_date); 

                return(
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="p-4 rounded-xl bg-card border border-border shadow-sm hover:shadow-md hover:bg-secondary/5 transition-all cursor-pointer"
                  onClick={() => {
                    setSelectedTask(task);
                    setDetailModalOpen(true);
                  }}
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
                              "font-semibold transition-all truncate",
                              task.status === "completed" &&
                                "line-through text-muted-foreground"
                            )}
                          >
                            {task.title}
                          </h3>
                          {task.description && (
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {task.description}
                            </p>
                          )}

                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            {time && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatTime(time)}
                              </span>
                            )}
                            <span
                              className={cn(
                                "px-2 py-0.5 rounded-md border capitalize",
                                priorityColors[task.priority]
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
              )})}
            </AnimatePresence>
          )}
        </div>

        <TaskDetailModal
          task={selectedTask}
          open={detailModalOpen}
          onOpenChange={setDetailModalOpen}
          onSave={handleSaveTask}
        />
      </motion.div>
    );
  }
);