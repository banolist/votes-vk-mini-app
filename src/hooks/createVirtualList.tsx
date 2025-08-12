import {
  Accessor,
  type Component,
  For,
  JSX,
  Match,
  Show,
  Switch,
} from "solid-js";
import { Page, useVirtualInfiniteScroll } from "./useVirtualInfiniteScrol";

type UseVirtualInfiniteScrollOptions<TNode> = {
  /** Массив ключей для кэширования */
  queryKey: unknown[];
  /** Функция запроса страниц, получает pageParam (cursor) */
  queryFn: (opts: { pageParam?: string | null }) => Promise<Page<TNode>>;
  /** Размер страницы (_first_) */
  pageSize: number;
  /** Оценка высоты одного элемента (пиксели) или функция */
  estimateSize: number | ((node: TNode) => number);
  /** Количество элементов для предварительной отрисовки */
  overscan?: number;
  /** Автоматически измерять размеры элементов для более точной виртуализации */
  autoMeasure?: boolean;

  noContentText?: string;

  enabled?: boolean;
  class?: string;
};

export default function createVirtualList<TNode>(
  opts: Accessor<UseVirtualInfiniteScrollOptions<TNode>>,
) {
  const { setViewportRef, items, virtualizer, isError, error, measureElement } =
    useVirtualInfiniteScroll<TNode>(opts);
  return {
    List: (props: {
      children: (item: NonNullable<TNode>) => JSX.Element;
      fallback?: JSX.Element;
    }) => (
      <Switch>
        <Match when={isError}>{error?.message}</Match>
        <Match when={true}>
          <div
            ref={setViewportRef}
            class="overflow-x-auto overflow-y-visible w-full h-[80vh] px-4"
          >
            <Show when={!items().length}>
              {opts().noContentText ? (
                opts().noContentText
              ) : (
                <div>Похоже тут ничего нет, возвращайтесь позже</div>
              )}
            </Show>
            <div
              class="gap-2 flex flex-col overflow-visible w-full"
              style={{
                height: virtualizer().getTotalSize() + "px",
                position: "relative",
              }}
            >
              <For each={virtualizer().getVirtualItems()}>
                {(item) => {
                  const ev = items()[item.index];
                  return (
                    <div
                      ref={(el) => measureElement?.(el, item.index)} // ← автоизмерение
                      style={{
                        position: "absolute",
                        top: item.start + "px",
                        width: "100%",
                        // overflow: "visible",
                        // height: "auto",
                        // isolation: "isolate",
                      }}
                    >
                      <Show
                        when={ev}
                        fallback={
                          <div
                            class="skeleton w-full"
                            style={{
                              height: item.size + "px",
                            }}
                          />
                        }
                      >
                        {(ev) => (
                          <div style={{ overflow: "visible" }}>
                            {props.children(ev())}
                          </div>
                        )}
                      </Show>
                    </div>
                  );
                }}
              </For>
            </div>
          </div>
        </Match>
      </Switch>
    ),
  };
}
