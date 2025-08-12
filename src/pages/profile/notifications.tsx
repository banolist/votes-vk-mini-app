/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/solid-query";
import dayjs from "dayjs";
import {
  createSignal,
  For,
  Match,
  onCleanup,
  onMount,
  Switch,
  type Component,
  createMemo,
} from "solid-js";
import Page from "~/components/ui/Page";
import HeroiconsInformationCircle from "~icons/heroicons/information-circle";
import HeroiconsExclamationCircle16Solid from "~icons/heroicons/exclamation-circle-16-solid";
import HeroiconsXCircle20Solid from "~icons/heroicons/x-circle-20-solid";
import HeroiconsCheckCircle20Solid from "~icons/heroicons/check-circle-20-solid";
import DOMPurify from "dompurify";
import execute from "~/utils/execute";
import { graphql } from "~/graphql";
import { Button } from "@kobalte/core/button";
import {
  NotificationAction,
  NotificationActionType,
  NotificationActionVariant,
} from "~/graphql/graphql";
import { useNavigate } from "@solidjs/router";
type NotificationLevel = "error" | "warning" | "info" | "success";
interface Notification {
  id: number;
  message: string;
  level: NotificationLevel;
  createdAt: string;
  title: string;
  readed?: boolean;
}

const notificationsQuery = graphql(`
  query myNotifications {
    myNotifications(first: 150) {
      edges {
        node {
          id
          readAt
          notification {
            title
            message
            createdAt
            level
            expiresAt
            actions {
              label
              type
              payload
              variant
            }
          }
        }
      }
      totalCount
    }
  }
`);

const acceptEventInviteOrganizatorMutaion = graphql(`
  mutation acceptInviteOrganizatorEvent($requestID: ID!) {
    acceptInviteOrganizatorEvent(requestID: $requestID)
  }
`);
const rejectEventInviteOrganizatorMutaion = graphql(`
  mutation rejectInviteOrganizatorEvent($requestID: ID!) {
    rejectInviteOrganizatorEvent(requestID: $requestID)
  }
`);

export const notificationsUnreadedQuery = graphql(`
  mutation readNotifications($id: [ID!]) {
    readNotification(id: $id)
  }
`);

const readAllNotifications = graphql(`
  mutation readAllNotifications {
    readAllNotifications
  }
`);

const getNotificationIcon = (level: NotificationLevel) => {
  switch (level) {
    case "error":
      return HeroiconsXCircle20Solid;
    case "warning":
      return HeroiconsExclamationCircle16Solid;
    case "info":
      return HeroiconsInformationCircle;
    case "success":
      return HeroiconsCheckCircle20Solid;
  }
};

