export type habits = {
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
    habits: habits[];
    totalCount: number;
}

export type MyHabitListPagination = {
    habits: habits[];
    totalCount: number;
}