import { motion } from "framer-motion";
import { CheckSquare, Clock, TrendingUp, Zap } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { DailyProgressRadial } from "@/components/dashboard/DailyProgressRadial";
import { TasksDueToday } from "@/components/dashboard/TasksDueToday";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"; // 
import { taskApi } from "@/api/tasks"; // 
import { format, isToday, parseISO } from "date-fns";
import PageLoading  from '../../components/dashboard/PageLoading';
import { profileApi } from "@/lib/profile";

export default function DashboardOverview() {
  const queryClient = useQueryClient();

  // Fetch User Profile
  const { data: user } = useQuery({
    queryKey: ["currentUser"],
    queryFn: profileApi.getProfile,
  });

  const username = user?.first_name || user?.email?.split('@')[0] || "User";

  // 1. Fetch the tasks
  const { data, isLoading, error } = useQuery({
    queryKey: ["tasks"],
    queryFn: taskApi.getAll,
  });

  // 2. Toggle Mutation
  const toggleMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: any }) =>
      taskApi.update(id, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  // 3. Early Returns
  if (isLoading) return <PageLoading />;
  if (error) return <div className="flex items-center justify-center h-full"><p className="text-destructive">Error loading tasks</p></div>;



const allTasks = Array.isArray(data) ? data : (data?.results ?? []);

  // Logic for "Due Today" (Comparing task.due_date with today's date)
  const todayStr = format(new Date(), "yyyy-MM-dd");
  const tasksDueToday = allTasks.filter((t) => t.due_date === todayStr);

  const todayTasksCount = allTasks.filter(t => 
  t.due_date && isToday(parseISO(t.due_date)) && t.status !== "completed"
).length;


  // 4. Calculate Stats Dynamically
  const todayTotalTasks = tasksDueToday.length;
  const todayCompletedTasks = tasksDueToday.filter((t) => t.status === "completed");
  const todayInProgressTasks = tasksDueToday.filter((t) => t.status === "in_progress");
  

    // 4. Calculate Stats Dynamically
  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter((t) => t.status === "completed");
  const inProgressTasks = allTasks.filter((t) => t.status === "in_progress");
  


  const handleToggleComplete = (id: string) => {
    const task = tasksDueToday.find((t) => t.id === id);
    if (!task) return;
    const newStatus = task.status === "completed" ? "todo" : "completed";
    toggleMutation.mutate({ id, status: newStatus });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Welcome back, {username}!</h1>
        <p className="text-muted-foreground mt-1">Here's what's happening today.</p>
      </div>

      {/* Stats Grid - Using real data now */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Tasks"
          value={totalTasks}
          icon={Zap}
        />
        <StatsCard
          title="Completed"
          value={completedTasks.length}
          change={`${Math.round((completedTasks.length / totalTasks) * 100 || 0)}% rate`}
          icon={TrendingUp}
        />
        <StatsCard
          title="In Progress"
          value={inProgressTasks.length}
          icon={Clock}
        />
        <StatsCard
          title="Due Today"
          value={tasksDueToday.length}
          icon={Zap}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DailyProgressRadial 
           completed={completedTasks.length} 
           total={todayTotalTasks} 
        />
        <div className="lg:col-span-2">
          {/* Note: Ensure TasksDueToday uses the field names from your API (e.g. status vs completed) */}
          <TasksDueToday
            tasks={allTasks}
          />
        </div>
      </div>
    </motion.div>
  );
}
