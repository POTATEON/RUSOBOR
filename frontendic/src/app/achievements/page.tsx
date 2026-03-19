"use client"

import { CreateAchievementsDialog } from "@/features/achievements/create-achievements-diolog"
import { AchievementCard } from "@/features/achievements/achievement-card"
import { useGetAchievementsList } from "@/features/achievements/model/use-get-achievements-list"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { Achievements } from "@/entities/achievements/types"

export default function AchievementsPage() {
  const userId = "string" // Заглушка, в реальном приложении брать из контекста
  const page = 1
  const pageSize = 100

  const { data, isLoading, error } = useGetAchievementsList({ page, pageSize, userId })

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-destructive">Ошибка загрузки ачивок: {error.message}</div>
      </div>
    )
  }

  // Преобразуем данные: result может быть одним объектом или массивом
  let achievementsList: Achievements[] = []
  if (data?.result) {
    if (Array.isArray(data.result)) {
      achievementsList = data.result
    } else {
      // Если result - одиночный объект, оборачиваем в массив
      achievementsList = [data.result]
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Мои ачивки</h1>
        <CreateAchievementsDialog />
      </div>

      <p className="text-muted-foreground mb-8">
        Здесь отображаются ваши достижения. Прогресс показывает, насколько вы близки к цели.
      </p>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievementsList.map((achievement) => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              userId={userId}
            />
          ))}
        </div>
      )}

      {!isLoading && achievementsList.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          У вас пока нет ачивок. Создайте первую!
        </div>
      )}
    </div>
  )
}