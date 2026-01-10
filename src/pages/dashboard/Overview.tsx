import { motion } from "framer-motion";
import { CheckSquare, Clock, TrendingUp, Zap } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { DailyProgressRadial } from "@/components/dashboard/DailyProgressRadial";
import { TasksDueToday } from "@/components/dashboard/TasksDueToday";
import { useState } from "react";

// Mock data - will be replaced with API calls
const mockTasks = [
  {
    id: "1",
    title: "Review project proposal",
    priority: "high" as const,
    completed: false,
    dueTime: "10:00 AM",
  },
  {
    id: "2",
    title: "Team standup meeting",
    priority: "medium" as const,
    completed: true,
    dueTime: "11:00 AM",
  },
  {
    id: "3",
    title: "Update documentation",
    priority: "low" as const,
    completed: false,
    dueTime: "2:00 PM",
  },
  {
    id: "4",
    title: "Code review for feature branch",
    priority: "high" as const,
    completed: false,
    dueTime: "4:00 PM",
  },
  {
    id: "5",
    title: "Send weekly report",
    priority: "medium" as const,
    completed: false,
    dueTime: "5:00 PM",
  },
];

export default function DashboardOverview() {
  const [tasks, setTasks] = useState(mockTasks);

  const handleToggleComplete = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Welcome back!</h1>
        <p className="text-muted-foreground mt-1">
          Here's what's happening with your tasks today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Tasks"
          value={24}
          change="+3 from yesterday"
          changeType="positive"
          icon={CheckSquare}
          delay={0}
        />
        <StatsCard
          title="Completed"
          value={18}
          change="75% completion rate"
          changeType="positive"
          icon={TrendingUp}
          delay={0.1}
        />
        <StatsCard
          title="In Progress"
          value={4}
          change="2 due today"
          changeType="neutral"
          icon={Clock}
          delay={0.2}
        />
        <StatsCard
          title="Overdue"
          value={2}
          change="Needs attention"
          changeType="negative"
          icon={Zap}
          delay={0.3}
        />
      </div>

      {/* Progress & Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DailyProgressRadial completed={completedCount} total={tasks.length} />
        <div className="lg:col-span-2">
          <TasksDueToday
            tasks={tasks}
            onToggleComplete={handleToggleComplete}
          />
        </div>
      </div>
    </motion.div>
  );
}
