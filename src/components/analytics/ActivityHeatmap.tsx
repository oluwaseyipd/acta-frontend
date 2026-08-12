import { subDays, format, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";

export function ActivityHeatmap({ tasks }: { tasks: any[] }) {
  const last28Days = Array.from({ length: 28 }, (_, i) => subDays(new Date(), 27 - i));

  return (
    <div className="p-6 rounded-2xl bg-card border border-border shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Last 4 Weeks Activity</h3>
      <div className="flex flex-wrap gap-2">
        {last28Days.map((date) => {
          const count = tasks.filter(t => {
            const rawDate = t.due_date || t.dueDate;
            return t.status === "completed" && rawDate && isSameDay(new Date(rawDate), date);
          }).length;

          return (
            <div
              key={date.toISOString()}
              className={cn(
                "h-8 w-8 rounded-md flex items-center justify-center text-[10px] font-bold transition-all",
                count === 0 && "bg-muted/30 text-muted-foreground",
                count > 0 && count < 3 && "bg-primary/30 text-primary border border-primary/20",
                count >= 3 && "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
              )}
              title={`${count} tasks on ${format(date, "MMM dd")}`}
            >
              {count > 0 ? count : ""}
            </div>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground mt-4">
        Darker squares indicate higher daily task volume.
      </p>
    </div>
  );
}
