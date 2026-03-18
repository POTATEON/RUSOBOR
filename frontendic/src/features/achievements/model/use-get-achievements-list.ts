import { achievementsApi } from "@/entities/achievements/api";
import { useQuery } from "@tanstack/react-query";

export function useGetAchievementsList({page, pageSize, userId} : {page: number, pageSize: number, userId: string}){
    const {data, isLoading, error } = useQuery({
    queryKey: ["achievements", page],
    queryFn: () => achievementsApi.getAchievements({page, pageSize, userId})
})
    return {
        data,
        isLoading,
        error
    };
}
