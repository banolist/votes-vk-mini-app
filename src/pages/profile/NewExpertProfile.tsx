import { createEffect, createSignal, Show, type Component } from "solid-js";
import execute from "~/utils/execute";
import { z } from "zod";
import { TextField } from "~/components/form/TextField";
import { Button } from "@kobalte/core/button";
import {
  createForm,
  getErrors,
  reset,
  zodForm,
  setResponse,
} from "@modular-forms/solid";
import DirectionsSelect from "~/components/ui/DirectionsSelect";
import RegionsSelect from "~/components/ui/RegionsSelect";
import Page from "~/components/ui/Page";
import bridge from "@vkontakte/vk-bridge";
import { useMutation, useQuery } from "@tanstack/solid-query";
import {
  ProfileRequestChangeType,
  ProfileRequestStatus,
  ProfileRequestType,
} from "~/graphql/graphql";
import { useNavigate } from "@solidjs/router";
import { toHttps } from "~/utils/form";
import { createExpertProfileMutation } from "~/api/expertProfile";
import { myProfileRequest } from "~/api/events";
import Card from "~/components/ui/Card";

const profileCreateInputSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  communityDirections: z
    .array(z.string().min(1, "Должно быть хотя-бы 1 направление"))
    .nonempty({
      message: "Должно быть хотя-бы 1 направление",
    })
    .max(4, { message: "Максимум 4 направления" }),
  about: z.string().min(5).max(256),
  region: z.string(),
  simpleSpeechLink: z.string().url(),
  socialMediaLink: z.string().url(),
  referUsername: z.string().optional(),
});

type ProfileCrateForm = typeof profileCreateInputSchema._type;

