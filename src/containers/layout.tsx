import MyErrorFallback from "~/components/MyErrorFallback";
import Navbar from "./navbar";
import { Portal } from "solid-js/web";
import { Toast, toaster } from "@kobalte/core/toast";
import { createNotificationService } from "~/hooks/notifyService";
import HeroiconsXMark16Solid from "~icons/heroicons/x-mark-16-solid";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Layout(props: any) {
  createNotificationService({
    onNewNotification: (data) => {
      toaster.show((props) => (
        <Toast
          toastId={props.toastId}
          class="flex flex-col items-center justify-between gap-2 p-3 bg-base-100 shadow-2xl w-full"
        >
          <div class="flex w-full justify-between">
            <div>
              <Toast.Title class="text-2xl text-tx-secondary">
                {data.title}
              </Toast.Title>
              <Toast.Description class="font-light text-tx-secondary2">
                {data.message}
              </Toast.Description>
            </div>
            <Toast.CloseButton class="btn btn-ghost btn-circle">
              <HeroiconsXMark16Solid />
            </Toast.CloseButton>
          </div>
          <Toast.ProgressTrack class="toast__progress-track">
            <Toast.ProgressFill class="toast__progress-fill" />
          </Toast.ProgressTrack>
        </Toast>
      ));
    },
  });

  return (
    <>
      <Navbar />
      <main class="flex h-full w-full bg-base-200 items-center justify-center">
        <div class="p-2 h-full flex flex-col gap-4 md:w-2xl w-full">
          <MyErrorFallback>{props.children}</MyErrorFallback>
        </div>
        <Portal>
          <Toast.Region>
            <Toast.List class="toast z-50 w-sm" />
          </Toast.Region>
        </Portal>
      </main>
    </>
  );
}
