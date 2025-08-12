import { Component } from "solid-js";
import { StatApplet } from "./StatFields";
import HeroiconsAcademicCapSolid from "~icons/heroicons/academic-cap-solid";
import HeroiconsUserGroup20Solid from "~icons/heroicons/user-group-20-solid";
import HeroiconsMegaphone20Solid from "~icons/heroicons/megaphone-20-solid";
const ProfileApplets: Component<{
  class?: string;
  data: {
    countEvents: number;
    votesCount: number;
    peopleVotesCount: number;
  };
}> = (props) => {
  return (
    <div class={"flex gap-0.5 " + props.class || ""}>
      {/* stat */}
      {/* <div class="bg-base-200 rounded-lg w-full grid grid-cols-3 p-2 gap-0.5 items-center"> */}
      {/*   <div class="text-xs text-base-content/60">Количество мероприятий</div> */}
      {/*   <div class="text-2xl font-bold text-end">{props.data.countEvents}</div> */}
      {/*   <HeroiconsMegaphone20Solid class="size-9 justify-self-end text-base-content/80" /> */}
      {/* </div> */}
      {/* <div class="bg-base-200 rounded-lg w-full grid grid-cols-3 p-2 gap-0.5 items-center"> */}
      {/*   <div class="text-xs text-base-content/60">Количество мероприятий</div> */}
      {/*   <div class="text-2xl font-bold text-end">{props.data.countEvents}</div> */}
      {/*   <HeroiconsMegaphone20Solid class="size-9 justify-self-end text-base-content/80" /> */}
      {/* </div> */}
      {/* <div class="bg-base-200 rounded-lg w-full grid grid-cols-3 p-2 gap-0.5 items-center"> */}
      {/*   <div class="text-xs text-base-content/60">Количество мероприятий</div> */}
      {/*   <div class="text-2xl font-bold text-end">{props.data.countEvents}</div> */}
      {/*   <HeroiconsMegaphone20Solid class="size-9 justify-self-end text-base-content/80" /> */}
      {/* </div> */}
      {/**/}
      <StatApplet
        text="Количество мероприятий"
        stat={props.data.countEvents}
        icon={HeroiconsMegaphone20Solid}
      />
      <StatApplet
        text="Экспертный Рейтинг"
        stat={props.data.votesCount}
        icon={HeroiconsAcademicCapSolid}
      />
      <StatApplet
        text="Народный рейтинг"
        stat={props.data.peopleVotesCount}
        icon={HeroiconsUserGroup20Solid}
      />
    </div>
  );
};

// const ProfileApplets: Component<{
//   data: {
//     countEvents: number;
//     votesCount: number;
//     peopleVotesCount: number;
//   };
// }> = (props) => {
//   return (
//     <div class="flex flex-row gap-1 w-full">
//       <StatApplet
//         text="Количество мероприятий"
//         stat={props.data.countEvents}
//         icon={HeroiconsMegaphone20Solid}
//       />
//       <StatApplet
//         text="Экспертный Рейтинг"
//         stat={props.data.votesCount}
//         icon={HeroiconsAcademicCapSolid}
//       />
//       <StatApplet
//         text="Народный рейтинг"
//         stat={props.data.peopleVotesCount}
//         icon={HeroiconsUserGroup20Solid}
//       />
//     </div>
//   );
// };
export default ProfileApplets;
