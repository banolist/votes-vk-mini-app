import { JSX, splitProps, type Component } from "solid-js";
import { SelectMultilineField } from "../form/Select";
import { graphql } from "~/graphql";
import { useQuery } from "@tanstack/solid-query";
import execute from "~/utils/execute";
import { Region, TariffListOptionsQieryQuery } from "~/graphql/graphql";

const tariffListOptions = graphql(`
  query tariffListOptionsQiery {
    tariffs {
      id
      title
    }
  }
`);

interface RegionsProps {
  name: string;
  label?: string | undefined;
  placeholder?: string | undefined;
  value: string[] | string | undefined;
  error: string;
  required?: boolean | undefined;
  disabled?: boolean | undefined;
  ref: (element: HTMLSelectElement) => void;
  onInput: JSX.EventHandler<HTMLSelectElement, InputEvent>;
  onChange: JSX.EventHandler<HTMLSelectElement, Event>;
  onBlur: JSX.EventHandler<HTMLSelectElement, FocusEvent>;
  closeOnSelection?: boolean | undefined;
  multiple?: boolean;
}

const TariffSelect: Component<RegionsProps> = (props) => {
  const [, rest] = splitProps(props, ["error"]);

  const query = useQuery(() => ({
    queryKey: ["regionsSelect"],
    queryFn: async () => (await execute(tariffListOptions)).tariffs,
  }));

  return (
    <SelectMultilineField<{ id: string; title: string }>
      {...rest}
      options={query.data || []}
      optionTextValue="title"
      optionValue="id"
      isLoading={query.isLoading}
      error={query.isError ? query.error.message : props.error}
    />
  );
};
export default TariffSelect;
