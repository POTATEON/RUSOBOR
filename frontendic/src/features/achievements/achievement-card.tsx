"use client"

import { Achievements } from "@/entities/achievements/types"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { useUpdateCompleteAchievements } from "./model/use-ubdate-complete-achievements"

interface AchievementCardProps {
  achievement: Achievements
  userId: string
}

export function AchievementCard({ achievement, userId }: AchievementCardProps) {
  const { id, name, description, finalValue, progress, isComplete } = achievement
  const percentage = finalValue > 0 ? Math.min(100, (progress / finalValue) * 100) : 0
  const isCompleted = percentage >= 100

  const [showCelebration, setShowCelebration] = useState(false)
  const [audioPlayed, setAudioPlayed] = useState(false)
  const [markedComplete, setMarkedComplete] = useState(isComplete)
  const [hasCelebrated, setHasCelebrated] = useState(false)

  const { updateProgressAchievements, isPending } = useUpdateCompleteAchievements()

  // Эффект для триггера праздника при завершении
  useEffect(() => {
    if (isCompleted && !showCelebration && !markedComplete && !hasCelebrated) {
      setShowCelebration(true)
      setHasCelebrated(true)
      // Воспроизведение звука
      const audio = new Audio("/nad.mp3")
      audio.volume = 0.3
      audio.play().catch((e) => console.log("Аудио не удалось воспроизвести:", e))
      setAudioPlayed(true)
    }
  }, [isCompleted, showCelebration, markedComplete, hasCelebrated])

  // Закрытие праздника по клику и отправка запроса
  const handleCloseCelebration = async () => {
    setShowCelebration(false)
    if (!markedComplete) {
      try {
        await updateProgressAchievements({
          achievementsId: id.toString(),
          userId: userId,
        })
        setMarkedComplete(true)
      } catch (error) {
        console.error("Ошибка при отметке ачивки:", error)
        // Если ошибка, оставляем markedComplete false, но праздник больше не показываем
        setHasCelebrated(true)
      }
    }
  }

  // Определение стилей в зависимости от прогресса и статуса
  const getProgressTheme = (percent: number, isComplete: boolean) => {
    if (isComplete) {
      return {
        bar: "bg-gray-400",
        card: "border-l-4 border-l-gray-400 bg-gray-100 dark:bg-gray-800/30",
        text: "text-gray-600 dark:text-gray-400",
      }
    }
    if (percent < 30) {
      return {
        bar: "bg-red-500",
        card: "border-l-4 border-l-red-500 bg-red-50 dark:bg-red-950/20",
        text: "text-red-800 dark:text-red-300",
      }
    } else if (percent < 70) {
      return {
        bar: "bg-yellow-500",
        card: "border-l-4 border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/20",
        text: "text-yellow-800 dark:text-yellow-300",
      }
    } else if (percent < 100) {
      return {
        bar: "bg-blue-500",
        card: "border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-950/20",
        text: "text-blue-800 dark:text-blue-300",
      }
    } else {
      return {
        bar: "bg-green-500",
        card: "border-l-4 border-l-green-500 bg-green-50 dark:bg-green-950/20",
        text: "text-green-800 dark:text-green-300",
      }
    }
  }

  const theme = getProgressTheme(percentage, markedComplete)

  return (
    <div className="relative">
      <div
        className={cn(
          "rounded-lg p-4 shadow-sm transition-all hover:shadow-md",
          theme.card,
          theme.text
        )}
      >
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <h3 className="font-semibold text-lg">{name}</h3>
            <p className="text-sm opacity-80">{description}</p>
            <div className="space-y-2 mt-3">
              <div className="flex justify-between text-sm">
                <span>Прогресс</span>
                <span>
                  {progress} / {finalValue} ({percentage.toFixed(0)}%)
                </span>
              </div>
              <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all duration-500", theme.bar)}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
            {isCompleted && !markedComplete && (
              <div className="mt-2 text-xs font-medium px-2 py-1 rounded-full bg-green-200 text-green-900 dark:bg-green-900 dark:text-green-200 inline-block">
                🎉 Завершено! Нажмите на карточку для отметки
              </div>
            )}
            {markedComplete && (
              <div className="mt-2 text-xs font-medium px-2 py-1 rounded-full bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-gray-300 inline-block">
                ✅ Выполнена и неактивна
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Эффект праздника */}
      {showCelebration && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center cursor-pointer"
          onClick={handleCloseCelebration}
        >
          <div className="absolute inset-0 bg-black/40" />
          {/* Картинки по углам - круглые и большие */}
          <img
            src="/ded.jpg"
            alt="Celebration"
            className="absolute top-8 left-8 w-48 h-48 object-cover rounded-full shadow-2xl animate-bounce border-4 border-white"
          />
          <img
            src="/ded.jpg"
            alt="Celebration"
            className="absolute top-8 right-8 w-48 h-48 object-cover rounded-full shadow-2xl animate-bounce border-4 border-white"
            style={{ animationDelay: "0.2s" }}
          />
          <img
            src="/ded.jpg"
            alt="Celebration"
            className="absolute bottom-8 left-8 w-48 h-48 object-cover rounded-full shadow-2xl animate-bounce border-4 border-white"
            style={{ animationDelay: "0.4s" }}
          />
          <img
            src="/ded.jpg"
            alt="Celebration"
            className="absolute bottom-8 right-8 w-48 h-48 object-cover rounded-full shadow-2xl animate-bounce border-4 border-white"
            style={{ animationDelay: "0.6s" }}
          />
          {/* Центральное сообщение - меньше и проще */}
          <div className="relative bg-white/95 dark:bg-gray-900/95 p-6 rounded-2xl shadow-2xl max-w-sm text-center border-4 border-yellow-400">
            <h2 className="text-2xl font-bold text-green-700 dark:text-green-300 mb-3">
              Вы выполнили
            </h2>
            <p className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              "{name}"
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Нажмите в любом месте, чтобы закрыть
            </p>
            {isPending && <p className="text-sm text-blue-600 mt-2">Отправка запроса...</p>}
          </div>
        </div>
      )}
    </div>
  )
}