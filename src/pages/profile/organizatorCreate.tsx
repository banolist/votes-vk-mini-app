import { Button } from "@kobalte/core/button";
import { createForm, reset, zodForm } from "@modular-forms/solid";
import { useNavigate } from "@solidjs/router";
import { useMutation, useQuery } from "@tanstack/solid-query";
import { createEffect, createSignal, Show, type Component } from "solid-js";
import { z } from "zod";
import { myProfileRequest } from "~/api/events";
import Card from "~/components/ui/Card";
import { TextField } from "~/components/form/TextField";
import Page from "~/components/ui/Page";
import { graphql } from "~/graphql";
import {
  ProfileRequestChangeType,
  ProfileRequestStatus,
  ProfileRequestType,
} from "~/graphql/graphql";
import execute from "~/utils/execute";
import { toHttps } from "~/utils/form";

const createSchema = z.object({
  organizationURL: z.string().url("Должно быть ссылкой"),
  organizationName: z.string().min(2),
});

type CreateForm = typeof createSchema._type;

const createOrganizatorRequestMutation = graphql(`
  mutation createOrganizatorRequest($data: ProfileCreateInput!) {
    createProfileRequest(input: $data) {
      id
    }
  }
`);

const OrganizatorCreate: Component = () => {
  const [disabledForm, setDisabledForm] = createSignal(false);

  const [form, { Form, Field }] = createForm<CreateForm>({
    validate: zodForm(createSchema),
  });
  const navigate = useNavigate();
  const mutation = useMutation(() => ({
    mutationKey: ["createOrganizator"],
    mutationFn: async (data: CreateForm) => {
      await execute(createOrganizatorRequestMutation, {
        data: {
          changeType: ProfileRequestChangeType.Create,
          type: ProfileRequestType.Organizator,
          organizator: {
            organizationName: data.organizationName,
            organizationURL: data.organizationURL,
          },
        },
      });
    },
    onSuccess: () => navigate("/menu"),
  }));
  const query = useQuery(() => ({
    queryKey: ["OrganizatorCreateProfiele"],
    queryFn: async () =>
      (
        await execute(myProfileRequest, {
          argType: ProfileRequestType.Organizator,
        })
      ).myProfileRequest,
  }));
  const handleResetForm = () => {
    const data = query.data?.organizatorRequest;
    if (!data) {
      return;
    }
    reset(form, {
      initialValues: {
        organizationName: data.newOrganizationName || "",
        organizationURL: data.newOrganizationURL || "",
      },
    });
  };
  createEffect(() => {
    handleResetForm();
    if (query.data?.status != ProfileRequestStatus.Rejected && query.data) {
      setDisabledForm(true);
    }
  });
  const handleEdit = () => {
    if (!disabledForm()) {
      handleResetForm();
    }
    setDisabledForm(!disabledForm());
  };

  return (
    <Page title="Регистрация организации">
      <Card class="">
        <Show when={query.data}>
          <div class="items-center">
            Статус вашей заявки:{" "}
            <span
              class="status"
              classList={{
                "status-success":
                  query.data?.status == ProfileRequestStatus.Approved,
                "status-error":
                  query.data?.status == ProfileRequestStatus.Rejected,
                "status-info":
                  query.data?.status == ProfileRequestStatus.Pending,
              }}
            />{" "}
            <span>
              {localeStatus[query.data?.status || ProfileRequestStatus.Pending]}
            </span>
          </div>
        </Show>
        <Form
          onSubmit={(v) => mutation.mutate(v)}
          class="flex flex-col gap-2 min-w-full max-w-md"
        >
          <Field name="organizationName">
            {(field, props) => (
              <TextField
                {...props}
                label="Название организации"
                value={field.value}
                disabled={disabledForm()}
                error={field.error}
                required
              />
            )}
          </Field>
          <Field name="organizationURL" transform={toHttps()}>
            {(field, props) => (
              <TextField
                {...props}
                label="Ссылка на сайт"
                value={field.value}
                error={field.error}
                disabled={disabledForm()}
                required
              />
            )}
          </Field>
          <Show when={form.response.message}>
            <div>{form.response.message}</div>
          </Show>
          <Show when={query.data?.status == ProfileRequestStatus.Pending}>
            <Button class="btn btn-secondary" onClick={handleEdit}>
              {disabledForm() ? "Редактировать заявку" : "Отменить изменение"}
            </Button>
          </Show>
          <Button
            type="submit"
            class="btn btn-accent mt-2 w-full"
            disabled={form.submitting || disabledForm()}
          >
            {form.submitting ? "Отправка..." : "Отправить"}
          </Button>
        </Form>
      </Card>
    </Page>
  );
};
export default OrganizatorCreate;

const localeStatus: Record<ProfileRequestStatus, string> = {
  approved: "Принята",
  pending: "Ожидает модерации",
  rejected: "Отклонена",
};
