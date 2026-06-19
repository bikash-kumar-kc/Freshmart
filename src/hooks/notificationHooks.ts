import { useMutation, useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../app/constants/queryKeys";
import {
  deleteNotifications,
  getAllNotifications,
  markedNotifications,
} from "../app/api/server action/notifications.server";

export const useGetAllNotifications = (id: string | undefined) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_ALL_NOTIFICATIONS, id],
    queryFn: () => getAllNotifications(id as string),
    enabled: !!id,
  });
};

export const useMarkedNotification = () => {
  return useMutation({
    mutationKey: [QUERY_KEYS.MARKED_NOTIFICATIONS],
    mutationFn: (id: string) => markedNotifications(id),
  });
};

export const useDeleteNotification = () => {
  return useMutation({
    mutationKey: [QUERY_KEYS.DELETED_NOTIFICATIONS],
    mutationFn: (id: string) => deleteNotifications(id),
  });
};