const NotificationsPage: Component = () => {
  const queryClient = useQueryClient();
  const query = useQuery(() => ({
    queryKey: ["notifications"],
    queryFn: async () => await execute(notificationsQuery),
  }));

  // Добавляем мутацию для отметки уведомлений как прочитанных
  const readMutation = useMutation(() => ({
    mutationFn: async (ids: string[]) => {
      if (ids.length !== 0) {
        await execute(notificationsUnreadedQuery, { id: ids });
      } else {
        await execute(readAllNotifications);
      }
    },
    onSuccess: () => {
      // Инвалидируем запрос уведомлений после успешной мутации
      query.refetch();
      queryClient.invalidateQueries({
        queryKey: ["me"],
      });
    },
  }));

  // Храним элементы уведомлений и их состояние
  const [notificationElements, setNotificationElements] = createSignal<
    Map<string, HTMLDivElement>
  >(new Map());
  const readIds = new Set<string>();

  // Инициализация IntersectionObserver
  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const toMarkAsRead: string[] = [];

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = (entry.target as HTMLElement).dataset.notificationId;
            if (id && !readIds.has(id)) {
              toMarkAsRead.push(id);
              readIds.add(id);
            }
          }
        });

        if (toMarkAsRead.length > 0) {
          readMutation.mutate(toMarkAsRead);
        }
      },
      {
        threshold: 0.5,
        rootMargin: "0px 0px -100px 0px",
      },
    );

    // Наблюдаем за всеми уже зарегистрированными элементами
    notificationElements().forEach((el) => observer.observe(el));

    // Очистка при размонтировании
    onCleanup(() => {
      observer.disconnect();
    });

    // Возвращаем observer, чтобы использовать его в registerNotificationElement
    return observer;
  });

  // Функция для регистрации элемента уведомления
  const registerNotificationElement = (id: string, el: HTMLDivElement) => {
    if (!el) return;

    setNotificationElements((prev) => {
      const newMap = new Map(prev);
      newMap.set(id, el);
      return newMap;
    });
  };

  const handleReadAllNotifications = async () => {
    readMutation.mutate([]);
  };

  return (
    <Page
      title="Мои уведомления"
      titleElements={
        <Button class="btn btn-accent" onClick={handleReadAllNotifications}>
          Прочесть все
        </Button>
      }
    >
      <div class="flex flex-col gap-3">
        <Switch>
          <Match when={query.isLoading}>Загрузка...</Match>
          <Match when={query.isError}>{query.error?.message}</Match>
          <Match when={query.isFetched && query.data}>
            {(data) => (
              <For
                each={data()
                  // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
                  .myNotifications.edges?.map((data) => data?.node!)
                  .map((v) => ({
                    ...v.notification,
                    readAt: v.readAt,
                    id: v.id,
                  }))}
              >
                {(notification) => {
                  const Icon = getNotificationIcon(notification.level);
                  const formattedTime = dayjs(notification.createdAt).format(
                    "HH:mm DD.MM.YYYY",
                  );
                  const isExpress = dayjs().isAfter(notification.expiresAt);

                  return (
                    <div
                      ref={(el) => {
                        if (!notification.readAt) {
                          registerNotificationElement(notification.id, el);
                        }
                      }}
                      data-notification-id={notification.id}
                      classList={{
                        "border-2 border-primary": !notification.readAt,
                      }}
                      class={`alert bg-base-100 shadow-lg transition-all hover:shadow-md`}
                    >
                      <Icon
                        class={`flex-shrink-0 size-7 text-${notification.level}`}
                      />
                      <div class="w-full flex flex-col">
                        <div class="flex justify-between items-center text-pretty">
                          <h3 class={`font-bold`}>{notification.title}</h3>
                          <span class="text-sm opacity-70 text-nowrap">
                            {formattedTime}
                          </span>
                        </div>
                        <div
                          class="text-sm mt-1 prose"
                          // eslint-disable-next-line solid/no-innerhtml
                          innerHTML={DOMPurify.sanitize(
                            notification.message,
                            sanitizeConfig,
                          )}
                        />
                        <div class="flex flex-col gap-1 mt-2">
                          <For each={notification.actions}>
                            {(action) => (
                              <NotificationActionBtn
                                notification={notification}
                                action={action}
                              />
                            )}
                          </For>
                        </div>
                      </div>
                    </div>
                  );
                }}
              </For>
            )}
          </Match>
        </Switch>
      </div>
    </Page>
  );
};
const NotificationActionBtn = (props: { notification: any; action: any }) => {
  const navigate = useNavigate();

  // Mutation for accepting/rejecting invites
  const mutAcceptReject = useMutation(() => ({
    mutationKey: ["acceptRejectInvite"],
    mutationFn: async (p: { isAccept: boolean; requestID: string }) => {
      if (p.isAccept) {
        execute(acceptEventInviteOrganizatorMutaion, {
          requestID: p.requestID,
        });
      } else {
        execute(rejectEventInviteOrganizatorMutaion, {
          requestID: p.requestID,
        });
      }
    },
  }));

  // Extract endpoint and data from action payload
  const payload = createMemo(() => props.action.payload || {});
  const endpoint = createMemo(() => (payload().endpoint as string) || "");
  const data = createMemo(() => (payload().data as string) || "");

  // Map endpoints to handlers
  const handlers = createMemo(() => [
    {
      test: (ep: string) => ep.startsWith("voteVerification"),
      handle: () => navigate(`menu/verification/expert/${data()}`),
    },
    {
      test: (ep: string) => ep === "event",
      handle: () => navigate(`/events/${data()}`),
    },
    {
      test: (ep: string) => ep.endsWith("createPaymentLinkEventRequest"),
      handle: () => navigate(`/menu/events/${data()}/payment`),
    },
    {
      test: (ep: string) => ep.includes("event/organizator/accept"),
      handle: () =>
        mutAcceptReject.mutate({ isAccept: true, requestID: data() }),
    },
    {
      test: (ep: string) => ep.includes("event/organizator/reject"),
      handle: () =>
        mutAcceptReject.mutate({ isAccept: false, requestID: data() }),
    },
  ]);
  // Main action handler
  const handleNotificationAction = () => {
    const ep = endpoint();
    handlers().some(({ test, handle }) => {
      if (test(ep)) {
        handle();
        return true; // stop after first match
      }
      return false;
    });
  };

  // Determine if the button should be disabled
  const isExpired = dayjs().isAfter(props.notification.expiresAt);
  const disabled = createMemo(() => {
    // Always allow event endpoints
    if (endpoint() === "event") return false;
    return isExpired || mutAcceptReject.isPending;
  });

  // const handleNotificationAction = (action: {
  //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   payload?: any | null;
  //   type: NotificationActionType;
  // }) => {
  //   switch (action.type) {
  //     case NotificationActionType.Dismiss:
  //       break;
  //     case NotificationActionType.Navigate:
  //       break;
  //     case NotificationActionType.ApiCall: {
  //       if (!action.payload) return;
  //       const payload = action.payload as Record<string, unknown>;
  //       if ("endpoint" in payload && payload.endpoint) {
  //         const endpoint = payload.endpoint as string;
  //         if (endpoint.startsWith("voteVerification")) {
  //           const data = payload.data;
  //
  //           navigate("menu/verification/expert/" + data);
  //         }
  //         if (endpoint.startsWith("event") && "data" in payload) {
  //           const data = payload.data;
  //
  //           if (endpoint.endsWith("createPaymentLinkEventRequest")) {
  //             navigate(`/menu/events/${data}/payment`);
  //           }
  //           if (endpoint == "event") {
  //             navigate(`/events/${data}`);
  //           }
  //           if (endpoint.includes("event/organizator/accept")) {
  //             return mutAcceptReject.mutate({
  //               isAccept: true,
  //               requestID: `${data}`,
  //             });
  //           }
  //           if (endpoint.includes("event/organizator/reject")) {
  //             return mutAcceptReject.mutate({
  //               isAccept: false,
  //               requestID: `${data}`,
  //             });
  //           }
  //         }
  //       }
  //       break;
  //     }
  //     default:
  //       break;
  //   }
  // };

  // const isExpress = dayjs().isAfter(props.notification.expiresAt);

  return (
    <Button
      class="btn w-full"
      classList={{
        "btn-secondary":
          props.action.variant == NotificationActionVariant.Secondary,
        "btn-primary":
          props.action.variant == NotificationActionVariant.Primary,
        "btn-ghost": props.action.variant == NotificationActionVariant.Ghost,
        "btn-accent": props.action.variant == NotificationActionVariant.Accent,
      }}
      onClick={handleNotificationAction}
      disabled={disabled()}
    >
      {props.action.label}
    </Button>
  );
};

export default NotificationsPage;

const sanitizeConfig = {
  ALLOWED_TAGS: ["a", "strong", "em", "code", "br", "img"],
  ALLOWED_ATTR: ["href", "class", "target", "src", "alt", "width", "height"],
  FORBID_CONTENTS: ["script", "iframe", "style"],
  ALLOWED_URI_REGEXP: /^(?:(?:https?|ftp|mailto|data):|[/#])/i,
};
