import { Button } from "@kobalte/core/button";
import { createForm, zodForm } from "@modular-forms/solid";
import { useQuery } from "@tanstack/solid-query";
import {
  Component,
  createEffect,
  createSignal,
  For,
  JSXElement,
  Match,
  onCleanup,
  onMount,
  Show,
  Switch,
  type Component as TariffsPage,
} from "solid-js";
import { number, z } from "zod";
import Card from "~/components/ui/Card";
import { TextField } from "~/components/form/TextField";
import Page from "~/components/ui/Page";
import { StatField } from "~/components/ui/StatFields";
import { graphql } from "~/graphql";
import execute from "~/utils/execute";

const tariffListQuery = graphql(`
  query tariffsList {
    tariffs {
      active
      family
      joinProfessionalCommunities
      mailingPerMonth
      numberExpertsManagedByOneRepresentative
      organizerExpertsOnEvent
      organizerFeeEventMailingPriceExpert
      organizerInviteMailingPriceExpert
      organizerPerEvent
      organizerRequestExpertAboutPrice
      paidEventResponsesPerMonth
      paidRequestPublicationPrice
      activeWordDurationHours
      price
      referralBonus
      referralPrice
      title
      updatedAt
      votesPerEvent
      countExpertsInCreateCommunity
      createProfessionalCommunities
      createdAt
      eventsPerMonth
      freeEventResponses
      id
    }
  }
`);

const createTariffPaymentLinkMutation = graphql(`
  mutation createPaymentLinkTariff($data: SubmitTariffInput!) {
    submitTariff(data: $data) {
      discount
      openedByPromocode
      paymentLink
      promocodeResult
    }
  }
`);

const selectTariffSchema = z.object({
  // tariff: z.number(),
  promocode: z.string().optional(),
  email: z.string().email(),
});

type SelctTariffForm = typeof selectTariffSchema._type;

const TariffsPage: TariffsPage = () => {
  const query = useQuery(() => ({
    queryKey: ["tariffsPage"],
    queryFn: async () => await execute(tariffListQuery),
  }));

  const [form, { Form, Field }] = createForm<SelctTariffForm>({
    validate: zodForm(selectTariffSchema),
  });

  const [selectedTariff, setSelectedTariff] = createSignal<string | null>(null);
  createEffect(() => {
    const tariffsData = query.data?.tariffs;
    if (query.isFetched && tariffsData && tariffsData.length !== 0) {
      setSelectedTariff(tariffsData[0].id);

      observer = new IntersectionObserver(
        (entres) =>
          entres.forEach((entre) => {
            if (entre.isIntersecting) {
              const id = entre.target.id.split("-")[1];
              const selected = tariffsData.find((t) => t.id == id);
              if (selected) {
                setSelectedTariff(selected.id);
              }
            }
          }),
        {
          threshold: 0.7,
          rootMargin: "0px",
        },
      );
      carouselItems.forEach((item) => observer.observe(item));
    }
  });

  let observer: IntersectionObserver;
  const carouselItems: HTMLDivElement[] = [];
  onCleanup(() => {
    if (observer) observer.disconnect();
  });
  let carouselRef: HTMLDivElement | null = null;

  // Функция для прокрутки карусели к выбранному тарифу
  const scrollToTariff = (index: number) => {
    if (carouselRef && carouselItems[index]) {
      carouselItems[index].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
    }
  };

  onMount(() => {
    if (!carouselRef) return;

    // Исправленный обработчик wheel
    const handleWheel = (e: WheelEvent) => {
      // Прокручиваем ТОЛЬКО если не зажат Shift
      if (!e.shiftKey) {
        e.preventDefault();
        carouselRef!.scrollLeft += e.deltaY * 2; // Умножаем для скорости
      }
    };

    carouselRef.addEventListener("wheel", handleWheel, { passive: false });

    // Чистка при размонтировании
    onCleanup(() => {
      carouselRef?.removeEventListener("wheel", handleWheel);
    });
  });

  async function onSubmit(data: SelctTariffForm) {
    const selected = selectedTariff();
    if (!selected) return;
    const result = await execute(createTariffPaymentLinkMutation, {
      data: {
        durationMonths: 1,
        email: data.email,
        promocode: data.promocode,
        tariffID: selected,
      },
    });

    window.location.href = `https://vk.com/away.php?to=${encodeURI(
      result.submitTariff.paymentLink,
    )}`;
  }

  return (
    <Page title="тарифы" class="items-center">
      <Switch>
        <Match when={query.isLoading}>Загрузка...</Match>
        <Match when={query.error}>{query.error?.message}</Match>
        <Match when={query.isFetched && query.data?.tariffs}>
          {(tariffs) => (
            <>
              <div
                ref={(ref) => {
                  carouselRef = ref;
                }}
                class="carousel touch-pan-x scroll-smooth w-full space-x-4 p-4"
              >
                <For each={tariffs()}>
                  {(tariff) => (
                    <div
                      id={`tariff-${tariff.id}`}
                      ref={(el) => carouselItems.push(el)}
                      class="carousel-item relative shadow-md p-3 bg-base-100 rounded-2xl border-1 border-base-300 flex flex-col flex-shrink-0 w-full"
                    >
                      <div class="flex items-center justify-between gap-1">
                        <strong class="text-2xl">{tariff.title}</strong>
                      </div>
                      <div class="divider" />
                      <FieldStat text="Срок активности слова на мероприятии">
                        {tariff.activeWordDurationHours}
                      </FieldStat>
                      <FieldStat text="Кол-во мероприятий в месяц">
                        {tariff.eventsPerMonth}
                      </FieldStat>
                      <FieldStat text="Голосов на мероприятии">
                        {tariff.votesPerEvent}
                      </FieldStat>
                      <FieldStat text="Рассылок по аудитории в месяц">
                        {tariff.mailingPerMonth}
                      </FieldStat>
                      <div>
                        <div class="text-2xl font-light">Цена</div>
                        <div class="text-2xl font-bold">{tariff.price}</div>
                      </div>
                    </div>
                  )}
                </For>
              </div>
              <div class="flex justify-center w-full py-2 gap-2">
                <For each={tariffs()}>
                  {(tariff, index) => (
                    <button
                      onClick={() => scrollToTariff(index())}
                      class={`btn btn-xs btn-circle ${
                        selectedTariff() === tariff.id
                          ? "bg-primary"
                          : "bg-base-300"
                      }`}
                    >
                      •
                    </button>
                  )}
                </For>
              </div>
              <Form onSubmit={onSubmit} class="card bg-base-100">
                <div class="card-body items-center ">
                  <div class="flex flex-col min-w-xs sm:min-w-md">
                    <span class="text-2xl font-bold uppercase">
                      ВСЕГО к оплате
                    </span>
                    <span class="text-2xl font-bold">
                      {
                        tariffs().find(
                          (tariff) => tariff.id == selectedTariff(),
                        )?.price
                      }
                      ₽
                    </span>
                  </div>
                  <div class="min-w-xs sm:min-w-md">
                    <Field name="promocode">
                      {(field, props) => (
                        <TextField
                          {...props}
                          label="Промокод"
                          value={field.value}
                          error={field.error}
                        />
                      )}
                    </Field>
                    <Field name="email">
                      {(field, props) => (
                        <TextField
                          {...props}
                          label="Email"
                          type="email"
                          value={field.value}
                          error={field.error}
                        />
                      )}
                    </Field>
                    <Show when={form.response.message}>
                      {form.response.message}
                    </Show>
                    <Button
                      type="submit"
                      class="btn btn-primary mt-2 w-full max-w-md"
                      disabled={form.submitting}
                    >
                      Оплатить
                    </Button>
                  </div>
                </div>
              </Form>
            </>
          )}
        </Match>
      </Switch>
    </Page>
  );
};
export default TariffsPage;

