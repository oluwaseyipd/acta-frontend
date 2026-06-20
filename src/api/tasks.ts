import apiClient, { endpoints } from '@/lib/api-client'; 
import { Task } from '@/types/task';

export const taskApi = {
  create: async (taskData: any) => {
    const { data } = await apiClient.post(endpoints.tasks, taskData);
    return data;
  },

  getAll: async (params?: Record<string, any>) => {
    const { data } = await apiClient.get(endpoints.tasks, { params });
    if (Array.isArray(data)) {
      return data;
    }
    if (data && Array.isArray(data.results)) {
      return data;
    }
    return data; 
  },

  update: async (id: string, updates: Partial<Task>) => {
    const { data } = await apiClient.patch(endpoints.taskDetail(id), updates);
    return data;
  },

  delete: async (id: string) => {
    await apiClient.delete(endpoints.taskDetail(id));
  },
};
