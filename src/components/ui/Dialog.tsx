// components/ui/dialog.tsx
import { Dialog as KobalteDialog } from "@kobalte/core";
import {
  DialogContentProps,
  DialogTitleProps,
  DialogTriggerProps,
} from "@kobalte/core/dialog";
import HeroiconsXMark16Solid from "~icons/heroicons/x-mark-16-solid";
import { JSX, Show } from "solid-js";

export const Dialog = {
  Root: KobalteDialog.Root,
  Trigger: (
    props: DialogTriggerProps & { class?: string; children: JSX.Element }
  ) => {
    return <KobalteDialog.Trigger {...props} />;
  },
  Content: (
    props: DialogContentProps & { title?: string; children: JSX.Element }
  ) => (
    <KobalteDialog.Portal>
      <KobalteDialog.Overlay class="animate-overlayHide data-[expanded]:animate-overlayShow" />
      <div class="modal modal-open modal-bottom sm:modal-middle z-0">
        <KobalteDialog.Content
          class="modal-box animate-contentHide data-[expanded]:animate-contentShow"
          {...props}
        >
          <KobalteDialog.Title class="font-bold text-lg absolute top-3">
            {props.title}
          </KobalteDialog.Title>
          <KobalteDialog.Description class={"mt-6.5"}>
            {props.children}
          </KobalteDialog.Description>
          <KobalteDialog.CloseButton class="btn btn-sm btn-circle self-end absolute top-2 right-2">
            <HeroiconsXMark16Solid />
          </KobalteDialog.CloseButton>
        </KobalteDialog.Content>
      </div>
    </KobalteDialog.Portal>
  ),
};
