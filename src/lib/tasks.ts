// api/tasks.ts
import apiClient, { endpoints } from '@/lib/api-client';

export const taskApi = {
  // ... other methods ...
  create: async (taskData: any) => {
    const { data } = await apiClient.post(endpoints.tasks, taskData);
    return data;
  },
};
