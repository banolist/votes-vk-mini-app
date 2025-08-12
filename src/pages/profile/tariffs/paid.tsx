import { A } from "@solidjs/router";
import { type Component } from "solid-js";
const PaidTariffPage: Component = () => {
  return (
    <>
      <div class="text-2xl">Спасибо за оплату!</div>
      <A href="/" class="btn btn-accent">
        Вернутся на главную
      </A>
    </>
  );
};
export default PaidTariffPage;
