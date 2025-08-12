import { Component, createSignal, Show } from "solid-js";
import { z } from "zod";
import Modal from "./Modal";
import {
  createForm,
  FormStore,
  getValues,
  setValue,
  zodForm,
} from "@modular-forms/solid";
import { TextField } from "../form/TextField";
import CapchaInput from "./CapchaInput";
import { Button } from "@kobalte/core/button";
import { VoteType } from "~/graphql/graphql";

interface VoteDialogProps {
  myVote?: VoteType;
  onNewEvent: (data: VoteForm) => void;
  class?: string;
  triggerText?: string;
  title?: string;
  disabled?: boolean;
  error?: string;
}

const createSchema = z.object({
  voteType: z.enum(["positive", "negative", "delete"]),
  feedback: z.string().nonempty().max(512),
});

export type VoteForm = typeof createSchema._type;

const localeMyVote: Record<VoteType, string> = {
  delete: "Удален",
  negative: "Негативный",
  positive: "Позитивный",
};
const VoteDialog: Component<VoteDialogProps> = (props) => {
  const [form, { Form, Field }] = createForm<VoteForm>({
    validate: zodForm(createSchema),
  });
  const [open, setOpen] = createSignal(false);

  const handleClickSubmit = async (vote: VoteType) => {
    setValue(form, "voteType", vote as never);
    const v = getValues(form);
    props.onNewEvent({
      feedback: v.feedback!,
      voteType: vote,
    });
    setOpen(false);
  };
  return (
    <Modal
      open={open()}
      onOpenChange={setOpen}
      title={props.title || "Голосование"}
      triggerContent={props.triggerText || "Голосование"}
      class={props.class || "btn btn-accent"}
      triggerDisabled={props.disabled}
    >
      <Show when={props.myVote !== VoteType.Delete && props.myVote}>
        {(vote) => <span>Ваш голос: {localeMyVote[vote()]}</span>}
      </Show>
      <Form>
        <Field name="feedback">
          {(field, props) => (
            <TextField
              {...props}
              value={field.value}
              error={field.error}
              label="Отзыв"
              multiline
              required
            />
          )}
        </Field>
        <CapchaInput />
        <span>Вы доверяете эксперту?</span>
        <div class="flex w-full gap-1 mt-2">
          <VoteBtn
            form={form}
            handleSubmit={handleClickSubmit}
            voteBtnType={VoteType.Positive}
            myVote={props.myVote}
          />
          <VoteBtn
            form={form}
            handleSubmit={handleClickSubmit}
            voteBtnType={VoteType.Negative}
            myVote={props.myVote}
          />
          <VoteBtn
            form={form}
            handleSubmit={handleClickSubmit}
            voteBtnType={VoteType.Delete}
            myVote={props.myVote}
          />
        </div>
      </Form>
      <Show when={props.error}> {props.error}</Show>
    </Modal>
  );
};
export default VoteDialog;

const VoteBtn: Component<{
  myVote?: VoteType | undefined;
  handleSubmit: (vote: VoteType) => void;
  form: FormStore<VoteForm>;
  voteBtnType: VoteType;
}> = (props) => {
  return (
    <Show when={props.myVote !== props.voteBtnType}>
      <Button
        class="btn w-full flex-1"
        classList={{
          "btn-success": props.voteBtnType == VoteType.Positive,
          "btn-error": props.voteBtnType == VoteType.Negative,
          "btn-warning": props.voteBtnType == VoteType.Delete,
        }}
        onClick={() => props.handleSubmit(props.voteBtnType)}
        disabled={props.form.submitting}
      >
        {props.voteBtnType == VoteType.Positive
          ? "Да"
          : props.voteBtnType == VoteType.Negative
            ? "Нет"
            : "Удалить голос"}
      </Button>
    </Show>
  );
};
