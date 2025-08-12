import {
  createContext,
  createSignal,
  Setter,
  Show,
  useContext,
  type Component,
} from "solid-js";
import Modal from "~/components/ui/Modal";
import { Tabs } from "@kobalte/core/tabs";
import useMe from "~/hooks/useMe";
import { hasRights, UserRights } from "~/utils/rights";
import ExpertCreateForm from "./expertEventForm";
import OrganizatorCreateForm from "./OrganizatorEvent";

interface TariffLimits {
  votesPerEvent: number;
  eventsPerMonth: number;
  activeWordDurationHours: number;
}
interface ContextValues {
  queryKey: () => unknown[];
  tariffLimits?: TariffLimits;
  setOpenDialog: Setter<boolean>;
  representativeForUser?: string;
}

const Context = createContext<ContextValues | null>(null);

const CreateEventModal: Component<{
  queryKey: () => unknown[];
  tariffLimits?: TariffLimits;
  representativeForUser?: string;
  disabled?: boolean;
}> = (props) => {
  const [openCreateDialog, setOpenCreateDialog] = createSignal(false);
  const [formType, setFormType] = createSignal<"expert" | "organizator">(
    "expert",
  );
  const me = useMe();

  return (
    <Context.Provider value={{ ...props, setOpenDialog: setOpenCreateDialog }}>
      <Modal
        onOpenChange={setOpenCreateDialog}
        open={openCreateDialog()}
        title="Создание мероприятия"
        class="btn btn-primary w-full"
        triggerContent="Создать"
        triggerDisabled={(props.tariffLimits?.eventsPerMonth || 0) <= 0}
      >
        {/* <label for="toggle-event-form">Тип мероприятия</label> */}
        <Tabs value={formType()} onChange={setFormType}>
          <Tabs.List class="justify-center tabs tabs-border">
            <Tabs.Trigger class="tab" value="expert">
              Эксперт
            </Tabs.Trigger>
            <Show
              when={hasRights(me.data?.rights || 0, UserRights.Organizator)}
            >
              <Tabs.Trigger class="tab" value="organizator">
                Организатор
              </Tabs.Trigger>
            </Show>
          </Tabs.List>
          <Tabs.Content value="expert">
            <ExpertCreateForm />
          </Tabs.Content>
          <Tabs.Content value="organizator">
            <OrganizatorCreateForm />
          </Tabs.Content>
        </Tabs>
      </Modal>
    </Context.Provider>
  );
};

export default CreateEventModal;

export const useCtx = () => {
  const ctx = useContext(Context);
  if (!ctx) {
    throw new Error("context not provided");
  }
  return ctx;
};
