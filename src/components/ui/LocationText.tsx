import { type Component } from "solid-js";
import HeroiconsMapPin from "~icons/heroicons/map-pin";
const LocationText: Component<{ class?: string; location?: string | null }> = (
  props,
) => {
  return (
    <div
      class={
        "flex text-md capitalize justify-start text-tx-secondary2 align-bottom " +
        props.class
      }
    >
      <HeroiconsMapPin class="size-6" />
      <span>{props.location}</span>
    </div>
  );
};
export default LocationText;
