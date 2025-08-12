import { Button } from "@kobalte/core/button";
import {
  createForm,
  setResponse,
  setValues,
  zodForm,
} from "@modular-forms/solid";
import { useNavigate } from "@solidjs/router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/solid-query";
import bridge from "@vkontakte/vk-bridge";
import {
  createEffect,
  createMemo,
  createSignal,
  Match,
  Show,
  Switch,
  untrack,
  type Component,
} from "solid-js";
import { z } from "zod";
import {
  deleteMyExpertProfile,
  deleteMyOrganizatorProfile,
  deleteMyUserProfile,
} from "~/api/profile";
import { setSettingsMutation, settingsQuery } from "~/api/settings";
import AcceptRejectModal from "~/components/ui/AcceptRejectModal";
import Card from "~/components/ui/Card";
import { Checkbox } from "~/components/form/Checkbox";
import Modal from "~/components/ui/Modal";
import Page from "~/components/ui/Page";
import useMe from "~/hooks/useMe";
import useVKApi from "~/hooks/useVKapi";
import execute from "~/utils/execute";
import { hasRights, UserRights } from "~/utils/rights";

const settingsSchema = z.object({
  peopleRatingEnabled: z.boolean(),
  notificationsFromExperts: z.boolean(),
  notificationsFromAppEnabled: z.boolean().optional(),
});

type SettingsForm = typeof settingsSchema._type;

const Settings: Component = () => {
  const [form, { Form, Field }] = createForm<SettingsForm>({
    validate: zodForm(settingsSchema),
    initialValues: {
      notificationsFromExperts: false,
      peopleRatingEnabled: false,
    },
  });
  const queryClient = useQueryClient();
  const allowedScopes = useVKApi(() => ({
    method: "VKWebAppCheckAllowedScopes",
    props: {
      scopes: "notify",
    },
  }));
  const query = useQuery(() => ({
    queryKey: ["settings"],
    queryFn: async () => (await execute(settingsQuery)).settings,
  }));
  const mutation = useMutation(() => ({
    mutationKey: ["settings"],
    mutationFn: async (data: SettingsForm) => {
      const result = (await execute(setSettingsMutation, { data })).setSettings;
      setValues(form, result);
      queryClient.setQueryData(["settings"], result);
    },
    onSuccess: () => {
      setResponse(form, {
        message: "Настройки успешно сохранены",
      });
    },
  }));

  createEffect(() => {
    const data = query.data;
    if (!data) return;
    untrack(() => setValues(form, data));
  });

  const allowedNotifications = createMemo(
    () => allowedScopes.data?.result.find((v) => v.scope == "notify")?.allowed,
  );

  const mutationNotificationFromApp = useMutation(() => ({
    mutationKey: ["nofificationFromApp"],
    mutationFn: async () => {
      if (!allowedNotifications()) {
        if ((await bridge.send("VKWebAppAllowNotifications")).result) {
          return (
            await execute(setSettingsMutation, {
              data: { notificationsFromAppEnabled: false },
            })
          ).setSettings;
        }
      } else if ((await bridge.send("VKWebAppDenyNotifications")).result) {
        return (
          await execute(setSettingsMutation, {
            data: { notificationsFromAppEnabled: false },
          })
        ).setSettings;
      }
    },
    onSuccess: (result) => {
      setValues(form, { ...result });
      queryClient.setQueryData(["settings"], result);
    },
  }));

  const me = useMe();
  return (
    <Page title="Настройки">
      <Switch>
        <Match when={me.isLoading && query.isLoading}>Загрузка...</Match>
        <Match when={me.isError}>{me.error?.message}</Match>
        <Match when={query.isError}>{query.error?.message}</Match>
        <Match when={query.isFetched && query.data}>
          {(data) => (
            <>
              <Form
                class="flex flex-col"
                onSubmit={(data) => mutation.mutate(data)}
              >
                <div class="grid grid-cols-1 gap-2">
                  <Card class="px-2 gap-x-2">
                    <div class="text-xl font-bold mb-2">Основные</div>
                    <div class="flex flex-col gap-2">
                      <Field name="notificationsFromExperts" type="boolean">
                        {(field, props) => (
                          <Checkbox
                            {...props}
                            label="Уведомления от экспертов"
                            checked={field.value}
                            error={field.error}
                          />
                        )}
                      </Field>

                      <Button
                        class="btn btn-accent"
                        onClick={() => mutationNotificationFromApp.mutate()}
                        disabled={mutationNotificationFromApp.isPending}
                      >
                        Разрешить уведомления от приложения
                      </Button>
                      <Show when={mutationNotificationFromApp.isError}>
                        <div class="text-error">
                          {mutationNotificationFromApp.error?.message}
                        </div>
                      </Show>
                      <DeleteProfile type="user" />
                    </div>
                  </Card>
                  <Show when={hasRights(me.data!.rights, UserRights.Expert)}>
                    <Card class="px-2">
                      <div class="text-xl font-bold">Эксперт</div>
                      <Field name="peopleRatingEnabled" type="boolean">
                        {(field, props) => (
                          <Checkbox
                            {...props}
                            label="Народный рейтинг"
                            checked={field.value}
                            error={field.error}
                          />
                        )}
                      </Field>
                      <div class="flex flex-col gap-2">
                        <DeleteProfile type="expert" />
                      </div>
                    </Card>
                  </Show>
                  <Show
                    when={hasRights(me.data!.rights, UserRights.Organizator)}
                  >
                    <Card class="px-2 gap-x-2">
                      <div class="text-xl font-bold mb-2">Организатор</div>
                      <div class="flex flex-col gap-2">
                        <DeleteProfile type="organizator" />
                      </div>
                    </Card>
                  </Show>
                </div>
                <div class="flex flex-col gap-2 items-center">
                  <Button
                    type="submit"
                    class="btn btn-primary w-full btn-wide mt-2"
                    disabled={form.submitting}
                  >
                    {!form.submitting ? "Сохранить" : "Сохранение..."}
                  </Button>
                  <Show when={form.response.message}>
                    <div>{form.response.message}</div>
                  </Show>
                </div>
              </Form>
            </>
          )}
        </Match>
      </Switch>
    </Page>
  );
};
export default Settings;

const DeleteProfile: Component<{ type: "expert" | "user" | "organizator" }> = (
  props,
) => {
  const [openModal, setOpenModal] = createSignal(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const mutation = useMutation(() => ({
    mutationKey: ["deleteProfile"],
    mutationFn: async () => {
      if (props.type == "user") {
        await execute(deleteMyUserProfile);
      } else if (props.type == "expert") {
        await execute(deleteMyExpertProfile);
      } else if (props.type == "organizator") {
        await execute(deleteMyOrganizatorProfile);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      setOpenModal(false);
      navigate("/");
    },
  }));

  return (
    <>
      <Modal
        title="Удалить профиль?"
        onOpenChange={setOpenModal}
        open={openModal()}
        class="btn-error btn"
        triggerContent={
          <Switch>
            <Match when={props.type == "user"}>Удалить профиль участника</Match>
            <Match when={props.type == "expert"}>
              Удалить профиль эксперта
            </Match>
            <Match when={props.type == "organizator"}>
              Удалить профиль Организатора
            </Match>
          </Switch>
        }
      >
        <div class="flex gap-1">
          <button
            class="btn btn-error"
            disabled={mutation.isPending}
            onClick={() => mutation.mutate()}
          >
            Удалить
          </button>
          <button onClick={() => setOpenModal(false)} class="btn">
            Отмена
          </button>
        </div>
        <Show when={mutation.isError}>{mutation.error?.message}</Show>
      </Modal>
    </>
  );
};
