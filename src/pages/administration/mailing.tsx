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
  targetRoles: z
    .array(z.enum(["verified", "expert", "organizator", "users", "preExpert"]))
    .optional(),
  targetDirections: z.array(z.string()).optional(),
  targetRegions: z.array(z.string()).optional(),
  targetExpertAuditory: z.array(z.string()).optional(),
  title: z.string(),
  message: z.string(),
});

type MailingForm = typeof mailingSchema._type;

const MailingAdminPage: Component = () => {
  const [form, { Form, Field }] = createForm<MailingForm>({
    initialValues: {
      targetRoles: [],
      targetDirections: [],
      targetRegions: [],
      targetExpertAuditory: [],
    },
    validate: zodForm(mailingSchema),
  });
  const navigate = useNavigate();

  const mutation = useMutation(() => ({
    mutationKey: ["sendAdminMailing"],
    mutationFn: async (data: MailingForm) => {
      const rights =
        data.targetRoles?.map((r) => {
          if (r === "expert") {
            return UserRights.Expert;
          } else if (r === "organizator") {
            return UserRights.Organizator;
          } else if (r === "verified") {
            return UserRights.Verified;
          } else if (r === "users") {
            return UserRights.User;
          } else if (r === "preExpert") {
            return UserRights.PreExpert;
          }
        }) || [];
      let calcRights = 0;
      rights.forEach((element) => {
        if (!element) {
          return;
        }
        calcRights |= element;
      });
      await execute(mailingAdminMutation, {
        data: {
          message: data.message,
          title: data.title,
          level: NotificationLevel.Info,
          targetRights: calcRights,
          regionTargetIDs: fixFieldValue(data.targetRegions),
          directionTargetIDs: fixFieldValue(data.targetDirections),
        },
      });
    },
    onSuccess: () => {
      navigate("../");
    },
  }));

  return (
    <Page title="Рассылка">
      <Form onSubmit={(data) => mutation.mutate(data)}>
        <Field name="targetRoles" type="string[]">
          {(field, props) => (
            <SelectMultilineField<OptionSelect>
              {...props}
              value={field.value}
              error={field.error}
              label="Таргет ролей"
              optionTextValue="label"
              optionValue="value"
              options={targetOptions}
              multiple
            />
          )}
        </Field>
        <Field name="targetDirections" type="string[]">
          {(field, props) => (
            <DirectionsSelect
              {...props}
              label="Таргет направлений"
              value={field.value}
              error={field.error}
              multiple
            />
          )}
        </Field>
        <Field name="targetRegions" type="string[]">
          {(field, props) => (
            <RegionsSelect
              {...props}
              label="Таргет регионов"
              value={field.value}
              error={field.error}
              multiple
            />
          )}
        </Field>
        <div class="text-sm font-light text-tx-secondary">
          Если не установить таргет, уведомление придет всем
        </div>
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
          class="btn btn-accent w-full mt-2"
          disabled={form.submitting}
        >
          {form.submitting ? "Отправка..." : "Отправить"}
        </Button>
      </Form>
    </Page>
  );
};
export default MailingAdminPage;
