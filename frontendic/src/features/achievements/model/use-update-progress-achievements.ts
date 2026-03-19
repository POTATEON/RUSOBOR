import { achievementsApi } from "@/entities/achievements/api"
import { queryClient } from "@/shared/api/query-client"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

export function useUpdateProgressAchievements() {
  const mutation = useMutation({
    mutationFn: achievementsApi.putUbdateProgressAchievements,
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["achievements"] }),
    onError: () => {
      toast.error("Не удалось продвинуться")
    },
    onSuccess: () => {
      toast.success("Успешно продвинулись")
    },
  })

  return {
    updateProgressAchievements: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    data: mutation.data,
  }
}
