"use client"

import { MyHabitCard } from "@/features/habit/my-habit-card"
import { HabitStats } from "@/features/habit/habit-stats"
import { useGetMyHabitList } from "@/features/habit/model/use-get-my-habit-list"
import { HabitPagination } from "@/features/habit/pagination-habit-list"
import { useState } from "react"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { habits } from "@/entities/habit/types"

const PAGE_SIZE = 10

export default function MyHabitPage() {
  const [page, setPage] = useState(1)
  const userId = "string"

  const { data, isLoading, error } = useGetMyHabitList({ page, pageSize: PAGE_SIZE, userId })

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-destructive">Ошибка загрузки ваших привычек: {error.message}</div>
      </div>
    )
  }

  const habits = data?.result?.habits || []
  const totalCount = data?.result?.totalCount || 0

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Мои привычки</h1>
        <p className="text-muted-foreground mt-2">
          Здесь отображаются все привычки, которые вы добавили в свой личный список.
          Отмечайте выполнение каждый день, следите за прогрессом и достигайте целей!
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <Skeleton className="h-40 w-full rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-60 rounded-xl" />
            ))}
          </div>
        </div>
      ) : (
        <>
          <HabitStats habits={habits} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {habits.map((habit: habits) => (
              <MyHabitCard key={habit.id} habit={habit} userId={userId} />
            ))}
          </div>

          {totalCount > PAGE_SIZE && (
            <HabitPagination
              page={page}
              setPage={setPage}
              total={totalCount}
              pageSize={PAGE_SIZE}
            />
          )}

          {habits.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed rounded-2xl">
              <h3 className="text-xl font-semibold text-muted-foreground">У вас пока нет привычек</h3>
              <p className="mt-2 text-muted-foreground">
                Добавьте привычки из каталога, чтобы начать отслеживать свой прогресс.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}