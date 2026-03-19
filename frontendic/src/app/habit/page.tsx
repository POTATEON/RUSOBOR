"use client"

import { HabitCard } from "@/features/habit/habit-card"
import { CreateHabitDialog } from "@/features/habit/create-habit-dialog"
import { useGetHabitList } from "@/features/habit/model/use-get-habit-list"
import { HabitPagination } from "@/features/habit/pagination-habit-list"
import { useState } from "react"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { useAddHabitPersonal } from "@/features/habit/model/use-add-to-personal-habit"

const PAGE_SIZE = 10

export default function HabitPage() {
  const [page, setPage] = useState(1)
  const userId = "string" // Заглушка, в реальном приложении брать из контекста

  const { data, isLoading, error } = useGetHabitList({ page, pageSize: PAGE_SIZE })
  const { addHabitPersonal, isPending } = useAddHabitPersonal()

  const handleAddToPersonal = async (habitId: string) => {
    try {
      await addHabitPersonal({ idHabit: habitId, idUser: userId })
    } catch (err) {
      console.error("Ошибка добавления привычки:", err)
    }
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-destructive">Ошибка загрузки привычек: {error.message}</div>
      </div>
    )
  }

  const habits = data?.result?.habits || []
  const totalCount = data?.result?.totalCount || 0

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Каталог привычек</h1>
        <CreateHabitDialog />
      </div>

      <p className="text-muted-foreground mb-8">
        Выберите привычки, которые хотите добавить в свой личный список. Ценность привычки влияет на её дизайн.
      </p>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-lg" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {habits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onAddToPersonal={handleAddToPersonal}
                userId={userId}
              />
            ))}
          </div>

          {totalCount > 0 && (
            <HabitPagination
              page={page}
              setPage={setPage}
              total={totalCount}
              pageSize={PAGE_SIZE}
            />
          )}
        </>
      )}

      {!isLoading && habits.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          Нет доступных привычек. Создайте первую!
        </div>
      )}
    </div>
  )
}