import { createEffect, createSignal, JSX, Show, splitProps } from "solid-js";
import { TextField as Kobalte } from "@kobalte/core/text-field";

type TextFieldProps = {
  name?: string;
  type?:
    | "text"
    | "email"
    | "tel"
    | "password"
    | "date"
    | "datetime-local"
    | "number"
    | undefined;
  label?: string | undefined;
  placeholder?: string | undefined;
  value?: string | undefined;
  error?: string;
  multiline?: boolean | undefined;
  required?: boolean | undefined;
  disabled?: boolean | undefined;
  ref?: (element: HTMLInputElement | HTMLTextAreaElement) => void;
  onInput?: JSX.EventHandler<
    HTMLInputElement | HTMLTextAreaElement,
    InputEvent
  >;
  onChange?: JSX.EventHandler<HTMLInputElement | HTMLTextAreaElement, Event>;
  onBlur?: JSX.EventHandler<HTMLInputElement | HTMLTextAreaElement, FocusEvent>;
  classList?: Record<string, string>;
  description?: string;
  class?: string;
  max?: number;
};

export function TextField(props: TextFieldProps) {
  const [rootProps, inputProps] = splitProps(
    props,
    ["name", "value", "required", "disabled"],
    ["placeholder", "ref", "onInput", "onChange", "onBlur", "classList"],
  );

  const [value, setValue] = createSignal("");

  createEffect(() => {
    if (props.value) {
      setValue(props.value);
    }
  });

  return (
    <Kobalte
      {...rootProps}
      value={value()}
      onChange={setValue}
      validationState={props.error ? "invalid" : "valid"}
      class={"flex flex-col w-full gap-0.5 max-w-md"}
    >
      <Show when={props.label}>
        <Kobalte.Label class="form-label">
          {props.label}
          <Show when={props.max}>
            <span
              class="text-xs"
              classList={{
                "text-error": (props.value?.length || 0) > (props.max ?? 1),
              }}
            >
              {" " + props.value?.length || 0}/{props.max}
            </span>
          </Show>
        </Kobalte.Label>
      </Show>
      <Show
        when={props.multiline}
        fallback={
          <Kobalte.Input
            {...inputProps}
            data-testid={`${props.name}-input`}
            class="input w-full hide-spin-buttons"
            classList={{
              "is-invalid": props.error,
              ...props.classList,
            }}
            type={props.type}
          />
        }
      >
        <Kobalte.TextArea
          autoResize
          wrap="hard"
          class={
            "input w-full max-w-md text-wrap py-1 px-2 max-h-32 min-h-5 validator" +
            props.class
          }
          classList={{
            "is-invalid": props.error,
            ...props.classList,
          }}
          {...inputProps}
        />
      </Show>
      <Kobalte.ErrorMessage class="text-error">
        {props.error}
      </Kobalte.ErrorMessage>
      <Show when={props.description}>
        <Kobalte.Description class="text-sm font-light text-tx-primary2">
          {props.description}
        </Kobalte.Description>
      </Show>
    </Kobalte>
  );
}
