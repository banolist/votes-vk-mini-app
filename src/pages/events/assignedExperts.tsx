import { Button } from "@kobalte/core/button";
import HeroiconsXMark16Solid from "~icons/heroicons/x-mark-16-solid";
import { Search } from "@kobalte/core/search";
import HeroiconsChevronUpDown16Solid from "~icons/heroicons/chevron-up-down-16-solid";
import { Tabs } from "@kobalte/core/tabs";
import { createForm, reset, setResponse, zodForm } from "@modular-forms/solid";
import { useParams } from "@solidjs/router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/solid-query";
import dayjs from "dayjs";
import { Maybe } from "graphql/jsutils/Maybe";
import {
  Accessor,
  createEffect,
  createMemo,
  createSignal,
  Match,
  Setter,
  Show,
  Switch,
  type Component,
} from "solid-js";
import { z } from "zod";
import {
  acceptRespnceExpertToOrganizatorEventMutation,
  eventCardPageQuery,
  expertResponseToEventQuery,
  inviteExpertToOrganizatorEvent,
  rejectRespnceExpertToOrganizatorEventMutation,
} from "~/api/events";
import AcceptRejectButtons from "~/components/ui/AcceptRejectButtons";
import ExpertCard from "~/components/ui/ExpertCard";
import FormResponce from "~/components/form/formResponce";
import { TextField } from "~/components/form/TextField";
import Modal from "~/components/ui/Modal";
import Page from "~/components/ui/Page";
import {
  ExpertResponseToEventStatus,
  ExpertResponseToEventType,
} from "~/graphql/graphql";
import createVirtualList from "~/hooks/createVirtualList";
import execute from "~/utils/execute";
import { graphql } from "~/graphql";
// появилась проблема с рендерингом если вернуться с другой страницы после добавления списка назначенных экспертов

const AssignedExpertsToEventPage: Component = () => {
  const { id } = useParams();
  const parentEventQuery = useQuery(() => ({
    queryKey: ["event", id],
    queryFn: async () => (await execute(eventCardPageQuery, { id })).event,
  }));

  const { List: ListRequest } = createVirtualList(() => ({
    queryKey: ["assignedExpertsToEvent", id],
    estimateSize: 180,
    pageSize: 10,
    autoMeasure: true,

    queryFn: async ({ pageParam }) =>
      (
        await execute(expertResponseToEventQuery, {
          first: 10,
          after: pageParam,
          where: {
            type: ExpertResponseToEventType.Request,
            hasEventWith: [{ id }],
          },
        })
      ).expertResponseToEvents,
  }));
  const { List: ListInvites } = createVirtualList(() => ({
    queryKey: ["assignedExpertsToEventInvites", id],
    estimateSize: 180,
    pageSize: 10,
    autoMeasure: true,

    queryFn: async ({ pageParam }) =>
      (
        await execute(expertResponseToEventQuery, {
          first: 10,
          after: pageParam,
          where: {
            hasEventWith: [{ id }],
            type: ExpertResponseToEventType.Invitation,
          },
        })
      ).expertResponseToEvents,
  }));

  return (
    <Page title="Управление экпертами">
      <Tabs>
        <Tabs.List class="justify-center tabs tabs-border mb-2">
          <Tabs.Trigger class="tab" value="requests">
            Отклики
          </Tabs.Trigger>
          <Tabs.Trigger class="tab" value="invites">
            Приглашения
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="requests">
          <Show when={parentEventQuery.data}>
            {(event) => (
              <ListRequest>
                {(item) => <Item {...item} parentEvent={event()} />}
              </ListRequest>
            )}
          </Show>
        </Tabs.Content>
        <Tabs.Content value="invites">
          <RepondExpertsModal />
          <ListInvites>
            {(item) => (
              <ExpertCard
                {...item.user}
                {...item.user.expertProfile}
                href={`/experts/${item.user.id}`}
              />
            )}
          </ListInvites>
          {/* <Button class="btn btn-primary w-full">Добавить эксперта</Button> */}
        </Tabs.Content>
      </Tabs>
    </Page>
  );
};
export default AssignedExpertsToEventPage;

