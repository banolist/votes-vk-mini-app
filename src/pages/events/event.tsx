/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import XLSX, { utils, write } from "xlsx";
import { Button } from "@kobalte/core/button";
import { A, useParams } from "@solidjs/router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/solid-query";
import dayjs from "dayjs";
// import { use } from "marked";
import {
  createMemo,
  For,
  JSXElement,
  Match,
  Show,
  Switch,
  type Component,
} from "solid-js";
import { eventCardPageQuery, expertResponseToEventQuery } from "~/api/events";
import Avatar from "~/components/ui/Avatar";
import ExpandText from "~/components/ui/ExpandText";
import ExpertCard from "~/components/ui/ExpertCard";
import NameComponent from "~/components/ui/Name";
import { StatField } from "~/components/ui/StatFields";
import VoteDialog, { VoteForm } from "~/components/ui/VoteDialog";

import { graphql } from "~/graphql";
import {
  EventType,
  ExpertResponseToEventStatus,
  VoteTypeRating,
} from "~/graphql/graphql";
import useMe from "~/hooks/useMe";
import execute from "~/utils/execute";
import { hasRights, UserRights } from "~/utils/rights";

const eventVoteMutation = graphql(`
  mutation voteInEvent($data: CreateVoteInput!) {
    createVote(data: $data) {
      id
    }
  }
`);

const eventVoteDeleteMutation = graphql(`
  mutation deleteVoteInEvent($data: DeleteVoteInput!) {
    deleteVote(id: $data)
  }
`);

