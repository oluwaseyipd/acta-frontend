import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";


interface DailyProgressRadialProps {
  completed: number;
  total: number;
}

export function DailyProgressRadial({
  completed,
  total,
}: DailyProgressRadialProps) {
  // Safety check: calculate percentage, ensure it's between 0-100
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  // Recharts needs two segments to show the "ring"
  const data = [
    { name: "Completed", value: percentage },
    { name: "Remaining", value: 100 - percentage },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="glass-card p-6"
    >
      <h3 className="text-lg font-semibold mb-4 text-foreground">Daily Progress</h3>

      <div className="relative h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={0}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              stroke="none"
              animationBegin={0}
              animationDuration={1000}
            >
              {/* Segment 1: Progress color */}
              <Cell fill="hsl(var(--success))" className="transition-all duration-500" />
              {/* Segment 2: Background track color */}
              <Cell fill="hsl(var(--muted))" opacity={0.3} />
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Text (Absolute Positioned) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            key={percentage} // Key triggers re-animation when number changes
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-foreground leading-none"
          >
            {percentage}%
          </motion.span>
          <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider font-medium">
            Done
          </p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-6">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-[success]" style={{ backgroundColor: 'hsl(var(--success))' }} />
          <span className="text-sm font-medium text-foreground">
            {completed} <span className="text-muted-foreground font-normal">done</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-muted" />
          <span className="text-sm font-medium text-foreground">
            {total - completed} <span className="text-muted-foreground font-normal">left</span>
          </span>
        </div>
      </div>
    </motion.div>
  );
}
