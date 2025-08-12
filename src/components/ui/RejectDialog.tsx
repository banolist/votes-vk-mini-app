import { createForm, zodForm } from "@modular-forms/solid";
import { z } from "zod";
import Modal from "./Modal";
import { TextField } from "../form/TextField";
import { Button } from "@kobalte/core/button";
import { Show } from "solid-js";

const rejectSchema = z.object({
  reason: z.string().min(5),
});

export type RejectForm = typeof rejectSchema._type;

export default function RejectDialog(props: {
  handleSubmit: (data: RejectForm) => void;
  error?: Error | null;
}) {
  const [form, { Form, Field }] = createForm<RejectForm>({
    validate: zodForm(rejectSchema),
  });
  return (
    <Modal
      title="Отклонить заявку"
      triggerContent="Отклонить"
      class="btn btn-error"
    >
      <Form onSubmit={props.handleSubmit} class="flex flex-col gap-2">
        <Field name="reason">
          {(field, props) => (
            <TextField
              {...props}
              label="Причина"
              value={field.value}
              error={field.error}
              multiline
            />
          )}
        </Field>
        <Show when={props.error}>{props.error?.message}</Show>
        <Button type="submit" class="btn btn-primary">
          Подтвердить
        </Button>
      </Form>
    </Modal>
  );
}