const EventPage: Component = () => {
  const { id } = useParams();
  const me = useMe();

  const queryClient = useQueryClient();
  // fetch page data
  const query = useQuery(() => ({
    queryKey: ["event", id],
    queryFn: async () => {
      const resp = await execute(eventCardPageQuery, { id });
      return resp;
    },
  }));
  const responcesToEvent = useQuery(() => ({
    queryKey: ["eventResponcesMainPage", id],
    enabled: query.isFetched && query.data?.event.type == EventType.Organizer,
    queryFn: async () => {
      return (
        await execute(expertResponseToEventQuery, {
          first: 5,
          where: {
            hasEventWith: [
              {
                id,
              },
            ],
            status: ExpertResponseToEventStatus.Accepted,
          },
        })
      ).expertResponseToEvents.edges
        ?.map((v) => v?.node!)
        .map((v) => v.user);
    },
  }));
  // vote action
  const voteMutation = useMutation(() => ({
    mutationKey: ["voteEvent"],
    mutationFn: async (data: VoteForm) => {
      if (data.voteType == "delete") {
        await execute(eventVoteDeleteMutation, {
          data: {
            typeRating: VoteTypeRating.Expert,
            targetExpertID: query.data?.event.creator.id,
            eventID: id,
            feedback: data.feedback,
          },
        });
      } else {
        await execute(eventVoteMutation, {
          data: {
            eventID: id,
            feedback: data.feedback,
            typeRating: VoteTypeRating.Expert,
            targetExpertID: query.data?.event.creator.id,
            isLike: data.voteType == "positive",
          },
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event", id] });
    },
  }));

  const isCreator = createMemo(
    () => me.data?.id == query.data?.event.creator.id,
  );

  return (
    <Switch>
      <Match when={query.isLoading}>Загрузка...</Match>
      <Match when={query.isError}>{query.error?.message}</Match>
      <Match when={query.isFetched && query.data}>
        {(data) => (
          <Show when={data().event}>
            {(event) => (
              <>
                <EventCard
                  {...event()}
                  buttomContent={
                    <Show
                      when={
                        responcesToEvent.isFetched &&
                        responcesToEvent.data &&
                        responcesToEvent.data.length
                      }
                    >
                      <div class="divider" />
                      <div class="mb-2 text-md">Назначенные эксперты:</div>
                      <For each={responcesToEvent.data}>
                        {(props) => (
                          <A href={`/experts/${props.id}`} class="flex gap-2">
                            <Avatar class="size-10 rounded-box" {...props} />
                            <div class="text text-center">
                              <NameComponent {...props} />
                            </div>
                          </A>
                        )}
                      </For>
                    </Show>
                  }
                />

                <Show
                  when={
                    event().type != EventType.Organizer &&
                    event().creator.expertProfile &&
                    event().creator
                  }
                >
                  {(creator) => (
                    <ExpertCard
                      {...creator()}
                      {...creator().expertProfile}
                      href={`/experts/${creator().id}`}
                    />
                  )}
                </Show>
                <Show
                  when={dayjs(event().endTime).isAfter(dayjs()) && isCreator()}
                >
                  <CreateAnalisticEventBtn event={event()} />
                </Show>
                <Show
                  when={!isCreator() && event().type != EventType.Organizer}
                >
                  <VoteDialog
                    class="btn btn-accent"
                    myVote={data().event.myExpertVote}
                    onNewEvent={(v) => voteMutation.mutate(v)}
                    error={voteMutation.error?.message}
                  />
                </Show>
                <Show
                  when={
                    data().event.type == EventType.Organizer &&
                    hasRights(me.data?.rights || 0, UserRights.Verified)
                  }
                >
                  <RespondToEventBtn eventID={id} />
                </Show>
                <Show when={isCreator() && me.data?.agreesTermsAt}>
                  <div class="w-full flex flex-col gap-1 *:btn *:w-full *:btn-accent">
                    <Switch>
                      <Match when={data().event.type == EventType.Organizer}>
                        <A href={`/events/${id}/assignedExperts`}>
                          Управление экпертами
                        </A>
                      </Match>
                    </Switch>
                  </div>
                  <Button />
                </Show>
              </>
            )}
          </Show>
        )}
      </Match>
    </Switch>
  );
};
export default EventPage;

const crereateResponceQuery = graphql(`
  query votesResponce($eventID: ID!) {
    analisticVotes(eventID: $eventID) {
      deletedAt
      event {
        promoWorld
        startTime
        endTime
        title
      }
      targetExpert {
        user {
          id
          firstName
          lastName
          nickname
        }
      }
      user {
        firstName
        lastName
        nickname
        id
      }
      isLike
    }
  }
`);
const createVotesHistory = graphql(`
  query votesHistory($eventID: ID!) {
    analisticVotesHistory(eventID: $eventID) {
      action
      newIsLike
      oldIsLike
      reason
      createdAt
    }
  }
`);
const respondToEventMutation = graphql(`
  mutation responceToOrganizatorEvent($id: ID!) {
    respondToOrganizatorEvent(eventID: $id) {
      id
      status
      type
    }
  }
`);

interface Event {
  id: string;
  type: EventType;
}

const CreateAnalisticEventBtn: Component<{ event: Event }> = (props) => {
  const mutation = useMutation(() => ({
    mutationKey: ["CreateAnalisticEvent"],
    mutationFn: async () => {
      const votes = (
        await execute(crereateResponceQuery, {
          eventID: props.event.id,
        })
      ).analisticVotes;
      const votesHistoryData = (
        await execute(createVotesHistory, {
          eventID: props.event.id,
        })
      ).analisticVotesHistory;
      // Трансформируем данные
      // Подготовка данных
      const votesA = votes!.map((v) => ({
        Удален: v.deletedAt || "-",
        "Промо cлово": v.event?.promoWorld,
        Начало: v.event?.startTime,
        Конец: v.event?.endTime,
        Событие: v.event?.title,
        "ID эксперта": v.targetExpert?.user.id || "-",
        Эксперт:
          `${v.targetExpert?.user.firstName || ""} ${v.targetExpert?.user.lastName || ""}`.trim() ||
          v.targetExpert?.user.nickname ||
          "-",
        "ID пользователя": v.user?.id,
        Пользователь:
          `${v.user?.firstName} ${v.user?.lastName}`.trim() || v.user?.nickname,
        Оценка: v.isLike ? "👍 Лайк" : "👎 Дизлайк",
      }));

      const history = votesHistoryData!.map((h) => ({
        Действие: h.action,
        "Новая оценка": h.newIsLike ? "👍 Лайк" : "👎 Дизлайк",
        "Старая оценка": h.oldIsLike ? "👍 Лайк" : "👎 Дизлайк",
        Причина: h.reason || "-",
        Дата: new Date(h.createdAt).toLocaleString(),
      })); // Создаем книгу
      // Создание книги Excel
      const workbook = utils.book_new();

      // Добавление листа с голосами
      const votesSheet = utils.json_to_sheet(votesA);
      utils.book_append_sheet(workbook, votesSheet, "Голоса");

      // Добавление листа с историей
      const historySheet = utils.json_to_sheet(history);
      utils.book_append_sheet(workbook, historySheet, "История изменений");

      // Генерация файла и скачивание
      const excelBuffer = write(workbook, { bookType: "xlsx", type: "array" });
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `votes_report_${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(a);
      a.click();

      // Очистка
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
    },
  }));
  return (
    <Show when={props.event.type == EventType.Organizer}>
      <Button
        class="btn"
        onClick={() => mutation.mutate()}
        disabled={mutation.isPending}
      >
        Выгрузить голоса
      </Button>
    </Show>
  );
};

const RespondToEventBtn: Component<{ eventID: string }> = (props) => {
  const mutation = useMutation(() => ({
    mutationKey: ["respondToEvent"],
    mutationFn: async () => {
      await execute(respondToEventMutation, {
        id: props.eventID,
      });
    },
  }));
  return (
    <Button class="btn btn-primary" onClick={() => mutation.mutate()}>
      Откликнуться
    </Button>
  );
};

export interface EventData {
  title: string;
  createdAt: dayjs.Dayjs;
  startTime: dayjs.Dayjs;
  description?: string;
  promoWorld?: string | null;
  duration: number;
  buttomContent?: JSXElement;
}

const EventCard: Component<EventData> = (props) => {
  const [startAt, createdAt] = [dayjs(props.startTime), dayjs(props.createdAt)];
  return (
    <div class="flex flex-col p-3 w-full h-max bg-base-100 rounded-2xl shadow-xl border-1 border-base-300">
      <div class="flex items-center justify-between gap-1">
        <strong class="text-xl">{props.title}</strong>
        <span class="text-xs font-light text-nowrap flex flex-col">
          <span>Дата создания: </span>
          <span>{createdAt.format("LT l")}</span>
        </span>
      </div>
      <Show when={props.promoWorld}>
        <StatField text="Промослово">
          <span class="font-light">{props.promoWorld}</span>
        </StatField>
      </Show>
      <StatField text="Начало">
        <span class="font-light">{startAt.format("LT l")}</span>
      </StatField>
      <StatField text="Длительность">
        <span class="font-light">{props.duration} час.</span>
      </StatField>
      <ExpandText text="Описание" value={props.description}></ExpandText>
      {props.buttomContent}
    </div>
  );
};
