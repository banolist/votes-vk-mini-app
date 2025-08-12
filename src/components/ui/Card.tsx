import { type Component, JSXElement, Show } from "solid-js";

const Card: Component<{
  children?: JSXElement;
  title?: JSXElement;
  titlePosition?: "start" | "center";
  endTitle?: JSXElement;
  class?: string;
  classBody?: string;
  hight?: number;
}> = (props) => {
  return (
    <div
      class={
        "bg-base-100 card shadow-xl card-border w-full " + props.class || ""
      }
    >
      <div
        class={"card-body " + props.classBody}
        style={{
          height: props.hight ? `${props.hight}` : undefined,
        }}
      >
        <Show when={props.title}>
          <div
            class="flex items-center gap-1"
            classList={{
              "justify-center": props.titlePosition === "center",
              "justify-between": props.titlePosition !== "center",
            }}
          >
            <strong>{props.title}</strong>
            <Show when={props.endTitle}>
              <span class="text-xs font-light">{props.endTitle}</span>
            </Show>
          </div>
        </Show>
        {props.children}
      </div>
    </div>
  );
};
export default Card;
