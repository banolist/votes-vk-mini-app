import { A, useParams } from "@solidjs/router";
import {
  createContext,
  createSignal,
  Match,
  Show,
  Switch,
  type Component,
} from "solid-js";

import Name from "~/components/ui/ExpertName";
import ExpandText from "~/components/ui/ExpandText";
import { StatListField } from "~/components/ui/StatFields";
import execute from "~/utils/execute";
import { Button } from "@kobalte/core/button";

import ProfileApplets from "~/components/ui/ProfileApplets";
import useMe from "~/hooks/useMe";
import { useMutation, useQuery, useQueryClient } from "@tanstack/solid-query";
import {
  RepresentativeExpertRequestType,
  VoteTypeRating,
} from "~/graphql/graphql";
import { hasRights, UserRights } from "~/utils/rights";
import Modal from "~/components/ui/Modal";
import { createForm, reset, setResponse, zodForm } from "@modular-forms/solid";
import { z } from "~/i18n/i18n";
import TariffSelect from "~/components/ui/TariffSelect";
import { TextField } from "~/components/form/TextField";
import VoteDialog, { VoteForm } from "~/components/ui/VoteDialog";

import {
  assignTariffMutatuion,
  deleteVotePeopleMutate,
  expertProfileQuery as userQuery,
  verificateUserAdmin,
  voteInPeopleRaitingMutate,
  preExpertRequestCreateQuery,
  assignAdminRights,
} from "~/api/expertProfile";
import Avatar from "~/components/ui/Avatar";
import Card from "~/components/ui/Card";
import FormResponce from "~/components/form/formResponce";
import ExpertCardPage from "~/components/ui/expertPage";

interface ContextValues {
  user: string;
}

const context = createContext(null);

const UserProfile: Component = () => {
  const { id } = useParams<{ id: string }>();
  const me = useMe();
  const queryClient = useQueryClient();
  const query = useQuery(() => ({
    queryKey: ["user", id],
    queryFn: async () => {
      const resp = (await execute(userQuery, { id: id })).user;
      return resp;
    },
  }));

  const votePeopleMutation = useMutation(() => ({
    mutationKey: ["votePeopleRaiting", id],
    mutationFn: async (data: VoteForm) => {
      if (data.voteType !== "delete") {
        await execute(voteInPeopleRaitingMutate, {
          data: {
            typeRating: VoteTypeRating.People,
            targetExpertID: id,
            feedback: data.feedback,
            isLike: data.voteType === "positive" ? true : false,
          },
        });
      } else {
        await execute(deleteVotePeopleMutate, {
          data: {
            typeRating: VoteTypeRating.People,
            targetExpertID: id,
            feedback: data.feedback,
          },
        });
      }
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["user", id] });
    },
  }));

  return (
    <ExpertCardPage
      userID={id}
      afterCard={(user) => (
        <Show when={me.data?.agreesTermsAt && user().expertProfile}>
          {(profile) => (
            <>
              <Show when={hasRights(me.data?.rights || 0, UserRights.Verified)}>
                <A
                  class="btn btn-accent"
                  href={`https://vk.com/id${user().platforms?.platformID}`}
                >
                  Профиль ВК
                </A>
              </Show>
              <Show when={profile().peopleRatingEnabled}>
                <VoteDialog
                  myVote={profile().myPeopleVote}
                  error={votePeopleMutation.error?.message}
                  onNewEvent={(v) => votePeopleMutation.mutate(v)}
                  class="btn btn-accent"
                  title="Голосовать в народном рейтинге"
                  triggerText="Голосовать в народном рейтинге"
                  disabled={me.data?.id == id}
                />
              </Show>
              <Show
                when={hasRights(me.data?.rights || 0, UserRights.PreExpert)}
              >
                <PrExertRequestBtn rights={profile().rights} />
              </Show>

              <Show when={hasRights(me.data?.rights || 0, UserRights.Admin)}>
                <AssignAdminRightsButton rights={profile().rights} />
                <AssignTariffModal userID={id} />
                <VerificateButton rights={user().rights} />
                <div class="flex flex-col *:btn">
                  <Button class="btn-error">Заблокировать</Button>
                </div>
              </Show>
            </>
          )}
        </Show>
      )}
    />
  );
};
export default UserProfile;

