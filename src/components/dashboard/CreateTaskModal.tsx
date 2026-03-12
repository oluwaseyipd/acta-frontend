import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CalendarIcon, Clock, Loader2 } from "lucide-react";
import { format, isToday } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// Utilities & API
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { taskApi } from "@/api/tasks";

/**
 * Validation Schema
 */
const taskSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  description: z.string().max(500, "Description is too long").optional(),
  category: z.string().max(50, "Category name is too long").optional(),
  priority: z.enum(["low", "medium", "high"]),
  due_date: z.date().optional(),
  due_time: z.string().optional(),
}).refine((data) => {
  if (!data.due_date || !data.due_time) return true;

  const now = new Date();
  const selectedDateTime = new Date(data.due_date);
  const [hours, minutes] = data.due_time.split(":").map(Number);
  selectedDateTime.setHours(hours, minutes, 0, 0);

  return selectedDateTime > now;
}, {
  message: "Selected time has already passed",
  path: ["due_time"],
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface CreateTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultDate?: Date;
}

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

export function CreateTaskModal({
  open,
  onOpenChange,
  defaultDate,
}: CreateTaskModalProps) {
  const queryClient = useQueryClient();

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      due_date: defaultDate,
      category: "",
      due_time: "",
    },
  });

  React.useEffect(() => {
    if (defaultDate) {
      form.setValue("due_date", defaultDate);
    }
  }, [defaultDate, form]);

  /**
   * API Mutation Logic with Combined ISO DateTime
   */
  const { mutate, isPending } = useMutation({
    mutationFn: async (values: TaskFormValues) => {
      
       let combinedISOString = null;
        if (values.due_date && values.due_time) {
          const dateCopy = new Date(values.due_date);
          const [hours, minutes] = values.due_time.split(":").map(Number);
          dateCopy.setHours(hours, minutes, 0, 0);
          combinedISOString = dateCopy.toISOString(); // "2023-10-27T14:30:00.000Z"
        }
 
      const payload = {
        title: values.title,
        description: values.description,
        category: values.category,
        priority: values.priority,
        due_date: combinedISOString, 
      };


    return await taskApi.create(payload);// Authenticated via axios interceptor
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] }); // Refresh Inbox
      toast.success("Task created successfully!");
      form.reset();
      onOpenChange(false);
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || "Failed to create task";
      toast.error(message);
    },
  });

  const onSubmit = (data: TaskFormValues) => {
    mutate(data);
  };

  const selectedDate = form.watch("due_date");

  const filteredTimeOptions = React.useMemo(() => {
    if (!selectedDate || !isToday(selectedDate)) return timeOptions;

    const now = new Date();
    const currentTotalMinutes = now.getHours() * 60 + now.getMinutes();

    return timeOptions.filter((option) => {
      const [h, m] = option.value.split(":").map(Number);
      return (h * 60 + m) > currentTotalMinutes;
    });
  }, [selectedDate]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New Task</DialogTitle>
          <DialogDescription>
            Fill in the details for your new task.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 mt-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter task title..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add more details..."
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input placeholder="Work, Home, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="due_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Due Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="due_time"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Due Time</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4 opacity-50" />
                            <SelectValue placeholder="Pick a time" />
                          </div>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-60">
                        {filteredTimeOptions.length > 0 ? (
                          filteredTimeOptions.map((time) => (
                            <SelectItem key={time.value} value={time.value}>
                              {time.label}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="p-2 text-xs text-center text-muted-foreground italic">
                            No more times today
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Task"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}