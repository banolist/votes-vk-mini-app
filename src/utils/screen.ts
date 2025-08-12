export function getScreenSize() {
  const width = window.innerWidth;
  if (width >= 1920) return "3xl";
  if (width >= 1280) return "xl";
  if (width >= 768) return "md";
  if (width >= 640) return "sm";
  return "xs"; // если меньше sm
}
