import { habitApi } from "@/entities/habit/api"
import { queryClient } from "@/shared/api/query-client"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

export function useResetStreackHabit() {
  const mutation = useMutation({
    mutationFn: habitApi.putResetStreackHabit,
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["habits"] }),
    onError: () => {
      toast.error("Не удалось сбросить прогресс привычки")
    },
    onSuccess: () => {
      toast.success("Успешно сбросили прогресс привычки")
    },
  })

  return {
    updateResetStreackHabit: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    data: mutation.data,
  }
}
