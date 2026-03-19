"use client"

import { habits } from "@/entities/habit/types"
import { Button } from "@/shared/components/ui/button"
import { cn } from "@/lib/utils"

interface HabitCardProps {
  habit: habits
  onAddToPersonal?: (habitId: string) => void
  userId?: string
}

export function HabitCard({ habit, onAddToPersonal, userId = "string" }: HabitCardProps) {
  const { id, name, description, cost, tagName, streak, finalValue, goal_days } = habit

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

  const goalValue = goal_days > 0 ? goal_days : (finalValue ?? 0)
  const progressPercent = goalValue > 0 ? Math.min(100, (streak / goalValue) * 100) : 0
  const isGoalReached = streak >= goalValue

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
          <h3 className="font-bold text-2xl text-center mb-2">{name}</h3>
          <p className="text-base text-center opacity-90 mb-4">{description}</p>
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
                Серия: {streak} 
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
                  Цель достигнута! Вы можете получить награду.
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
        </div>
      </div>
    </div>
  )
}