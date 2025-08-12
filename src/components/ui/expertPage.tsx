/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  JSXElement,
  Match,
  Show,
  Switch,
  Accessor,
  type Component,
} from "solid-js";

import Name from "~/components/ui/ExpertName";
import ExpandText from "~/components/ui/ExpandText";
import {
  StatField,
  StatField2,
  StatListField,
} from "~/components/ui/StatFields";
import execute from "~/utils/execute";
import ProfileApplets from "~/components/ui/ProfileApplets";
import { useQuery } from "@tanstack/solid-query";
import { expertProfileQuery as userQuery } from "~/api/expertProfile";
import Avatar from "~/components/ui/Avatar";
import Card from "~/components/ui/Card";
import { Maybe, User } from "~/graphql/graphql";
import { A } from "@solidjs/router";

const CommunityDirectionsList: Component<{
  directions?: Maybe<
    Array<{
      direction: string;
      name: string;
    }>
  >;
}> = (props) => {
  return (
    <StatListField
      text="Направления"
      items={props.directions?.map((v) => `${v.direction}/${v.name}`)}
    />
  );
};

const ExpertCardPage: Component<{
  userID: string;
  afterCard?: Component<Accessor<User>>;
}> = (props) => {
  const query = useQuery(() => ({
    queryKey: ["user", props.userID],
    queryFn: async () => {
      const resp = (await execute(userQuery, { id: props.userID })).user;
      return resp;
    },
  }));

  return (
    <div class="w-full gap-2 flex flex-col justify-center">
      <Switch>
        <Match when={query.isLoading}>Загрузка...</Match>
        <Match when={query.error}>{query.error?.message}</Match>
        <Match when={query.isFetched && query.data}>
          {(user) => (
            <>
              <Avatar
                avatar={user().avatar}
                class="size-96 rounded-3xl self-center"
              />
              <Card>
                {/* statistic */}
                <Show when={user().expertProfile}>
                  <ProfileApplets data={user().expertProfile!} />
                </Show>
                <Name {...user()} />
                <Show when={user().expertProfile}>
                  {(profile) => (
                    <>
                      <div class="flex flex-col gap-1.25">
                        <CommunityDirectionsList
                          directions={profile().communityDirections}
                        />
                        <ExpandText value={profile().about} />
                      </div>
                      <StatField text="Ccылка на соц сеть">
                        <A
                          href={`https://vk.com/away.php?to=${encodeURI(profile().socialMediaLink || "")}`}
                          class="link"
                        >
                          {profile().socialMediaLink}
                        </A>
                      </StatField>
                    </>
                  )}
                </Show>
              </Card>
              {props.afterCard && props.afterCard(user as any)}
            </>
          )}
        </Match>
      </Switch>
    </div>
  );
};
export default ExpertCardPage;
