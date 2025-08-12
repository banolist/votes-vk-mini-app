import { Combobox as Kobalte } from "@kobalte/core";
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

type SelectMultilineProps<Option, OptGroup = never> = {
  name: string;
  label?: string | undefined;
  placeholder?: string | undefined;
  options: Array<Option | OptGroup>;
  displaySelectedOption?(v: Option): string;
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
  sectionTextValue?: keyof OptGroup;
  onSelect?: (v: Option[] | Option | undefined) => void;
  // displayOptionLabel?: (option: Option) => JSX.Element;
  isLoading?: boolean;
  multiple?: boolean;
};

export function ComboboxField<
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
    if (props.onSelect) {
      props.onSelect(getValue());
    }
  });
  createEffect(() => {
    const optionValueKey = props.optionValue;
    const value = props.value;
    if (!optionValueKey) return;

    if (!props.multiple) {
      setValue(() => {
        const slectedValue = value as string;
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
        const selectedValues = (value as string[]) || [];

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

  return (
    <Kobalte.Root<Option, OptGroup>
      {...rootProps}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      value={getValue() as any}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onChange={setValue as any}
      validationState={props.error ? "invalid" : "valid"}
      itemComponent={(props) => (
        <Kobalte.Item
          class="flex justify-between items-center px-2 hover:bg-base-100 "
          item={props.item}
        >
          <Kobalte.ItemLabel class="text-base-content font-light text-md">
            {props.item.textValue}
          </Kobalte.ItemLabel>
          <Kobalte.ItemIndicator>
            <HeroiconsXMark16Solid class="size-5" />
          </Kobalte.ItemIndicator>
        </Kobalte.Item>
      )}
      sectionComponent={(section) => (
        <Kobalte.Section class="text-base-content w-full bg-base-200">
          {props.sectionTextValue
            ? (section.section.rawValue[props.sectionTextValue] as string)
            : section.section.textValue}
        </Kobalte.Section>
      )}
    >
      <Show when={props.label}>
        <Kobalte.Label>{props.label}</Kobalte.Label>
      </Show>
      <Kobalte.HiddenSelect {...selectProps} />
      <Kobalte.Control<Option>
        class={
          props.disabled
            ? "cursor-default input w-full min-h-(--size) h-auto py-1 max-w-md text-base-content/60 flex justify-between validator bg-base-200 border-0 "
            : "cursor-default input w-full min-h-(--size) h-auto py-1 max-w-md text-base-content/60 flex justify-between validator "
        }
        aria-label={props.label}
      >
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
                        classList={{
                          "bg-base-300 text-base-content/40": props.disabled,
                        }}
                        onPointerDown={(e) => e.stopPropagation()}
                      >
                        <Show
                          when={props.displaySelectedOption}
                          fallback={
                            props.optionTextValue &&
                            (option[props.optionTextValue] as string)
                          }
                        >
                          {props.displaySelectedOption &&
                            props.displaySelectedOption(option)}
                        </Show>
                        <button
                          disabled={props.disabled}
                          class="btn btn-xs btn-circle btn-error"
                          onClick={() => state.remove(option)}
                        >
                          <HeroiconsXMark16Solid />
                        </button>
                      </span>
                    )}
                  </For>
                  <Kobalte.Input disabled={props.disabled} />
                </div>
              </Match>
              <Match when={!props.multiple}>
                <Kobalte.Input
                  value={
                    props.optionTextValue &&
                    ((getValue() as Option)?.[props.optionTextValue] as string)
                  }
                />
              </Match>
            </Switch>
            <Kobalte.Trigger class="">
              <Kobalte.Icon>
                <Show when={!props.isLoading} fallback={<Spinner />}>
                  <HeroiconsChevronUpDown16Solid />
                </Show>
              </Kobalte.Icon>
            </Kobalte.Trigger>
          </>
        )}
      </Kobalte.Control>
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
