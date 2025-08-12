import { Dialog as Kobalte } from "@kobalte/core";
import {
  Accessor,
  JSX,
  Setter,
  Show,
  splitProps,
  type Component,
} from "solid-js";
import HeroiconsXMark16Solid from "~icons/heroicons/x-mark-16-solid";

interface ModalProps {
  open?: boolean;
  class?: string;
  onOpenChange?: Setter<boolean>;
  modal?: boolean;
  defaultOpen?: boolean;
  preventScroll?: boolean;
  forceMount?: boolean;
  children?: JSX.Element;
  triggerContent?: JSX.Element;
  title: string;
  triggerDisabled?: boolean;
}

const Modal: Component<ModalProps> = (props) => {
  const [, rest] = splitProps(props, [
    "children",
    "title",
    "triggerContent",
    "class",
  ]);
  return (
    <Kobalte.Root
      {...rest}
      open={props.open}
      onOpenChange={props.onOpenChange}
      modal={props.modal}
      preventScroll={props.preventScroll}
      forceMount={props.forceMount}
      defaultOpen={props.defaultOpen}
    >
      <Show when={props.triggerContent}>
        <Kobalte.Trigger
          disabled={props.triggerDisabled}
          class={`${props.class}`}
        >
          {props.triggerContent}
        </Kobalte.Trigger>
      </Show>
      <Kobalte.Portal>
        {/* Overlay */}
        <Kobalte.Overlay class="modal-backdrop" />
        {/* Контейнер модального окна */}

        <div class="modal modal-open modal-bottom sm:modal-middle z-10 self-center">
          <Kobalte.Content class="modal-box w-screen">
            {/* Заголовок и кнопка закрытия */}
            <div class="flex justify-between items-center">
              <Kobalte.Title class="font-bold text-lg">
                {props.title}
              </Kobalte.Title>
              <Kobalte.CloseButton class="btn btn-sm btn-circle btn-ghost">
                <HeroiconsXMark16Solid class="size-6" />
              </Kobalte.CloseButton>
            </div>
            {/* Описание */}
            <Show when={props.children}>
              <Kobalte.Description class="py-4">
                {props.children}
              </Kobalte.Description>
            </Show>
          </Kobalte.Content>
        </div>
      </Kobalte.Portal>
    </Kobalte.Root>
  );
};
export default Modal;

// const Modal1: Component<ModalProps> = (props) => {
//   const [, rest] = splitProps(props, [
//     "children",
//     "title",
//     "triggerContent",
//     "class",
//   ]);
//   return (
//     <Kobalte.Root
//       {...rest}
//       // open={props.open}
//       open={true}
//       onOpenChange={props.onOpenChange}
//       modal={props.modal}
//       preventScroll={props.preventScroll}
//       forceMount={props.forceMount}
//       defaultOpen={props.defaultOpen}
//     >
//       <Kobalte.Trigger class={props.class}>
//         {props.triggerContent}
//       </Kobalte.Trigger>
//       <Kobalte.Portal>
//         {/* Overlay */}
//         <Kobalte.Overlay class="modal-backdrop" />
//         {/* Контейнер модального окна */}
//         <div class="modal modal-open modal-bottom sm:modal-middle z-10 self-center">
//           <Kobalte.Content class="modal-box w-screen">
//             {/* Заголовок и кнопка закрытия */}
//             <div class="flex justify-between items-center">
//               <Kobalte.Title class="font-bold text-lg">
//                 {props.title}
//               </Kobalte.Title>
//               <Kobalte.CloseButton class="btn btn-sm btn-circle">
//                 <HeroiconsXMark16Solid />
//               </Kobalte.CloseButton>
//             </div>
//             {/* Описание */}
//             <Show when={props.children}>
//               <Kobalte.Description class="py-4">
//                 {props.children}
//               </Kobalte.Description>
//             </Show>
//           </Kobalte.Content>
//         </div>
//       </Kobalte.Portal>
//     </Kobalte.Root>
//   );
// };
