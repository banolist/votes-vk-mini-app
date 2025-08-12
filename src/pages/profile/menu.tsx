import { A } from "@solidjs/router";
import {
  Accessor,
  createMemo,
  createSignal,
  For,
  Index,
  Match,
  Show,
  Switch,
  type Component,
} from "solid-js";
// import HeroiconsUser from "~icons/heroicons/user?width=24px&height=24px";
import HeroiconsCog6ToothSolid from "~icons/heroicons/cog-6-tooth-solid";
import HeroiconsTicketSolid from "~icons/heroicons/ticket-solid";
import HeroiconsPaperAirplaneSolid from "~icons/heroicons/paper-airplane-solid";
import HeroiconsMegaphoneSolid from "~icons/heroicons/megaphone-solid";
import HeroiconsRocketLaunchSolid from "~icons/heroicons/rocket-launch-solid";
import HeroiconsCubeTransparentSolid from "~icons/heroicons/cube-transparent-solid";
import HeroiconsChatBubbleBottomCenterSolid from "~icons/heroicons/chat-bubble-bottom-center-solid";
import HeroiconsChevronDown16Solid from "~icons/heroicons/chevron-down-16-solid";
import HeroiconsInformationCircle from "~icons/heroicons/information-circle";
import HeroiconsIdentificationSolid from "~icons/heroicons/identification-solid";
import { hasRights, UserRights } from "~/utils/rights";
import useMe from "~/hooks/useMe";
import Page from "~/components/ui/Page";

const ProfileMenu: Component = () => {
  const me = useMe();

  const items: Accessor<ItemProps[]> = createMemo(() => {
    if (!me.data) {
      return [];
    }

    const meHasRights = (rights: UserRights) =>
      hasRights(me.data.rights, rights);
    return [
      {
        icon: HeroiconsIdentificationSolid,
        href: "./my-profile",
        text: "Мой профиль",
        hide: !me.data.agreesTermsAt,
      },
      {
        icon: HeroiconsRocketLaunchSolid,
        href: "./register-expert",
        text: "Стать экспертом",
        hide: meHasRights(UserRights.Expert) || !me.data.agreesTermsAt,
      },
      {
        icon: HeroiconsMegaphoneSolid,
        href: "./events",
        text: "Мои мероприятия",
        hide: !meHasRights(UserRights.Expert),
      },
      {
        icon: HeroiconsPaperAirplaneSolid,
        href: "./mailing",
        text: "Рассылка по аудитории",
        hide: !meHasRights(UserRights.Expert),
      },
      {
        icon: HeroiconsTicketSolid,
        href: "./tariffs",
        hide: !me.data.agreesTermsAt,
        text: "Тарифы",
      },
      {
        icon: HeroiconsCog6ToothSolid,
        href: "./settings",
        hide: !me.data.agreesTermsAt,
        text: "Настройки",
      },
      {
        icon: HeroiconsChatBubbleBottomCenterSolid,
        text: "Создать организацию",
        href: "./register-organizator",
        hide:
          meHasRights(UserRights.Organizator) ||
          !meHasRights(UserRights.Expert),
      },
      // {
      //   icon: HeroiconsChatBubbleBottomCenterSolid,
      //   text: "Стать представителем",
      //   href: "./representative/create-profile",
      //   hide:
      //     !meHasRights(UserRights.Expert) || meHasRights(UserRights.PreExpert),
      // },
      // {
      //   text: "Представительство",
      //   icon: HeroiconsChatBubbleBottomCenterSolid,
      //   hide: !meHasRights(UserRights.Expert),
      //   subItems: [
      //     {
      //       icon: HeroiconsMegaphoneSolid,
      //       text: "Мероприятия",
      //       href: "./representative",
      //     },
      //     {
      //       icon: HeroiconsCog6ToothSolid,
      //       text: "Запросы",
      //       href: "./representative/requests",
      //     },
      //   ],
      // },
      // {
      //   text: "Верификация",
      //   icon: HeroiconsChatBubbleBottomCenterSolid,
      //   hide:
      //     meHasRights(UserRights.Verified) || !meHasRights(UserRights.Expert),
      //   href: "./verification/create-profile",
      // },
      {
        text: "Администрирование",
        icon: HeroiconsCubeTransparentSolid,
        hide: !meHasRights(UserRights.Admin),
        subItems: [
          {
            icon: HeroiconsCog6ToothSolid,
            text: "Рассылка",
            href: "/administration/mailing",
          },
          {
            icon: HeroiconsCog6ToothSolid,
            text: "Промокоды",
            href: "/administration/promocodes",
          },
          {
            icon: HeroiconsCog6ToothSolid,
            text: "Тарифы",
            href: "/administration/tariffs",
          },
          {
            icon: HeroiconsCog6ToothSolid,
            text: "Модерация профилей",
            href: "/administration/moderation/experts",
          },
          {
            icon: HeroiconsCog6ToothSolid,
            text: "Модерация мероприятий",
            href: "/administration/moderation/events",
          },
          {
            icon: HeroiconsCog6ToothSolid,
            text: "Изменить правила использования",
            href: "/administration/usage",
          },
        ],
      },
      {
        icon: HeroiconsInformationCircle,
        text: "Условия использования",
        href: "/usage",
      },
    ];
  });
  return (
    <>
      <Page title="платформа">
        <ul class="menu gap-1 inline-block space-y-1 w-full">
          <Index each={items()}>
            {(item) => (
              <Show when={!item().hide}>
                <Item {...item()} />
              </Show>
            )}
          </Index>
        </ul>
      </Page>
    </>
  );
};

