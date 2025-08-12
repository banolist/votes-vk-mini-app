import { Button } from "@kobalte/core/button";
import { Tabs } from "@kobalte/core/tabs";
import { A } from "@solidjs/router";
import { useMutation } from "@tanstack/solid-query";
import dayjs from "dayjs";
import { createSignal, Show, type Component } from "solid-js";
import Card from "~/components/ui/Card";
import Name from "~/components/ui/ExpertName";
import Page from "~/components/ui/Page";
import { graphql } from "~/graphql";
import {
  OrderDirection,
  RepresentativeExpertRequestOrderField,
  RepresentativeExpertRequestStatus,
  RepresentativeExpertRequestType,
} from "~/graphql/graphql";
import createVirtualList from "~/hooks/createVirtualList";
import useMe from "~/hooks/useMe";
import execute from "~/utils/execute";
import { UserRights } from "~/utils/rights";

const preExpertExperts = graphql(`
  query preExpertExperts(
    $first: Int!
    $after: Cursor
    $where: RepresentativeExpertRequestWhereInput
    $orderBy: RepresentativeExpertRequestOrder
  ) {
    representativeExpertRequests(
      first: $first
      after: $after
      where: $where
      orderBy: $orderBy
    ) {
      totalCount
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      edges {
        cursor
        node {
          id
          status
          targetUser {
            id
            firstName
            lastName
            avatar
            rights
          }
          representativeUser {
            id
            firstName
            lastName
            avatar
            rights
          }
          type
          createdAt
        }
      }
    }
  }
`);
const PreExpertRequests: Component = () => {
  const [pageType, setpageType] = createSignal<Filter>("my_request");
  const me = useMe();
  const mutation = useMutation(() => ({
    mutationKey: ["acceptRejectPreexpertRequest"],
    mutationFn: async (data: {
      data: RepresentativeExpertRequestStatus;
      id: string;
    }) => {
      if (data.data == RepresentativeExpertRequestStatus.Approved) {
        await execute(acceptRepresentive, { id: data.id });
      } else {
        await execute(rejectRepresentive, { id: data.id });
      }
    },
  }));

  const { List } = createVirtualList(() => ({
    queryKey: ["preExpertExperts", pageType(), me.data?.id],
    queryFn: async ({ pageParam }) =>
      (
        await execute(preExpertExperts, {
          first: 10,
          after: pageParam,
          orderBy: {
            field: RepresentativeExpertRequestOrderField.CreatedAt,
            direction: OrderDirection.Desc,
          },
          where: {
            status: RepresentativeExpertRequestStatus.Pending,
            type: RepresentativeExpertRequestType.Request,
            hasRepresentativeUserWith:
              pageType() == "my_request" ? [{ id: me.data?.id }] : undefined,
            hasTargetUserWith:
              pageType() == "request" ? [{ id: me.data?.id }] : undefined,
          },
        })
      ).representativeExpertRequests,
    pageSize: 10,
    estimateSize: 150,
  }));

  return (
    <Page title="Запросы">
      <Show when={me.data}>
        {(me) => (
          <Tabs value={pageType()} onChange={setpageType}>
            <Tabs.List class="justify-center tabs tabs-border *:tab">
              {/* <Tabs.Trigger class="tab" value="invite">
            Приглашения
          </Tabs.Trigger> */}
              <Tabs.Trigger value="my_request">Мои запросы</Tabs.Trigger>
              <Tabs.Trigger value="request">Запросы</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="my_request">
              <List>
                {(item) => (
                  <CardRequest
                    filter="my_request"
                    {...item}
                    mutation={(v) => mutation.mutate(v)}
                    myID={me().id}
                  />
                )}
              </List>
            </Tabs.Content>
            <Tabs.Content value="request">
              <List>
                {(item) => (
                  <CardRequest
                    filter="request"
                    {...item}
                    mutation={(v) => mutation.mutate(v)}
                    myID={me().id}
                  />
                )}
              </List>
            </Tabs.Content>
          </Tabs>
        )}
      </Show>
    </Page>
  );
};
export default PreExpertRequests;

type Filter = "my_request" | "request";

const acceptRepresentive = graphql(`
  mutation acceptRepresentive($id: ID!) {
    acceptRepresentativeRequest(requestID: $id)
  }
`);

const rejectRepresentive = graphql(`
  mutation rejectRepresentive($id: ID!) {
    rejectRepresentativeRequest(requestID: $id)
  }
`);

interface User {
  id: string;
  firstName: string;
  lastName: string;
  avatar?: string | null;
  rights: UserRights;
}

const CardRequest: Component<{
  filter: Filter;
  id: string;
  targetUser: User;
  representativeUser: User;
  type: RepresentativeExpertRequestType;
  createdAt: string;
  mutation: (data: {
    data: RepresentativeExpertRequestStatus;
    id: string;
  }) => void;
  myID: string;
}> = (props) => {
  const title = () =>
    props.type === RepresentativeExpertRequestType.Invite
      ? props.representativeUser
      : props.targetUser;

  const isMyRequest = () => props.representativeUser.id == props.myID;

  return (
    <Card
      title={<Name class="text-xl" {...title()} />}
      endTitle={dayjs(props.createdAt).format("lll")}
      class="flex flex-col gap-2"
    >
      <A class="btn btn-primary btn-outline" href={`/experts/${title().id}`}>
        Подробнее
      </A>
      <Show when={!isMyRequest()}>
        <div class="flex gap-2">
          <Button
            class="btn btn-success flex-1"
            onClick={() =>
              props.mutation({
                data: RepresentativeExpertRequestStatus.Rejected,
                id: props.id,
              })
            }
          >
            Принять
          </Button>
          <Button
            class="btn btn-error flex-1"
            onClick={() =>
              props.mutation({
                data: RepresentativeExpertRequestStatus.Rejected,
                id: props.id,
              })
            }
          >
            Отклонить
          </Button>
        </div>
      </Show>
    </Card>
  );
};
