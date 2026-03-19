"use client"

import { habits } from "@/entities/habit/types"
import { Button } from "@/shared/components/ui/button"
import { cn } from "@/lib/utils"
import { useUpdateStreackHabit } from "./model/use-update-streack-habit"
import { useResetStreackHabit } from "./model/use-reset-streack-habit"
import { useEffect, useState } from "react"

interface HabitCardProps {
  habit: habits
  onAddToPersonal?: (habitId: string) => void
  userId?: string
}

export function HabitCard({ habit, onAddToPersonal, userId = "string" }: HabitCardProps) {
  const { id, name, description, cost, tagName, streak, finalValue, goal_days } = habit

  const { updateStreackHabit, isPending: isUpdating } = useUpdateStreackHabit()
  const { updateResetStreackHabit, isPending: isResetting } = useResetStreackHabit()

  const [lastClickedAt, setLastClickedAt] = useState<number | null>(null)
  const [showAlreadyMarked, setShowAlreadyMarked] = useState(false)
  const [resetTimerId, setResetTimerId] = useState<NodeJS.Timeout | null>(null)

  // Загрузка времени последнего нажатия из localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`habit_${id}_lastClicked`)
    if (saved) {
      const timestamp = parseInt(saved, 10)
      if (!isNaN(timestamp)) {
        setLastClickedAt(timestamp)
        // Запланировать сброс, если прошло больше 24 часов с последнего нажатия
        scheduleResetIfNeeded(timestamp)
      }
    }
  }, [id])

  // Функция для планирования сброса через 24 часа после lastClickedAt
  const scheduleResetIfNeeded = (timestamp: number) => {
    const now = Date.now()
    const twentyFourHours = 24 * 60 * 60 * 1000
    const timeSinceClick = now - timestamp
    const timeUntilReset = twentyFourHours - timeSinceClick

    if (timeUntilReset > 0) {
      // Если ещё не прошло 24 часа, запланировать сброс
      const timer = setTimeout(() => {
        handleAutoReset()
      }, timeUntilReset)
      setResetTimerId(timer)
    } else {
      // Если прошло больше 24 часов, сбросить streak
      handleAutoReset()
    }
  }

  const handleAutoReset = async () => {
    try {
      await updateResetStreackHabit({ idHabit: id, idUser: userId })
      // После сброса очищаем lastClickedAt
      localStorage.removeItem(`habit_${id}_lastClicked`)
      setLastClickedAt(null)
    } catch (error) {
      console.error("Ошибка при автосбросе streak:", error)
    }
  }

  const handleMark = async () => {
    const now = Date.now()
    const twentyFourHours = 24 * 60 * 60 * 1000

    if (lastClickedAt && now - lastClickedAt < twentyFourHours) {
      // Показываем картинку и звук
      setShowAlreadyMarked(true)
      const audio = new Audio("/iii.mp3")
      audio.volume = 0.3
      audio.play().catch((e) => console.log("Аудио не удалось воспроизвести:", e))
      setTimeout(() => setShowAlreadyMarked(false), 3000)
      return
    }

    // Отправляем запрос на увеличение streak
    try {
      await updateStreackHabit({ idHabit: id, idUser: userId, streak: streak + 1 })
      // Сохраняем время нажатия
      localStorage.setItem(`habit_${id}_lastClicked`, now.toString())
      setLastClickedAt(now)
      // Отменяем предыдущий таймер сброса, если был
      if (resetTimerId) clearTimeout(resetTimerId)
      // Запускаем новый таймер сброса через 24 часа
      const timer = setTimeout(() => {
        handleAutoReset()
      }, twentyFourHours)
      setResetTimerId(timer)
    } catch (error) {
      console.error("Ошибка при отметке привычки:", error)
    }
  }

  // Очистка таймера при размонтировании
  useEffect(() => {
    return () => {
      if (resetTimerId) clearTimeout(resetTimerId)
    }
  }, [resetTimerId])

  const getCostTheme = (cost: number) => {
    if (cost <= 50) {
      return {
        border: "border-l-4 border-l-green-500",
        bg: "bg-green-50 dark:bg-green-950/20",
        text: "text-green-800 dark:text-green-300",
        buttonVariant: "default" as const,
      }
    } else if (cost <= 150) {
      return {
        border: "border-l-4 border-l-yellow-500",
        bg: "bg-yellow-50 dark:bg-yellow-950/20",
        text: "text-yellow-800 dark:text-yellow-300",
        buttonVariant: "secondary" as const,
      }
    } else {
      return {
        border: "border-l-4 border-l-red-500",
        bg: "bg-red-50 dark:bg-red-950/20",
        text: "text-red-800 dark:text-red-300",
        buttonVariant: "destructive" as const,
      }
    }
  }

  const theme = getCostTheme(cost)

  // Прогресс достижения цели (используем goal_days, если задано, иначе finalValue)
  const goalValue = goal_days > 0 ? goal_days : (finalValue ?? 0)
  const progressPercent = goalValue > 0 ? Math.min(100, (streak / goalValue) * 100) : 0
  const isGoalReached = streak >= goalValue

  // Определяем, доступна ли кнопка "отметиться"
  const twentyFourHours = 24 * 60 * 60 * 1000
  const canMark = !lastClickedAt || (Date.now() - lastClickedAt >= twentyFourHours)

  return (
    <div
      className={cn(
        "rounded-lg p-4 shadow-sm transition-all hover:shadow-md",
        theme.border,
        theme.bg,
        theme.text
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <h3 className="font-semibold text-lg">{name}</h3>
          <p className="text-sm opacity-80">{description}</p>
          <div className="space-y-3 mt-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-white/50 dark:bg-black/50">
                Ценность: {cost}
              </span>
              {tagName && tagName.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {tagName.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                Цель: {goalValue} дней
              </span>
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                Серия: {streak} 🔥
              </span>
            </div>

            {/* Прогресс-бар */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Прогресс к цели</span>
                <span>
                  {streak} / {goalValue} ({progressPercent.toFixed(0)}%)
                </span>
              </div>
              <div className="h-2 w-full bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all duration-500", {
                    "bg-green-500": progressPercent >= 100,
                    "bg-blue-500": progressPercent >= 50 && progressPercent < 100,
                    "bg-yellow-500": progressPercent > 0 && progressPercent < 50,
                    "bg-gray-400": progressPercent === 0,
                  })}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              {isGoalReached && (
                <div className="text-xs font-medium text-green-700 dark:text-green-300 mt-1">
                  🎉 Цель достигнута! Вы можете получить награду.
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 shrink-0 ml-2">
          <Button
            variant={theme.buttonVariant}
            size="sm"
            onClick={() => onAddToPersonal?.(id)}
            className="w-full"
          >
            Добавить
          </Button>
          <Button
            variant={canMark ? "default" : "outline"}
            size="sm"
            onClick={handleMark}
            disabled={isUpdating || isResetting}
            className={cn("w-full", !canMark && "bg-gray-300 text-gray-600")}
          >
            {canMark ? "Отметиться" : "Уже отмечено"}
          </Button>
        </div>
      </div>

      {/* Оверлей "сегодня вы уже отметились" */}
      {showAlreadyMarked && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-2xl max-w-md text-center border-4 border-yellow-400">
            <img
              src="/ded.jpg"
              alt="Already marked"
              className="w-48 h-48 object-cover rounded-full mx-auto mb-4"
            />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
              Сегодня вы уже отметились!
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Подождите 24 часа перед следующей отметкой.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setShowAlreadyMarked(false)}
            >
              Закрыть
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}