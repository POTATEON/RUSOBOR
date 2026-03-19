export type Achievements = {
    id: number;
    name: string;
    description: string;
    finalValue: number;
    progress: number;
    isComplete: boolean;
}

export type AchievementsPagination = {
    habits: Achievements[];
    totalCount: number;
}