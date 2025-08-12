// Функция для нормализации параметров (string | string[] -> string[])
export const normalizeParam = (
  param: string | string[] | undefined
): string[] => {
  if (!param) return [];
  if (Array.isArray(param)) return param;
  return [param];
};