const searchExpertQuery = graphql(`
  query searchExpert($query: String!) {
    searchExpertToOrganizatorEvent(query: $query) {
      id
      firstName
      lastName
      avatar
      nickname
    }
  }
`);
interface Expert {
  id: string;
  firstName: string;
  lastName: string;
  avatar?: string | null;
  nickname?: string | null;
}
function ExpertSelect(props: {
  selectedExpert: Accessor<Expert | null>;
  setSelectedExpert: Setter<Expert | null>;
}) {
  let inputRef: HTMLInputElement | undefined;

  const [inputText, setInputText] = createSignal("");
  const query = useQuery(() => ({
    queryKey: ["searchExpert", inputText()],
    queryFn: async () => {
      return (await execute(searchExpertQuery, { query: inputText() }))
        .searchExpertToOrganizatorEvent;
    },
  }));

  return (
    <Search<Expert>
      options={query.data || []}
      value={props.selectedExpert()}
      onChange={(e) => {
        if (inputRef) {
          inputRef.value = `${e?.firstName} ${e?.lastName}`;
        }
        props.setSelectedExpert(e);
      }}
      onInputChange={setInputText}
      debounceOptionsMillisecond={300}
      optionValue="id"
      optionTextValue={(e) => `${e.firstName} ${e.lastName}`}
      placeholder="Найти эксперта..."
      required
      class="border-0"
      itemComponent={(props) => (
        <Search.Item
          item={props.item}
          class="flex justify-between items-center px-2 hover:bg-base-200 border-0"
        >
          <Search.ItemLabel>
            <SelectItem {...props.item.rawValue} />
          </Search.ItemLabel>
        </Search.Item>
      )}
    >
      <Search.Control class="input flex w-full max-w-md">
        <Search.Indicator>
          <Search.Icon>{/* <MagnifyingGlassIcon /> */}</Search.Icon>
        </Search.Indicator>
        <Search.Input
          ref={inputRef}
          value={
            props.selectedExpert()
              ? `${props.selectedExpert()?.firstName} ${props.selectedExpert()?.lastName}`
              : ""
          }
        />
      </Search.Control>
      <Search.Portal>
        <Search.Content
          class="w-full max-w-md max-h-52 overflow-auto bg-base-100 rounded-xl border-1 border-base-content/20 z-20"
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <Search.Listbox class="py-1 inline-block w-full gap-0.5 cursor-default space-y-1" />
          <Search.NoResult class="flex flex-col font-bold items-center p-2">
            <div>Эксперт не найден</div>
          </Search.NoResult>
        </Search.Content>
      </Search.Portal>
    </Search>
  );
}
const SelectItem: Component<Expert> = (props) => {
  return (
    <div class="flex gap-2 items-center">
      <div class="avatar-placeholder">
        <div class="avatar w-12 ">
          <img class="rounded-full" src={props.avatar || ""} alt="" />
        </div>
      </div>
      <div class="text-2xl">
        {props.firstName} {props.lastName}
      </div>
    </div>
  );
};

const RepondExpertsModal: Component = () => {
  const { id } = useParams();
  const [form, { Form, Field }] = createForm<CreateChildrenEventForm>({
    validate: zodForm(createChildEventSchema),
  });

  const [openModal, setOpenModal] = createSignal(false);
  const [selectedExpert, setSelectedExpert] = createSignal<Expert | null>(null);
  const clientQuery = useQueryClient();
  const onError = (err: Error) =>
    setResponse(form, {
      message: err.message,
      status: "error",
    });
  const onSuccess = () => {
    clientQuery.invalidateQueries({
      queryKey: ["assignedExpertsToEventInvites"],
    });
    setOpenModal(false);
  };
  const mutation = useMutation(() => ({
    mutationKey: ["assignExpertsToEventsCardInvites"],
    mutationFn: async (data: CreateChildrenEventForm) => {
      const exp = selectedExpert();
      if (!exp) {
        return;
      }
      console.log(exp.id);
      await execute(inviteExpertToOrganizatorEvent, {
        data: {
          eventID: id,
          expertID: exp.id,
          create: {
            duration: data.duration,
            promoWord: data.promoword,
            startAt: dayjs(data.startAt).format(),
          },
        },
      });
    },
    onSuccess,
    onError,
  }));
  return (
    <>
      <Modal
        title="Пригласить эксперта"
        triggerContent={"Добавить эксперта"}
        class="btn btn-accent w-full mb-2"
        open={openModal()}
        onOpenChange={setOpenModal}
      >
        <ExpertSelect
          selectedExpert={selectedExpert}
          setSelectedExpert={setSelectedExpert}
        />
        <Form onSubmit={(data) => mutation.mutate(data)}>
          <Field name="promoword">
            {(field, props) => (
              <TextField
                {...props}
                name={field.name}
                error={field.error}
                label="Промослово мероприятия"
                required
              />
            )}
          </Field>
          <Field name="startAt">
            {(field, props) => (
              <TextField
                {...props}
                type="datetime-local"
                name={field.name}
                error={field.error}
                label="Начало мероприятия"
                required
              />
            )}
          </Field>
          <Field name="duration" type="number">
            {(field, props) => (
              <TextField
                {...props}
                type="number"
                name={field.name}
                error={field.error}
                label="Длительность мероприятия"
                required
              />
            )}
          </Field>
          <FormResponce response={form.response} />
          <Button class="btn btn-accent w-full mt-2" type="submit">
            Отправить
          </Button>
        </Form>
      </Modal>
    </>
  );
};

