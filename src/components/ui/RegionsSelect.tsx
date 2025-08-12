import {
  createEffect,
  createSignal,
  JSX,
  Show,
  splitProps,
  type Component,
} from "solid-js";
import { SelectMultilineField } from "../form/Select";
import { graphql } from "~/graphql";
import { useQuery } from "@tanstack/solid-query";
import execute from "~/utils/execute";
import { Region } from "~/graphql/graphql";
import { ComboboxField } from "../form/Combobox";
import { Checkbox } from "../form/Checkbox";

const regionsQuery = graphql(`
  query regionsOptions {
    regions {
      regionName
      id
    }
  }
`);
interface RegionsProps {
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
  enabled?: boolean;
  onFethed?: () => void;
}

const RegionsSelect: Component<RegionsProps> = (props) => {
  const [, rest] = splitProps(props, ["error"]);

  const query = useQuery(() => ({
    queryKey: ["regionsSelect"],
    queryFn: async () => (await execute(regionsQuery)).regions,
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
          label="Выбрать все регионы"
        />
      </Show>
      <ComboboxField<Region>
        {...rest}
        // value={selected()?.map((a) => a.id)}
        disabled={isAll() && props.checkbox}
        options={query.data || []}
        optionTextValue="regionName"
        optionValue="id"
        isLoading={query.isLoading}
        error={query.isError ? query.error.message : props.error}
      />
    </>
  );
};
export default RegionsSelect;
