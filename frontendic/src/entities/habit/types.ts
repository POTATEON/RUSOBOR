export type habits = {
    id: string;
    name: string;
    description: string;
    cost: number;
    tagId: string;
    streak: number;
    finalValue?: number;
    goal_days: number;
    tagName?: string[];
}

export type HabitListPagination = {
    habits: habits[];
    totalCount: number;
}

export type MyHabitListPagination = {
    habits: habits[];
    totalCount: number;
}