import {
  createEffect,
  createSignal,
  JSX,
  Show,
  splitProps,
  type Component,
} from "solid-js";
import execute from "~/utils/execute";
import {
  CategoryCommunityDirection,
  CommunityDirection,
} from "~/graphql/graphql";
import { useQuery } from "@tanstack/solid-query";
import { ComboboxField } from "../form/Combobox";
import { Checkbox } from "../form/Checkbox";
import { graphql } from "~/graphql";

const communityDirectionsQuery = graphql(`
  query CommunityDirectionsCategorized {
    communityDirectionsCategorized {
      label
      options {
        id
        name
        direction
      }
    }
  }
`);

interface DirectionsProps {
  name: string;
  label?: string | undefined;
  placeholder?: string | undefined;
  value: string[] | string | undefined;
  error: string;
  required?: boolean | undefined;
  disabled?: boolean | undefined;
  ref: (element: HTMLSelectElement) => void;
  onInput: JSX.EventHandler<HTMLSelectElement, InputEvent>;
  onChange: JSX.EventHandler<HTMLSelectElement, Event>;
  onBlur: JSX.EventHandler<HTMLSelectElement, FocusEvent>;
  closeOnSelection?: boolean | undefined;
  multiple?: boolean;
  checkbox?: boolean;
  onFethed?: () => void;
}

const DirectionsSelect: Component<DirectionsProps> = (props) => {
  const [, rest] = splitProps(props, ["error"]);

  const query = useQuery(() => ({
    queryKey: ["directionsSelect"],
    queryFn: async () =>
      (await execute(communityDirectionsQuery)).communityDirectionsCategorized,
  }));

  const [isAll, setIsAll] = createSignal(true);

  createEffect(() => {
    if (props.onFethed && query.isFetched) {
      props.onFethed();
    }
  });
  return (
    <>
      <Show when={props.checkbox}>
        <Checkbox
          checked={isAll()}
          onInput={(e) => setIsAll(e.currentTarget.checked)}
          label="Выбрать все направления"
        />
      </Show>
      <ComboboxField<CommunityDirection, CategoryCommunityDirection>
        {...rest}
        disabled={isAll() && props.checkbox}
        options={query.data || []}
        optionTextValue="name"
        optionGroupChildren="options"
        optionValue="id"
        closeOnSelection
        displaySelectedOption={(v) => `${v.direction}/${v.name}`}
        isLoading={query.isLoading}
        error={query.isError ? query.error.message : props.error}
        sectionTextValue="label"
      />
    </>
  );
};
export default DirectionsSelect;
