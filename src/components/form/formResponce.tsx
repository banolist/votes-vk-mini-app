import { FormResponse, ResponseData } from "@modular-forms/solid";
import { Show } from "solid-js";

export default function FormResponce<
  TResponseData extends ResponseData,
>(props: { response: FormResponse<TResponseData> }) {
  return (
    <Show when={props.response.status}>
      <div
        classList={{
          "text-error": props.response.status == "error",
        }}
      >
        {props.response.message}
      </div>
    </Show>
  );
}
