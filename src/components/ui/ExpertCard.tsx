import { JSXElement, Match, Show, Switch, type Component } from "solid-js";
import { A } from "@solidjs/router";
import LocationText from "./LocationText";
import ProfileApplets from "./ProfileApplets";
import NameComponent from "./Name";
import Avatar from "./Avatar";
import Card from "./Card";
import { UserRights } from "~/utils/rights";
const ExpertCard: Component<{
  avatar?: string | null;
  firstName?: string;
  lastName?: string;
  phaserName?: string;
  about?: string | null;
  rights?: UserRights;
  region?:
    | string
    | {
        regionName: string;
      };
  votesCount?: number;
  peopleVotesCount?: number;
  countEvents?: number;
  vitrified?: boolean;

  stat?: boolean;
  href: string;
  buttomContent?: JSXElement;
  size?: "small" | "normal";
  class?: string;
  hight?: number;
}> = (props) => {
  return (
    <Card
      classBody={"gap-1 p-3 " + props.class || ""}
      class=""
      hight={props.hight}
    >
      <Switch>
        <Match when={props.size == "small"}>
          <A href={props.href} class="flex gap-2">
            <Avatar class="size-10 rounded-box" {...props} />
            <div class="flex flex-col w-full justify-between">
              <div>
                <NameComponent {...props} />
                <div class="text-tx-primary font-light leading-[1.2] text-pretty line-clamp-2">
                  {props.about}
                </div>
              </div>
            </div>
          </A>
          <Show when={props.buttomContent}>{props.buttomContent}</Show>
        </Match>
        <Match when={true}>
          <div class="flex gap-2">
            <Avatar class="size-24 rounded-box" {...props} />
            <div class="flex flex-col w-full justify-between">
              <div>
                <NameComponent {...props} />
                <div class="text-tx-primary font-light leading-[1.2] text-pretty line-clamp-3">
                  {props.about}
                </div>
              </div>
            </div>
          </div>
          <LocationText
            class="justify-self-end"
            location={
              typeof props.region == "string"
                ? props.region
                : props.region?.regionName
            }
          />
          <Show when={props.stat}>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <ProfileApplets class="mt-1" data={props as any} />
          </Show>
          <Show when={props.buttomContent}>{props.buttomContent}</Show>
          <A
            class="btn btn-outline btn-primary w-full text-base font-medium mt-1"
            href={props.href}
          >
            Подробнее
          </A>
        </Match>
      </Switch>
    </Card>
  );
};
export default ExpertCard;
