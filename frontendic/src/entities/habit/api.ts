import { apiClient } from "@/shared/api/api-axios";
import { HabitListPagination } from "./types";

export type Pagination = {
    page: number,
    pageSize: number,
}

export type CreateHabitRequest = {
    name: string;
    description: string;
    cost: number;
}

export type AddHabitPersonal = {
    idHabit: number;
    idUser: number;
}

export type UpdateHabitStreak = {
    idHabit: number;
    idUser: number;
    streak: number;
}

export type ResetStreackHabit = {
    idHabit: number;
    idUser: number;
}


export type Envelope<T> = {
    result: T;
    errorList: boolean;
    timeGeneral: string;
}


export const habitApi = {
    getHabits: async (request : Pagination): Promise<Envelope<HabitListPagination>> => {
        const response = await apiClient.get<Envelope<HabitListPagination>>("/habits", {
            params: {
                PageSize: request.pageSize,
                Page: request.page,
            },
        });

        return response.data;
    },

    postHabit: async (request : CreateHabitRequest): Promise<Envelope<number>> => {
        const response = await apiClient.post<Envelope<number>>("/habits", request);
        return response.data;
    },

    putAddHabitPersonal: async (request : AddHabitPersonal): Promise<Envelope<number>> => {
        const response = await apiClient.put<Envelope<number>>("/habits", request);
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