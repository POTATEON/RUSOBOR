import { habitApi } from "@/entities/habit/api";
import { queryClient } from "@/shared/api/query-client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export function useGetMyHabitList({page, pageSize, userId} : {page: number, pageSize: number, userId: string}){
    const {data, isLoading, error } = useQuery({
    queryKey: ["Myhabits", page],
    queryFn: () => habitApi.getMyHabits({page, pageSize, userId})
})
    return {
        data,
        isLoading,
        error
    };
}
