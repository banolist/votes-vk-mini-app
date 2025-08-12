import { Show, type Component } from "solid-js";
import HeroiconsCheckBadge20Solid from "~icons/heroicons/check-badge-20-solid";
const Name: Component<{
  firstName: string;
  lastName: string;
  phaserName?: string;
  verifiedVK?: boolean;
  class?: string;
  size?: "small" | "big" | "custom";
}> = (props) => {
  return (
    <div
      class={
        `text-tx-secondary capitalize flex flex-wrap gap-x-1.5 items-center w-full h-max ` +
        props.class
      }
      classList={{
        "text-4xl":
          props.size == "big" || (!props.size && props.size !== "custom"),
        "text-2xl": props.size == "small",
      }}
    >
      <span>{props.firstName}</span>
      <span>{props.lastName}</span>
      <Show when={props.phaserName}>
        <span>{props.phaserName}</span>
      </Show>
      <Show when={props.verifiedVK}>
        <HeroiconsCheckBadge20Solid class="size-8 text-info" />
      </Show>
    </div>
  );
};
export default Name;
