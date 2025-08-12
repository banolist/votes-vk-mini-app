import { A, useNavigate, useParams } from "@solidjs/router";
import { createMemo, Match, Show, Switch, type Component } from "solid-js";
import { StatField } from "~/components/ui/StatFields";
import { graphql } from "~/graphql";
import execute from "~/utils/execute";
import ExpandText from "~/components/ui/ExpandText";
import dayjs from "dayjs";
import ExpertCard from "~/components/ui/ExpertCard";
import { Button } from "@kobalte/core/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/solid-query";
import AcceptRejectButtons from "~/components/ui/AcceptRejectButtons";
import { RejectForm } from "~/components/ui/RejectDialog";
import { EventRequest, EventType } from "~/graphql/graphql";
import useMe from "~/hooks/useMe";

const expertProfileRequestQuery = graphql(`
  query moderationCardEventRequest($id: ID!) {
    eventRequest(id: $id) {
      updatedAt
      createdAt
      verifiedAt
      status
      event {
        startTime
        duration
        description
        title
        type
        expertEvent {
          commentToListener
        }
      }
      creator {
        id
        firstName
        lastName
        nickname
        avatar
        expertProfile {
          id
          about
          region {
            regionName
          }
        }
      }
    }
  }
`);

const expertProfileRequestAccept = graphql(`
  mutation AcceptEventRequest($id: ID!, $withPayment: Boolean = false) {
    acceptEvent(eventId: $id, withPayment: $withPayment)
  }
`);

const rejectEventMutation = graphql(`
  mutation rejectEventRequest($id: ID!, $reason: String!) {
    rejectEvent(eventId: $id, reason: $reason)
  }
`);

const ModerationEventCard: Component = () => {
  const { id } = useParams();
  const query = useQuery(() => ({
    queryKey: ["eventModeration", id],
    queryFn: async () =>
      (await execute(expertProfileRequestQuery, { id })).eventRequest,
  }));

  return (
    <>
      <Switch>
        <Match when={query.isLoading}>Загрузка...</Match>
        <Match when={query.isError}>{query.error?.message}</Match>
        <Match when={query.isFetched && query.data}>
          {(data) => (
            <>
              <EventCard
                {...data()}
                {...data().event}
                creatorID={data().creator.id}
              />
              <Show when={data().creator}>
                {(creator) => (
                  <ExpertCard
                    {...creator()}
                    about={creator().expertProfile?.about || ""}
                    region={creator().expertProfile?.region?.regionName || ""}
                    href={`/experts/${creator().expertProfile?.id}`}
                  />
                )}
              </Show>

              <Show when={data()?.status === "pending"}>
                <Buttons data={data().event!} />
              </Show>
            </>
          )}
        </Match>
      </Switch>
    </>
  );
};
export default ModerationEventCard;

interface EventCardProps {
  title: string;
  createdAt: dayjs.Dayjs;
  status: string;
  startTime: dayjs.Dayjs;
  description: string;
  duration: number;
  link?: string;
  creatorID: string;
  commentToListener?: string;
}

const EventCard: Component<EventCardProps> = (props) => {
  const times = createMemo(() => ({
    startTime: dayjs(props.startTime),
    createdAt: dayjs(props.createdAt),
  }));
  const me = useMe();
  return (
    <div class="flex flex-col p-3 w-full h-max bg-base-100 rounded-2xl shadow-xl border-1 border-base-300">
      <div class="flex items-center justify-between gap-1">
        <strong>{props.title}</strong>
        <span class="text-xs font-light">
          <span>Дата создания: </span>
          <span>{times().createdAt.format("LT l")}</span>
        </span>
      </div>
      <StatField text="Статус">
        <div class="status status-success" />
        <div>{props.status}</div>
      </StatField>
      <StatField text="Начало">
        <span class="font-light">{times().startTime.format("LT l")}</span>
      </StatField>
      <StatField text="Длительность">
        <span class="font-light">{} час.</span>
      </StatField>
      <Show when={props.creatorID == me.data?.id}>
        <StatField text="Комментарий для слушателя">
          {props.commentToListener}
        </StatField>
      </Show>
      <ExpandText text="Описание" value={props.description} />
      <Show when={props.link}>
        <A class="btn btn-outline w-full btn-primary" href={props.link || ""}>
          Подробнее
        </A>
      </Show>
    </div>
  );
};

const Buttons: Component<{ data: { type: EventType } }> = (props) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const queryKey = () => ["eventModeration", id];
  const onSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: queryKey(),
    });
    navigate("../");
  };

  const mutationReject = useMutation(() => ({
    mutationKey: queryKey(),
    mutationFn: async (data: RejectForm) => {
      await execute(rejectEventMutation, { id, reason: data.reason });
    },
    onSuccess,
  }));
  const mutationAccept = useMutation(() => ({
    mutationKey: queryKey(),
    mutationFn: async () => {
      await execute(expertProfileRequestAccept, { id });
    },
    onSuccess,
  }));

  const mutationAcceptAsPayment = useMutation(() => ({
    mutationKey: queryKey(),
    mutationFn: async () => {
      await execute(expertProfileRequestAccept, { id, withPayment: true });
    },
    onSuccess,
  }));

  return (
    <>
      <Show when={props.data.type == EventType.Organizer}>
        <Button
          onClick={() => mutationAcceptAsPayment.mutate()}
          class="btn btn-primary"
        >
          Принять как платное
        </Button>
      </Show>
      <AcceptRejectButtons
        onAccept={() => mutationAccept.mutate()}
        onReject={(form) => mutationReject.mutate(form)}
      />
    </>
  );
};
