/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  children,
  For,
  Index,
  JSX,
  Match,
  Switch,
  type Component,
} from "solid-js";

type Stat = { positive: number; negative: number } | number | string[] | string;

const DisplayValue: Component<{ value: Stat }> = (props) => {
  return (
    <Switch>
      <Match when={typeof props.value === "number"}>
        <span
          class={(props.value as number) > 0 ? "text-success" : "text-error"}
        >
          {props.value as number}
        </span>
      </Match>
      <Match when={typeof props.value === "string"}>
        <div>{props.value as string}</div>
      </Match>
      <Match when={Array.isArray(props.value)}>
        <div class="flex flex-col gap-1.25 w-full">
          <For each={props.value as []}>{(v) => <Item text={v} />}</For>
        </div>
      </Match>
      <Match
        when={
          typeof props.value === "object" &&
          "positive" in props.value &&
          "negative" in props.value
        }
      >
        <>
          <span class="text-success">{(props.value as any).positive}</span>
          <span>/</span>
          <span class="text-error">{(props.value as any).negative}</span>
        </>
      </Match>
    </Switch>
  );
};

export const StatField: Component<{
  class?: string;
  text: string;
  children?: JSX.Element;
  value?: Stat;
}> = (props) => {
  return (
    <div class="flex flex-wrap gap-1">
      <div class={"text-tx-primary2 " + props.class}>{props.text}:</div>
      <span class="flex items-center gap-1">
        {props.children && <>{props.children}</>}
        {props.value !== undefined && props.value !== null && (
          <DisplayValue value={props.value} />
        )}
      </span>
    </div>
  );
};

export const StatApplet: Component<{
  text: string;
  stat: number;
  icon: Component<{ class?: string }>;
}> = (props) => {
  return (
    <div class="bg-base-200 rounded-lg w-full grid grid-cols-3 md:grid-cols-6 p-2 gap-0.5 items-center">
      <div class="text-xs text-base-content/60 col-span-3 md:col-span-2">
        {props.text}
      </div>
      <div
        class="text-md font-bold text-end col-span-2 md:col-span-3"
        classList={{
          "text-base-content/80": props.stat === 0,
          "text-success": props.stat > 0,
          "text-error": props.stat < 0,
        }}
      >
        {props.stat}
      </div>
      <props.icon class="size-6  text-base-content/80 text-end justify-self-end" />
    </div>
  );
};

export const Field: Component<{ field: string; children: JSX.Element }> = (
  props,
) => {
  return (
    <span class="text-tx-primary2 text-lg flex flex-wrap gap-x-1">
      <span class="">{props.field}:</span>
      <span class="text-tx-secondary">{props.children}</span>
    </span>
  );
};

export const StatField2: Component<{
  text: string;
  value: { positive: number; negative: number };
}> = (props) => {
  return (
    <div class="flex gap-1">
      <div class="text-tx-primary2 capitalize text-lg">{props.text}:</div>
      <div class="text-lg flex">
        <span class="text-success">{props.value.positive}</span>
        <span>/</span>
        <span class="text-success">{props.value.negative}</span>
      </div>
    </div>
  );
};

export const StatListField: Component<{ text: string; items?: string[] }> = (
  props,
) => {
  return (
    <div class="flex flex-col gap-1.25 items-start justify-start w-full">
      <div class="text-tx-secondary2 text-lg">{props.text}:</div>
      <For each={props.items}>{(v) => <Item text={v} />}</For>
    </div>
  );
};

export const Item: Component<{ text: string }> = (props) => {
  return (
    <div class="flex gap-1.25 items-center mx-3.75 w-full h-max">
      <div class="rounded-full my-0.5 size-2 bg-tx-secondary2" />
      <div class="text-tx-secondary text-lg leading-[1.2] relative w-full">
        {props.text}
      </div>
    </div>
  );
};
