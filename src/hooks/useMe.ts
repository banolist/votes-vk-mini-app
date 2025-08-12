import { graphql } from "../graphql";
import execute from "../utils/execute";
import { useQuery } from "@tanstack/solid-query";

const meQuery = graphql(`
  query Me {
    me {
      id
      firstName
      lastName
      rights
      agreesTermsAt
      notifications(where: { readAtIsNil: true }) {
        totalCount
      }
    }
  }
`);

export default function useMe() {
  const query = useQuery(() => ({
    queryKey: ["me"],
    queryFn: async () => (await execute(meQuery)).me,
  }));

  return query;
}
