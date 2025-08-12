import dayjs from "dayjs";
import { createSignal, Show, type Component } from "solid-js";
import EventCard from "~/components/ui/EventCard";
import { StatField } from "~/components/ui/StatFields";
import execute from "~/utils/execute";
import Page from "~/components/ui/Page";
import createVirtualList from "~/hooks/createVirtualList";
import useTariffLimits from "~/hooks/useTariffLimits";
import CreateEventModal from "~/components/createEvent/CreateEventModal";
import Modal from "~/components/ui/Modal";
import { createForm } from "@modular-forms/solid";
import { SelectMultilineField } from "~/components/form/Select";
import { Button } from "@kobalte/core/button";
import HeroiconsChevronUpDownSolid from "~icons/heroicons/chevron-up-down-solid";
import { EventType } from "~/graphql/graphql";
import { profileEventsQuery } from "~/api/events";

const Events: Component = () => {
  const [selectedEventTypes, setSelectedEventTypes] = createSignal<FilterForm>(
    {},
  );

  const queryKey = () => ["myEventRequests", selectedEventTypes()];

  const { List } = createVirtualList(() => ({
    queryKey: queryKey(),
    queryFn: async ({ pageParam }) =>
      (
        await execute(profileEventsQuery, {
          first: 10,
          after: pageParam,
          where: selectedEventTypes().eventType
            ? {
                hasEventWith: [
                  {
                    type: selectedEventTypes().eventType,
                  },
                ],
              }
            : undefined,
        })
      ).myEventRequests,
    estimateSize: 195,
    pageSize: 10,
    noContentText: "Пока нет мероприятий",
  }));
  const tariffLimits = useTariffLimits();

  return (
    <Page
      title="мои мероприятия"
      titleElements={<FilterDialog onSubmit={setSelectedEventTypes} />}
    >
      <Show when={tariffLimits.data?.tariffLimits}>
        {(tariff) => (
          <div>
            <StatField
              text="Осталось по тарифу в этом месяце"
              value={tariff().eventsPerMonth}
            />
            <div class="flex items-center gap-1">
              <StatField
                text="Макс. срок активности промослова"
                value={tariff().activeWordDurationHours}
              />
              час.
            </div>
            <CreateEventModal
              queryKey={queryKey}
              tariffLimits={tariffLimits.data?.tariffLimits}
            />
          </div>
        )}
      </Show>
      <List fallback={<div class="skeleton w-full h-[290]" />}>
        {(event) => {
          return (
            <EventCard
              data={{
                id: event.id,
                type: event.event.type,
                title: event.event.title,
                createdAt: dayjs(event.createdAt),
                startTime: dayjs(event.event?.startTime),
                duration: event.event?.duration,
                status: event.status,
                description: event.event?.description,
              }}
              link={`/events/${event.event.id}`}
            />
          );
        }}
      </List>
    </Page>
  );
};
export default Events;

type FilterForm = {
  eventType?: EventType;
};

const FilterDialog: Component<{
  onSubmit: (data: FilterForm) => void;
}> = (props) => {
  const [, { Form, Field }] = createForm<FilterForm>();
  return (
    <Modal
      title="Фильтры"
      triggerContent={<HeroiconsChevronUpDownSolid class="size-8" />}
      class="btn bg-base-100 rounded-xl"
    >
      <Form onSubmit={props.onSubmit}>
        <Field name="eventType">
          {(field, props) => (
            <SelectMultilineField
              {...props}
              value={field.value}
              error={field.error}
              optionValue="value"
              optionTextValue="label"
              options={[
                { label: "Организатор", value: EventType.Organizer },
                { label: "Эксперт", value: EventType.Expert },
                {
                  label: "Представительство организатора",
                  value: EventType.Children,
                },
              ]}
              withChekbox
            />
          )}
        </Field>
        <Button type="submit" class="btn btn-accent w-full mt-2">
          Применить
        </Button>
      </Form>
    </Modal>
  );
};
