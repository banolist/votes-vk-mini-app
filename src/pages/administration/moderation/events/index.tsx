import { useQuery } from "@tanstack/solid-query";

import { For, Match, Show, Switch, type Component } from "solid-js";
import EventCard from "~/components/ui/EventCard";

import { graphql } from "~/graphql";
import { useVirtualInfiniteScroll } from "~/hooks/useVirtualInfiniteScrol";
import execute from "~/utils/execute";

const moderationListQuery = graphql(`
  query moderationEventsList($first: Int!, $after: Cursor) {
    eventRequests(
      first: $first
      after: $after
      where: { status: pending }
      orderBy: { field: CREATED_AT, direction: DESC }
    ) {
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      edges {
        node {
          id
          createdAt

          status
          event {
            type
            description
            startTime
            duration
            title
            expertEvent {
              commentToListener
              promoWord
            }
          }
        }
        cursor
      }
      totalCount
    }
  }
`);

const ModerationEventList: Component = () => {
  // const query = useQuery(() => ({
  //   queryKey: ["ModerationEventList"],
  //   queryFn: async () => (await execute(moderationListQuery)).eventRequests,
  // }));

  const { setViewportRef, items, virtualizer } = useVirtualInfiniteScroll(
    () => ({
      queryKey: ["moderationEvents"],
      queryFn: async ({ pageParam }) =>
        (await execute(moderationListQuery, { first: 25, after: pageParam }))
          .eventRequests,

      pageSize: 25,
      estimateSize: 185,
    }),
  );

  return (
    <>
      <div class="text-tx-secondary2 text-2xl uppercase">модерация</div>
      <div ref={setViewportRef} class="overflow-y-auto w-full pr-4">
        {/* <Show when={items.length == 0}>
          <div>Нет заявок на модерацию, возвращайтесь позже</div>
        </Show> */}
        <div
          class="gap-2 flex flex-col"
          style={{
            height: virtualizer().getTotalSize() + "px",
            position: "relative",
          }}
        >
          <For each={virtualizer().getVirtualItems()}>
            {(item) => {
              const ev = items()[item.index]!;
              return (
                <div
                  style={{
                    position: "absolute",
                    top: item.start + "px",
                    width: "100%",
                  }}
                >
                  <Show
                    when={ev}
                    fallback={<div class="skeleton w-full h-72" />}
                  >
                    <EventCard
                      data={{ ...ev, ...ev?.event, id: undefined }}
                      link={`./${ev.id}`}
                    />
                  </Show>
                </div>
              );
            }}
          </For>
        </div>
      </div>
    </>
  );
};
export default ModerationEventList;