interface ItemProps {
  id: string;
  status: ExpertResponseToEventStatus;
  parentEvent: {
    startTime: string;
  };
  user: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: Maybe<string>;
    expertProfile?: Maybe<{
      about?: Maybe<string>;
      region: { regionName: string };
    }>;
  };
}

const createChildEventSchema = z.object({
  promoword: z.string(),
  startAt: z.string(),
  duration: z.number(),
});

type CreateChildrenEventForm = typeof createChildEventSchema._type;
const Item: Component<ItemProps> = (props) => {
  const { id: eventID } = useParams();
  const [form, { Form, Field }] = createForm<CreateChildrenEventForm>({
    validate: zodForm(createChildEventSchema),
  });
  const [openModal, setOpenModal] = createSignal(false);
  const clientQuery = useQueryClient();
  const onError = (err: Error) =>
    setResponse(form, {
      message: err.message,
      status: "error",
    });
  const onSuccess = () =>
    clientQuery.invalidateQueries({
      queryKey: ["assignedExpertsToEvent"],
    });

  const mutationAccept = useMutation(() => ({
    mutationKey: ["assignExpertsToEventsCard"],
    mutationFn: async (data: CreateChildrenEventForm) => {
      await execute(acceptRespnceExpertToOrganizatorEventMutation, {
        id: props.id,
        data: {
          duration: data.duration,
          promoWord: data.promoword,
          startAt: dayjs(data.startAt).format(),
        },
      });
    },
    onSuccess,
    onError,
  }));
  const mutationReject = useMutation(() => ({
    mutationKey: ["assignExpertsToEventsCard"],
    mutationFn: async () => {
      await execute(rejectRespnceExpertToOrganizatorEventMutation, {
        id: props.id,
      });
    },
    onSuccess,
    onError,
  }));

  createEffect(() => {
    reset(form, {
      initialValues: {
        startAt: dayjs(props.parentEvent.startTime).format("YYYY-MM-DDTHH:mm"),
      },
    });
  });

  return (
    <>
      <Modal
        title="Принять отклик"
        open={openModal()}
        onOpenChange={setOpenModal}
      >
        <Form onSubmit={(data) => mutationAccept.mutate(data)}>
          <Field name="promoword">
            {(field, props) => (
              <TextField
                {...props}
                name={field.name}
                error={field.error}
                label="Промослово мероприятия"
                required
              />
            )}
          </Field>
          <Field name="startAt">
            {(field, props) => (
              <TextField
                {...props}
                type="datetime-local"
                name={field.name}
                error={field.error}
                label="Начало мероприятия"
                required
              />
            )}
          </Field>
          <Field name="duration" type="number">
            {(field, props) => (
              <TextField
                {...props}
                type="number"
                name={field.name}
                error={field.error}
                label="Длительность мероприятия"
                required
              />
            )}
          </Field>
          <FormResponce response={form.response} />
          <Button class="btn btn-accent w-full mt-2" type="submit">
            Отправить
          </Button>
        </Form>
      </Modal>
      <ExpertCard
        {...props.user}
        {...props.user.expertProfile}
        href={`/experts/${props.user.id}`}
        buttomContent={
          <AcceptRejectButtons
            noDialog
            onReject={() => mutationReject.mutate()}
            onAccept={() => setOpenModal(true)}
          />
        }
      />
    </>
  );
};
