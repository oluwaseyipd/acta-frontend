import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { taskApi } from "@/api/tasks";
import { isAfter, isBefore, startOfDay, subDays, format } from "date-fns";
import AnalyticsCard from "@/components/analytics/AnalyticsCard";
import { ProductivityChart } from "@/components/analytics/ProductivityChart";
import { PriorityPieChart } from "@/components/analytics/PriorityPieChart";
import { ActivityHeatmap } from "@/components/analytics/ActivityHeatmap";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

export default function Analytics() {
  const [range, setRange] = useState<number>(7);
  
  const { data, isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: taskApi.getAll,
  });


  
  const tasks = data ?? [];

  // --- 1. Basic Stats ---
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  // --- 2. Overdue Logic ---
  const today = startOfDay(new Date());
  const overdueCount = tasks.filter((t) => {
    return t.status !== "completed" && isBefore(new Date(t.dueDate), today);
  }).length;

  // --- 3. Velocity (Tasks done in last 7 days) ---
  const last7Days = subDays(today, range);
  const recentCompleted = tasks.filter((t) => 
    t.status === "completed" && isAfter(new Date(t.dueDate), last7Days)
  ).length;



  const currentStreak = useMemo(() => {
  let streak = 0;
  let checkDate = new Date();
  const completedDates = tasks
    .filter(t => t.status === "completed" && t.dueDate)
    .map(t => format(new Date(t.dueDate), "yyyy-MM-dd"));

  const uniqueDates = new Set(completedDates);

  while (uniqueDates.has(format(checkDate, "yyyy-MM-dd"))) {
    streak++;
    checkDate = subDays(checkDate, 1);
  }
  
  // If today isn't done yet, check if yesterday was the start of a streak
  if (streak === 0) {
    checkDate = subDays(new Date(), 1);
    while (uniqueDates.has(format(checkDate, "yyyy-MM-dd"))) {
      streak++;
      checkDate = subDays(checkDate, 1);
    }
  }
  return streak;
}, [tasks]);

    if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading tasks...</p>
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
                    <h1 className="text-3xl font-bold">Tasks</h1>
                    <p className="text-muted-foreground">
                        Analytics Dashboard
                    </p>
                </div>

                <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-lg w-fit">
                  {[7, 30, 90].map((days) => (
                      <Button
                        key={days}
                        variant={range === days ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setRange(days)}
                        className="px-4"
                      >
                        {days}D
                      </Button>
                    ))}
                </div>

            </div>

      <div className="flex flex-col gap-6">   
        {/* Row 1: KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <AnalyticsCard title="Completion Rate" value={`${completionRate}%`} desc="Overall productivity" />
          <AnalyticsCard title={`Tasks Done (${range}d)`} value={recentCompleted} desc={`Velocity last ${range} days`}  />
          <AnalyticsCard title="Overdue" value={overdueCount} desc="Needs immediate action" variant="destructive" />
          <AnalyticsCard title="Total Archive" value={completed} desc="Total tasks finished" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Row 2: Charts */}
            <div className="lg:col-span-2">
              <ProductivityChart
               tasks={tasks} 
               range={range} />
            </div>
              {/* <PriorityPieChart tasks={tasks} /> */}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PriorityPieChart tasks={tasks} />
            <ActivityHeatmap tasks={tasks} />

        </div>


        
      </div>  
    </motion.div>
  );
}
