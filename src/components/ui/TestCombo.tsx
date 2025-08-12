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

interface Food {
  value: string;
  label: string;
  disabled: boolean;
}
interface Category {
  label: string;
  options: Food[];
}
const ALL_OPTIONS: Category[] = [
  {
    label: "Test",
    options: [
      { value: "apple1", label: "Apple1", disabled: false },
      { value: "banana1", label: "Banana1", disabled: false },
      { value: "blueberry1", label: "Blueberry1", disabled: false },
      { value: "grapes1", label: "Grapes1", disabled: true },
      { value: "pineapple1", label: "Pineapple1", disabled: false },
    ],
  },
  {
    label: "Fruits",
    options: [
      { value: "apple", label: "Apple", disabled: false },
      { value: "banana", label: "Banana", disabled: false },
      { value: "blueberry", label: "Blueberry", disabled: false },
      { value: "grapes", label: "Grapes", disabled: true },
      { value: "pineapple", label: "Pineapple", disabled: false },
    ],
  },
  {
    label: "Meat",
    options: [
      { value: "beef", label: "Beef", disabled: false },
      { value: "chicken", label: "Chicken", disabled: false },
      { value: "lamb", label: "Lamb", disabled: false },
      { value: "pork", label: "Pork", disabled: false },
    ],
  },
];

interface DirectionsProps {
  name: string;
  label?: string | undefined;
  placeholder?: string | undefined;
  value?: string[] | string | undefined;
  error?: string;
  required?: boolean | undefined;
  disabled?: boolean | undefined;
  ref?: (element: HTMLSelectElement) => void;
  onInput?: JSX.EventHandler<HTMLSelectElement, InputEvent>;
  onChange?: JSX.EventHandler<HTMLSelectElement, Event>;
  onBlur?: JSX.EventHandler<HTMLSelectElement, FocusEvent>;
  closeOnSelection?: boolean | undefined;
  multiple?: boolean;
  checkbox?: boolean;
  onFethed?: () => void;
}

const TestCombo: Component<DirectionsProps> = (props) => {
  const [, rest] = splitProps(props, ["error"]);

  const query = useQuery(() => ({
    queryKey: ["directionsSelect3242"],
    queryFn: () => ALL_OPTIONS,
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
      <ComboboxField<Food, Category>
        {...rest}
        disabled={isAll() && props.checkbox}
        options={query.data || []}
        optionTextValue="label"
        optionGroupChildren="options"
        optionValue="value"
        closeOnSelection
        displaySelectedOption={(v) => `${v.label}/${v.value}`}
        isLoading={query.isLoading}
        error={query.isError ? query.error.message : props.error!}
        sectionTextValue="label"
      />
    </>
  );
};
export default TestCombo;
