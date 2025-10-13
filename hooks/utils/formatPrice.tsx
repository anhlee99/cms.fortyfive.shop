export const formatPrice = (value: string | number): string => {
  if (!value) return "";
  const num = parseFloat(value.toString().replace(/,/g, ""));
  if (isNaN(num)) return "";
  return num.toLocaleString("en-US").replace(/,/g, ",");
};
