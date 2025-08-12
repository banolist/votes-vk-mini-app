import { Button } from "@kobalte/core/button";
import { createForm, zodForm } from "@modular-forms/solid";
import { useNavigate } from "@solidjs/router";
import { useMutation } from "@tanstack/solid-query";
import { Show, type Component } from "solid-js";
import { z } from "zod";
import DirectionsSelect from "~/components/ui/DirectionsSelect";
import { SelectMultilineField } from "~/components/form/Select";
import { TextField } from "~/components/form/TextField";
import Page from "~/components/ui/Page";
import RegionsSelect from "~/components/ui/RegionsSelect";
import { graphql } from "~/graphql";
import { NotificationLevel } from "~/graphql/graphql";
import useMe from "~/hooks/useMe";
import execute from "~/utils/execute";
import { fixFieldValue as fixFieldValue } from "~/utils/form";
import { UserRights } from "~/utils/rights";

type Target = "verified" | "expert" | "organizator" | "users" | "all";

interface OptionSelect {
  label: string;
  value: string;
}

const targetOptions: OptionSelect[] = [
  {
    label: "Эксперт",
    value: "expert",
  },
  {
    label: "Организатор",
    value: "organizator",
  },
  {
    label: "Участник",
    value: "users",
  },
  {
    label: "Верифицированный",
    value: "verified",
  },
  {
    label: "Представитель",
    value: "preExpert",
  },
];

const mailingAdminMutation = graphql(`
  mutation mailingAdmin($data: CreateNotificationInput!) {
    createNotification(data: $data)
  }
`);

const mailingSchema = z.object({
  title: z.string(),
  message: z.string(),
});

type MailingForm = typeof mailingSchema._type;

const MailingPage: Component = () => {
  const [form, { Form, Field }] = createForm<MailingForm>({
    validate: zodForm(mailingSchema),
  });
  const navigate = useNavigate();

  const me = useMe();

  const mutation = useMutation(() => ({
    mutationKey: ["sendAdminMailing"],
    mutationFn: async (data: MailingForm) => {
      await execute(mailingAdminMutation, {
        data: {
          message: data.message,
          title: data.title,
          level: NotificationLevel.Info,
          expertAuditoryIDs: [me.data?.id || ""],
        },
      });
    },
    onSuccess: () => {
      navigate("../");
    },
  }));

  return (
    <Page title="Рассылка">
      <Form
        onSubmit={(data) => mutation.mutate(data)}
        class="flex flex-col items-center"
      >
        <Field name="title">
          {(field, props) => (
            <TextField
              {...props}
              label="Заголовок"
              error={field.error}
              value={field.value}
              required
            />
          )}
        </Field>
        <Field name="message">
          {(field, props) => (
            <TextField
              {...props}
              label="Сообщение"
              error={field.error}
              value={field.value}
              multiline
              required
            />
          )}
        </Field>
        <div>{form.response.message}</div>
        <Show when={mutation.isError}>{mutation.error?.message}</Show>
        <Button
          type="submit"
          class="btn btn-accent btn-wide mt-2"
          disabled={form.submitting}
        >
          {form.submitting ? "Отправка..." : "Отправить"}
        </Button>
      </Form>
    </Page>
  );
};
export default MailingPage;
