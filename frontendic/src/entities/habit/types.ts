export type Habit = {
    id: number;
    name: string;
    description: string;
    cost: number;
    tagName: string[];
    streak: number;
    finalValue: number;
}

export type HabitListPagination = {
    habits: Habit[];
    totalCount: number;
}