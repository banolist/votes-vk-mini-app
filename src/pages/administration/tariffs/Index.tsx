import { Button } from "@kobalte/core/button";
import { createForm, reset, setResponse, zodForm } from "@modular-forms/solid";
import { useMutation, useQuery, useQueryClient } from "@tanstack/solid-query";
import {
  createEffect,
  createSignal,
  For,
  Match,
  Show,
  Switch,
  type Component,
} from "solid-js";
import { number, z } from "zod";
import { tariffsControlListQuery, tariffUpdateMutation } from "~/api/tariffs";
import Card from "~/components/ui/Card";
import { TextField } from "~/components/form/TextField";
import Modal from "~/components/ui/Modal";
import Page from "~/components/ui/Page";
import execute from "~/utils/execute";

const TariffListPage: Component = () => {
  const queryClient = useQueryClient();
  const queryTariffs = useQuery(() => ({
    queryKey: ["tariffsControl"],
    queryFn: async () => (await execute(tariffsControlListQuery)).tariffs,
  }));
  const mutationToggle = useMutation(() => ({
    mutationKey: ["tariffToggle"],
    mutationFn: async (data: { id: string; nowIsActive: boolean }) =>
      await execute(tariffUpdateMutation, {
        id: data.id,
        data: { active: !data.nowIsActive },
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["tariffsControl"],
      }),
  }));

  return (
    <Page title="Управление тарифами">
      <Switch>
        <Match when={queryTariffs.isLoading}>Загрузка...</Match>
        <Match when={queryTariffs.isError}>{queryTariffs.error?.message}</Match>
        <Match when={queryTariffs.isFetched && queryTariffs.data}>
          {(data) => (
            <For each={data()}>
              {(tariff) => (
                <Card
                  title={<span class="text-2xl">{tariff.title}</span>}
                  endTitle={
                    <div class="flex space-x-1">
                      <Button
                        class="btn btn-info"
                        disabled={mutationToggle.isPending}
                        onClick={() =>
                          mutationToggle.mutate({
                            id: tariff.id,
                            nowIsActive: tariff.active,
                          })
                        }
                      >
                        {tariff.active ? "Выкючить" : "Включить"}
                      </Button>
                      <EditTariffModal initialValues={tariff} />
                    </div>
                  }
                >
                  <div class="flex flex-col">
                    <span>
                      Статус:{" "}
                      <span
                        class="status"
                        classList={{
                          "status-success": tariff.active,
                          "status-error": !tariff.active,
                        }}
                      />{" "}
                    </span>
                    <strong>Эксперт</strong>
                    <span>
                      Мероприятий в месяц{" "}
                      <DisplayValue value={tariff.eventsPerMonth} />
                    </span>
                    <span>
                      Вступления в проф. сообщества:{" "}
                      <DisplayValue
                        value={tariff.joinProfessionalCommunities}
                      />
                    </span>
                    <span>
                      Рассылка в месяц{" "}
                      <DisplayValue value={tariff.mailingPerMonth} />
                    </span>
                    <span>
                      Количество экспертов на мероприятие{" "}
                      <DisplayValue
                        value={tariff.numberExpertsManagedByOneRepresentative}
                      />
                    </span>
                    <span>
                      Длительность слова{" "}
                      <DisplayValue value={tariff.activeWordDurationHours} />
                    </span>
                    <strong>Организатор</strong>
                    <span>
                      Кол-во экспертов на мероприятии{" "}
                      <DisplayValue value={tariff.organizerExpertsOnEvent} />
                    </span>
                    <span>
                      Цена платной рассылки по экспертам{" "}
                      <DisplayValue
                        value={tariff.organizerFeeEventMailingPriceExpert}
                      />
                    </span>
                    <span>
                      Цена рассылки приглашений организаторам{" "}
                      <DisplayValue
                        value={tariff.organizerInviteMailingPriceExpert}
                      />
                    </span>
                    <span>
                      Кол-во мероприятий в месяц:{" "}
                      <DisplayValue value={tariff.organizerPerEvent} />
                    </span>
                    <span>
                      Цена запроса информации об эксперте{" "}
                      <DisplayValue
                        value={tariff.organizerRequestExpertAboutPrice}
                      />
                    </span>
                    <strong>Раферал</strong>
                    <span>
                      Бонус <DisplayValue value={tariff.referralBonus} />
                    </span>
                    <span>
                      Цена <DisplayValue value={tariff.referralPrice} />
                    </span>
                    <span>
                      Кол-во экспертов в созданном сообществе{" "}
                      <DisplayValue
                        value={tariff.countExpertsInCreateCommunity}
                      />
                    </span>
                    <span>
                      Кол-во проф сообществ{" "}
                      <DisplayValue
                        value={tariff.createProfessionalCommunities}
                      />
                    </span>{" "}
                    <strong>Цена {tariff.price}</strong>
                  </div>{" "}
                </Card>
              )}
            </For>
          )}
        </Match>
      </Switch>
    </Page>
  );
};

