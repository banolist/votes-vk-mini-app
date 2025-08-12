import { type Component as Navbar } from "solid-js";
import HeroiconsArrowLeft16Solid from "~icons/heroicons/arrow-left-16-solid";
import HeroiconsUser20Solid from "~icons/heroicons/user-20-solid";
import HeroiconsArrowUpTray16Solid from "~icons/heroicons/arrow-up-tray-16-solid";
import { A, useLocation } from "@solidjs/router";
import { Match, Show, Switch } from "solid-js";
import HeroiconsBell20Solid from "~icons/heroicons/bell-20-solid";
import HeroiconsHome20Solid from "~icons/heroicons/home-20-solid";
import useMe from "~/hooks/useMe";
import { Button } from "@kobalte/core";

const Navbar: Navbar = () => {
  const location = useLocation();
  const isNotHome = () => location.pathname !== "/";

  const handleGoBack = () => {
    window.history.back();
  };

  const me = useMe();
  return (
    <div class="navbar flex justify-between items-center px-2">
      <div class="w-full flex">
        <Switch>
          <Match when={isNotHome()}>
            <button
              on:click={handleGoBack}
              class="btn btn-ghost flex gap-2 px-2 py-4"
            >
              <HeroiconsArrowLeft16Solid class="size-8" />
              <div>Вернуться</div>
            </button>
          </Match>
          <Match when={!isNotHome()}>
            <HeroiconsArrowUpTray16Solid class="size-8" />
          </Match>
        </Switch>
      </div>
      <Show when={!isNotHome()}>
        <div class="text-[#5c6d76] capitalize text-4xl">exprating</div>
      </Show>
      <div class="flex gap-2 w-full justify-end *:btn *:btn-circle *:btn-ghost">
        <Show when={isNotHome()}>
          <A class="btn btn-ghost flex gap-2 px-2 py-4" href="/">
            <HeroiconsHome20Solid class="size-8" />
          </A>
        </Show>
        <A href="/menu/notifications" class="indicator">
          <Show when={me.isFetched && me.data?.notifications.totalCount}>
            <div class="indicator-item badge badge-secondary badge-xs">
              {me.data?.notifications.totalCount}
            </div>
          </Show>
          <HeroiconsBell20Solid class="size-8" />
        </A>
        <A href="/menu">
          <HeroiconsUser20Solid class="size-8" />
        </A>
      </div>
    </div>
  );
};
export default Navbar;
