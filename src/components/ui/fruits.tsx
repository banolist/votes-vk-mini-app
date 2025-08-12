import { Combobox } from "@kobalte/core/combobox";
interface Food {
  value: string;
  label: string;
  disabled: boolean;
}
interface Category {
  label: string;
  options: Food[];
}
const ALL_OPTIONS: Category[] = [
  {
    label: "Fruits",
    options: [
      { value: "apple", label: "Apple", disabled: false },
      { value: "banana", label: "Banana", disabled: false },
      { value: "blueberry", label: "Blueberry", disabled: false },
      { value: "grapes", label: "Grapes", disabled: true },
      { value: "pineapple", label: "Pineapple", disabled: false },
    ],
  },
  {
    label: "Meat",
    options: [
      { value: "beef", label: "Beef", disabled: false },
      { value: "chicken", label: "Chicken", disabled: false },
      { value: "lamb", label: "Lamb", disabled: false },
      { value: "pork", label: "Pork", disabled: false },
    ],
  },
];
export default function OptionGroupExample() {
  return (
    <Combobox<Food, Category>
      options={ALL_OPTIONS}
      optionValue="value"
      optionTextValue="label"
      optionLabel="label"
      optionDisabled="disabled"
      optionGroupChildren="options"
      placeholder="Search a food…"
      itemComponent={(props) => (
        <Combobox.Item item={props.item}>
          <Combobox.ItemLabel>{props.item.rawValue.label}</Combobox.ItemLabel>
          <Combobox.ItemIndicator>{/* <CheckIcon /> */}</Combobox.ItemIndicator>
        </Combobox.Item>
      )}
      sectionComponent={(props) => (
        <Combobox.Section>{props.section.rawValue.label}</Combobox.Section>
      )}
    >
      <Combobox.Control aria-label="Food">
        <Combobox.Input />
        <Combobox.Trigger>
          <Combobox.Icon>{/* <CaretSortIcon /> */}</Combobox.Icon>
        </Combobox.Trigger>
      </Combobox.Control>
      <Combobox.Portal>
        <Combobox.Content>
          <Combobox.Listbox />
        </Combobox.Content>
      </Combobox.Portal>
    </Combobox>
  );
}
