import { Show, type Component } from "solid-js";
import { hasRights, UserRights } from "~/utils/rights";
import HeroiconsCheckBadge16Solid from "~icons/heroicons/check-badge-16-solid";
import MdiAcademicCap from "~icons/mdi/academic-cap";
const NameComponent: Component<{
  firstName?: string;
  lastName?: string;
  phaserName?: string;
  vitrified?: boolean;
  rights?: UserRights;
}> = (props) => {
  return (
    <div class="flex flex-wrap gap-x-1 text-tx-secondary leading-[1.2] text-lg capitalize items-center">
      <span>{props.firstName}</span>
      <span>{props.lastName}</span>
      <Show when={props.phaserName}>
        <span>{props.phaserName}</span>
      </Show>
      <Show when={props.vitrified}>
        <HeroiconsCheckBadge16Solid class="size-5 text-blue-400" />
      </Show>
      <Show when={hasRights(props.rights || 0, UserRights.Expert)}>
        <MdiAcademicCap class="size-5" />
      </Show>
    </div>
  );
};
export default NameComponent;
