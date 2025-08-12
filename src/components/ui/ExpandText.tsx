import { createEffect, createSignal, onMount, type Component } from "solid-js";
import HeroiconsChevronDown20Solid from "~icons/heroicons/chevron-down-20-solid";
export const ExpandText: Component<{ text?: string; value?: string | null }> = (
  props,
) => {
  // Состояние для управления развернутым/свернутым видом
  const [isExpanded, setIsExpanded] = createSignal(false);

  // Состояние для определения, нужно ли показывать кнопку "Развернуть"
  const [showButton, setShowButton] = createSignal(false);

  // Ссылка на текстовый блок
  let textRef!: HTMLDivElement;

  // Проверка высоты текста при монтировании компонента
  createEffect(() => {
    setTimeout(() => {
      if (textRef.scrollHeight > textRef.clientHeight) {
        setShowButton(true); // Показываем кнопку, если текст превышает ограничение
      }
    }, 1000);
  });

  // Функция для переключения состояния
  const toggleExpand = () => {
    setIsExpanded(!isExpanded());
  };

  return (
    <div class="flex flex-col gap-1">
      <div class="text-tx-secondary2 capitalize">
        {props.text ? props.text : "Об Эксперте"}:
      </div>
      <div
        ref={(rl) => {
          textRef = rl;
          if (rl.scrollHeight > rl.clientHeight) {
            setShowButton(true); // Показываем кнопку, если текст превышает ограничение
          }
        }}
        class="text-tx-secondary flex-wrap max-w-full text-pretty"
        classList={{
          "line-clamp-3": !isExpanded(), // Ограничение текста до 3 строк, если свернуто
          "line-clamp-none": isExpanded(), // Убираем ограничение, если развернуто
        }}
      >
        {props.value}
      </div>
      {showButton() && (
        <button
          class="btn btn-ghost text-primary flex w-fit"
          onClick={toggleExpand}
        >
          {isExpanded() ? "Свернуть" : "Развернуть"}
          <HeroiconsChevronDown20Solid
            class="size-6 transition-transform"
            classList={{
              "rotate-180": isExpanded(), // Поворачиваем иконку, если развернуто
            }}
          />
        </button>
      )}
    </div>
  );
};
export default ExpandText;
