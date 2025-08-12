import { Select as Kobalte } from "@kobalte/core";
import {
  createEffect,
  createSignal,
  type JSX,
  Show,
  splitProps,
  For,
  Switch,
  Match,
} from "solid-js";
import HeroiconsXMark16Solid from "~icons/heroicons/x-mark-16-solid";
import HeroiconsChevronUpDown16Solid from "~icons/heroicons/chevron-up-down-16-solid";
import { Checkbox } from "./Checkbox";

type Option = {
  label: string;
  value: string;
};

type SelectProps = {
  name: string;
  label?: string | undefined;
  placeholder?: string | undefined;
  options: Option[];
  value: string | undefined;
  error: string;
  required?: boolean | undefined;
  disabled?: boolean | undefined;
  ref: (element: HTMLSelectElement) => void;
  onInput: JSX.EventHandler<HTMLSelectElement, InputEvent>;
  onChange: JSX.EventHandler<HTMLSelectElement, Event>;
  onBlur: JSX.EventHandler<HTMLSelectElement, FocusEvent>;
};

export function SelectField(props: SelectProps) {
  const [rootProps, selectProps] = splitProps(
    props,
    ["name", "placeholder", "options", "required", "disabled"],
    ["placeholder", "ref", "onInput", "onChange", "onBlur"],
  );
  const [getValue, setValue] = createSignal<Option>();
  createEffect(() => {
    setValue(props.options.find((option) => props.value == option.value));
  });
  return (
    <Kobalte.Root
      {...rootProps}
      multiple={false}
      value={getValue()}
      onChange={setValue}
      optionValue="value"
      optionTextValue="label"
      validationState={props.error ? "invalid" : "valid"}
      itemComponent={(props) => (
        <Kobalte.Item item={props.item}>
          <Kobalte.ItemLabel>{props.item.textValue}</Kobalte.ItemLabel>
          <Kobalte.ItemIndicator>
            {/* Add SVG icon here */}
          </Kobalte.ItemIndicator>
        </Kobalte.Item>
      )}
      sectionComponent={(props) => (
        <Kobalte.Section class="text-sm text-tx-secondary2 font-light">
          {props.section.textValue}
        </Kobalte.Section>
      )}
    >
      <Show when={props.label}>
        <Kobalte.Label>{props.label}</Kobalte.Label>
      </Show>
      <Kobalte.HiddenSelect {...selectProps} />
      <Kobalte.Trigger>
        <Kobalte.Value<Option>>
          {(state) => state.selectedOption().label}
        </Kobalte.Value>
        <Kobalte.Icon>{/* Add SVG icon here */}</Kobalte.Icon>
      </Kobalte.Trigger>
      <Kobalte.Portal>
        <Kobalte.Content>
          <Kobalte.Listbox />
        </Kobalte.Content>
      </Kobalte.Portal>
      <Kobalte.ErrorMessage>{props.error}</Kobalte.ErrorMessage>
    </Kobalte.Root>
  );
}

type SelectMultilineProps<Option, OptGroup = never> = {
  name: string;
  label?: string | undefined;
  placeholder?: string | undefined;
  options: Array<Option | OptGroup>;
  value: string[] | string | undefined;
  error: string;
  required?: boolean | undefined;
  disabled?: boolean | undefined;
  ref: (element: HTMLSelectElement) => void;
  onInput: JSX.EventHandler<HTMLSelectElement, InputEvent>;
  onChange: JSX.EventHandler<HTMLSelectElement, Event>;
  onBlur: JSX.EventHandler<HTMLSelectElement, FocusEvent>;
  closeOnSelection?: boolean | undefined;
  optionTextValue?: keyof Option | undefined;
  optionValue?: keyof Option | undefined;
  optionGroupChildren?: keyof OptGroup | undefined;
  // displayOptionLabel?: (option: Option) => JSX.Element;
  isLoading?: boolean;
  multiple?: boolean;
  withChekbox?: boolean;
};

export function SelectMultilineField<
  Option extends object,
  OptGroup extends object = never,
