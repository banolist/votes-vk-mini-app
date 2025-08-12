// мои представители, кого я представляю
import { Select } from "@kobalte/core/select";
import { useQuery } from "@tanstack/solid-query";
import {
  Accessor,
  createMemo,
  createSignal,
  Match,
  Setter,
  Show,
  Switch,
  type Component,
} from "solid-js";
import Page from "~/components/ui/Page";
import { graphql } from "~/graphql";
import createVirtualList from "~/hooks/createVirtualList";
import execute from "~/utils/execute";
import HeroiconsXMark16Solid from "~icons/heroicons/x-mark-16-solid";
import HeroiconsChevronUpDown16Solid from "~icons/heroicons/chevron-up-down-16-solid";
import EventCard from "~/components/ui/EventCard";
import CreateEventModal from "~/components/createEvent/CreateEventModal";
const representativeUsersQuery = graphql(`
  query representativeUsers($first: Int!, $after: Cursor) {
    representativeExperts(first: $first, after: $after) {
      pageInfo {
        endCursor
        hasNextPage
      }
      totalCount
      edges {
        cursor
        node {
          id
          firstName
          lastName
          avatar
          nickname
        }
      }
    }
  }
`);

const representativeEventsQuery = graphql(`
  query representiveEvents($expertID: ID!, $first: Int!, $after: Cursor) {
    expertRepresentativeEvents(
      expertID: $expertID
      after: $after
      first: $first
    ) {
      edges {
        cursor
        node {
          id
          title
          createdAt
          myExpertVote
          promoWorld
          startTime
          type
          description
          duration
          endTime
          eventRequest {
            status
            updatedAt
          }
        }
      }
      pageInfo {
        endCursor
        hasPreviousPage
        hasNextPage
        startCursor
      }
      totalCount
    }
  }
`);

const representativeUserTariffLimits = graphql(`
  query userTariffLimits($userID: ID!) {
    userTariffLimits(userID: $userID) {
      votesPerEvent
      eventsPerMonth
      activeWordDurationHours
    }
  }
`);

interface Expert {
  id: string;
  firstName: string;
  lastName: string;
  avatar?: string | null;
  nickname?: string | null;
}
const RepresentativeUsers: Component = () => {
  const [selectedExpert, setselectedExpert] = createSignal<Expert | null>(null);
  const { List } = createVirtualList(() => ({
    queryKey: ["representativeEvents", selectedExpert()],
    queryFn: async ({ pageParam }) =>
      (
        await execute(representativeEventsQuery, {
          expertID: selectedExpert()?.id || "",
          first: 25,
          after: pageParam,
        })
      ).expertRepresentativeEvents,
    pageSize: 25,
    estimateSize: 190,
    noContentText: "Тут пока ничего нет",
    enabled: !!selectedExpert(),
  }));
  const usersQuery = useQuery(() => ({
    queryKey: ["representativeUsers"],
    queryFn: async () =>
      (await execute(representativeUsersQuery, { first: 25, after: null }))
        .representativeExperts,
  }));

  const users = createMemo(
    () =>
      usersQuery.data?.edges
        ?.map((r) => r?.node)
        .filter((node): node is NonNullable<typeof node> => node != null) || [],
  );

  const userTariffLimits = useQuery(() => ({
    queryKey: ["representiveUser", selectedExpert()?.id],
    queryFn: async () =>
      await execute(representativeUserTariffLimits, {
        userID: selectedExpert()?.id || "",
      }),
    enabled: !!selectedExpert(),
  }));

  // const users: Accessor<Expert[]> = () => [
  //   {
  //     firstName: "Билли",
  //     lastName: "Херингтон",
  //     avatar:
  //       "https://i.pinimg.com/736x/b8/79/31/b87931530891195dfedcca2e1406ac5b.jpg",
  //     nickname: "test",
  //     id: "1",
  //   },
  //   {
  //     firstName: "Билли",
  //     lastName: "Херингтон",
  //     avatar:
  //       "https://i.pinimg.com/736x/b8/79/31/b87931530891195dfedcca2e1406ac5b.jpg",
  //     nickname: "test",
  //     id: "3",
  //   },
  //   {
  //     firstName: "Билли",
  //     lastName: "Херингтон",
  //     avatar:
  //       "https://i.pinimg.com/736x/b8/79/31/b87931530891195dfedcca2e1406ac5b.jpg",
  //     nickname: "test",
  //     id: "2",
  //   },
  // ];

  return (
    <Page title="Представительство">
      <ExpertSelect
        selectedExpert={selectedExpert}
        users={users()}
        setSelectedExpert={setselectedExpert}
      />
      <Show when={selectedExpert()}>
        <CreateEventModal
          queryKey={() => ["representativeEventCreate"]}
          representativeForUser={selectedExpert()?.id}
          tariffLimits={userTariffLimits.data?.userTariffLimits}
        />
      </Show>
      <List>
        {(item) => <EventCard data={item} link={`/events/${item.id}`} />}
      </List>
    </Page>
  );
};
export default RepresentativeUsers;

const SelectItem: Component<Expert> = (props) => {
  return (
    <div class="flex gap-2 items-center">
      <div class="avatar-placeholder">
        <div class="avatar w-12 ">
          <img class="rounded-full" src={props.avatar || ""} alt="" />
        </div>
      </div>
      <div class="text-2xl">
        {props.firstName} {props.lastName}
      </div>
    </div>
  );
};

function ExpertSelect(props: {
  users: Expert[];
  selectedExpert: Accessor<Expert | null>;
  setSelectedExpert: Setter<Expert | null>;
}) {
  return (
    <Switch>
      <Match when={props.users.length}>
        <Select<Expert>
          options={props.users}
          value={props.selectedExpert()}
          onChange={props.setSelectedExpert}
          optionValue="id"
          placeholder="Выберите эксперта"
          class="border-0"
          itemComponent={(props) => (
            <Select.Item
              item={props.item}
              class="flex justify-between items-center px-2 hover:bg-base-200 border-0"
            >
              <Select.ItemLabel class="">
                <SelectItem {...props.item.rawValue} />
              </Select.ItemLabel>
              <Select.ItemIndicator>
                <HeroiconsXMark16Solid class="size-5" />
              </Select.ItemIndicator>
            </Select.Item>
          )}
          sectionComponent={(props) => (
            <Select.Section class="text-sm text-tx-secondary2 font-light">
              {props.section.textValue}
            </Select.Section>
          )}
        >
          <Select.Trigger class="w-full max-w-md flex justify-between validator h-12 items-center px-2">
            <Select.Value<Expert> class="flex items-center">
              {(state) => <SelectItem {...state.selectedOption()} />}
            </Select.Value>
            <Select.Icon>
              <HeroiconsChevronUpDown16Solid class="size-7" />
            </Select.Icon>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content class="w-full max-w-md max-h-52 overflow-auto rounded-xl border-0 border-base-content/20 z-20">
              <Select.Listbox class="bg-base-100 py-1 inline-block w-full gap-0.5 cursor-default space-y-1" />
            </Select.Content>
          </Select.Portal>
        </Select>
      </Match>
      <Match when={true}>
        <div>Экспертов представительства нет, отправьте запрос эксперту</div>
      </Match>
    </Switch>
  );
}