const PrExertRequestBtn: Component<{ rights: UserRights }> = (props) => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const me = useMe();
  const mutation = useMutation(() => ({
    mutationKey: ["user", id],
    mutationFn: async () => {
      if (!me.data) return;
      await execute(preExpertRequestCreateQuery, {
        data: {
          targetUserID: id,
          representativeUserID: me.data.id,
          type: RepresentativeExpertRequestType.Request,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["expertProfile", id],
      });
    },
  }));
  return (
    <Button
      onClick={() => mutation.mutate()}
      class="btn btn-accent"
      disabled={!hasRights(props.rights, UserRights.Verified)}
    >
      Стать представителем
    </Button>
  );
};

const VerificateButton: Component<{ rights: UserRights }> = (props) => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const mutation = useMutation(() => ({
    mutationKey: ["user", id],
    mutationFn: async () => {
      await execute(verificateUserAdmin, { userID: id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user", id],
      });
    },
  }));
  return (
    <Button
      onClick={() => mutation.mutate()}
      class="btn "
      disabled={
        !hasRights(props.rights, UserRights.Admin) && mutation.isPending
      }
    >
      {hasRights(props.rights, UserRights.Verified)
        ? "Убрать верификацию"
        : "Верифицировать"}
    </Button>
  );
};

const AssignAdminRightsButton: Component<{ rights: UserRights }> = (props) => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const mutation = useMutation(() => ({
    mutationKey: ["user", id],
    mutationFn: async () => {
      await execute(assignAdminRights, { id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user", id],
      });
    },
  }));
  return (
    <Button
      onClick={() => mutation.mutate()}
      class="btn"
      disabled={!hasRights(props.rights, UserRights.Admin)}
    >
      Назначить права администратора
    </Button>
  );
};

const assignTariffSchema = z.object({
  tariffID: z.string(),
  duration: z.number().min(1).max(12),
});

type AssignTariffForm = typeof assignTariffSchema._type;

const AssignTariffModal: Component<{ userID: string }> = (props) => {
  const [form, { Form, Field }] = createForm<AssignTariffForm>({
    validate: zodForm(assignTariffSchema),
    initialValues: {
      duration: 1,
    },
    validateOn: "change",
  });

  const mutation = useMutation(() => ({
    mutationKey: ["user"],
    mutationFn: async (data: AssignTariffForm) => {
      await execute(assignTariffMutatuion, {
        data: {
          userID: props.userID,
          tariffID: data.tariffID,
          duration: data.duration,
        },
      });
    },
    onSuccess: () => setOpen(false),
    onError: (err) =>
      setResponse(form, {
        status: "error",
        message: err.message,
      }),
  }));

  const [open, setOpen] = createSignal(false);

  return (
    <Modal
      title="Назначить тариф пользователю"
      triggerContent="Назначить тариф"
      class="btn"
      onOpenChange={setOpen}
      open={open()}
    >
      <Form
        onSubmit={(data) => mutation.mutate(data)}
        class="flex flex-col gap-2"
      >
        <Field name="tariffID">
          {(field, props) => (
            <TariffSelect
              {...props}
              label="Тариф"
              value={field.value}
              error={field.error}
            />
          )}
        </Field>
        <Field name="duration" type="number">
          {(field, props) => (
            <TextField
              {...props}
              label="Месяцы"
              value={field.value?.toString()}
              error={field.error}
              type="number"
            />
          )}
        </Field>
        <FormResponce response={form.response} />
        <Button
          type="submit"
          class="btn btn-accent"
          disabled={mutation.isPending}
        >
          Назначить
        </Button>
      </Form>
    </Modal>
  );
};

