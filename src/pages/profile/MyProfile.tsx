import { Match, Show, Switch, type Component } from "solid-js";
import Name from "~/components/ui/ExpertName";
import ExpandText from "~/components/ui/ExpandText";
import { StatField } from "~/components/ui/StatFields";
import { graphql } from "~/graphql";
import execute from "~/utils/execute";
import ProfileApplets from "~/components/ui/ProfileApplets";
import { hasRights, UserRights } from "~/utils/rights";
import useMe from "~/hooks/useMe";
import Card from "~/components/ui/Card";
import { useQuery } from "@tanstack/solid-query";
import { A } from "@solidjs/router";

const myProfileQuery = graphql(`
  query MyProfile {
    me {
      avatar
      firstName
      lastName
      expertProfile {
        simpleSpeechLink
        socialMediaLink
        positiveVotes
        negativeVotes
        positivePeopleVotes
        negativePeopleVotes
        countEvents
        peopleVotesCount
        votesCount
        region {
          regionName
        }
        peopleRatingEnabled
        about
        communityDirections {
          direction
          name
        }
      }
    }
  }
`);

const MyProfile: Component = () => {
  const query = useQuery(() => ({
    queryKey: ["myProfile"],
    queryFn: async () => {
      const resp = await execute(myProfileQuery);
      return resp.me;
    },
  }));
  const me = useMe();

  return (
    <>
      <Switch>
        <Match when={query.isLoading}>Загрузка...</Match>
        <Match when={query.isError}>{query.error?.message}</Match>
        <Match when={query.isFetched && query.data}>
          {(data) => (
            <div class="items-center flex flex-col gap-1">
              <img
                src={data().avatar || ""}
                alt={data().firstName[0] + data().lastName[0]}
                class="size-full rounded-3xl max-w-xl"
              />
              <Switch>
                <Match
                  when={!hasRights(me.data?.rights || 0, UserRights.Expert)}
                >
                  <Card>
                    <Name
                      firstName={data().firstName}
                      lastName={data().lastName}
                    />
                    <span>Вы явлеетесь участником</span>
                  </Card>
                </Match>
                <Match when={true}>
                  <div class="flex flex-col py-3 px-5 gap-1 w-full self-start rounded-3xl bg-base-100 border-[#e6d9cb]">
                    <Show when={data().expertProfile}>
                      {(expertProfile) => (
                        <>
                          <div class="flex flex-row gap-1 justify-start w-full">
                            <ProfileApplets data={{ ...expertProfile() }} />
                          </div>
                          <Name
                            firstName={data().firstName}
                            lastName={data().lastName}
                          />
                          <div class="flex flex-col gap-1.25">
                            <StatField
                              text="Направления"
                              value={
                                expertProfile().communityDirections?.map(
                                  (d) => `${d.direction}/${d.name}`,
                                ) || []
                              }
                            />
                            <StatField text="Ccылка на соц сеть">
                              <A
                                href={`https://vk.com/away.php?to=${encodeURI(data().expertProfile?.socialMediaLink || "")}`}
                                class="link"
                              >
                                {data().expertProfile?.socialMediaLink}
                              </A>
                            </StatField>

                            <ExpandText value={expertProfile().about || ""} />
                          </div>
                        </>
                      )}
                    </Show>
                  </div>
                </Match>
              </Switch>
            </div>
          )}
        </Match>
      </Switch>
    </>
  );
};
export default MyProfile;
