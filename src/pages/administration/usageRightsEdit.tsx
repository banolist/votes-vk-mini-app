import {
  createMutation,
  createQuery,
  useMutation,
  useQuery,
} from "@tanstack/solid-query";
import { createEffect, createSignal, Show, type Component } from "solid-js";
import { TextField } from "~/components/form/TextField";
import execute from "~/utils/execute";
import { usageRightsQuery } from "../Usage";
import Page from "~/components/ui/Page";
import { Button } from "@kobalte/core/button";
import { graphql } from "~/graphql";
import { query, useNavigate } from "@solidjs/router";
import { createForm, getValue, setValue } from "@modular-forms/solid";

const usageRightsMutation = graphql(`
  mutation usageRightWrite($text: String!) {
    platformRightsTextWrite(text: $text)
  }
`);

type UsageForm = {
  usage: string;
};

const UsageRightsEdit: Component = () => {
  const queryUsage = useQuery(() => ({
    queryKey: ["usageRightss"],
    queryFn: async () => {
      const rights = await execute(usageRightsQuery);
      return rights.platformRightsText;
    },
  }));

  const [form, { Form, Field }] = createForm<UsageForm>({
    initialValues: {
      usage: queryUsage.data,
    },
  });

  createEffect(() => {
    // const usage = getValue(form, "usage");
    if (queryUsage.isFetched) {
      setValue(form, "usage", queryUsage.data!);
    }
  });

  const handleSubmit = (data: UsageForm) => {
    if (!data) {
      return;
    }
    mutaion.mutate(data);
  };

  const navigate = useNavigate();

  const mutaion = useMutation(() => ({
    mutationKey: ["usageRights"],
    mutationFn: async (form: UsageForm) => {
      await execute(usageRightsMutation, {
        text: form.usage,
      });
    },
    onSuccess: () => {
      // navigate("../");
    },
  }));

  return (
    <Page title="Изменить страницу правила использования">
      <Show when={queryUsage.isFetched && queryUsage.data}>
        <Form onSubmit={handleSubmit}>
          <Field name="usage">
            {(field, props) => (
              <TextField
                {...props}
                value={field.value || queryUsage.data}
                class="w-96 min-h-96 max-w-2xl"
                required
                multiline
              />
            )}
          </Field>
          <Button
            type="submit"
            class="btn btn-primary mt-2 w-full"
            disabled={form.submitting}
          >
            Изменить
          </Button>
        </Form>
      </Show>
    </Page>
  );
};
export default UsageRightsEdit;