>(props: SelectMultilineProps<Option, OptGroup>) {
  const [rootProps, selectProps] = splitProps(
    props,
    [
      "name",
      "placeholder",
      "options",
      "required",
      "disabled",
      "closeOnSelection",
      "optionTextValue",
      "optionValue",
      "optionGroupChildren",
      "multiple",
    ],
    ["placeholder", "ref", "onInput", "onChange", "onBlur"],
  );
  const [getValue, setValue] = createSignal<Option[] | Option>();
  createEffect(() => {
    const optionValueKey = props.optionValue;
    if (!optionValueKey) return;

    if (!props.multiple) {
      setValue(() => {
        const slectedValue = props.value as string;
        const options = props.options as Option[];
        if (!optionValueKey) {
          return;
        }
        return options.find(
          (option) => slectedValue == (option[optionValueKey] as string),
        );
      });
    } else {
      setValue(() => {
        const selectedValues = (props.value as string[]) || [];

        return props.options.flatMap((option) => {
          // Если это OptGroup (проверяем наличие optionGroupChildren и соответствующего свойства)
          if (
            props.optionGroupChildren !== undefined &&
            props.optionGroupChildren in option // Проверка существования ключа в объекте
          ) {
            const group = option as OptGroup;
            const children = group[props.optionGroupChildren] as Option[];

            // Фильтруем дочерние элементы группы
            return children.filter((child) => {
              const childValue = child[optionValueKey] as string;
              const selected = selectedValues.some((v) => v == childValue);
              if (selected) {
                console.log("my", selectedValues, childValue);
              }
              return selected; // Нестрогое сравнение
            });
          }
          // Если это Option
          else if (props.optionValue !== undefined) {
            return selectedValues.includes(
              (option as Option)[props.optionValue] as string,
            )
              ? [option as Option]
              : [];
          }
          return [];
        });
      });
    }
  });

  const [selectAll, setSelectAll] = createSignal(true);
  return (
    <>
      <Show when={props.withChekbox}>
        <Checkbox
          label="Выбрать все"
          onInput={(e) => {
            const value = e.currentTarget.checked;
            if (value) {
              setValue(undefined);
            }
            setSelectAll(value);
          }}
          checked={selectAll()}
        />
      </Show>
      <Kobalte.Root<Option, OptGroup>
        {...rootProps}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        value={getValue() as any}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onChange={setValue as any}
        disabled={selectAll() && props.withChekbox}
        validationState={props.error ? "invalid" : "valid"}
        itemComponent={(props) => (
          <Kobalte.Item
            class="flex justify-between items-center px-2 hover:bg-base-200"
            item={props.item}
          >
            <Kobalte.ItemLabel>{props.item.textValue}</Kobalte.ItemLabel>
            <Kobalte.ItemIndicator>
              <HeroiconsXMark16Solid class="size-5" />
            </Kobalte.ItemIndicator>
          </Kobalte.Item>
        )}
        sectionComponent={(props) => (
          <Kobalte.Section class="text-sm text-tx-secondary2 font-light">
            {props.section.textValue}
          </Kobalte.Section>
        )}
      >
        <Show when={props.label}>
          <Kobalte.Label>{props.label}</Kobalte.Label>
        </Show>
        <Kobalte.HiddenSelect {...selectProps} />
        <Kobalte.Trigger class="cursor-default input w-full min-h-(--size) h-auto py-1 max-w-md text-base-content/60 flex justify-between validator">
          <Kobalte.Value<Option> class="w-full flex mr-2">
            {(state) => (
              <>
                <Switch>
                  <Match when={props.isLoading}>Загрузка...</Match>
                  <Match when={props.multiple}>
                    <div class="flex flex-wrap gap-1 w-full">
                      <For each={state.selectedOptions()}>
                        {(option) => (
                          <span
                            class="p-1 gap-1 bg-base-200 rounded-full flex items-center text-base-content"
                            onPointerDown={(e) => e.stopPropagation()}
                          >
                            {props.optionTextValue &&
                              (option[props.optionTextValue] as string)}
                            <button
                              class="btn btn-xs btn-circle btn-error"
                              onClick={() => state.remove(option)}
                            >
                              <HeroiconsXMark16Solid />
                            </button>
                          </span>
                        )}
                      </For>
                    </div>
                    <button
                      class="btn btn-ghost p-0 btn-xs my-1 self-center"
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={state.clear}
                    >
                      <HeroiconsXMark16Solid class="size-6" />
                    </button>
                  </Match>
                  <Match when={!props.multiple}>
                    {props.optionTextValue &&
                      (state.selectedOption()[props.optionTextValue] as string)}
                  </Match>
                </Switch>
              </>
            )}
          </Kobalte.Value>
          <Kobalte.Icon>
            <Show when={!props.isLoading} fallback={<Spinner />}>
              <HeroiconsChevronUpDown16Solid />
            </Show>
          </Kobalte.Icon>
        </Kobalte.Trigger>
        <Kobalte.Portal>
          <Show when={!props.isLoading}>
            <Kobalte.Content class="w-full max-w-md max-h-52 overflow-auto rounded-xl border-1 border-base-content/20 z-20">
              <Kobalte.Listbox
                aria-labelledby={`${props.name}-label`}
                aria-multiselectable={props.multiple}
                class="bg-base-100 px-4 flex flex-col gap-0.5 cursor-default"
              />
            </Kobalte.Content>
          </Show>
        </Kobalte.Portal>
        <Kobalte.ErrorMessage class="text-error">
          {props.error}
        </Kobalte.ErrorMessage>
      </Kobalte.Root>
    </>
  );
}

// Компонент Spinner для индикатора загрузки
function Spinner() {
  return (
    <svg
      class="animate-spin h-5 w-5 text-current"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
