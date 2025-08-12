import { useQueryClient } from "@tanstack/solid-query";
import { createClient } from "graphql-sse";
import { onCleanup, onMount } from "solid-js";
import { clientEnv } from "~/env/client";

export function createNotificationService(props: {
  onNewNotification: (data: NewNotification) => void;
}) {
  const queryClient = useQueryClient();
  const vkquery =
    clientEnv.MODE === "development"
      ? clientEnv.VITE_DEBUG_VK_QUERY
      : localStorage.getItem("vk-query");
  // Создаем клиент
  const client = createClient({
    url: clientEnv.VITE_SERVER_GQL,
    headers: {
      "Vk-Query": vkquery!,
    },
  });

  // Функция для запуска подписки
  const subscribeToNotifications = async () => {
    const subscription = client.iterate({
      query: `
          subscription {
            notificationAdded {
              message
              title
              level
            }
          }
        `,
    });

    // Обработчик для новых уведомлений
    for await (const result of subscription) {
      if (result.data?.notificationAdded) {
        const newNotification = result.data
          .notificationAdded as NewNotification;
        props.onNewNotification(newNotification);
        queryClient.invalidateQueries({
          queryKey: ["notifications"],
        });
      }
    }
  };

  // Запускаем подписку
  onMount(() => {
    subscribeToNotifications().catch(console.error);
  });

  // Очистка при размонтировании компонента
  onCleanup(() => {
    client.dispose();
  });
}

// Типы для TypeScript
interface NewNotification {
  message: string;
  title: string;
  level?: NotificationLevel;
  actions: Action[];
}

interface Action {
  label: string;
  type: string;
  payload: unknown;
}
type NotificationLevel = "error" | "warning" | "info" | "success";
