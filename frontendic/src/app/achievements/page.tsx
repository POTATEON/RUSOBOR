"use client"

import { useState } from "react"
import { CreateAchievementsDialog } from "@/features/achievements/create-achievements-diolog"
import { AchievementCard } from "@/features/achievements/achievement-card"
import { AchievementsPagination } from "@/features/achievements/pagination-achievements-list"
import { useGetAchievementsList } from "@/features/achievements/model/use-get-achievements-list"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { Achievement } from "@/entities/achievements/types"
import { useQuery } from "@tanstack/react-query"
import { achievementsApi } from "@/entities/achievements/api"

export default function AchievementsPage() {
  const userId = "string"
  const [page, setPage] = useState(1)
  const pageSize = 20

  const { data, isLoading, error } = useGetAchievementsList({ page, pageSize, userId })

  const { data: allData, isLoading: allLoading } = useQuery({
    queryKey: ["achievements-all", userId],
    queryFn: () => achievementsApi.getAchievements({ page: 1, pageSize: 100, userId }),
    enabled: !!userId,
  })

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-destructive">Ошибка загрузки ачивок: {error.message}</div>
      </div>
    )
  }

  const achievementsList: Achievement[] = data?.result?.achievements || []
  const totalCount = data?.result?.totalCount || 0

  const allAchievements = allData?.result?.achievements || []
  const completedCount = allAchievements.filter(a => a.isCompleted).length
  const totalGoals = allAchievements.length
  const earnedCount = completedCount

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Мои ачивки</h1>
        <CreateAchievementsDialog userId={userId} />
      </div>

      {/* Статистика */}
      {allLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 dark:text-blue-300">Всего целей</p>
                <p className="text-3xl font-bold mt-2">{totalGoals}</p>
              </div>
              <div className="text-2xl">🎯</div>
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-xl border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 dark:text-green-300">Достигнуто целей</p>
                <p className="text-3xl font-bold mt-2">{completedCount}</p>
              </div>
              <div className="text-2xl">✅</div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Из {totalGoals} целей достигнуто {completedCount}
            </p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-950/30 p-4 rounded-xl border border-purple-200 dark:border-purple-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-700 dark:text-purple-300">Заработано достижений</p>
                <p className="text-3xl font-bold mt-2">{earnedCount}</p>
              </div>
              <div className="text-2xl">🏆</div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Вы выполнили {earnedCount} достижений
            </p>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: pageSize }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-lg" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievementsList.map((achievement) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                userId={userId}
              />
            ))}
          </div>
          {totalCount > pageSize && (
            <AchievementsPagination
              page={page}
              setPage={setPage}
              total={totalCount}
              pageSize={pageSize}
            />
          )}
        </>
      )}

      {!isLoading && achievementsList.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          У вас пока нет ачивок. Создайте первую!
        </div>
      )}
    </div>
  )
}