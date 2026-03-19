"use client"

import { habits } from "@/entities/habit/types"

interface HabitStatsProps {
  habits: habits[]
}

export function HabitStats({ habits }: HabitStatsProps) {
  const totalHabits = habits.length
  const totalCost = habits.reduce((sum, h) => sum + h.cost, 0)
  const totalStreak = habits.reduce((sum, h) => sum + h.streak, 0)
  const completedGoals = habits.filter(h => h.finalValue && h.streak >= h.finalValue).length
  const averageProgress = habits.length > 0
    ? habits.reduce((sum, h) => {
        const final = h.finalValue ?? 0
        const progress = final > 0 ? Math.min(100, (h.streak / final) * 100) : 0
        return sum + progress
      }, 0) / habits.length
    : 0

  return (
    <div className="space-y-6 mb-8">
      <h2 className="text-2xl font-bold">Статистика по вашим привычкам</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700 dark:text-blue-300">Всего привычек</p>
              <p className="text-3xl font-bold mt-2">{totalHabits}</p>
            </div>
            <div className="text-2xl">📊</div>
          </div>
        </div>
        <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-xl border border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 dark:text-green-300">Суммарная ценность</p>
              <p className="text-3xl font-bold mt-2">{totalCost}</p>
            </div>
            <div className="text-2xl">📈</div>
          </div>
        </div>
        <div className="bg-orange-50 dark:bg-orange-950/30 p-4 rounded-xl border border-orange-200 dark:border-orange-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-700 dark:text-orange-300">Общая серия</p>
              <p className="text-3xl font-bold mt-2">{totalStreak}</p>
            </div>
            <div className="text-2xl">🔥</div>
          </div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-950/30 p-4 rounded-xl border border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-700 dark:text-purple-300">Достигнуто целей</p>
              <p className="text-3xl font-bold mt-2">{completedGoals}</p>
            </div>
            <div className="text-2xl">🎯</div>
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/20 dark:to-blue-950/20 p-6 rounded-xl border border-cyan-200 dark:border-cyan-800">
        <h3 className="text-lg font-semibold mb-4">Средний прогресс по всем привычкам</h3>
        <div className="flex items-center gap-6">
          <div className="flex-1">
            <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-700"
                style={{ width: `${averageProgress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Прогресс рассчитывается как отношение текущей серии к цели.
            </p>
          </div>
          <div className="text-3xl font-bold">{averageProgress.toFixed(1)}%</div>
        </div>
      </div>
    </div>
  )
}