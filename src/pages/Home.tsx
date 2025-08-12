import {
  createEffect,
  createSignal,
  Match,
  Switch,
  type Component,
} from "solid-js";
import { A, useNavigate } from "@solidjs/router";
import { graphql } from "~/graphql";
import execute from "~/utils/execute";
import { TextField } from "@kobalte/core/text-field";
import HeroiconsArrowRight16Solid from "~icons/heroicons/arrow-right-16-solid";
import { useQuery } from "@tanstack/solid-query";
import { Button } from "@kobalte/core/button";
import useMe from "~/hooks/useMe";
import Modal from "~/components/ui/Modal";
import TestCombo from "~/components/ui/TestCombo";
import OptionGroupExample from "~/components/ui/fruits";

const homePageQuery = graphql(`
  query homePage {
    statistic {
      eventsCount
      eventsHoursCount
      usersCount
      votesCount
    }
  }
`);

const Home: Component = () => {
  const [openUsageModal, setOpenUsageModal] = createSignal(false);
  const me = useMe();
  createEffect(() => {
    if (!me.data?.agreesTermsAt && me.isFetched) {
      setOpenUsageModal(true);
    } else {
      setOpenUsageModal(false);
    }
  });
  const query = useQuery(() => ({
    queryKey: ["statisticHome"],
    queryFn: async () => {
      return (await execute(homePageQuery)).statistic;
    },
  }));
  return (
    <>
      <div class="flex flex-col px-2.5 gap-2.5 bg-base-200 w-full max-w-2xl self-center">
        <div class="flex p-5 self-center mb-2.5 bg-primary rounded-3xl shadow-2xl border-1 border-base-300 w-full">
          <div class="text-white font-medium leading-relaxed text-xl">
            <Switch>
              <Match when={query.isLoading}>Загрузка...</Match>
              <Match when={query.isError}>{query.error?.message}</Match>
              <Match when={query.isFetched}>
                <div>
                  <span>Мероприятий оцифровано: </span>
                  <span class="font-bold">{query.data?.eventsCount}</span>
                </div>
                <div>
                  <span>Часов мероприятий: </span>
                  <span class="font-bold">{query.data?.eventsHoursCount}</span>
                </div>
                <div>
                  <span>Пользователей: </span>
                  <span class="font-bold">{query.data?.usersCount}</span>
                </div>
                <div>
                  <span>Голоса: </span>
                  <span class="font-bold">{query.data?.votesCount}</span>
                </div>
              </Match>
            </Switch>
          </div>
        </div>
        <div class="text-[#5c6d76] uppercase text-4xl mb-2">голосование</div>
        <SearhchPromoWorld />
        <div class="flex flex-col gap-3 mt-5">
          <HomeCard
            title="Эксперты"
            body="Найдите своего любимого эксперта"
            btnText="Открыть"
            hearf="/experts"
          />
          <HomeCard
            title="Мероприятия"
            body="Создавайте мероприятия и участвуйте в мероприятия"
            btnText="Открыть"
            hearf="/events"
          />
        </div>
      </div>
      <Modal
        open={openUsageModal()}
        onOpenChange={setOpenUsageModal}
        title="Не полный доступ!"
      >
        <div>Для использования платформы необходимо принять оферту</div>
        <A href="/usage" class="btn btn-accent mt-2">
          Перейти к оферте
        </A>
      </Modal>
    </>
  );
};

const inputPromoWorldQuery = graphql(`
  query inputPromoWild($world: String! = "") {
    inputEvent(promoWord: $world) {
      id
    }
  }
`);

const SearhchPromoWorld: Component = () => {
  const [promoWorld, setPromoWorld] = createSignal("");
  const [error, setError] = createSignal("");
  const navigate = useNavigate();
  const handleSearch = async () => {
    try {
      const resp = await execute(inputPromoWorldQuery, { world: promoWorld() });
      navigate("/events/" + resp.inputEvent?.id);
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.message.includes("not found")) {
          setError("не найдено");
          return;
        }
        setError(err.message);
      }
    }
  };

  return (
    <div class="flex flex-col">
      <TextField
        value={promoWorld()}
        onChange={setPromoWorld}
        class="w-full flex px-3 py-2 gap-2.5 items-center justify-between bg-base-100 rounded-xl shadow-md outline-1 outline-base-content/10"
      >
        <TextField.Input
          class="flex-grow text-tx-secondary2 font-light text-lg bg-transparent border-none outline-none placeholder:text-gray-400"
          placeholder="Введите кодовое слово"
        />

        <Button class="btn btn-ghost btn-circle size-8" onClick={handleSearch}>
          <HeroiconsArrowRight16Solid class="size-8 text-gray-500" />
        </Button>
      </TextField>
      <div class="ml-4 text-sm font-light text-tx-secondary2">{error()}</div>
    </div>
  );
};

export default Home;
const HomeCard: Component<{
  title: string;
  body: string;
  btnText: string;
  hearf?: string;
}> = (props) => {
  return (
    <A
      class="flex flex-col p-5 gap-1 justify-center w-full min-h-[200px] bg-base-100 rounded-2xl shadow-md"
      href={props.hearf || ""}
    >
      <div class="text-black capitalize text-2xl">{props.title}</div>
      <div class="text-black text-lg">{props.body}</div>
      <span class="text-primary text-lg">{props.btnText}</span>
    </A>
  );
};
