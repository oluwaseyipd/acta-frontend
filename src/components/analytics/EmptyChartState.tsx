import { BarChart3, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function EmptyChartState({ message }: { message: string }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-[280px] w-full border-2 border-dashed border-muted rounded-xl bg-muted/5">
      <div className="p-4 bg-muted/20 rounded-full mb-4">
        <BarChart3 className="h-8 w-8 text-muted-foreground opacity-50" />
      </div>
      <p className="text-sm font-medium text-muted-foreground mb-4">
        {message}
      </p>
      <Button 
        variant="outline" 
        size="sm" 
        className="gap-2"
        onClick={() => navigate("/dashboard/tasks")}
      >
        <Plus className="h-4 w-4" />
        Create your first task
      </Button>
    </div>
  );
}
