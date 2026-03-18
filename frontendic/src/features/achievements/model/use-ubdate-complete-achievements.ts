import { achievementsApi } from "@/entities/achievements/api"
import { queryClient } from "@/shared/api/query-client"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

export function useUpdateCompleteAchievements() {
  const mutation = useMutation({
    mutationFn: achievementsApi.putUbdateCompleteAchievements,
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["achievements"] }),
    onError: () => {
      toast.error("Не отметить выполнение ачивки")
    },
    onSuccess: () => {
      toast.success("Успешно отметили выполнение ачивки")
    },
  })

  return {
    updateProgressAchievements: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    data: mutation.data,
  }
}