const DisplayValue: Component<{ value: number }> = (props) => (
  <span>{props.value === -1 ? "∞" : props.value}</span>
);

export default TariffListPage;

const TariffSchema = z.object({
  title: z.string(),
  joinProfessionalCommunities: z.number(),
  mailingPerMonth: z.number(),
  numberExpertsManagedByOneRepresentative: z.number(),
  organizerExpertsOnEvent: z.number(),
  organizerFeeEventMailingPriceExpert: z.number(),
  organizerInviteMailingPriceExpert: z.number(),
  organizerPerEvent: z.number(),
  organizerRequestExpertAboutPrice: z.number(),
  paidEventResponsesPerMonth: z.number(),
  paidRequestPublicationPrice: z.number(),
  activeWordDurationHours: z.number(),
  price: z.number(),
  referralBonus: z.number(),
  referralPrice: z.number(),
  votesPerEvent: z.number(),
  countExpertsInCreateCommunity: z.number(),
  createProfessionalCommunities: z.number(),
  eventsPerMonth: z.number(),
});

type TariffForm = typeof TariffSchema._type;
const EditTariffModal: Component<{
  initialValues: TariffForm & { id?: string };
}> = (props) => {
  const [open, setOpen] = createSignal(false);
  const [form, { Form, Field }] = createForm<TariffForm>({
    validate: zodForm(TariffSchema),
  });

  createEffect(() => {
    reset(form, {
      initialValues: props.initialValues,
    });
  });
  const queryClient = useQueryClient();
  const mutate = useMutation(() => ({
    mutationKey: ["tariff"],
    mutationFn: async (data: TariffForm) => {
      // update
      if (props.initialValues.id) {
        await execute(tariffUpdateMutation, {
          id: props.initialValues.id,
          data,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tariffsControl"] });
      setOpen(false);
      reset(form);
    },
    onError: (err) =>
      setResponse(form, {
        status: "error",
        message: err.message,
      }),
  }));
  return (
    <Modal
      title="Редактировать тариф"
      triggerContent={"Редактировать"}
      class="btn btn-secondary"
      open={open()}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (isOpen)
          reset(form, {
            initialValues: props.initialValues,
          });
      }}
    >
      <Form onSubmit={(v) => mutate.mutate(v)}>
        <div class="flex flex-col gap-4 max-h-[70vh] overflow-y-auto p-1">
          {/* Общие поля */}
          <div class="md:col-span-2">
            <Field name="title">
              {(field, props) => (
                <TextField
                  {...props}
                  value={field.value}
                  error={field.error}
                  label="Название тарифа"
                  required
                />
              )}
            </Field>
          </div>

          <div class="md:col-span-2">
            <Field name="price" type="number">
              {(field, props) => (
                <TextField
                  {...props}
                  value={field.value?.toString()}
                  error={field.error}
                  type="number"
                  label="Цена тарифа"
                  required
                />
              )}
            </Field>
          </div>

          {/* Секция: Эксперт */}
          <div class="md:col-span-2 font-bold mt-4 text-lg">Эксперт</div>

          <Field name="eventsPerMonth" type="number">
            {(field, props) => (
              <TextField
                {...props}
                value={field.value?.toString()}
                error={field.error}
                type="number"
                label="Мероприятий в месяц"
                required
              />
            )}
          </Field>

          <Field name="joinProfessionalCommunities" type="number">
            {(field, props) => (
              <TextField
                {...props}
                value={field.value?.toString()}
                error={field.error}
                type="number"
                label="Вступлений в проф. сообщества"
                required
              />
            )}
          </Field>

          <Field name="mailingPerMonth" type="number">
            {(field, props) => (
              <TextField
                {...props}
                value={field.value?.toString()}
                error={field.error}
                type="number"
                label="Рассылок в месяц"
                required
              />
            )}
          </Field>

          <Field name="numberExpertsManagedByOneRepresentative" type="number">
            {(field, props) => (
              <TextField
                {...props}
                value={field.value?.toString()}
                error={field.error}
                type="number"
                label="Экспертов на представителя"
                required
              />
            )}
          </Field>

          <Field name="activeWordDurationHours" type="number">
            {(field, props) => (
              <TextField
                {...props}
                value={field.value?.toString()}
                error={field.error}
                type="number"
                label="Длительность слова (часы)"
                required
              />
            )}
          </Field>

          <Field name="votesPerEvent" type="number">
            {(field, props) => (
              <TextField
                {...props}
                value={field.value?.toString()}
                error={field.error}
                type="number"
                label="Голосов на мероприятие"
                required
              />
            )}
          </Field>

          {/* Секция: Организатор */}
          <div class="md:col-span-2 font-bold mt-4 text-lg">Организатор</div>

          <Field name="organizerExpertsOnEvent" type="number">
            {(field, props) => (
              <TextField
                {...props}
                value={field.value?.toString()}
                error={field.error}
                type="number"
                label="Экспертов на мероприятии"
                required
              />
            )}
          </Field>

          <Field name="organizerPerEvent" type="number">
            {(field, props) => (
              <TextField
                {...props}
                value={field.value?.toString()}
                error={field.error}
                type="number"
                label="Мероприятий в месяц"
                required
              />
            )}
          </Field>

          <Field name="organizerFeeEventMailingPriceExpert" type="number">
            {(field, props) => (
              <TextField
                {...props}
                value={field.value?.toString()}
                error={field.error}
                type="number"
                label="Цена платной рассылки по экспертам"
                required
              />
            )}
          </Field>

          <Field name="organizerInviteMailingPriceExpert" type="number">
            {(field, props) => (
              <TextField
                {...props}
                value={field.value?.toString()}
                error={field.error}
                type="number"
                label="Цена рассылки приглашений"
                required
              />
            )}
          </Field>

          <Field name="organizerRequestExpertAboutPrice" type="number">
            {(field, props) => (
              <TextField
                {...props}
                value={field.value?.toString()}
                error={field.error}
                type="number"
                label="Цена запроса об эксперте"
                required
              />
            )}
          </Field>

          <Field name="paidEventResponsesPerMonth" type="number">
            {(field, props) => (
              <TextField
                {...props}
                value={field.value?.toString()}
                error={field.error}
                type="number"
                label="Платных откликов в месяц"
                required
              />
            )}
          </Field>

          <Field name="paidRequestPublicationPrice" type="number">
            {(field, props) => (
              <TextField
                {...props}
                value={field.value?.toString()}
                error={field.error}
                type="number"
                label="Цена платной публикации запроса"
                required
              />
            )}
          </Field>

          {/* Секция: Реферальная система */}
          <div class="md:col-span-2 font-bold mt-4 text-lg">
            Реферальная система
          </div>

          <Field name="referralBonus" type="number">
            {(field, props) => (
              <TextField
                {...props}
                value={field.value?.toString()}
                error={field.error}
                type="number"
                label="Реферальный бонус"
                required
              />
            )}
          </Field>

          <Field name="referralPrice" type="number">
            {(field, props) => (
              <TextField
                {...props}
                value={field.value?.toString()}
                error={field.error}
                type="number"
                label="Реферальная цена"
                required
              />
            )}
          </Field>

          {/* Секция: Проф. сообщества */}
          <div class="md:col-span-2 font-bold mt-4 text-lg">
            Проф. сообщества
          </div>

          <Field name="countExpertsInCreateCommunity" type="number">
            {(field, props) => (
              <TextField
                {...props}
                value={field.value?.toString()}
                error={field.error}
                type="number"
                label="Экспертов в сообществе"
                required
              />
            )}
          </Field>

          <Field name="createProfessionalCommunities" type="number">
            {(field, props) => (
              <TextField
                {...props}
                value={field.value?.toString()}
                error={field.error}
                type="number"
                label="Создаваемых сообществ"
                required
              />
            )}
          </Field>
        </div>
        <Show when={form.response.status == "error"}>
          <div class="text-error">{form.response.message}</div>
        </Show>
        <Button
          type="submit"
          class={"btn btn-secondary"}
          disabled={form.submitting}
        >
          Сохранить
        </Button>
      </Form>
    </Modal>
  );
};
