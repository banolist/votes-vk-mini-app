import { JSX, type Component } from "solid-js";
interface PageProps {
  title: string;
  children: JSX.Element;
  titleElements?: JSX.Element;
  class?: string;
}

const Page: Component<PageProps> = (props) => {
  return (
    <div class="flex flex-col gap-2.5">
      <div class="flex items-center justify-between">
        <div class="text-tx-secondary2 text-2xl uppercase">{props.title}</div>
        {props.titleElements}
      </div>
      <div class={"flex flex-col gap-3 w-full " + props.class}>
        {props.children}
      </div>
    </div>
  );
};
export default Page;
