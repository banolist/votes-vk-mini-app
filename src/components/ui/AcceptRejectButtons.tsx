import { Show, type Component } from "solid-js";
import RejectDialog, { RejectForm } from "./RejectDialog";
import { Button } from "@kobalte/core/button";

type rejectFn = ((data: RejectForm) => void) | (() => void);

interface AcceptRejectButtonsProps {
  onAccept: () => void;
  onReject: rejectFn;
  noDialog?: boolean | undefined;
  disabled?: boolean | undefined;
  error?: Error | null;
}

const AcceptRejectButtons: Component<AcceptRejectButtonsProps> = (props) => {
  return (
    <div class="grid grid-cols-2 gap-1">
      <button
        class="btn btn-success"
        on:click={() => props.onAccept()}
        disabled={props.disabled}
      >
        Принять
      </button>
      <Show
        when={!props.noDialog}
        fallback={
          <Button
            onClick={() => (props.onReject as () => void)()}
            class="btn btn-error"
          >
            Отклонить
          </Button>
        }
      >
        <RejectDialog handleSubmit={props.onReject} error={props.error} />
      </Show>
      <Show when={props.error}>
        <div>{props.error?.message}</div>
      </Show>
    </div>
  );
};
export default AcceptRejectButtons;
