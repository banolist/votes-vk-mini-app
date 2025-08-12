import { createSignal, JSXElement, splitProps, type Component } from "solid-js";
import Modal from "./Modal";
import { Button } from "@kobalte/core/button";
interface AcceptRejectModalProps {
  title: string;
  class?: string;
  onAccept: () => void;
  onReject?: () => void;
  triggerDisabled?: boolean;
  triggerContent?: JSXElement;
}
const AcceptRejectModal: Component<AcceptRejectModalProps> = (props) => {
  const [opened, setOpened] = createSignal(false);
  const [modal, rest] = splitProps(props, [
    "title",
    "class",
    "triggerDisabled",
    "triggerContent",
  ]);
  const onReject = () => {
    setOpened(false);
    if (rest.onReject) {
      rest.onReject();
    }
  };
  const onAccept = () => {
    setOpened(false);
    rest.onAccept();
  };
  return (
    <Modal {...modal} onOpenChange={setOpened} open={opened()}>
      <div class="flex gap-1">
        <Button class="btn btn-success flex-1" onClick={onAccept}>
          Принять
        </Button>
        <Button class="btn btn-error flex-1" onClick={onReject}>
          Отклонить
        </Button>
      </div>
    </Modal>
  );
};
export default AcceptRejectModal;
