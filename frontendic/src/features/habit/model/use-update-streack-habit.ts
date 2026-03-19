import { habitApi } from "@/entities/habit/api"
import { queryClient } from "@/shared/api/query-client"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

export function useUpdateStreackHabit() {
  const mutation = useMutation({
    mutationFn: habitApi.putUpdateStreackHabit,
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["habits"] }),
    onError: () => {
      toast.error("Не удалось обновить прогресс привычки")
    },
    onSuccess: () => {
      toast.success("Успешно обновили прогресс привычки")
    },
  })

  return {
    updateStreackHabit: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    data: mutation.data,
  }
}
