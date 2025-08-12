import { useMutation, useQuery, useQueryClient } from "@tanstack/solid-query";
import {
  createMemo,
  createSignal,
  Match,
  Switch,
  type Component,
} from "solid-js";
import { graphql } from "~/graphql";
import useMe from "~/hooks/useMe";
import execute from "~/utils/execute";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { A } from "@solidjs/router";
import { SwitchField } from "~/components/form/Switch";
const acceptPlatformRightsMutation = graphql(`
  mutation AcceptPlatformRights($data: acceptPlatformRightsInput!) {
    acceptPlatformRights(data: $data)
  }
`);
export const usageRightsQuery = graphql(`
  query UsageRights {
    platformRightsText
  }
`);

const Usage: Component = () => {
  const me = useMe();
  const aggred = createMemo(() => !!me.data?.agreesTermsAt);
  const queryClient = useQueryClient();
  const mutation = useMutation(() => ({
    mutationKey: ["aggreeTerms"],
    mutationFn: () => execute(acceptPlatformRightsMutation, { data: {} }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["me"] }),
  }));

  const [checkedUsageRights, setChechedUsageRights] = createSignal(false);

  const query = useQuery(() => ({
    queryKey: ["usageRights"],
    queryFn: async () => {
      const resp = await execute(usageRightsQuery);
      const data = await marked.parse(resp.platformRightsText);
      return data;
    },
  }));
  return (
    <>
      <div class="text-[#5c6d76] text-2xl leading-[1.2] relative">Оферта</div>
      <div class="flex flex-col p-5 gap-5 bg-[#f7f2ee] rounded-[15px]">
        <Switch>
          <Match when={query.isFetched && query.data}>
            {(data) => (
              <div
                // class="text-[#35444c] text-justify text-base leading-relaxed space-y-4 relative w-full"
                class="prose max-w-none text-[#35444c] prose-yellow"
                classList={
                  {
                    // "prose-headings:text-[#2b363d]": true,
                    // "prose-a:text-accent hover:prose-a:opacity-80": true,
                    // "prose-strong:text-[#404d55]": true,
                    // "prose-code:before:content-none prose-code:after:content-none":
                    //   true,
                    // "prose-code:bg-base-200 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded":
                    //   true,
                  }
                }
                // eslint-disable-next-line solid/no-innerhtml
                innerHTML={DOMPurify.sanitize(data())}
              />
            )}
          </Match>
        </Switch>
        <SwitchField
          label={
            <>
              Согласен с{" "}
              <A
                href={`https://vk.com/away.php?to=${encodeURI("https://exprating.ru/opd")}`}
                class="link"
              >
                условиями обработки персональных данных
              </A>
            </>
          }
          reverse
          checked={checkedUsageRights() || aggred()}
          onChange={(e) => setChechedUsageRights(e.currentTarget.checked)}
          onInput={(e) => setChechedUsageRights(e.currentTarget.checked)}
          disabled={aggred()}
        />
        <button
          class="btn btn-accent"
          onClick={() => mutation.mutate()}
          disabled={!checkedUsageRights() || aggred() || mutation.isPending}
        >
          {!aggred() ? "Принять" : "Вы уже приняли оферту"}
        </button>
      </div>
    </>
  );
};
export default Usage;
const sanitizeConfig = {
  ALLOWED_TAGS: ["a", "strong", "em", "code", "br", "img"],
  ALLOWED_ATTR: ["href", "class", "target", "src", "alt", "width", "height"],
  FORBID_CONTENTS: ["script", "iframe", "style"],
  ALLOWED_URI_REGEXP: /^(?:(?:https?|ftp|mailto|data):|[/#])/i,
};
