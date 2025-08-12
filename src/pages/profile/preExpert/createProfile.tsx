// создание заявки на добавление прав представительтва

import { Button } from "@kobalte/core/button";
import { useNavigate } from "@solidjs/router";
import { useMutation } from "@tanstack/solid-query";
import { type Component, Show } from "solid-js";
import Card from "~/components/ui/Card";
import Page from "~/components/ui/Page";
import { graphql } from "~/graphql";
import execute from "~/utils/execute";
const createPreexpertProfile = graphql(`
  mutation createProfilePreExpert {
    createProfileRequest(input: { changeType: create, type: pre_expert }) {
      id
    }
  }
`);

const CreateRequest: Component = () => {
  const navigate = useNavigate();
  const mutate = useMutation(() => ({
    mutationKey: ["createPreExpertProfile"],
    mutationFn: async () => {
      await execute(createPreexpertProfile);
    },
    onSuccess: () => {
      navigate("/menu");
    },
  }));

  return (
    <Page title="запрос на права представителя">
      <Card title="Права представителя позволяет:">
        <div class="flex flex-col">
          <div>Вести мероприятия от имени другого эксперта</div>
        </div>
      </Card>
      <Show when={mutate.isError}>
        <div>{mutate.error?.message}</div>
      </Show>
      <Button
        class="btn btn-accent"
        on:click={() => mutate.mutate()}
        disabled={mutate.isPending}
      >
        Создать заявку
      </Button>
    </Page>
  );
};
export default CreateRequest;
