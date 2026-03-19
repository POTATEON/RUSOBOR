"use client"

import { habits } from "@/entities/habit/types"
import { Button } from "@/shared/components/ui/button"
import { cn } from "@/lib/utils"
import { useUpdateStreackHabit } from "./model/use-update-streack-habit"
import { useResetStreackHabit } from "./model/use-reset-streack-habit"
import { useEffect, useState } from "react"

interface MyHabitCardProps {
  habit: habits
  userId?: string
}

export function MyHabitCard({ habit, userId = "string" }: MyHabitCardProps) {
  const { id, name, description, cost, tagName, streak, finalValue } = habit

  const { updateStreackHabit, isPending: isUpdating } = useUpdateStreackHabit()
  const { updateResetStreackHabit, isPending: isResetting } = useResetStreackHabit()

  const [lastClickedAt, setLastClickedAt] = useState<number | null>(null)
  const [showAlreadyMarked, setShowAlreadyMarked] = useState(false)
  const [resetTimerId, setResetTimerId] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem(`habit_${id}_lastClicked`)
    if (saved) {
      const timestamp = parseInt(saved, 10)
      if (!isNaN(timestamp)) {
        setLastClickedAt(timestamp)
        scheduleResetIfNeeded(timestamp)
      }
    }
  }, [id])

  const scheduleResetIfNeeded = (timestamp: number) => {
    const now = Date.now()
    const twentyFourHours = 24 * 60 * 60 * 1000
    const timeSinceClick = now - timestamp
    const timeUntilReset = twentyFourHours - timeSinceClick

    if (timeUntilReset > 0) {
      const timer = setTimeout(() => {
        handleAutoReset()
      }, timeUntilReset)
      setResetTimerId(timer)
    } else {
      handleAutoReset()
    }
  }

  const handleAutoReset = async () => {
    try {
      await updateResetStreackHabit({ idHabit: id, idUser: userId })
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
      setShowAlreadyMarked(true)
      const audio = new Audio("/iii.mp3")
      audio.volume = 0.3
      audio.play().catch((e) => console.log("Аудио не удалось воспроизвести:", e))
      setTimeout(() => setShowAlreadyMarked(false), 3000)
      return
    }

    try {
      await updateStreackHabit({ idHabit: id, idUser: userId, streak: streak + 1 })
      localStorage.setItem(`habit_${id}_lastClicked`, now.toString())
      setLastClickedAt(now)
      if (resetTimerId) clearTimeout(resetTimerId)
      const timer = setTimeout(() => {
        handleAutoReset()
      }, twentyFourHours)
      setResetTimerId(timer)
    } catch (error) {
      console.error("Ошибка при отметке привычки:", error)
    }
  }

  useEffect(() => {
    return () => {
      if (resetTimerId) clearTimeout(resetTimerId)
    }
  }, [resetTimerId])

  const getCostTheme = (cost: number) => {
    if (cost <= 50) {
      return {
        border: "border-l-4 border-l-green-500",
        bg: "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20",
        text: "text-green-800 dark:text-green-300",
        buttonVariant: "default" as const,
        badge: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      }
    } else if (cost <= 150) {
      return {
        border: "border-l-4 border-l-amber-500",
        bg: "bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20",
        text: "text-amber-800 dark:text-amber-300",
        buttonVariant: "secondary" as const,
        badge: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
      }
    } else {
      return {
        border: "border-l-4 border-l-rose-500",
        bg: "bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20",
        text: "text-rose-800 dark:text-rose-300",
        buttonVariant: "destructive" as const,
        badge: "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200",
      }
    }
  }

  const theme = getCostTheme(cost)

  const safeFinalValue = finalValue ?? 0
  const progressPercent = safeFinalValue > 0 ? Math.min(100, (streak / safeFinalValue) * 100) : 0
  const isGoalReached = streak >= safeFinalValue

  const twentyFourHours = 24 * 60 * 60 * 1000
  const canMark = !lastClickedAt || (Date.now() - lastClickedAt >= twentyFourHours)

  return (
    <div
      className={cn(
        "rounded-xl p-5 shadow-lg transition-all hover:shadow-xl",
        theme.border,
        theme.bg,
        theme.text
      )}
    >
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-xl">{name}</h3>
            <span className={cn("text-xs font-semibold px-3 py-1 rounded-full", theme.badge)}>
              Ценность: {cost}
            </span>
          </div>
          <p className="text-sm opacity-90">{description}</p>

          <div className="flex flex-wrap items-center gap-3 mt-4">
            {tagName && tagName.length > 0 && (
              <div className="flex items-center gap-1">
                <span className="text-sm">🏷️</span>
                <div className="flex flex-wrap gap-1">
                  {tagName.map((tag: string, idx: number) => (
                    <span
                      key={idx}
                      className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="flex items-center gap-1">
              <span className="text-sm">🎯</span>
              <span className="text-sm font-medium">Цель: {safeFinalValue} дней</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm">🔥</span>
              <span className="text-sm font-medium">Серия: {streak}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm">📅</span>
              <span className="text-sm">
                {lastClickedAt
                  ? `Последняя отметка: ${new Date(lastClickedAt).toLocaleDateString()}`
                  : "Ещё не отмечалось"}
              </span>
            </div>
          </div>

          {/* Прогресс-бар с анимацией */}
          <div className="space-y-2 mt-4">
            <div className="flex justify-between text-sm">
              <span>Прогресс к цели</span>
              <span className="font-semibold">
                {streak} / {safeFinalValue} ({progressPercent.toFixed(0)}%)
              </span>
            </div>
            <div className="h-3 w-full bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all duration-700", {
                  "bg-gradient-to-r from-green-500 to-emerald-500": progressPercent >= 100,
                  "bg-gradient-to-r from-blue-500 to-cyan-500": progressPercent >= 50 && progressPercent < 100,
                  "bg-gradient-to-r from-amber-500 to-yellow-500": progressPercent > 0 && progressPercent < 50,
                  "bg-gray-400": progressPercent === 0,
                })}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            {isGoalReached && (
              <div className="text-sm font-medium text-green-700 dark:text-green-300 mt-2 flex items-center gap-2">
                <span className="text-lg">🎉</span>
                Цель достигнута! Вы можете получить награду.
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 shrink-0">
          <Button
            variant={canMark ? "default" : "outline"}
            size="lg"
            onClick={handleMark}
            disabled={isUpdating || isResetting}
            className={cn("min-w-32", !canMark && "bg-gray-300 text-gray-600")}
          >
            {canMark ? "✅ Отметиться сегодня" : "⏳ Уже отмечено"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateResetStreackHabit({ idHabit: id, idUser: userId })}
            disabled={isResetting}
          >
            🔄 Сбросить серию
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