import { useMemo } from "react";
import { subDays, format, isSameDay, parseISO } from "date-fns";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, defs, linearGradient, stop
} from "recharts";
import { EmptyChartState } from "@/components/analytics/EmptyChartState";

interface ProductivityChartProps {
  tasks: any[];
  range: number; // Add this
}

export function ProductivityChart({ tasks, range }: ProductivityChartProps) {
  // Memoize calculations so they don't re-run unless tasks change
  const chartData = useMemo(() => {
    return Array.from({ length: range }, (_, i) => {
      const date = subDays(new Date(), (range - 1) - i);
      const dateStr = range > 30 ? format(date, "MMM dd") : format(date, "dd MMM");

      const count = tasks.filter((task) => {
        const rawDate = task.due_date || task.dueDate;
        if (task.status !== "completed" || !rawDate) return false;
        return isSameDay(parseISO(rawDate), date);
      }).length;

      return { day: dateStr, completed: count };
    });
  }, [tasks, range]);

  const hasData = chartData.some(day => day.completed > 0);

  return (
    <div className="p-6 rounded-2xl bg-card border border-border shadow-sm h-[400px]">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Productivity Trend</h3>
        <p className="text-sm text-muted-foreground">Tasks completed over the last 7 days</p>
      </div>

      <div className="h-[280px] w-full">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" opacity={0.5} />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                interval={range > 30 ? 6 : 0}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  borderRadius: '12px',
                  border: '1px solid hsl(var(--border))',
                  fontSize: '12px'
                }}
              />
              <Area
                type="monotone"
                dataKey="completed"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorCompleted)"
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <EmptyChartState message="No tasks completed in this time range" />
        )}
      </div>
    </div>
  );
}
