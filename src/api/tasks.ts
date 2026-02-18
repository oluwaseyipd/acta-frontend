export const taskApi = {
  // Fetch all tasks
  getAll: async () => {
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/tasks`);
    if (!res.ok) throw new Error("Failed to fetch tasks");
    return res.json();
  },

  // Update a single task (status or details)
  update: async (id: string, updates: Partial<Task>) => {
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    return res.json();
  },

  // Delete a task
  delete: async (id: string) => {
    await fetch(`${import.meta.env.VITE_BASE_URL}/tasks/${id}`, { method: "DELETE" });
  }
};