const NewExpertProfile: Component = () => {
  const navigate = useNavigate();
  // const [error, setError] = createSignal<string | null>(null);
  // get dependencies querys
  const [fetchedRegins, setFetchedRegins] = createSignal(false);
  const [fetchedDirections, setFetchedDirections] = createSignal(false);
  const quertExpertProfile = useQuery(() => ({
    queryKey: ["myExpertProfileExpertReuqet"],
    enabled: fetchedRegins() && fetchedDirections(),
    queryFn: async () => {
      const result = await execute(myProfileRequest, {
        argType: ProfileRequestType.Expert,
      });
      return result.myProfileRequest;
    },
  }));

  const [disabledForm, setDisabledForm] = createSignal(false);

  const queryVKUserInfo = useQuery(() => ({
    queryKey: ["VKUserInfo"],
    queryFn: () => bridge.send("VKWebAppGetUserInfo"),
    enabled: quertExpertProfile.isFetched,
  }));

  const [form, { Form, Field }] = createForm<ProfileCrateForm>({
    validate: zodForm(profileCreateInputSchema),
    revalidateOn: "change",
  });
  function handleResetForm() {
    const data = quertExpertProfile.data?.expertRequest;
    if (!data) return;
    reset(form, {
      initialValues: {
        communityDirections: data.newCommunityDirections?.length
          ? (data.newCommunityDirections?.map((v) => v.id.toString()) as [
              string,
              ...string[],
            ]) // Приведение типа
          : [""],
        firstName: data.newFirstName || "",
        lastName: data.newLastName || "",
        referUsername: data.newReferUsername || "",
        simpleSpeechLink: data.newSimpleSpeechLink || "",
        socialMediaLink: data.newSocialMediaLink || "",
        about: data.newAbout || "",
        region: data.newRegion?.id.toString() || "",
      },
    });
  }
  const handleEdit = () => {
    if (!disabledForm()) {
      handleResetForm();
    }
    setDisabledForm(!disabledForm());
  };

  createEffect(() => {
    handleResetForm();
    if (
      quertExpertProfile.data?.status !== ProfileRequestStatus.Rejected &&
      quertExpertProfile.data
    ) {
      setDisabledForm(true);
    }
  });

  createEffect(() => {
    const data = queryVKUserInfo.data;
    if (data && !queryVKUserInfo.data) {
      reset(form, {
        initialValues: {
          firstName: data.first_name,
          lastName: data.last_name,
        },
      });
    }
  });

  const mutate = useMutation(() => ({
    mutationKey: ["registerExpertProfile"],
    mutationFn: async (data: ProfileCrateForm) => {
      return await execute(createExpertProfileMutation, {
        input: {
          changeType: ProfileRequestChangeType.Create,
          type: ProfileRequestType.Expert,
          expert: {
            communityDirections: data.communityDirections,
            region: data.region,
            about: data.about,
            simpleSpeechLink: data.simpleSpeechLink,
            socialMediaLink: data.socialMediaLink,
            referUsername: data.referUsername,
            firstName: data.firstName,
            lastName: data.lastName,
          },
        },
      });
    },
    onSuccess: () => {
      navigate("../");
    },
    onError: (err) =>
      setResponse(form, {
        message: err.message,
        status: "error",
      }),
  }));

  return (
    <Page title="Регистрация профиля эксперта">
      <Card class="items-center">
        <Show when={quertExpertProfile.data}>
          <div class="items-center">
            Статус вашей заявки:{" "}
            <span
              class="status"
              classList={{
                "status-success":
                  quertExpertProfile.data?.status ==
                  ProfileRequestStatus.Approved,
                "status-error":
                  quertExpertProfile.data?.status ==
                  ProfileRequestStatus.Rejected,
                "status-info":
                  quertExpertProfile.data?.status ==
                  ProfileRequestStatus.Pending,
              }}
            />{" "}
            <span>
              {
                localeStatus[
                  quertExpertProfile.data?.status ||
                    ProfileRequestStatus.Pending
                ]
              }
            </span>
          </div>
        </Show>
        <Form class="flex flex-col gap-2" onSubmit={(v) => mutate.mutate(v)}>
          <Field name="firstName">
            {(field, props) => (
              <TextField
                {...props}
                label="Имя"
                value={field.value}
                error={field.error}
                disabled={disabledForm()}
                required
              />
            )}
          </Field>
          <Field name="lastName">
            {(field, props) => (
              <TextField
                {...props}
                label="Фамилия"
                value={field.value}
                error={field.error}
                disabled={disabledForm()}
                required
              />
            )}
          </Field>
          <Field name="referUsername">
            {(field, props) => (
              <TextField
                {...props}
                label="Ник"
                value={field.value}
                error={field.error}
                disabled={disabledForm()}
                description="Отображаемое имя, если стоит, будет отображаться в замену реального, опционально"
              />
            )}
          </Field>
          <Field name="socialMediaLink" transform={toHttps()}>
            {(field, props) => (
              <TextField
                {...props}
                label="Ссылка на соц. сеть"
                value={field.value}
                error={field.error}
                disabled={disabledForm()}
              />
            )}
          </Field>
          <Field name="simpleSpeechLink" transform={toHttps()}>
            {(field, props) => (
              <TextField
                {...props}
                label="Ссылка на пример выступления"
                value={field.value}
                error={field.error}
                disabled={disabledForm()}
                required
              />
            )}
          </Field>
          <Field name="about">
            {(field, props) => (
              <TextField
                {...props}
                max={256}
                label="Об эксперте"
                value={field.value}
                error={field.error}
                disabled={disabledForm()}
                multiline
                required
              />
            )}
          </Field>
          <Field
            name={"communityDirections"}
            type="string[]"
            validateOn="input"
          >
            {(field, props) => (
              <DirectionsSelect
                {...props}
                label="Направления сообщества"
                value={field.value}
                error={field.error}
                onFethed={() => setFetchedDirections(true)}
                disabled={disabledForm()}
                multiple
                required
              />
            )}
          </Field>
          <Field name={"region"} type="string" validateOn="change">
            {(field, props) => (
              <RegionsSelect
                {...props}
                label="Регион"
                value={field.value}
                error={field.error}
                onFethed={() => setFetchedRegins(true)}
                disabled={disabledForm()}
                required
              />
            )}
          </Field>
          <Show when={form.response.status == "error"}>
            <div class="text-error"> {form.response.message}</div>
          </Show>
          <Show
            when={
              quertExpertProfile.data?.status == ProfileRequestStatus.Pending
            }
          >
            <Button class="btn btn-secondary" onClick={handleEdit}>
              {disabledForm() ? "Редактировать заявку" : "Отменить изменение"}
            </Button>
          </Show>
          <Button
            type="submit"
            class="btn btn-primary max-w-md"
            disabled={disabledForm()}
          >
            Подать заявку
          </Button>
        </Form>
      </Card>
    </Page>
  );
};

const localeStatus: Record<ProfileRequestStatus, string> = {
  approved: "Принята",
  pending: "Ожидает модерации",
  rejected: "Отклонена",
};
export default NewExpertProfile;
