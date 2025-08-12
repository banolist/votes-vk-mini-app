import { A } from "@solidjs/router";
import { useMutation, useQueryClient } from "@tanstack/solid-query";
import dayjs from "dayjs";
import { createMemo, Show, type Component } from "solid-js";
import ExpandText from "~/components/ui/ExpandText";
import { StatField } from "~/components/ui/StatFields";
import { graphql } from "~/graphql";
import { EventRequestStatus, EventType } from "~/graphql/graphql";
import execute from "~/utils/execute";
import AcceptRejectModal from "./AcceptRejectModal";

export interface EventData {
  id?: string;
  type: EventType;
  title?: string;
  createdAt: dayjs.Dayjs;
  status?: EventRequestStatus;
  startTime: dayjs.Dayjs;
  description?: string;
  promoWorld?: string | null;
  duration: number;
}
interface EventCardProps {
  data: EventData;
  link?: string;
}
const statusLocale: Record<EventRequestStatus, string> = {
  approved: "Активно",
  pending: "Ожидает модерации",
  rejected: "Отклонено",
  wait_pay: "Ожидает оплаты",
};
const deleteEventRequest = graphql(`
  mutation deleteEventRequest($id: ID!) {
    deleteEventRequest(requestID: $id)
  }
`);
const EventCard: Component<EventCardProps> = (props) => {
  const clientQuery = useQueryClient();
  const deleteMutation = useMutation(() => ({
    mutationKey: ["events"],
    mutationFn: async () => {
      if (!props.data.id) return;
      await execute(deleteEventRequest, { id: props.data.id });
    },
    onSuccess: () => {
      clientQuery.invalidateQueries({
        queryKey: ["myEventRequests"],
      });
    },
  }));
  const [startAt, createdAt] = [
    dayjs(props.data.startTime),
    dayjs(props.data.createdAt),
  ];
  return (
    <div class="flex flex-col p-3 w-full h-max bg-base-100 rounded-2xl shadow-xl border-1 border-base-300">
      <div class="flex items-center justify-between gap-1">
        <strong class="text-xl">{props.data.title}</strong>
        <span class="text-xs font-light text-nowrap flex flex-col">
          <span>Дата создания: </span>
          <span>{createdAt.format("LT l")}</span>
        </span>
        <Show
          when={
            props.data.id && props.data.status == EventRequestStatus.Pending
          }
        >
          <AcceptRejectModal
            onAccept={() => deleteMutation.mutate()}
            class="btn btn-error"
            triggerContent={"Удалить"}
            title="Удалить Мероприетие?"
          />
        </Show>
      </div>
      <Show when={props.data.status}>
        <StatField text="Статус">
          <div
            class="status"
            classList={{
              "status-success": props.data.status === "approved",
              "status-error": props.data.status === "rejected",
              "status-warning": props.data.status === "pending",
            }}
          />
          <div>{statusLocale[props.data.status!]}</div>
        </StatField>
      </Show>
      <Show when={props.data.promoWorld}>
        <StatField text="Слово для голосования">
          <span class="font-light">{props.data.promoWorld}</span>
        </StatField>
      </Show>
      <StatField text="Начало">
        <span class="font-light">{startAt.format("LT l")}</span>
      </StatField>
      <StatField text="Длительность">
        <span class="font-light">{props.data.duration} час.</span>
      </StatField>
      <Show when={props.link}>
        <A
          class="btn btn-outline w-full btn-primary mt-2"
          href={props.link || ""}
        >
          Подробнее
        </A>
      </Show>
    </div>
  );
};
export default EventCard;
