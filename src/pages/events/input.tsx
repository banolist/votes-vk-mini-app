import { Button } from "@kobalte/core/button";
import HeroiconsMagnifyingGlassSolid from "~icons/heroicons/magnifying-glass-solid";
import { type Component } from "solid-js";
import { graphql } from "~/graphql";
import { TextField } from "@kobalte/core/text-field";

// const selectActiveEvent = graphql(`
//   query GetActive {

//   }
// `);

const EventInput: Component = () => {
  return (
    <div class="flex gap-2 w-full">
      <TextField class="w-full flex px-3 py-2 gap-2.5 items-center justify-between bg-base-100 rounded-xl shadow-md outline-1 outline-base-content/10">
        <TextField.Input
          class="flex-grow text-tx-secondary2 font-light text-lg bg-transparent border-none outline-none placeholder:text-gray-400"
          placeholder="Поиск мероприятия"
        />

        <HeroiconsMagnifyingGlassSolid class="size-6" />
      </TextField>
    </div>
  );
};
export default EventInput;
