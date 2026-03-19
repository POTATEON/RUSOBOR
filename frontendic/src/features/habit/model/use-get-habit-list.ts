import { habitApi } from "@/entities/habit/api";
import { queryClient } from "@/shared/api/query-client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export function useGetHabitList({page, pageSize} : {page: number, pageSize: number}){
    const {data, isLoading, error } = useQuery({
    queryKey: ["habits", page],
    queryFn: () => habitApi.getHabits({page, pageSize})
})
    return {
        data,
        isLoading,
        error
    };
}
