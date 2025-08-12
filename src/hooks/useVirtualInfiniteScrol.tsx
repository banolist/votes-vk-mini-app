/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createSignal,
  createEffect,
  onCleanup,
  JSX,
  createMemo,
  Accessor,
  Setter,
  Component,
  Show,
} from "solid-js";
import {
  useInfiniteQuery,
  type UseInfiniteQueryResult,
} from "@tanstack/solid-query";
import {
  createVirtualizer,
  Virtualizer,
  type VirtualItem,
} from "@tanstack/solid-virtual";

type PageInfo = { hasNextPage: boolean; endCursor?: any | null };

type UseVirtualInfiniteScrollOptions<TNode> = {
  /** Массив ключей для кэширования */
  queryKey: unknown[];
  /** Функция запроса страниц, получает pageParam (cursor) */
  queryFn: (opts: { pageParam?: string | null }) => Promise<Page<TNode>>;
  /** Извлечь элементы и курсоры из ответа страницы */

  /** Размер страницы (_first_) */
  pageSize: number;
  /** Оценка высоты одного элемента (пиксели) или функция */
  estimateSize: number | ((node: TNode) => number);
  /** Автоматически измерять размеры элементов для более точной виртуализации */
  autoMeasure?: boolean;
  /** Начальная оценка размера (обязательна при autoMeasure) */
  initialEstimateSize?: number;
  /** Количество элементов для предварительной отрисовки */
  overscan?: number;
  enabled?: boolean;
};

type UseVirtualInfiniteScrollResult<TNode> = {
  /** ref контейнера с overflow-auto */
  setViewportRef: Setter<Element | null>;
  /** Виртуальные элементы для рендера */
  virtualItems: () => VirtualItem[];
  /** Плоский массив загруженных узлов */
  items: Accessor<Array<TNode | null | undefined>>;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  virtualizer: Accessor<Virtualizer<Element, Element>>;
  /** Callback для измерения элементов (используется при autoMeasure) */
  measureElement?: (element: Element, index: number) => void;
  /** Props для input[type=range] */
  sliderProps: {
    value: Accessor<number>;
    min: number;
    max: number;
    step: number;
    onInput: (e: InputEvent & { currentTarget: HTMLInputElement }) => void;
  };
};

export interface Page<TNode> {
  edges?: Array<{
    cursor: any;
    node?: TNode | null;
  } | null> | null;
  pageInfo: PageInfo;
  totalCount: number;
}

