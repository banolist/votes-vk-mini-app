import { TextField } from "@kobalte/core/text-field";
import { Component, createSignal } from "solid-js";

const CapchaInput: Component = () => {
  const result = getRandomInt(0, 20);
  const first = getRandomInt(1, result);
  const second = result - first;
  const [value, setValue] = createSignal<string>("");
  const [touched, setTouched] = createSignal(false);

  const handleInputChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    setValue(target.value);
    if (!touched()) {
      setTouched(true); // Помечаем поле как "тронутое" при первом изменении
    }
  };

  const handleBlur = () => {
    setTouched(true); // Помечаем поле как "тронутое" при потере фокуса
  };

  return (
    <TextField
      class="flex flex-col gap-1"
      validationState={
        parseInt(value()) === result ? "valid" : touched() ? "invalid" : "valid"
      }
    >
      <TextField.Label>
        Введите капчу {first} + {second}
      </TextField.Label>
      <TextField.Input
        type="number"
        required
        value={value()}
        onChange={handleInputChange}
        onBlur={handleBlur} // Добавляем обработчик потери фокуса
        class="input p-2 w-full text-wrap hide-spin-buttons"
      />
      <TextField.ErrorMessage class="text-error text-sm">
        Неверное значение
      </TextField.ErrorMessage>
    </TextField>
  );
};
function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
export default CapchaInput;
