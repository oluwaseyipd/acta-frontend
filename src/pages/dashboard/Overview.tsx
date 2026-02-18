import { motion } from "framer-motion";
import { CheckSquare, Clock, TrendingUp, Zap } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { DailyProgressRadial } from "@/components/dashboard/DailyProgressRadial";
import { TasksDueToday } from "@/components/dashboard/TasksDueToday";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"; // 
import { taskApi } from "@/api/tasks"; // 
import { format } from "date-fns";

export default function DashboardOverview() {
  const queryClient = useQueryClient();

  // 1. Fetch the data
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
  if (isLoading) return <div>Loading Overview...</div>;
  if (error) return <div>Error loading data.</div>;



  const allTasks = data ?? [];

  // Logic for "Due Today" (Comparing task.dueDate with today's date)
  const todayStr = format(new Date(), "yyyy-MM-dd");
  const tasksDueToday = allTasks.filter((t) => t.dueDate === todayStr);


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
        <h1 className="text-3xl font-bold text-foreground">Welcome back!</h1>
        <p className="text-muted-foreground mt-1">Here's what's happening today.</p>
      </div>

      {/* Stats Grid - Using real data now */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Tasks"
          value={totalTasks}
          change={`+${totalTasks} total`}
          icon={CheckSquare}
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
           total={totalTasks} 
        />
        <div className="lg:col-span-2">
          {/* Note: Ensure TasksDueToday uses the field names from your API (e.g. status vs completed) */}
          <TasksDueToday
            tasks={tasksDueToday}
            onToggleComplete={handleToggleComplete}
          />
        </div>
      </div>
    </motion.div>
  );
}
