import { habitApi } from "@/entities/habit/api";
import { queryClient } from "@/shared/api/query-client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function useCreateHabit(){
    const mutation = useMutation({
    mutationFn: habitApi.postHabit,
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["habits"] }),
    onError: () => { toast.error("Не удалось создать привычку") },
    onSuccess: () => { toast.success("Привычка создана") }
})
    return {
        createHabit: mutation.mutateAsync,
        isPending: mutation.isPending,
        error: mutation.error,
    };
}
