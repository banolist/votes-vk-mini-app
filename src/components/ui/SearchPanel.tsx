import { Component } from "solid-js";
import HeroiconsArrowRight16Solid from "~icons/heroicons/arrow-right-16-solid";

const SearchPanel: Component<{ body: string; onClick?: () => void }> = (
  props
) => {
  return (
    <div
      class="flex px-3 py-2 gap-2.5 items-center justify-between bg-base-100 rounded-xl shadow-md outline-1 outline-base-content/10"
      on:click={props.onClick}
    >
      <div class="text-tx-secondary2 font-light text-lg">{props.body}</div>
      <HeroiconsArrowRight16Solid class="size-8 text-gray-500" />
    </div>
  );
};
export default SearchPanel;
