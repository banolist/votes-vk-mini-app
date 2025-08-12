import { clientEnv } from "~/env/client";
import { TypedDocumentString } from "~/graphql/graphql";

export default async function execute<TResult, TVariables>(
  query: TypedDocumentString<TResult, TVariables>,
  ...[variables]: TVariables extends Record<string, never> ? [] : [TVariables]
) {
  const vkquery =
    clientEnv.MODE === "development"
      ? clientEnv.VITE_DEBUG_VK_QUERY
      : localStorage.getItem("vk-query");

  const response = await fetch(clientEnv.VITE_SERVER_GQL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/graphql-response+json",
      "Vk-Query": vkquery!,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Network response was not ok: ${response.status} ${response.statusText} - ${errorText}`
    );
  }
  const result = await response.json();

  if (result.errors) {
    // Если есть ошибки, выбрасываем их
    throw new Error(
      result.errors
        .map((error: { message: string }) => error.message)
        .join("\n")
    );
  }

  return result.data as TResult;
}
