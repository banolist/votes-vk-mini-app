import { useNavigate, useParams } from "@solidjs/router";
import { useMutation, useQuery } from "@tanstack/solid-query";
import { Match, Switch, type Component } from "solid-js";
import AcceptRejectButtons from "~/components/ui/AcceptRejectButtons";
import Card from "~/components/ui/Card";
import ExpertCard from "~/components/ui/ExpertCard";
import Page from "~/components/ui/Page";
import { graphql } from "~/graphql";
import execute from "~/utils/execute";
const verificationCardQuery = graphql(`
  query verificationCardByID($id: ID!) {
    verifyExpertRequest(id: $id) {
      creator {
        id
        firstName
        lastName
        nickname
        expertProfile {
          about
        }
      }
      status
      createdAt
    }
  }
`);

const verficationAccept = graphql(`
  mutation verificationAccept(
    $id: ID!
    $isAccept: Boolean!
    $isReject: Boolean!
  ) {
    voteVerifyExpert(
      vote: {
        verifyExpertRequestId: $id
        isNegative: $isReject
        isPositive: $isAccept
      }
    ) {
      id
    }
  }
`);
const VerificationPage: Component = () => {
  const { id } = useParams();
  const query = useQuery(() => ({
    queryKey: ["verificationCard", id],
    queryFn: async () => await execute(verificationCardQuery, { id }),
  }));
  const navigate = useNavigate();
  const mutation = useMutation(() => ({
    mutationKey: ["verificationCard", id],
    mutationFn: async (isAccept: boolean) => {
      await execute(verficationAccept, {
        id,
        isAccept: isAccept,
        isReject: !isAccept,
      });
    },
    onSuccess: () => {
      navigate("/");
    },
  }));
  return (
    <Page title="Верификация эксперта">
      <Switch>
        <Match when={query.isLoading}>Загрузка...</Match>
        <Match when={query.isError}>{query.error?.message}</Match>
        <Match when={query.isFetched}>
          <Card title="Голосуете ли вы за верификацию эксперта?">
            <ExpertCard
              {...query.data?.verifyExpertRequest.creator}
              {...query.data?.verifyExpertRequest.creator.expertProfile}
              href={`/experts/${id}`}
            />
            <AcceptRejectButtons
              onAccept={() => mutation.mutate(true)}
              onReject={() => mutation.mutate(false)}
            />
          </Card>
        </Match>
      </Switch>
    </Page>
  );
};
export default VerificationPage;
