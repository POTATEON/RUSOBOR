export type Habit = {
    id: string;
    name: string;
    description: string;
    cost: number;
    tagId: string;
    streak: number;
    finalValue?: number;
    tagName?: string[];
}

export type HabitListPagination = {
    habits: Habit[];
    totalCount: number;
}