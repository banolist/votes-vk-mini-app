import { type JSX, JSXElement, splitProps } from "solid-js";

type CheckboxProps = {
  name?: string;
  label: JSXElement;
  value?: string | undefined;
  checked: boolean | undefined;
  error?: string;
  required?: boolean | undefined;
  disabled?: boolean | undefined;
  ref?: (element: HTMLInputElement) => void;
  onInput?: JSX.EventHandler<HTMLInputElement, InputEvent>;
  onChange?: JSX.EventHandler<HTMLInputElement, Event>;
  onBlur?: JSX.EventHandler<HTMLInputElement, FocusEvent>;
  reverse?: boolean;
};

export function SwitchField(props: CheckboxProps) {
  const [rootProps, inputProps] = splitProps(
    props,
    ["name", "value", "checked", "required", "disabled"],
    ["ref", "onInput", "onChange", "onBlur"],
  );
  return (
    <div class="form-control mt-2 mb-1 ">
      <label
        class="items-center cursor-pointer gap-0.5 validator"
        classList={{
          "flex justify-start": !props.reverse,
          "flex flex-row-reverse justify-end": props.reverse,
        }}
      >
        <span>{props.label}</span>
        <input
          type="checkbox"
          class="checkbox"
          {...rootProps}
          {...inputProps}
          aria-invalid={!!props.error}
          aria-errormessage={props.error ? `${props.name}-error` : undefined}
        />
      </label>
      {props.error && (
        <div id={`${props.name}-error`} class="text-error">
          {props.error}
        </div>
      )}
    </div>
  );
}
