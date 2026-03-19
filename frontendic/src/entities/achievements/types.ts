export type Achievement = {
    id: string;
    name: string;
    description: string;
    finalValue: number;
    progress: number;
    isCompleted: boolean;
}

// Для обратной совместимости (можно удалить позже)
export type Achievements = Achievement;

export type PaginatedAchievements = {
    achievements: Achievement[];
    totalCount: number;
}