import { useState } from "react";
import { format } from "date-fns";
import { Calendar, Clock, X, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useCategories } from "@/hooks/useCategories";
import React from "react";
import { extractTime } from "../utils/date-utils";

type Priority = "low" | "medium" | "high";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  category: string;
  created_at: string;
  due_date: string;
}

interface TaskDetailModalProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (task: Task) => void;
}

const priorityColors = {
  low: "bg-info/10 text-info border-info/20",
  medium: "bg-warning/10 text-warning border-warning/20",
  high: "bg-destructive/10 text-destructive border-destructive/20",
};

const statusColors = {
  todo: "bg-muted text-muted-foreground",
  in_progress: "bg-primary/10 text-primary",
  completed: "bg-accent/10 text-accent",
};

// Generate time options in 30-minute intervals
const generateTimeOptions = () => {
  const options = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      const hour = h.toString().padStart(2, "0");
      const minute = m.toString().padStart(2, "0");
      const value = `${hour}:${minute}`;
      const displayHour = h % 12 || 12;
      const ampm = h >= 12 ? "PM" : "AM";
      const label = `${displayHour}:${minute} ${ampm}`;
      options.push({ value, label });
    }
  }
  return options;
};

const timeOptions = generateTimeOptions();

export function TaskDetailModal({ task, open, onOpenChange, onSave, }: TaskDetailModalProps) {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editedTask, setEditedTask] = useState<Task | null>(null);

  const { data: categories, isLoading: isCatsLoading } = useCategories();

  React.useEffect(() => {
  if (task) {
    setEditedTask({ ...task });
  }
}, [task]);


  // Helper to find the current category name for the display view

const currentCategoryName = React.useMemo(() => {
    if (!categories) return "Uncategorized";
    const list = Array.isArray(categories) ? categories : categories.results;
    // Standardize the list source from your paginated API
    return list?.find((c: any) => c.id === editedTask?.category)?.name || "Uncategorized";
  }, [categories, editedTask?.category])


if (!task || !editedTask) return null;


  const handleFieldClick = (field: string) => {
    setEditingField(field);
  };

  const handleSaveField = () => {
    setEditingField(null);
  };

  const handleSaveAll = () => {
    if (editedTask) {
      onSave(editedTask);
      onOpenChange(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "MMM d, yyyy");
    } catch {
      return dateStr;
    }
  };


  const formatTimeFromDate = (dateStr?: string) => {
  if (!dateStr) return "No time set";

  const date = new Date(dateStr);
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");

  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 || 12;

  return `${displayHour}:${minutes} ${ampm}`;
};

  const EditableField = ({
    field,
    label,
    value,
    children,
  }: {
    field: string;
    label: string;
    value: React.ReactNode;
    children: React.ReactNode;
  }) => (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </label>
      {editingField === field ? (
        <div className="flex items-center gap-2">
          <div className="flex-1">{children}</div>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleSaveField}
            className="h-8 w-8"
          >
            <Check className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          onClick={() => handleFieldClick(field)}
          className="p-2 rounded-lg border border-transparent hover:border-border hover:bg-secondary/50 cursor-pointer transition-all"
        >
          {value}
        </div>
      )}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="sr-only">Task Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Title */}
          <EditableField
            field="title"
            label="Title"
            value={
              <h2 className="text-xl font-semibold">{editedTask.title}</h2>
            }
          >
            <Input
              value={editedTask.title}
              onChange={(e) =>
                setEditedTask({ ...editedTask, title: e.target.value })
              }
              className="text-lg font-semibold"
              autoFocus
            />
          </EditableField>

          {/* Description */}
          <EditableField
            field="description"
            label="Description"
            value={
              <p className="text-muted-foreground">
                {editedTask.description || "No description"}
              </p>
            }
          >
            <Textarea
              value={editedTask.description}
              onChange={(e) =>
                setEditedTask({ ...editedTask, description: e.target.value })
              }
              className="resize-none"
              rows={3}
              autoFocus
            />
          </EditableField>

          {/* Priority & Category */}
          <div className="grid grid-cols-2 gap-4">
  <EditableField
    field="priority"
    label="Priority"
    value={
      <span
        className={cn(
          "px-3 py-1.5 text-sm rounded-lg border capitalize inline-block",
          priorityColors[editedTask.priority],
        )}
      >
        {editedTask.priority}
      </span>
    }
  >
    <Select
      value={editedTask.priority}
      onValueChange={(val: Priority) =>
        setEditedTask({ ...editedTask, priority: val })
      }
    >
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="low">Low</SelectItem>
        <SelectItem value="medium">Medium</SelectItem>
        <SelectItem value="high">High</SelectItem>
      </SelectContent>
    </Select>
  </EditableField>

  
  <EditableField
        field="category"
        label="Category"
        value={
          <span className="px-3 py-1.5 text-sm rounded-lg border bg-secondary/30 inline-block">
            {isCatsLoading ? "Loading..." : currentCategoryName}
          </span>
        }
      >
        <Select
          value={editedTask.category || ""}
          onValueChange={(val: string) =>
            setEditedTask({ ...editedTask, category: val })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {/* Map through categories based on your API's paginated structure */}
            {(Array.isArray(categories) ? categories : categories?.results)?.map((cat: any) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
            
            {(!categories || (Array.isArray(categories) ? categories.length : categories?.results?.length) === 0) && (
              <div className="p-2 text-xs text-center text-muted-foreground italic">
                No categories available
              </div>
            )}
          </SelectContent>
        </Select>
      </EditableField>
</div>

          {/* Due Date & Time Row */}
          <div className="grid grid-cols-2 gap-4">
            <EditableField
              field="due_date"
              label="Due Date"
              value={
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {formatDate(editedTask.due_date)}
                </span>
              }
            >
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="mr-2 h-4 w-4" />
                    {formatDate(editedTask.due_date)}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarPicker
                    mode="single"
                    selected={new Date(editedTask.due_date)}
                    onSelect={(date) =>
                      date &&
                      setEditedTask({
                        ...editedTask,
                        due_date: format(date, "yyyy-MM-dd"),
                      })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </EditableField>

            <EditableField
              field="due_time"
              label="Due Time"
              value={
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  {formatTimeFromDate(editedTask.due_date)}
                </span>
              }
            >
              <Select
                value={extractTime(editedTask.due_date) || ""}
                onValueChange={(val) => {
                  const date = new Date(editedTask.due_date);
                  const [hours, minutes] = val.split(":").map(Number);

                  date.setHours(hours, minutes, 0, 0);

                  setEditedTask({
                    ...editedTask,
                    due_date: date.toISOString(),
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {timeOptions.map((time) => (
                    <SelectItem key={time.value} value={time.value}>
                      {time.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </EditableField>
          </div>

          {/* Created Date (read-only) */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Created
            </label>
            <p className="p-2 text-sm text-muted-foreground">
              {formatDate(editedTask.created_at)}
            </p>
          </div>

          {/* Save Button */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleSaveAll}>
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
