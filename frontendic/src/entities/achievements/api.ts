import { apiClient } from "@/shared/api/api-axios";
import { Achievements } from "./types";

export type PaginationAchievements = {
    page: number,
    pageSize: number,
    userId: string;
}

export type CreateAchievementsRequest = {
    name: string;
    description: string;
    finalValue: number;
}

export type UbdateProgressAchievements = {
    achievementsId: number;
    valueProgress: number;
    userId: string;
}

export type UbdateCompleteAchievements = {
    achievementsId: string;
    userId: string;
}


export type Envelope<T> = {
    result: T;
    errorList: boolean;
    timeGeneral: string;
}


export const achievementsApi = {
    getAchievements: async (request : PaginationAchievements): Promise<Envelope<Achievements>> => {
        const response = await apiClient.get<Envelope<Achievements>>("/Achievements", {
            params: {
                PageSize: request.pageSize,
                Page: request.page,
                UserId: request.userId,
            },
        });

        return response.data;
    },

    postAchievements: async (request : CreateAchievementsRequest): Promise<Envelope<string>> => {
        const response = await apiClient.post<Envelope<string>>("/Achievements", request);
        return response.data;
    },

    putUbdateProgressAchievements: async (request : UbdateProgressAchievements): Promise<Envelope<string>> => {
        const response = await apiClient.put<Envelope<string>>("/Achievements", request);
        return response.data;
    },
    putUbdateCompleteAchievements: async (request : UbdateCompleteAchievements): Promise<Envelope<string>> => {
        const response = await apiClient.put<Envelope<string>>("/Achievements", request);
        return response.data;
    }
}