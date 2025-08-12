import { useQuery } from "@tanstack/solid-query";
import { graphql } from "~/graphql";
import execute from "~/utils/execute";

const tariffLimitsQuery = graphql(`
  query myTariffLimits {
    me {
      id
      tariffLimits {
        votesPerEvent
        eventsPerMonth
        activeWordDurationHours
      }
    }
  }
`);

export default function useTariffLimits() {
  const tariffLimits = useQuery(() => ({
    queryKey: ["myTariffLimits"],
    queryFn: async () => (await execute(tariffLimitsQuery)).me,
  }));
  return tariffLimits;
}