export function useVirtualInfiniteScroll<TNode>(
  opts: Accessor<UseVirtualInfiniteScrollOptions<TNode>>,
): UseVirtualInfiniteScrollResult<TNode> {
  const [totalCount, SetTotalCount] = createSignal(0);
  const [viewportRef, setViewportRef] = createSignal<Element | null>(null);

  // InfiniteQuery
  const query = useInfiniteQuery<Page<TNode>, Error>(() => ({
    queryKey: opts().queryKey,
    queryFn: async ({ pageParam }) =>
      await opts().queryFn({
        pageParam: pageParam as string | null | undefined,
      }),
    getNextPageParam: (lastPage) => {
      const { hasNextPage, endCursor } = lastPage.pageInfo;
      return hasNextPage ? endCursor : undefined;
    },
    enabled: opts().enabled,
    initialPageParam: null,
  }));

  // Собираем все узлы
  const items = createMemo(() =>
    query.data
      ? query.data.pages.flatMap((pg) => pg.edges?.map((eg) => eg?.node))
      : [],
  );
  // const items = createMemo(() =>
  //   query.data
  //     ? query.data.pages.flatMap((pg) => opts.getEdges(pg).map((e) => e.node))
  //     : []
  // );

  // Виртуализация
  const virtualizer = createMemo(() => {
    const count = totalCount();
    const options = opts();

    const virtualizerConfig: any = {
      count: count,
      getScrollElement: viewportRef,
      overscan: options.overscan ?? 5,
    };

    if (options.autoMeasure) {
      // Используем начальную оценку и автоматическое измерение
      virtualizerConfig.estimateSize = () => options.estimateSize ?? 50;
      virtualizerConfig.measureElement = (element: Element) => {
        return element.getBoundingClientRect().height;
      };
    } else {
      // Обычная оценка размера
      virtualizerConfig.estimateSize = (idx: number) => {
        const node = items()[idx];
        const estimateSize = options.estimateSize;
        return typeof estimateSize === "function"
          ? estimateSize(node!)
          : (estimateSize ?? 50);
      };
    }

    return createVirtualizer(virtualizerConfig);
  });

  createEffect(() => {
    if (!query.data) return;
    // установить количество из первого запроса
    SetTotalCount(query.data.pages.at(-1)?.totalCount || 0);
  });

  createEffect(() => {
    if (!query.data) return;
    // Дозагрузка при прокрутке за пределы загруженных
    const vItems = virtualizer().getVirtualItems();
    if (!vItems.length) return;
    const lastIndex = vItems.at(-1)!.index;
    const totalLoaded = items().length;
    const neededPage = Math.floor(lastIndex / opts().pageSize);
    const loadedPages = query.data.pages.length;
    if (neededPage == 3) {
      console.log("need!");
    }

    if (
      neededPage >= loadedPages &&
      query.hasNextPage &&
      !query.isFetchingNextPage
    ) {
      query.fetchNextPage();
    }
  });

  // Сигнал позиции ползунка (0..1)
  const [sliderVal, setSliderVal] = createSignal(0);

  // Обновляем slider при скролле
  createEffect(() => {
    const virtualItems = virtualizer().getVirtualItems();
    if (!virtualItems.length) return;
    const startIndex = virtualItems[0].index;
    const frac = startIndex / Math.max(totalCount() - 1, 1);
    setSliderVal(frac);
  });

  // Обработчик для ползунка
  function onSliderInput(e: InputEvent & { currentTarget: HTMLInputElement }) {
    const frac = parseFloat(e.currentTarget.value);
    const idx = Math.floor(frac * (totalCount() - 1));
    virtualizer().scrollToIndex(idx, { align: "start" });
  }

  // Возвращаем результат
  return {
    setViewportRef: setViewportRef,
    virtualItems: () => virtualizer().getVirtualItems(),
    virtualizer: virtualizer,
    items: items,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage ?? false,
    fetchNextPage: () => query.fetchNextPage(),
    measureElement: opts().autoMeasure
      ? (element: Element, index: number) => {
          virtualizer().measureElement(element);
        }
      : undefined,
    sliderProps: {
      value: sliderVal,
      min: 0,
      max: 1,
      step: 0.001,
      onInput: onSliderInput,
    },
  };
}

// --- Пример использования ---
// import { useVirtualInfiniteScroll } from '~/hooks/useVirtualInfiniteScroll';
// import EventCard from '~/components/EventCard';
//
// const { viewportRef, virtualItems, items, sliderProps, isLoading, isError } =
//   useVirtualInfiniteScroll({
//     queryKey: ['moderationEvents'],
//     queryFn: async ({ pageParam }) => execute(moderationListQuery, { first: 20, after: pageParam }),
//     getEdges: (res) => res.eventRequests.edges.map(e => ({ node: e.node, cursor: e.cursor })),
//     getPageInfo: (res) => res.eventRequests.pageInfo,
//     totalCount: totalCountFromServer,
//     pageSize: 20,
//     estimateSize: 200,
//   });
//
// <div class="relative flex">
//   <div ref={el => viewportRef = el} class="h-[80vh] overflow-auto w-full pr-4">
//     <div style={{ height: virtualizer.getTotalSize() + 'px', position: 'relative' }}>
//       {virtualItems.map(item => {
//         const ev = items[item.index];
//         return (
//           <div style={{ position: 'absolute', top: item.start + 'px', width: '100%' }}>
//             <EventCard data={{...ev, ...ev.event}} link={`./${ev.id}`} />
//           </div>
//         );
//       })}
//     </div>
//   </div>
//   <input type="range" {...sliderProps} class="absolute right-0 top-0 h-full rotate-90 origin-top-right" />
// </div>
