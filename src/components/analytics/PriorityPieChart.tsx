import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface PriorityPieChartProps {
  tasks: any[];
}

const PRIORITY_COLORS: Record<string, string> = {
  high: "hsl(var(--destructive))",
  medium: "hsl(var(--warning))",
  low: "hsl(var(--info))",
};

export function PriorityPieChart({ tasks }: PriorityPieChartProps) {
  const chartData = useMemo(() => {
    const counts = tasks.reduce((acc, task) => {
      const p = task.priority?.toLowerCase() || "low";
      acc[p] = (acc[p] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.keys(counts).map((key) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: counts[key],
      fill: PRIORITY_COLORS[key] || "hsl(var(--muted))",
    }));
  }, [tasks]);

  return (
    <div className="p-6 rounded-2xl bg-card border border-border shadow-sm h-[400px] flex flex-col">
      <div className="mb-2">
        <h3 className="text-lg font-semibold">Priority Distribution</h3>
        <p className="text-sm text-muted-foreground">Workload balance by priority</p>
      </div>

      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              animationBegin={0}
              animationDuration={1200}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} stroke="none" />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                borderRadius: '12px', 
                border: '1px solid hsl(var(--border))' 
              }} 
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
