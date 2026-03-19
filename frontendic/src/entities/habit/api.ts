import { apiClient } from "@/shared/api/api-axios";
import { HabitListPagination, MyHabitListPagination } from "./types";

export type Pagination = {
    page: number,
    pageSize: number,
}

export type MyPagimationPagination = {
    page: number,
    pageSize: number,
    userId: string;
}

export type CreateHabitRequest = {
    name: string;
    description: string;
    tagId: string;
    cost: number;
    userId: string;
}

export type AddHabitPersonal = {
    idHabit: string;
    idUser: string;
}

export type UpdateHabitStreak = {
    idHabit: string;
    idUser: string;
    streak: number;
}

export type ResetStreackHabit = {
    idHabit: string;
    idUser: string;
}


export type Envelope<T> = {
    result: T;
    errorList: string[] | null;
    timeGeneral: string;
}


export const habitApi = {
    getHabits: async (request : Pagination): Promise<Envelope<HabitListPagination>> => {
        const response = await apiClient.get<Envelope<HabitListPagination>>("/habits", {
            params: {
                sizePage: request.pageSize,
                page: request.page,
            },
        });

        return response.data;
    },
    getMyHabits: async (request : MyPagimationPagination): Promise<Envelope<MyHabitListPagination>> => {
        const response = await apiClient.get<Envelope<MyHabitListPagination>>(`/habits/${request.userId}`, {
            params: {
                sizePage: request.pageSize,
                page: request.page,
            },
        });

        return response.data;
    },

    postHabit: async (request : CreateHabitRequest): Promise<Envelope<number>> => {
        const response = await apiClient.post<Envelope<number>>(`/habits/${request.userId}`, request);
        return response.data;
    },

    putAddHabitPersonal: async (request : AddHabitPersonal): Promise<Envelope<number>> => {
        const response = await apiClient.put<Envelope<number>>(`/habits/${request.idUser}`, request);
        return response.data;
    },

    putUpdateStreackHabit: async (request : UpdateHabitStreak): Promise<Envelope<number>> => {
        const response = await apiClient.put<Envelope<number>>("/habits/streack", request);
        return response.data;
    },

    putResetStreackHabit: async (request : ResetStreackHabit): Promise<Envelope<number>> => {
        const response = await apiClient.put<Envelope<number>>("/habits/streack", request);
        return response.data;
    }
}