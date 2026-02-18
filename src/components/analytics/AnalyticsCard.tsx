import { cn } from "@/lib/utils";

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  desc: string;
  variant?: "default" | "destructive" | "success";
}

export default function AnalyticsCard({ 
  title, 
  value, 
  desc, 
  variant = "default" 
}: AnalyticsCardProps) {
  return (
    <div className="p-6 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-200 group">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest group-hover:text-primary transition-colors">
        {title}
      </p>
      
      <div className="flex items-baseline gap-1 mt-2">
        <h2 className={cn(
          "text-4xl font-bold tracking-tight",
          variant === "destructive" && "text-destructive",
          variant === "success" && "text-emerald-500",
          variant === "default" && "text-foreground"
        )}>
          {value}
        </h2>
      </div>

      <p className="text-xs text-muted-foreground mt-2 font-medium">
        {desc}
      </p>
    </div>
  );
}
