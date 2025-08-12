import { Button } from "@kobalte/core/button";
import dayjs from "dayjs";
import { Show, type Component } from "solid-js";
import execute from "~/utils/execute";
import { z } from "zod";
import { TextField } from "~/components/form/TextField";
import { useMutation, useQueryClient } from "@tanstack/solid-query";
import {
  EventType,
  OrganizatorEventFeeType,
  OrganizatorEventVerificationMode,
} from "~/graphql/graphql";
import { SelectMultilineField } from "~/components/form/Select";
import {
  createForm,
  SubmitHandler,
  zodForm,
  getValue,
} from "@modular-forms/solid";
import DirectionsSelect from "~/components/ui/DirectionsSelect";
import { Checkbox } from "~/components/form/Checkbox";
import RegionsSelect from "~/components/ui/RegionsSelect";
import { useCtx } from "./CreateEventModal";
import { eventsPageCreateRequestMutation } from "./api";
import { fixFieldValue, toHttps } from "~/utils/form";

const createOrganizatorEventSchema = z.object({
  title: z.string().min(3, "минимум 3 символа"),
  description: z.string().min(3, "минимум 3 символа"),
  link: z.string().url().optional(),
  topic: z.string().min(5, "минимум 5 символов"),
  targetAudience: z.array(z.string()),
  startAt: z.string(),
  duration: z.number(),
  transferPaid: z.boolean(),
  placeOnline: z.boolean(),
  place: z.string().optional(),
  speakerBenefits: z.string().max(200, "Максимум 200 символов"),
  feeType: z.enum([
    OrganizatorEventFeeType.Free,
    OrganizatorEventFeeType.Paid,
    OrganizatorEventFeeType.Negotiable,
  ]),
  verificationMode: z.enum([
    OrganizatorEventVerificationMode.All,
    OrganizatorEventVerificationMode.VerifiedOnly,
  ]),
  // targetAudience: z.string(),
});

type OrganizatorEventForm = typeof createOrganizatorEventSchema._type;

const OrganizatorCreateForm: Component = () => {
  const ctx = useCtx();
  const [eventForm, { Form, Field }] = createForm<OrganizatorEventForm>({
    validate: zodForm(createOrganizatorEventSchema),
    initialValues: {
      startAt: dayjs().format("YYYY-MM-DDTHH:mm"),
      feeType: OrganizatorEventFeeType.Paid,
      verificationMode: OrganizatorEventVerificationMode.All,
      placeOnline: true,
    },
  });
  const queryClient = useQueryClient();
  const mutation = useMutation(() => ({
    mutationKey: ctx.queryKey(),
    mutationFn: async (data: OrganizatorEventForm) => {
      await execute(eventsPageCreateRequestMutation, {
        event: {
          type: EventType.Organizer,
          representativeForUser: ctx.representativeForUser,
          event: {
            description: data.description,
            duration: data.duration,
            startAt: dayjs(data.startAt).format(),
            title: data.title,
            organizator: {
              feeType: data.feeType,
              speakerBenefits: data.speakerBenefits,
              topic: data.topic,
              transferPaid: data.transferPaid,
              verificationMode: data.verificationMode,
              place: data.place,
              targetAudience: fixFieldValue(data.targetAudience),
            },
          },
        },
      });
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["myEventRequests"],
      });
      ctx.setOpenDialog(false);
    },
  }));

  const handleSubmit: SubmitHandler<OrganizatorEventForm> = (values) => {
    mutation.mutate(values);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Field name="title">
        {(field, props) => (
          <TextField
            {...props}
            label="Название"
            value={field.value}
            error={field.error}
            required
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
            required
          />
        )}
      </Field>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <Field name="link" transform={toHttps() as any}>
        {(field, props) => (
          <TextField
            {...props}
            label="Ссылка на мероприятие"
            value={field.value}
            error={field.error}
          />
        )}
      </Field>
      <Field name="topic">
        {(field, props) => (
          <TextField
            {...props}
            label="Тема мероприятия"
            value={field.value}
            error={field.error}
          />
        )}
      </Field>
      <Field name="feeType">
        {(field, props) => (
          <SelectMultilineField
            {...props}
            label="Тип гонорара"
            value={field.value}
            error={field.error}
            optionTextValue="label"
            optionValue="value"
            options={feeTypeOptions}
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
      <Field name="duration" type="number">
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

      <Field name="targetAudience" type="string[]">
        {(field, props) => (
          <DirectionsSelect
            {...props}
            label="Направления эксперта"
            value={field.value}
            error={field.error}
            checkbox
            multiple
          />
        )}
      </Field>
      <Field name="transferPaid" type="boolean">
        {(field, props) => (
          <Checkbox
            {...props}
            label="Оплата трансфера"
            error={field.error}
            checked={field.value}
            description="Оплачивается ли трансфер до места проведения?"
            required
          />
        )}
      </Field>
      <Field name="speakerBenefits">
        {(field, props) => (
          <TextField
            {...props}
            label="Вознаграждение спикеров"
            value={field.value}
            error={field.error}
            description="дополнительные бонусы для спикеров"
          />
        )}
      </Field>
      <Field name="verificationMode">
        {(field, props) => (
          <SelectMultilineField
            {...props}
            label="Тип верификации"
            value={field.value}
            error={field.error}
            optionTextValue="label"
            optionValue="value"
            required
            options={verificationModeOptions}
          />
        )}
      </Field>
      <Field name="placeOnline" type="boolean">
        {(field, props) => (
          <Checkbox
            {...props}
            label="Онлайн мероприятие"
            error={field.error}
            checked={field.value}
            required
          />
        )}
      </Field>
      <Field name="place" type="string">
        {(field, props) => (
          <RegionsSelect
            {...props}
            label="Место проведения"
            value={field.value?.toString()}
            error={field.error}
            disabled={getValue(eventForm, "placeOnline")}
          />
        )}
      </Field>
      <Show when={mutation.isError}>
        <div class="text-error font-light">{mutation.error?.message}</div>
      </Show>
      <Button type="submit" class="btn btn-accent w-full mt-2">
        {!eventForm.submitting ? "Создать" : "Создание..."}
      </Button>
    </Form>
  );
};

export default OrganizatorCreateForm;

const feeTypeOptions = [
  {
    label: "Оплачивается",
    value: OrganizatorEventFeeType.Paid,
  },
  {
    label: "Не оплачивается",
    value: OrganizatorEventFeeType.Free,
  },
  {
    label: "По договоренности",
    value: OrganizatorEventFeeType.Negotiable,
  },
];
const verificationModeOptions = [
  {
    label: "Для всех",
    value: OrganizatorEventVerificationMode.All,
  },
  {
    label: "Только верифицированные",
    value: OrganizatorEventVerificationMode.VerifiedOnly,
  },
];
