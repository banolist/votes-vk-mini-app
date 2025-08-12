/* eslint-disable @typescript-eslint/no-explicit-any */
import { test, expect, vi } from "vitest";
import { render, waitFor, screen } from "@solidjs/testing-library";
import userEvent from "@testing-library/user-event";
import NewExpertProfile from "../NewExpertProfile";
import bridge, { RequestPropsMap } from "@vkontakte/vk-bridge";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { Route, Router } from "@solidjs/router";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});
// Обертка с предоставлением контекстов
const Wrapper = (props: any) => (
  <QueryClientProvider client={queryClient}>
    {props.children}
    {/* <Router>{props.children}</Router> */}
  </QueryClientProvider>
);

// Мок для bridge.send
vi.mock("@vkontakte/vk-bridge", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@vkontakte/vk-bridge")>();
  return {
    ...actual,
    default: {
      ...actual.default,
      send: vi
        .fn()
        .mockName("bridge.send") // Добавляем имя для лучших сообщений об ошибках
        .mockImplementation((method: keyof RequestPropsMap) => {
          if (method === "VKWebAppGetUserInfo") {
            return Promise.resolve({
              first_name: "VK_NAME",
              last_name: "VK_LASTNAME",
            });
          }
          return actual.default.send(method);
        }),
    },
  };
});

test("fill input fields in register form", async () => {
  render(
    () => (
      <Route
        path={"/"}
        component={() => (
          <Wrapper>
            <NewExpertProfile />
          </Wrapper>
        )}
      />
    ),
    {
      location: "/",
    },
  );

  // Дожидаемся загрузки данных
  await waitFor(() => {
    expect(bridge.send).toHaveBeenCalledWith<[keyof RequestPropsMap]>(
      "VKWebAppGetUserInfo",
    );
  });

  // Проверяем заполнение полей
  const firstNameInput = await screen.findByTestId("firstName-input");
  const lastNameInput = await screen.findByTestId("lastName-input");

  // Для Solid.js может потребоваться дополнительное время для обновления состояния
  await waitFor(() => {
    expect(firstNameInput).toHaveValue("VK_NAME");
    expect(lastNameInput).toHaveValue("VK_LASTNAME");
  });

  expect(firstNameInput).toBeInTheDocument();
});
