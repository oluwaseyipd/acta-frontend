import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CalendarIcon, Clock, Loader2, Plus } from "lucide-react";
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
import { profileApi } from "@/lib/profile";
import { categoryApi } from "@/lib/categories";
import { useCategories } from "@/hooks/useCategories";
import { useQuery } from "@tanstack/react-query";

/**
 * Validation Schema
 */
const taskSchema = z
  .object({
    title: z.string().min(1, "Title is required").max(100, "Title is too long"),
    description: z.string().max(500, "Description is too long").optional(),
    category: z.string().max(50, "Category name is too long").optional(),
    priority: z.enum(["low", "medium", "high"]),
    due_date: z.date().optional(),
    due_time: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!data.due_date || !data.due_time) return true;

      const now = new Date();
      const selectedDateTime = new Date(data.due_date);

      if (data.due_time) {
        const [hours, minutes] = data.due_time.split(":").map(Number);
        selectedDateTime.setHours(hours, minutes, 0, 0);
      } else {
        // If no time is picked, we assume 11:59 PM, which is always in the future for today
        selectedDateTime.setHours(23, 59, 59, 999);
      }
      return selectedDateTime > now;
    },
    {
      message: "Selected time has already passed",
      path: ["due_time"],
    },
  );

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
  const { data: categories, isLoading: isCatsLoading } = useCategories();
  const [isAddingCategory, setIsAddingCategory] = React.useState(false);
  const [newCatName, setNewCatName] = React.useState("");

  // Fetch the current user to get their ID for task assignment
  const { data: user } = useQuery({
    queryKey: ["currentUser"],
    queryFn: profileApi.getProfile,
  });

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

  // Mutation to add a new category immediately
  const createCategoryMutation = useMutation({
    mutationFn: (nameString: string) =>
      categoryApi.createCategory({ name: nameString }),
    onSuccess: (newCategory) => {
      // Refresh the list so the new category appears
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      // Automatically select the newly created category in the form
      form.setValue("category", newCategory.id);
      setIsAddingCategory(false);
      setNewCatName("");
      toast.success("Category added!");
    },
    onError: (error: any) => {
      const serverMessage =
        error.response?.data?.name?.[0] ||
        error.response?.data?.non_field_errors?.[0] ||
        "Failed to create category";
      toast.error(serverMessage);
    },
  });

  const handleAddCategory = () => {
    const normalizedName = newCatName.trim();

    // 1. Simple client-side check to see if name exists in current list
    const exists = categories?.some(
      (cat) => cat.name.toLowerCase() === normalizedName.toLowerCase(),
    );

    if (exists) {
      toast.error("You already have a category with this name.");
      return;
    }

    if (normalizedName) {
      createCategoryMutation.mutate(normalizedName);
    }
  };

  /**
   * API Mutation Logic with Combined ISO DateTime
   */
  const { mutate, isPending } = useMutation({
    mutationFn: async (values: TaskFormValues) => {
      let combinedISOString = null;

      if (values.due_date) {
        const dateCopy = new Date(values.due_date);

        if (values.due_time) {
          // User picked a specific time (e.g., 2:30 PM)
          const [hours, minutes] = values.due_time.split(":").map(Number);
          dateCopy.setHours(hours, minutes, 0, 0);
        } else {
          // No time picked: Set to 11:59:59 PM to cover the full 24hrs
          dateCopy.setHours(23, 59, 59, 999);
        }
          combinedISOString = dateCopy.toISOString().slice(0, 19) + "Z";
      }

      const payload = {
        title: values.title,
        description: values.description || "",
        priority: values.priority,
        status: "pending",
        due_date: combinedISOString,
        category: values.category || null,
        assigned_to: user?.id, // Assign to current user by default
      };

      return await taskApi.create(payload); // Authenticated via axios interceptor
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
    // 3. Optional: Guard against submitting if user isn't loaded yet
    if (!user?.id) {
      toast.error("Authentication required to create tasks.");
      return;
    }
    mutate(data);
  };

  const selectedDate = form.watch("due_date");

  const filteredTimeOptions = React.useMemo(() => {
    if (!selectedDate || !isToday(selectedDate)) return timeOptions;

    const now = new Date();
    const currentTotalMinutes = now.getHours() * 60 + now.getMinutes();

    return timeOptions.filter((option) => {
      const [h, m] = option.value.split(":").map(Number);
      return h * 60 + m > currentTotalMinutes;
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
              {/* Left Column: Category */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <div className="flex gap-2">
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="flex-1">
                            <SelectValue
                              placeholder={
                                isCatsLoading ? "Loading..." : "Select"
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {/* categories is now the array returned by getCategories */}
                          {categories?.map((cat: any) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                          
                          {categories?.length === 0 && !isCatsLoading && (
                            <div className="p-2 text-xs text-center text-muted-foreground italic">
                              No categories found.
                            </div>
                          )}
                        </SelectContent>
                      </Select>

                      {/* Trigger Button beside the Select */}
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="shrink-0"
                        onClick={() => {
                          setIsAddingCategory(!isAddingCategory);
                          setNewCatName(""); // Clear name when closing
                        }}
                      >
                        <Plus
                          className={cn(
                            "h-4 w-4 transition-transform",
                            isAddingCategory && "rotate-45",
                          )}
                        />
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Right Column: Priority */}
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

            {/* The Toggleable Inline Input - Appears right below the grid row */}
            {isAddingCategory && (
              <div className="mt-2 flex items-center gap-2 p-2 bg-muted/30 rounded-md border border-dashed animate-in fade-in slide-in-from-top-1">
                <Input
                  placeholder="New category name..."
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="h-8 text-sm"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddCategory();
                    }
                  }}
                />
                <Button
                  size="sm"
                  className="h-8"
                  onClick={handleAddCategory}
                  disabled={createCategoryMutation.isPending}
                >
                  {createCategoryMutation.isPending ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    "Save"
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2"
                  onClick={() => {
                    setIsAddingCategory(false);
                    setNewCatName("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            )}

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
