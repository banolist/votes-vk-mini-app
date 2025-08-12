import {
  createEffect,
  createMemo,
  createSignal,
  For,
  Match,
  Setter,
  Show,
  Switch,
  type Component,
} from "solid-js";
import ExpertCard from "~/components/ui/ExpertCard";
import { graphql } from "~/graphql";
import execute from "~/utils/execute";
import HeroiconsChevronUpDownSolid from "~icons/heroicons/chevron-up-down-solid";
import { Button } from "@kobalte/core/button";
import { createQuery } from "@tanstack/solid-query";
import Page from "~/components/ui/Page";
import Modal from "~/components/ui/Modal";
import RegionsSelect from "~/components/ui/RegionsSelect";
import { createForm, setValues } from "@modular-forms/solid";
import DirectionsSelect from "~/components/ui/DirectionsSelect";
import createVirtualList from "~/hooks/createVirtualList";
import HeroiconsAdjustmentsHorizontal from "~icons/heroicons/adjustments-horizontal";
import { useSearchParams } from "@solidjs/router";
import { normalizeParam } from "~/utils/params";
import { getScreenSize } from "~/utils/screen";
const expertListQuery = graphql(`
  query expertList(
    $first: Int!
    $after: Cursor
    $filter: ExpertProfileWhereInput!
  ) {
    expertProfiles(first: $first, after: $after, where: $filter) {
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      totalCount
      edges {
        cursor
        node {
          peopleVotesCount
          votesCount
          countEvents
          id
          user {
            firstName
            lastName
            avatar
            rights
          }
          about
          region {
            regionName
          }
          communityDirections {
            direction
            name
          }
        }
      }
    }
  }
`);

function fixFieldValue<TValue>(value: TValue[]) {
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
const ExpertList: Component = () => {
  const [filter] = useSearchParams<FiltersForm>();
  const screenSize = getScreenSize();
  const { List } = createVirtualList(() => ({
    queryKey: ["experts", filter],
    queryFn: async ({ pageParam }) => {
      const resp = await execute(expertListQuery, {
        first: 10,
        after: pageParam,
        filter: {
          hasRegionWith: filter.selectedRegions
            ? [{ idIn: [filter.selectedRegions] }]
            : undefined,
          hasCommunityDirectionsWith: filter.selectedDirections?.length
            ? [{ idIn: filter.selectedDirections }]
            : undefined,
        },
      });
      return resp.expertProfiles;
    },
    estimateSize: () => (window.innerWidth >= 640 ? 240 : 270),
    pageSize: 10,
  }));

  return (
    <Page title="СПИСОК ЭКСПЕРТОВ" titleElements={<FilterDialog />}>
      <List>
        {(v) => (
          <ExpertCard
            {...v}
            {...v.user}
            region={v.region.regionName}
            href={`/experts/${v.id}`}
            stat
            hight={250}
          />
        )}
      </List>
    </Page>
  );
};

type FiltersForm = {
  selectedRegions?: string;
  selectedDirections: string[];
};

const FilterDialog: Component = () => {
  const [filter, setFilter] = useSearchParams<FiltersForm>();
  const [form, { Form, Field }] = createForm<FiltersForm>();
  createEffect(() => {
    setValues(form, {
      selectedDirections: normalizeParam(filter.selectedDirections),
      selectedRegions: filter.selectedRegions,
    });
  });
  const [openModal, setOpenModal] = createSignal(false);

  const handleSubmit = (data: FiltersForm) => {
    setFilter(
      {
        selectedDirections: fixFieldValue(data.selectedDirections),
        selectedRegions: data.selectedRegions,
      },
      { replace: true },
    );
    setOpenModal(false);
  };

  return (
    <Modal
      title="Фильтры"
      class="btn bg-base-100 rounded-xl"
      triggerContent={<HeroiconsAdjustmentsHorizontal class="size-8" />}
      open={openModal()}
      onOpenChange={setOpenModal}
    >
      <Form onSubmit={handleSubmit} class="flex flex-col gap-1">
        <Field name="selectedRegions" type="string">
          {(field, props) => (
            <RegionsSelect
              {...props}
              label="Регион"
              value={field.value}
              error={field.error}
              checkbox
            />
          )}
        </Field>
        <Field name="selectedDirections" type="string[]">
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
        <Button type="submit" class="btn btn-accent">
          Применить
        </Button>
      </Form>
    </Modal>
  );
};

export default ExpertList;
