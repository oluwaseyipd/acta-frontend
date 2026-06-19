import apiClient, { endpoints } from '@/lib/api-client'; 
import { Task } from '@/types/task';

export const taskApi = {

  
  create: async (taskData: any) => {
    // endpoints.tasks is likely '/tasks/'
    const { data } = await apiClient.post(endpoints.tasks, taskData);
    return data;
  },
  // Now uses Axios + your Interceptors automatically!
  getAll: async () => {
    const { data } = await apiClient.get(endpoints.tasks);
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
