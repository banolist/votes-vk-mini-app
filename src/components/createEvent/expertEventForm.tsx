import { Button } from "@kobalte/core/button";
import dayjs from "dayjs";
import {
  createEffect,
  createSignal,
  Setter,
  Show,
  type Component,
} from "solid-js";
import execute from "~/utils/execute";
import { z } from "zod";
import { TextField } from "~/components/form/TextField";
import { useMutation, useQueryClient } from "@tanstack/solid-query";
import { EventType } from "~/graphql/graphql";
import {
  createForm,
  zodForm,
  maxRange,
  reset,
  custom,
  setError,
} from "@modular-forms/solid";
import useTariffLimits from "~/hooks/useTariffLimits";
import { useCtx } from "./CreateEventModal";
import { eventsPageCreateRequestMutation } from "./api";
import { A } from "@solidjs/router";

const createSchema = z.object({
  // type: z.enum(["expert", "organizator"]),
  title: z.string().min(3, "минимум 3 символа"),
  promoWorld: z.string().min(2, "минимум 2 символа"),
  description: z.string().min(5, "минимум 5 символов"),
  startAt: z.string().min(1),
  duration: z.coerce.number().max(50),
  commentToListener: z.string().optional(),
});

type EventForm = typeof createSchema._type;

const ExpertCreateForm: Component = () => {
  const [errorText, setErrorText] = createSignal("");

  const [form, { Form, Field }] = createForm<EventForm>({
    validate: zodForm(createSchema),
    initialValues: {
      startAt: dayjs().format("YYYY-MM-DDTHH:mm"),
    },
  });
  const ctx = useCtx();
  const queryClient = useQueryClient();
  const tariffLimits = useTariffLimits();

  const mutation = useMutation(() => ({
    mutationKey: ctx.queryKey(),
    mutationFn: async (data: EventForm) => {
      if (
        data.duration >
        (tariffLimits.data?.tariffLimits.activeWordDurationHours || 1)
      ) {
        setErrorText("Проверьте форму");
        return;
      }
      await execute(eventsPageCreateRequestMutation, {
        event: {
          type: EventType.Expert,
          representativeForUser: ctx.representativeForUser,
          event: {
            description: data.description,
            duration:
              data.duration ||
              tariffLimits.data?.tariffLimits.activeWordDurationHours ||
              1,
            startAt: dayjs(data.startAt).format(),
            title: data.title,
            expert: {
              commentToListener: data.commentToListener,
              promoWord: data.promoWorld,
            },
          },
        },
      });
    },
    onError(error) {
      console.error("error submit form: ", error);
      if (error instanceof Error) {
        setErrorText(error.message);
      }
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ctx.queryKey(),
      });
      ctx.setOpenDialog(false);
    },
  }));

  return (
    <Show
      when={tariffLimits.data?.tariffLimits.eventsPerMonth}
      fallback={
        <div class="flex flex-col gap-1">
          <span>Лимит на создание мероприятий в месяц </span>
          <A class="btn btn-accent" href="/menu/tariffs">
            приобрести тариф
          </A>
        </div>
      }
    >
      <Form
        class="flex flex-col gap-2"
        onSubmit={(data) => mutation.mutate(data)}
      >
        <Field name="title">
          {(field, props) => (
            <TextField
              {...props}
              label="Название"
              value={field.value}
              error={field.error}
            />
          )}
        </Field>
        <Field name="description">
          {(field, props) => (
            <TextField
              {...props}
              label="Описание"
              value={field.value}
              error={field.error}
              multiline
            />
          )}
        </Field>
        <Field name="promoWorld">
          {(field, props) => (
            <TextField
              label="Промо слово"
              {...props}
              value={field.value}
              error={field.error}
              required
            />
          )}
        </Field>
        <Field name="startAt">
          {(field, props) => (
            <TextField
              {...props}
              label="Время начала мероприятия"
              type="datetime-local"
              value={field.value}
              error={field.error}
            />
          )}
        </Field>
        <Field
          name="duration"
          type="number"
          validateOn="change"
          validate={[
            custom(
              (value) =>
                value! <=
                (tariffLimits.data?.tariffLimits?.activeWordDurationHours || 1),
              "Максимум можно указать по тарифу",
            ),
          ]}
        >
          {(field, props) => (
            <TextField
              {...props}
              type="number"
              label="Длительность часов"
              value={field.value?.toString()}
              error={field.error}
            />
          )}
        </Field>
        <Field name="commentToListener">
          {(field, props) => (
            <TextField
              {...props}
              label="Комментарий для слушателя"
              description="Комментарий отображается после голоса слушателя"
              value={field.value}
              error={field.error}
              multiline
            />
          )}
        </Field>
        <Button type="submit" class="btn btn-accent" disabled={form.submitting}>
          {!form.submitting ? "Создать" : "Создание..."}
        </Button>
        <Show when={errorText()}>
          <div>{errorText()}</div>
        </Show>
      </Form>
    </Show>
  );
};

export default ExpertCreateForm;
