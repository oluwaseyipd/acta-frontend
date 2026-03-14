// @/hooks/useCategories.ts
import { useQuery } from "@tanstack/react-query";
import { categoryApi } from "@/lib/categories";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: categoryApi.getCategories, 
    staleTime: 1000 * 60 * 5,
  });
}