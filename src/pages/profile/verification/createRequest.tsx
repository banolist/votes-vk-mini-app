import { Button } from "@kobalte/core/button";
import { useNavigate } from "@solidjs/router";
import { useMutation } from "@tanstack/solid-query";
import { Show, type Component } from "solid-js";
import Card from "~/components/ui/Card";
import Page from "~/components/ui/Page";
import { graphql } from "~/graphql";
import execute from "~/utils/execute";

const createPreexpertProfile = graphql(`
  mutation createProfileVerification {
    createVerifyExpertRequest {
      id
    }
  }
`);

const CreateRequest: Component = () => {
  const navigate = useNavigate();
  const mutate = useMutation(() => ({
    mutationKey: ["createVerificationProfile"],
    mutationFn: async () => {
      await execute(createPreexpertProfile);
    },
    onSuccess: () => {
      navigate("../");
    },
  }));

  return (
    <Page title="запрос на верификацию профиля">
      <Card title="Верификация позволяет:">
        <div class="flex flex-col">
          <div>Участвовать в мероприятиях организатора</div>
          <div>Верифицировать других экспертов</div>
          <div>Создавать профессиональные сообщества</div>
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
        Отправить заявку
      </Button>
    </Page>
  );
};
export default CreateRequest;
