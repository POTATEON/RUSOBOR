import { habitApi } from "@/entities/habit/api"
import { queryClient } from "@/shared/api/query-client"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

export function useAddHabitPersonal() {
  const mutation = useMutation({
    mutationFn: ({ idHabit, idUser }: { idHabit: string; idUser: string }) =>
      habitApi.putAddHabitPersonal({ idHabit, idUser }),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["habits"] }),
    onError: () => {
      toast.error("Не удалось привязать привычку")
    },
    onSuccess: () => {
      toast.success("Привычка успешно привязана")
    },
  })

  return {
    addHabitPersonal: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    data: mutation.data,
  }
}
