"use client"

import { habits } from "@/entities/habit/types"

interface HabitStatsProps {
  habits: habits[]
}

export function HabitStats({ habits }: HabitStatsProps) {
  const totalHabits = habits.length
  const totalStreak = habits.reduce((sum, h) => sum + h.streak, 0)
  const completedGoals = habits.filter(h => h.finalValue && h.streak >= h.finalValue).length

  return (
    <div className="space-y-6 mb-8">
      <h2 className="text-2xl font-bold">Статистика по вашим привычкам</h2>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700 dark:text-blue-300">Всего привычек</p>
              <p className="text-3xl font-bold mt-2">{totalHabits}</p>
            </div>
            <div className="text-2xl">📊</div>
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
    </div>
  )
}