import { Show, type Component } from "solid-js";
const Avatar: Component<{
  avatar?: string | null;
  firstName?: string;
  class?: string;
}> = (props) => {
  const fallbackText = () => props.firstName?.[0] || "?";
  return (
    <Show
      when={props.avatar}
      fallback={
        <div class="size-20 bg-base-200 flex items-center justify-center rounded-md border-1 border-base-content/5">
          {fallbackText()}
        </div>
      }
    >
      <img
        src={props.avatar!}
        alt={fallbackText()}
        class={
          props.class
            ? props.class
            : "size-20 object-cover rounded-md border-1 border-base-content/5"
        }
        loading="lazy"
        onError={(e) => {
          // Замена на fallback, если изображение не загрузилось
          e.currentTarget.style.display = "none";
        }}
      />
    </Show>
  );
};
export default Avatar;
