/* @refresh reload */
import { render } from "solid-js/web";
import bridge from "@vkontakte/vk-bridge";

import "./index.css";

import localizedFormat from "dayjs/plugin/localizedFormat"; // ES 2015
import dayjs from "dayjs";
import "dayjs/locale/ru";

import Routes from "./routes";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
bridge.send("VKWebAppInit", {});

dayjs.extend(localizedFormat);
dayjs.locale("ru");

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?",
  );
}
const queryClient = new QueryClient();

localStorage.setItem("vk-query", window.location.search.replace("?", ""));

render(
  () => (
    <QueryClientProvider client={queryClient}>
      <Routes />
    </QueryClientProvider>
  ),
  root!,
);
