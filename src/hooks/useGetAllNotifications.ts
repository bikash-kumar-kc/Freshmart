import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../app/constants/queryKeys";
import { getAllNotifications } from "../app/api/server action/notifications.server";

export const useGetAllNotifications = (id: string | undefined) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_ALL_NOTIFICATIONS, id],
    queryFn: () => getAllNotifications(id as string),
    enabled: !!id,
  });
};
