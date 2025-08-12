import { Button } from "@kobalte/core/button";
import { createForm, setValues, zodForm } from "@modular-forms/solid";
import { useMutation, useQueryClient } from "@tanstack/solid-query";
import dayjs from "dayjs";
import {
  createEffect,
  createResource,
  createSignal,
  For,
  Match,
  Show,
  Switch,
  type Component,
} from "solid-js";
import { z } from "zod";
import { promocodesListQuery } from "~/api/promocodes";
import Card from "~/components/ui/Card";
import { TextField } from "~/components/form/TextField";
import Modal from "~/components/ui/Modal";
import Page from "~/components/ui/Page";
import { StatField } from "~/components/ui/StatFields";
import TariffSelect from "~/components/ui/TariffSelect";
import { graphql } from "~/graphql";
import createVirtualList from "~/hooks/createVirtualList";
import execute from "~/utils/execute";
import { TIME_INPUT_FORMAT, timeNow } from "~/utils/time";

const PromocodePage: Component = () => {
  const { List } = createVirtualList(() => ({
    queryFn: async ({ pageParam }) =>
      (await execute(promocodesListQuery, { first: 25, after: pageParam }))
        .promocodes,
    estimateSize: 100,
    pageSize: 25,
    queryKey: ["promocodes"],
    noContentText: "Нет промокодов",
  }));
  return (
    <Page title="промокоды" titleElements={<ModalCreate />}>
      <List>
        {(item) => (
          <Card
            title={item.code}
            class=""
            endTitle={
              <span>Создан: {dayjs(item.createdAt).format("lll")}</span>
            }
          >
            <span class="flex gap-1 items-center">
              Статус:{" "}
              <span
                class="status"
                classList={{
                  "status-success": item.active,
                  "status-error": !item.active,
                }}
              />
              <span>{item.active ? "Активен" : "Не активен"}</span>
            </span>
            <span>Начало действия: {dayjs(item.startAt).format("lll")}</span>
            <span>Конец действия: {dayjs(item.endAt).format("lll")}</span>
            <span>
              Активаций: {item.activatedCount}/{item.maxCountActivations}
            </span>
            <span>
              Активаций на пользователя: {item.maxUserCountActivations}
            </span>
          </Card>
        )}
      </List>
    </Page>
  );
};

export default PromocodePage;

const createPromocodeQuery = graphql(`
  mutation createPromocode($data: CreatePromocodeInput!) {
    createPromocode(data: $data) {
      id
      maxUserCountActivations
      startAt
      tariffs {
        id
        title
      }
      code
      createdAt
      discount
      endAt
      activatedCount
      maxCountActivations
      maxMouthSubscriptionDuration
    }
  }
`);

const createPromocodeSchema = z.object({
  code: z.string(),
  startAt: z.string(),
  endAt: z.string(),
  maxUserCountActivations: z.number().default(1),
  maxMouthSubscriptionDuration: z.number().default(1),
  discount: z.number().default(100),
  maxCountActivations: z.number().default(10),
  tariffIDs: z.array(z.string()).optional(),
});

type CreatePromocodeForm = typeof createPromocodeSchema._type;

const ModalCreate: Component<{
  defValue?: CreatePromocodeForm;
}> = (props) => {
  const [openModal, setOpenModal] = createSignal(false);
  const [form, { Form, Field }] = createForm<CreatePromocodeForm>({
    validate: zodForm(createPromocodeSchema),
    // eslint-disable-next-line solid/reactivity
    initialValues: props.defValue || {
      discount: 10,
      maxCountActivations: 1000,
      maxMouthSubscriptionDuration: 1,
      maxUserCountActivations: 1,
      startAt: timeNow(),
      endAt: dayjs().add(7, "day").format(TIME_INPUT_FORMAT),
    },
  });

  createEffect(() => {
    if (props.defValue) {
      setValues(form, props.defValue);
    }
  });
  const queryClient = useQueryClient();

  const mutate = useMutation(() => ({
    mutationKey: ["createPromocode"],
    mutationFn: async (i: CreatePromocodeForm) => {
      const resp = await execute(createPromocodeQuery, {
        data: {
          ...i,
          startAt: dayjs(i.startAt).format(),
          endAt: dayjs(i.endAt).format(),
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        exact: true,
        queryKey: ["promocodes"],
      });
      setOpenModal(false);
    },
  }));

  return (
    <>
      <Modal
        triggerContent="Создать промокод"
        class="btn btn-accent"
        title="Создать промокод"
        open={openModal()}
        onOpenChange={setOpenModal}
      >
        <Form
          onSubmit={(data) => mutate.mutate(data)}
          class="flex flex-col gap-1"
        >
          <Field name="code">
            {(field, props) => (
              <TextField
                {...props}
                label="Промокод"
                value={field.value}
                error={field.error}
              />
            )}
          </Field>
          <Field name="startAt">
            {(field, props) => (
              <TextField
                {...props}
                type="datetime-local"
                label="Дата начала"
                value={field.value}
                error={field.error}
              />
            )}
          </Field>
          <Field name="endAt">
            {(field, props) => (
              <TextField
                {...props}
                type="datetime-local"
                label="Дата конца"
                value={field.value}
                error={field.error}
              />
            )}
          </Field>
          <Field name="discount" type="number">
            {(field, props) => (
              <TextField
                {...props}
                type="number"
                label="Процент скидки"
                value={field.value?.toString()}
                error={field.error}
              />
            )}
          </Field>
          <Field name="maxCountActivations" type="number">
            {(field, props) => (
              <TextField
                {...props}
                type="number"
                label="Максимум активаций"
                value={field.value?.toString()}
                error={field.error}
              />
            )}
          </Field>
          <Field name="maxMouthSubscriptionDuration" type="number">
            {(field, props) => (
              <TextField
                {...props}
                type="number"
                label="месяцы для покупки"
                value={field.value?.toString()}
                error={field.error}
              />
            )}
          </Field>
          <Field name="maxUserCountActivations" type="number">
            {(field, props) => (
              <TextField
                {...props}
                type="number"
                label="Максимум активаций на пользователя"
                value={field.value?.toString()}
                error={field.error}
              />
            )}
          </Field>
          <Field name="tariffIDs" type="string[]">
            {(field, props) => (
              <TariffSelect
                {...props}
                label="Тарифы"
                value={field.value?.toString()}
                error={field.error}
                multiple
              />
            )}
          </Field>
          <Show when={mutate.isError}>{mutate.error?.message}</Show>
          <Button
            type="submit"
            class="btn btn-primary"
            disabled={form.submitting}
          >
            Создать
          </Button>
        </Form>
      </Modal>
    </>
  );
};
