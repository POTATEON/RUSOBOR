import { useQuery } from "@tanstack/react-query"
import { Achievement } from "@/entities/achievements/types"

// Моковые данные ачивок для пользователя
const mockUserAchievements: Achievement[] = [
  {
    id: "1",
    name: "Первые шаги",
    description: "Создайте первую привычку",
    finalValue: 1,
    progress: 1,
    isCompleted: false,
  },
  {
    id: "2",
    name: "Стратег",
    description: "Добавьте 5 привычек в личный список",
    finalValue: 5,
    progress: 3,
    isCompleted: false,
  },
  {
    id: "3",
    name: "Мастер дисциплины",
    description: "Выполняйте привычки 30 дней подряд",
    finalValue: 30,
    progress: 15,
    isCompleted: false,
  },
  {
    id: "4",
    name: "Богатый опыт",
    description: "Накопите 1000 очков ценности",
    finalValue: 1000,
    progress: 650,
    isCompleted: false,
  },
  {
    id: "5",
    name: "Легенда",
    description: "Завершите все ачивки",
    finalValue: 10,
    progress: 4,
    isCompleted: false,
  },
]

async function fetchUserAchievements(userId: string): Promise<Achievement[]> {
  // Имитация задержки сети
  await new Promise((resolve) => setTimeout(resolve, 300))
  console.log(`Fetching achievements for user ${userId}`)
  return mockUserAchievements.map((ach) => ({
    ...ach,
    // Немного варьируем прогресс для демонстрации
    progress: ach.id === userId ? ach.finalValue : ach.progress, // для userId=1 завершённая ачивка
  }))
}

export function useGetUserAchievements(userId: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["userAchievements", userId],
    queryFn: () => fetchUserAchievements(userId),
  })

  return {
    achievements: data || [],
    isLoading,
    error,
  }
}