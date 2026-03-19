import { achievementsApi } from "@/entities/achievements/api";
import { queryClient } from "@/shared/api/query-client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function useCreateAchievements(){
    const mutation = useMutation({
    mutationFn: achievementsApi.postAchievements,
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["achievements"] }),
    onError: () => { toast.error("Не удалось создать ачивку") },
    onSuccess: () => { toast.success("Ачивка создана") }
})
    return {
        createAchievements: mutation.mutateAsync,
        isPending: mutation.isPending,
        error: mutation.error,
    };
}
