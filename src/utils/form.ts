import { toCustom } from "@modular-forms/solid";

export function fixFieldValue(value: string[] | undefined) {
  if (value && value.length) {
    if (value.length > 1) {
      return value;
    }
    if (!value[0]) {
      return [];
    }
  }
  return value;
}

export function toHttps() {
  return toCustom<string>(
    (value) => `https://${value?.replace(/^https?:\/\//, "").toLowerCase()}`,
    {
      on: "input",
    },
  );
}
