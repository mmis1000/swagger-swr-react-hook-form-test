import { notification } from "antd";
import { NotificationPlacement } from "antd/es/notification/interface";
import { useCallback } from "react";

export const useOpenNotification = () => {
  const [api, contextHolder] = notification.useNotification();

  const openNotification = useCallback((placement: NotificationPlacement, message: string) => {
    api.info({
      message: `Notification ${placement}`,
      description: `${message}!`,
      placement,
    });
  }, [api]);

  return { openNotification, contextHolder }
}