import { A, useNavigate, useParams } from "@solidjs/router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/solid-query";
import { Match, Show, Switch, type Component } from "solid-js";
import AcceptRejectButtons from "~/components/ui/AcceptRejectButtons";
import ExpandText from "~/components/ui/ExpandText";
import Name from "~/components/ui/ExpertName";
import LocationText from "~/components/ui/LocationText";
import { RejectForm } from "~/components/ui/RejectDialog";
import { Field, StatListField } from "~/components/ui/StatFields";
import { graphql } from "~/graphql";
import {
  ProfileRequestChangeType,
  ProfileRequestType,
} from "~/graphql/graphql";
import execute from "~/utils/execute";

const expertProfileRequestQuery = graphql(`
  query profileRequest($id: ID!) {
    ProfileRequest(id: $id) {
      creator {
        firstName
        lastName
        avatar
      }
      status
      changeType
      type
      expertRequest {
        newSocialMediaLink
        newSimpleSpeechLink
        newAbout
        newFirstName
        newLastName
        newCommunityDirections {
          direction
          name
        }
        newReferUsername
        newRegalia
        newRegion {
          regionName
        }
      }
      organizatorRequest {
        newOrganizationName
        newOrganizationURL
      }
    }
  }
`);

const expertProfileRequestAccept = graphql(`
  mutation AcceptExpertRequect($id: ID!) {
    acceptProfileRequest(requestId: $id) {
      id
    }
  }
`);

const rejectProfileMutation = graphql(`
  mutation rejectProfileRequest($id: ID!, $reason: String!) {
    rejectProfileRequest(requestId: $id, reason: $reason)
  }
`);

const ModerationEventCard: Component = () => {
  const { id } = useParams();
  const queryKey = () => ["profileRequest", id];

  const query = useQuery(() => ({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: queryKey(),
    queryFn: async () => {
      const resp = await execute(expertProfileRequestQuery, { id });
      return resp.ProfileRequest;
    },
  }));

  return (
    <>
      <Switch>
        <Match when={query.isLoading}>Загрузка...</Match>
        <Match when={query.isError}>{query.error?.message}</Match>
        <Match when={query.isFetched && query.data?.creator && query.data}>
          {(data) => (
            <div class="items-center flex flex-col gap-1">
              <img
                src={data().creator.avatar!}
                class="size-full rounded-3xl max-w-xl"
              />
              <div class="flex flex-col py-3 px-5 gap-1 w-full self-start rounded-3xl bg-base-100 border-[#e6d9cb]">
                <div class="text-2xl">
                  {localeChangeType[data().changeType]}
                </div>
                <Name
                  firstName={data().creator.firstName!}
                  lastName={data().creator.lastName!}
                />
                <Switch>
                  <Match
                    when={
                      data().type == ProfileRequestType.Expert &&
                      data().expertRequest
                    }
                  >
                    {(data) => (
                      <div class="flex flex-col gap-1.25">
                        <Field field="Регион">
                          <LocationText
                            location={data().newRegion?.regionName}
                          />
                        </Field>
                        <Field field="Пример выступления">
                          <A class="link" href={data().newSimpleSpeechLink!}>
                            {data().newSimpleSpeechLink}
                          </A>
                        </Field>
                        <Field field="Соц. сеть">
                          <A class="link" href={data().newSocialMediaLink!}>
                            {data().newSocialMediaLink}
                          </A>
                        </Field>
                        <StatListField
                          text="Направления"
                          items={
                            data()?.newCommunityDirections?.map(
                              (v) => `${v.direction}/${v.name}`,
                            ) || []
                          }
                        />
                        <ExpandText
                          text="Об Эксперте"
                          value={data().newRegalia}
                        />
                      </div>
                    )}
                  </Match>
                  <Match
                    when={
                      data().type == ProfileRequestType.Organizator &&
                      data().organizatorRequest
                    }
                  >
                    {(data) => (
                      <div class="flex flex-col gap-1.25">
                        <Field field="Название организации">
                          {data().newOrganizationName}
                        </Field>
                        <Show when={data().newOrganizationURL}>
                          {(url) => (
                            <Field field="URL организации">
                              <A class="link" href={url()}>
                                {url()}
                              </A>
                            </Field>
                          )}
                        </Show>
                      </div>
                    )}
                  </Match>
                </Switch>
                <Buttons />
              </div>
            </div>
          )}
        </Match>
      </Switch>
    </>
  );
};
export default ModerationEventCard;

const localeChangeType: Record<ProfileRequestChangeType, string> = {
  create: "Создание",
  update: "Изменение",
};

const Buttons = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const queryKey = () => ["profileRequest", id];
  const mutationReject = useMutation(() => ({
    mutationKey: queryKey(),
    mutationFn: async (data: RejectForm) => {
      await execute(rejectProfileMutation, { id, reason: data.reason });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKey(),
      });
      navigate("../");
    },
  }));
  const mutationAccept = useMutation(() => ({
    mutationKey: queryKey(),
    mutationFn: async () => {
      await execute(expertProfileRequestAccept, { id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKey(),
      });
      navigate("../");
    },
  }));

  return (
    <AcceptRejectButtons
      onAccept={() => mutationAccept.mutate()}
      onReject={(form) => mutationReject.mutate(form)}
      error={mutationAccept.error || mutationReject.error}
    />
  );
};
