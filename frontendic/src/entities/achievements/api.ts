import { apiClient } from "@/shared/api/api-axios";
import { Achievement, PaginatedAchievements } from "./types";

export type PaginationAchievements = {
    page: number,
    pageSize: number,
    userId: string;
}

export type CreateAchievementsRequest = {
    name: string;
    description: string;
    finalValue: number;
    tagId: string;
    userId: string;
}

export type UbdateProgressAchievements = {
    idUser: string;
    idAchievement: string;
    progress: number;
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
    getAchievements: async (request : PaginationAchievements): Promise<Envelope<PaginatedAchievements>> => {
        const response = await apiClient.get<Envelope<PaginatedAchievements>>(`/achievements/${request.userId}`, {
            params: {
                page: request.page,
                sizePage: request.pageSize,
            },
        });

        return response.data;
    },

    postAchievements: async (request : CreateAchievementsRequest): Promise<Envelope<string>> => {
        const response = await apiClient.post<Envelope<string>>("/achievements", request);
        return response.data;
    },

    putUbdateProgressAchievements: async (request : UbdateProgressAchievements): Promise<Envelope<string>> => {
        const response = await apiClient.put<Envelope<string>>("/achievements/progress", request);
        return response.data;
    },
    putUbdateCompleteAchievements: async (request : UbdateCompleteAchievements): Promise<Envelope<string>> => {
        const response = await apiClient.put<Envelope<string>>(`/achievements/${request.userId}/${request.achievementsId}/complete`);
        return response.data;
    }
}