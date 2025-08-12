import { createForm } from "@modular-forms/solid";
import { createSignal, Setter, type Component } from "solid-js";
import { eventsListQuery } from "~/api/events";
import DirectionsSelect from "~/components/ui/DirectionsSelect";
import EventCard from "~/components/ui/EventCard";
import { SelectField, SelectMultilineField } from "~/components/form/Select";
import Modal from "~/components/ui/Modal";
import Page from "~/components/ui/Page";
import RegionsSelect from "~/components/ui/RegionsSelect";
import { EventOrderField, OrderDirection } from "~/graphql/graphql";
import HeroiconsAdjustmentsHorizontal from "~icons/heroicons/adjustments-horizontal";
import createVirtualList from "~/hooks/createVirtualList";
import execute from "~/utils/execute";
import { Button } from "@kobalte/core/button";
import { useSearchParams } from "@solidjs/router";
import { graphql } from "~/graphql";
import { useQueryClient } from "@tanstack/solid-query";

const orderByOptions = [
  {
    label: "Дата создания",
    value: EventOrderField.CreatedAt,
  },
  {
    label: "Дата начала",
    value: EventOrderField.StartTime,
  },
];

type ListOptionsForm = {
  region?: string[];
  directions?: string[];
  orderBy: EventOrderField;
};

const EventsList: Component = () => {
  const [listOptions] = useSearchParams<ListOptionsForm>();
  const { List } = createVirtualList(() => ({
    queryKey: ["events", listOptions],
    queryFn: async ({ pageParam }) => {
      const options = listOptions;

      return (
        await execute(eventsListQuery, {
          first: 10,
          after: pageParam,
          filter:
            options.directions?.length || options.region?.length
              ? {
                  hasCreatorWith: [
                    {
                      hasExpertProfileWith: [
                        {
                          hasCommunityDirectionsWith: options.directions?.length
                            ? [
                                {
                                  idIn: options.directions,
                                },
                              ]
                            : undefined,
                          hasRegionWith: options.region?.length
                            ? [
                                {
                                  idIn: options.region,
                                },
                              ]
                            : undefined,
                        },
                      ],
                    },
                  ],
                }
              : undefined,
          orderBy: {
            field: options.orderBy || EventOrderField.CreatedAt,
            direction: OrderDirection.Desc,
          },
        })
      ).events;
    },
    estimateSize: 160,
    pageSize: 10,
  }));

  return (
    <Page title="СПИСОК МЕРОПРИЯТИЙ" titleElements={<FilterDialog />}>
      <List>
        {(v) => (
          <EventCard
            data={{
              type: v.type,
              title: v.title,
              createdAt: v.createdAt,
              duration: v.duration,
              description: v.description,
              startTime: v.startTime,
            }}
            link={`./${v.id}`}
          />
        )}
      </List>
    </Page>
  );
};
export default EventsList;

function fixFieldVaue(value: string[] | undefined) {
  if (value && value.length) {
    if (value.length > 1) {
      return value;
    }
    if (!value[0]) {
      return [];
    }
  }
  return value;
}

const FilterDialog: Component = () => {
  const [options, setOptions] = useSearchParams<ListOptionsForm>();
  const [, { Form, Field }] = createForm<ListOptionsForm>({
    initialValues: {
      directions: options.directions,
      orderBy: EventOrderField.CreatedAt,
      region: options.region,
    },
  });
  const [openModal, setOpenModal] = createSignal(false);

  const handleSubmit = (data: ListOptionsForm) => {
    setOptions(
      {
        orderBy: data.orderBy,
        directions: fixFieldVaue(data.directions),
        region: fixFieldVaue(data.region),
      },
      { replace: true },
    );
    setOpenModal(false);
  };
  return (
    <Modal
      title="Фильтр мероприятий"
      open={openModal()}
      class="btn bg-base-100 rounded-xl"
      triggerContent={<HeroiconsAdjustmentsHorizontal class="size-8" />}
      onOpenChange={setOpenModal}
    >
      <Form onSubmit={handleSubmit}>
        <Field name="orderBy">
          {(field, props) => (
            <SelectMultilineField
              {...props}
              value={field.value}
              error={field.error}
              optionTextValue="label"
              optionValue="value"
              options={orderByOptions}
            />
          )}
        </Field>
        <Field name="region" type="string[]">
          {(field, props) => (
            <RegionsSelect
              {...props}
              label="Регион"
              value={field.value?.toString()}
              error={field.error}
              checkbox
              multiple
            />
          )}
        </Field>
        <Field name="directions" type="string[]">
          {(field, props) => (
            <DirectionsSelect
              {...props}
              label="Направления"
              value={field.value}
              error={field.error}
              multiple
              checkbox
            />
          )}
        </Field>
        <Button type="submit" class="btn btn-accent mt-2 w-full max-w-md">
          Применить
        </Button>
      </Form>
    </Modal>
  );
};