// const VoteInPeopleRating: Component<{
//   myVote?: VoteType;
//   expertId: string;
//   open?: boolean;
//   setOpen?: Setter<boolean>;
// }> = (props) => {
//   const [voteType, setvoteType] = createSignal<VoteType>("delete");
//   const [feedback, setFeedback] = createSignal("");
//   const [opened, setOpened] = createSignal(false);
//   createEffect(() => {
//     if (props.open) {
//       setOpened(props.open);
//     }
//     if (props.myVote) {
//       setvoteType(props.myVote !== "positive" ? "positive" : "negative");
//     }
//   });

//   function setOpen(o: boolean) {
//     if (props.setOpen) {
//       props.setOpen(o);
//     }
//     setOpened(o);
//   }
//   createEffect(() => {
//     if (props.open) {
//       setOpened(props.open);
//     }
//   });

//   const mutation = useMutation(() => ({
//     mutationKey: ["voteExpert"],
//     mutationFn: async () => {
//       if (voteType() !== "delete") {
//         await execute(voteInPeopleRaitingMutate, {
//           data: {
//             typeRating: VoteTypeRating.Expert,
//             targetExpertID: props.expertId,
//             feedback: feedback(),
//             isLike: voteType() === "positive" ? true : false,
//           },
//         });
//       } else {
//         await execute(deleteVotePeopleMutate, {
//           data: {
//             typeRating: VoteTypeRating.Expert,
//             targetExpertID: props.expertId,
//             feedback: feedback(),
//           },
//         });
//       }
//     },
//     onSuccess: () => {
//       setOpen(false);
//     },
//   }));

//   async function submit(e: SubmitEvent) {}
//   return (
//     <Dialog.Root onOpenChange={setOpen} open={opened()}>
//       <Dialog.Trigger class="btn btn-accent">
//         Проголосовать в народном рейтинге
//       </Dialog.Trigger>
//       <Dialog.Content title="Народный рейтинг">
//         <form onSubmit={submit}>
//           <div class="flex flex-col gap-2">
//             <span>Голос</span>
//             <ToggleGroup
//               value={voteType()}
//               onChange={setvoteType}
//               class="flex w-full gap-1"
//             >
//               <Show when={props.myVote !== "positive"}>
//                 <ToggleGroup.Item
//                   class="btn btn-soft data-[pressed]:bg-success data-[pressed]:text-success-content"
//                   value="positive"
//                 >
//                   Положительно
//                 </ToggleGroup.Item>
//               </Show>
//               <Show when={props.myVote !== "negative"}>
//                 <ToggleGroup.Item
//                   class="btn btn-soft data-[pressed]:bg-error data-[pressed]:text-error-content"
//                   value="negative"
//                 >
//                   Отрицательно
//                 </ToggleGroup.Item>
//               </Show>
//               <Show when={props.myVote !== "delete"}>
//                 <ToggleGroup.Item
//                   class="btn btn-soft data-[pressed]:bg-error data-[pressed]:text-error-content"
//                   value="delete"
//                 >
//                   удалить
//                 </ToggleGroup.Item>
//               </Show>
//             </ToggleGroup>
//             <TextField
//               value={feedback()}
//               onChange={setFeedback}
//               class="flex flex-col gap-1"
//             >
//               <TextField.Label>Отзыв</TextField.Label>
//               <TextField.TextArea
//                 class="input p-2 w-full text-wrap"
//                 autoResize
//                 wrap="hard"
//               />
//             </TextField>
//             <CapchaInput />
//             <Show when={mutation.isError}>{mutation.error?.message}</Show>
//             <Button
//               type="submit"
//               class="btn btn-primary w-full"
//               disabled={mutation.isPending}
//             >
//               Отправить
//             </Button>
//           </div>
//         </form>
//       </Dialog.Content>
//     </Dialog.Root>
//   );
// };
