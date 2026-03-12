import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback, useMemo } from "react";
import { Search, Calendar, Clock, Plus, Inbox as InboxIcon } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taskApi } from "@/api/tasks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { usePopSound } from "@/hooks/use-sound";
import { toast } from "sonner";
import { format } from "date-fns";
import { TaskDetailModal } from "@/components/dashboard/TaskDetailModal";
import { CreateTaskModal } from "@/components/dashboard/CreateTaskModal";
import PageLoading from "@/components/dashboard/PageLoading";

type Priority = "low" | "medium" | "high";
type Status = "todo" | "in_progress" | "completed";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  created_at: string;
  due_date: string | null; // Updated to allow null
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

export default function Inbox() {
  const [searchQuery, setSearchQuery] = useState("");
  const [completingTasks, setCompletingTasks] = useState<Set<string>>(new Set());
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createDefaultDate, setCreateDefaultDate] = useState<Date | undefined>(undefined);

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
    mutationFn: (updatedTask: Task) => taskApi.update(updatedTask.id, updatedTask),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task updated!");
    },
  });

  // --- Data Processing ---
  const { undatedTasks, datedGroups, sortedDates, totalCount } = useMemo(() => {
    const allTasks: Task[] = Array.isArray(data) ? data : (data?.results ?? []);
    
    const filtered = allTasks.filter(
      (task) =>
        task.status !== "completed" &&
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !completingTasks.has(task.id)
    );

    const undated: Task[] = [];
    const dated: Record<string, Task[]> = {};

    filtered.forEach((task) => {
      if (!task.due_date) {
        undated.push(task);
      } else {
        if (!dated[task.due_date]) dated[task.due_date] = [];
        dated[task.due_date].push(task);
      }
    });

    const sorted = Object.keys(dated).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );

    return { 
      undatedTasks: undated, 
      datedGroups: dated, 
      sortedDates: sorted,
      totalCount: filtered.length 
    };
  }, [data, searchQuery, completingTasks]);

  const handleToggleComplete = useCallback(
    (taskId: string, e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      playPop();
      setCompletingTasks((prev) => new Set(prev).add(taskId));
      setTimeout(() => {
        toggleMutation.mutate({ id: taskId, status: "completed" });
        setCompletingTasks((prev) => {
          const next = new Set(prev);
          next.delete(taskId);
          return next;
        });
        toast.success("Task completed!");
      }, 400);
    },
    [playPop, toggleMutation]
  );

  const handleTaskClick = (task: Task, e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('[role="checkbox"]')) return;
    setSelectedTask(task);
    setIsDetailModalOpen(true);
  };

  const formatColumnDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "EEEE, MMM d");
    } catch {
      return dateStr;
    }
  };

  if (isLoading) return <PageLoading />;
  if (error) return <div className="flex items-center justify-center h-full"><p className="text-destructive">Error loading tasks</p></div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-full overflow-hidden">
      {/* Refined Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 flex-shrink-0">
        <div>
          <h1 className="text-3xl font-bold">Inbox</h1>
          <p className="text-muted-foreground">{totalCount} uncompleted tasks</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search inbox..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
          <Button onClick={() => { setCreateDefaultDate(undefined); setIsCreateModalOpen(true); }} size="sm" className="gap-2">
            <Plus className="h-4 w-4" /> New Task
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto pb-4 scrollbar-thin">
        {totalCount === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <InboxIcon className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <h2 className="text-xl font-semibold">Inbox Zero</h2>
            <p className="text-muted-foreground mt-2">All caught up or try a different search.</p>
          </div>
        ) : (
          <div className="flex gap-6 min-h-0 h-full">
            {/* 1. Undated Column (Always Left) */}
            <TaskColumn 
              title="No Date" 
              subtitle="Tasks without a deadline"
              tasks={undatedTasks} 
              onTaskClick={handleTaskClick}
              onToggle={handleToggleComplete}
              completingTasks={completingTasks}
              onAddTask={() => { setCreateDefaultDate(undefined); setIsCreateModalOpen(true); }}
              variant="secondary"
            />

            <div className="w-[1px] bg-border/50 self-stretch my-4" /> {/* Visual Separator */}

            {/* 2. Dated Columns */}
            {sortedDates.map((dateKey) => (
              <TaskColumn 
                key={dateKey}
                title={formatColumnDate(dateKey)} 
                subtitle={`${datedGroups[dateKey].length} tasks`}
                tasks={datedGroups[dateKey]} 
                onTaskClick={handleTaskClick}
                onToggle={handleToggleComplete}
                completingTasks={completingTasks}
                onAddTask={() => { setCreateDefaultDate(new Date(dateKey)); setIsCreateModalOpen(true); }}
              />
            ))}
          </div>
        )}
      </div>

      <TaskDetailModal task={selectedTask} open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen} onSave={(t: any) => updateTaskMutation.mutate(t)} />
      <CreateTaskModal open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} defaultDate={createDefaultDate} />
    </motion.div>
  );
}

// Reusable Column Component to clean up JSX
function TaskColumn({ title, subtitle, tasks, onTaskClick, onToggle, completingTasks, onAddTask, variant = "primary" }: any) {
  return (
    <div className="min-w-[320px] max-w-[320px] flex-shrink-0 flex flex-col h-full">
      <div className={cn("p-4 rounded-xl shadow-sm mb-4 border", 
        variant === "primary" ? "bg-primary text-primary-foreground border-primary" : "bg-muted/50 text-foreground border-border"
      )}>
        <h3 className="font-bold text-sm">{title}</h3>
        <p className="text-xs opacity-80 mt-1">{subtitle}</p>
      </div>

      <div className="space-y-3 overflow-y-auto pr-2 scrollbar-thin flex-1">
        <AnimatePresence mode="popLayout">
          {tasks.map((task: Task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: completingTasks.has(task.id) ? 0 : 1, x: completingTasks.has(task.id) ? -20 : 0 }}
              exit={{ opacity: 0, x: -20 }}
              onClick={(e) => onTaskClick(task, e)}
              className="p-4 rounded-xl bg-card border border-border shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <Checkbox checked={task.status === "completed"} onCheckedChange={() => onToggle(task.id)} className="mt-0.5" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{task.title}</h4>
                  {task.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{task.description}</p>}
                  <div className="flex items-center gap-2 mt-2">
                    <span className={cn("px-1.5 py-0.5 text-[10px] rounded border capitalize", priorityColors[task.priority])}>
                      {task.priority}
                    </span>
                    {task.due_time && <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Clock className="h-2.5 w-2.5" /> {task.due_time}</span>}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <button onClick={onAddTask} className="flex items-center gap-2 mt-4 py-2 text-muted-foreground hover:text-foreground transition-colors group">
        <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
          <Plus className="h-4 w-4 text-primary" />
        </span>
        <span className="text-sm">Add Task</span>
      </button>
    </div>
  );
}