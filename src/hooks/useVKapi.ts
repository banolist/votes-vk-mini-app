import { useQuery } from "@tanstack/solid-query";
import bridge, {
  AnyRequestMethodName,
  RequestIdProp,
  RequestProps,
} from "@vkontakte/vk-bridge";
import { Accessor } from "solid-js";

export default function useVKApi<K extends AnyRequestMethodName>(
  params: Accessor<{ method: K; props?: RequestProps<K> & RequestIdProp }>,
) {
  const query = useQuery(() => ({
    queryKey: [params().method],
    queryFn: () => bridge.send(params().method, params().props),
  }));
  return query;
}
