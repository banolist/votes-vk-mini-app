import {
  createEffect,
  createSignal,
  type JSX,
  JSXElement,
  Show,
  splitProps,
} from "solid-js";

type CheckboxProps = {
  name?: string;
  label: JSXElement;
  value?: string | undefined;
  checked?: boolean | undefined;
  error?: string;
  description?: string;
  required?: boolean | undefined;
  disabled?: boolean | undefined;
  ref?: (element: HTMLInputElement) => void;
  onInput?: JSX.EventHandler<HTMLInputElement, InputEvent>;
  onChange?: JSX.EventHandler<HTMLInputElement, Event>;
  onBlur?: JSX.EventHandler<HTMLInputElement, FocusEvent>;
};

export function Checkbox(props: CheckboxProps) {
  const [rootProps, inputProps] = splitProps(
    props,
    ["name", "value", "checked", "required", "disabled"],
    ["ref", "onInput", "onChange", "onBlur"],
  );
  const [value, setValue] = createSignal(false);

  createEffect(() => {
    setValue(props.checked ?? false);
  });
  return (
    <div class="form-control mt-2 mb-1">
      <label class="flex items-center cursor-pointer justify-start gap-0.5">
        <span class="">{props.label}</span>

        <input
          type="checkbox"
          class="toggle validator"
          classList={{
            "toggle-success": value(),
            "toggle-error": !value(),
          }}
          {...rootProps}
          {...inputProps}
          checked={value()}
          onChange={(e) => setValue(e.currentTarget.checked)}
          aria-invalid={!!props.error}
          aria-errormessage={props.error ? `${props.name}-error` : undefined}
        />
      </label>
      <Show when={props.description}>
        <div class="text-sm font-light text-tx-secondary2">
          {props.description}
        </div>
      </Show>
      {props.error && (
        <div id={`${props.name}-error`} class="text-error">
          {props.error}
        </div>
      )}
    </div>
  );
}