const FieldStat: Component<{ text: string; children: number }> = (props) => {
  return (
    <StatField text={props.text}>
      {props.children == -1 ? "Безлимит" : props.children}
    </StatField>
  );
};

type CaruselProps<TItem> = {
  idPrefix: string;
  data?: TItem[];
  children: (item: TItem) => JSXElement;
  idKey: keyof TItem;
};

// export function Carusel<TItem exstends {}>(props: CaruselProps<TItem>) {
//   let observer: IntersectionObserver;
//   const carouselItems: HTMLDivElement[] = [];
//   let carouselRef: HTMLDivElement | null = null;
//   const [selected, setSelected] = createSignal<TItem>();
//
//   createEffect(() => {
//     const data = props.data;
//     if (data && data.length) {
//       setSelected(data.at(0));
//
//       observer = new IntersectionObserver(
//         (entres) =>
//           entres.forEach((entre) => {
//             if (entre.isIntersecting) {
//               const id = entre.target.id.split("-")[1];
//               const selected = data.find((t) => t[props.idKey] == id);
//               if (selected) {
//                 setSelected(selected);
//               }
//             }
//           }),
//         {
//           threshold: 0.7,
//           rootMargin: "0px",
//         },
//       );
//       carouselItems.forEach((item) => observer.observe(item));
//     }
//   });
//   onCleanup(() => {
//     if (observer) observer.disconnect();
//   });
//   const scrollToTariff = (index: number) => {
//     if (carouselRef && carouselItems[index]) {
//       carouselItems[index].scrollIntoView({
//         behavior: "smooth",
//         block: "nearest",
//         inline: "start",
//       });
//     }
//   };
//
//   return (
//     <>
//       <div
//         ref={(ref) => (carouselRef = ref)}
//         class="carousel touch-pan-x scroll-smooth w-full space-x-4 p-4"
//       >
//         <For each={props.data}>
//           {(item) => (
//             <div
//               id={`${props.idPrefix}-${item[props.idKey]}`}
//               ref={(el) => carouselItems.push(el)}
//               class="carousel-item relative shadow-md p-3 bg-base-100 rounded-2xl border-1 border-base-300 flex flex-col flex-shrink-0 w-full"
//             >
//               {props.children(item)}
//             </div>
//           )}
//         </For>
//       </div>
//       <div class="flex justify-center w-full py-2 gap-2">
//         <For each={props.data}>
//           {(item, index) => (
//             <button
//               onClick={() => scrollToTariff(index())}
//               class={`btn btn-xs btn-circle ${
//                 selected() === item[props.idKey] ? "bg-primary" : "bg-base-300"
//               }`}
//             >
//               •
//             </button>
//           )}
//         </For>
//       </div>
//     </>
//   );
// }