interface ItemProps {
  icon?: Component<{ class: string }>;
  text: string;
  href?: string;
  subItems?: ItemProps[];

  hide?: boolean;
}
export default ProfileMenu;

const Item: Component<ItemProps> = (props) => {
  return (
    <li class="p-2 bg-base-100 rounded-2xl border-base-300 flex ">
      <Switch
        fallback={
          <A href={props.href || "/"} class="flex gap-2 items-center w-full">
            {props.icon && <props.icon class="size-8 min-w-8" />}
            <div class="text-tx-secondary text-lg md:text-2xl break-words whitespace-normal">
              {props.text}
            </div>
          </A>
        }
      >
        <Match when={props.subItems}>
          <SubItems {...props} />
        </Match>
      </Switch>
    </li>
  );
};
const SubItems: Component<ItemProps> = (props) => {
  const [isOpened, setIsOpened] = createSignal(false);
  return (
    <>
      <div
        on:click={() => setIsOpened(!isOpened())}
        class="text-tx-secondary text-lg md:text-2xl flex items-center gap-2 w-full cursor-pointer"
      >
        {props.icon && <props.icon class="size-8 min-w-8" />}
        <span class="break-words whitespace-normal flex-1">{props.text}</span>
        <HeroiconsChevronDown16Solid
          class={`size-6 ${
            isOpened() && "-rotate-180"
          } duration-300 ease-in-out`}
        />
      </div>
      <ul
        class="overflow-hidden transition-all duration-300 ease-in-out"
        classList={{
          "max-h-0": !isOpened(),
          "max-h-96": isOpened(),
        }}
      >
        <Show when={isOpened()}>
          <For each={props.subItems}>
            {(item) => {
              if (item.hide) {
                return;
              }
              const IconComponent = item.icon;
              return (
                <li class="flex">
                  <A href={item.href || "/"} class="flex gap-2 w-full">
                    {IconComponent && <IconComponent class="size-8 min-w-8" />}
                    <div class="text-tx-secondary text-lg md:text-2xl break-words whitespace-normal">
                      {item.text}
                    </div>
                  </A>
                </li>
              );
            }}
          </For>
        </Show>
      </ul>
    </>
  );
};
