import { A } from "@solidjs/router";
import dayjs from "dayjs";
import { Show, type Component } from "solid-js";
import Card from "~/components/ui/Card";
import NameComponent from "~/components/ui/Name";
import Page from "~/components/ui/Page";
import { graphql } from "~/graphql";
import {
  ProfileRequestChangeType,
  ProfileRequestStatus,
  ProfileRequestType,
} from "~/graphql/graphql";
import createVirtualList from "~/hooks/createVirtualList";
import execute from "~/utils/execute";

const moderationListQuery = graphql(`
  query moderationProfilesList($first: Int!, $cursor: Cursor) {
    profileRequests(
      first: $first
      after: $cursor
      where: { status: pending }
      orderBy: { direction: DESC, field: CREATED_AT }
    ) {
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
          type
          createdAt
          changeType
          creator {
            firstName
            lastName
            avatar
          }
        }
      }
      totalCount
    }
  }
`);

const ModerationList: Component = () => {
  const { List } = createVirtualList(() => ({
    queryKey: ["expertProfileRequest"],
    queryFn: async ({ pageParam }) =>
      (await execute(moderationListQuery, { first: 25, cursor: pageParam }))
        .profileRequests,
    pageSize: 25,
    estimateSize: 190,
  }));
  return (
    <>
      <Page title="Модерация профилей">
        <List>
          {(r) => <ExpertCard {...r} {...r.creator} href={`./${r.id}`} />}
        </List>
      </Page>
    </>
  );
};
export default ModerationList;

const categoryLocale: Record<ProfileRequestChangeType, string> = {
  create: "Создание",
  update: "Редактирование",
};

const statusLocale: Record<ProfileRequestStatus, string> = {
  approved: "Принято",
  pending: "В ожидании",
  rejected: "Отклонено",
};
const profileRequestTypeLocale: Record<ProfileRequestType, string> = {
  expert: "Эксперт",
  organizator: "Организация",
  pre_expert: "Представительство",
};

const ExpertCard: Component<{
  type: ProfileRequestType;
  firstName: string;
  lastName: string;
  phaserName?: string;
  avatar?: string | null;
  changeType: ProfileRequestChangeType;
  createdAt?: string;
  href: string;
}> = (props) => {
  return (
    <Card>
      <div class="card w-full">
        <div class="flex w-full gap-2">
          <img
            src={props.avatar || ""}
            alt={props.firstName[0] || ""}
            class="size-24 justify-center items-center text-justify bg-base-200 rounded-xl border-base-content/10 border"
          />
          <div class="flex flex-col w-full">
            <NameComponent {...props} />
            <div>Категория: {categoryLocale[props.changeType]}</div>
            <div>Дата создания: {dayjs(props.createdAt!).format("LT L")}</div>
            <div>Тип: {profileRequestTypeLocale[props.type]}</div>
          </div>
        </div>
        <A
          class="btn btn-outline btn-accent w-full text-base font-medium"
          href={props.href}
        >
          Подробнее
        </A>
      </div>
    </Card>
  );
};
