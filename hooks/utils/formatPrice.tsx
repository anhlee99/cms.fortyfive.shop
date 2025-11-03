export const formatPrice = (value: string | number): string => {
  // 1. Nếu giá trị là 0 (số) hoặc "0" (chuỗi), trả về "0"
  if (value === 0 || value === "0") {
    return "0";
  }

  // 2. Nếu giá trị là null, undefined, hoặc chuỗi rỗng, trả về chuỗi rỗng
  if (!value) {
    return "";
  }

  // 3. Xử lý định dạng giá trị > 0
  const num = parseFloat(value.toString().replace(/,/g, ""));

  if (isNaN(num)) return "";

  // Bạn đang sử dụng định dạng toLocaleString với en-US,
  // sau đó thay thế dấu phẩy (,) bằng dấu phẩy (,).
  // Kết quả cuối cùng là định dạng Mỹ (ví dụ: 1,000,000).
  return num.toLocaleString("en-US", { maximumFractionDigits: 0 });
  // Bạn có thể không cần .replace(/,/g, ",") vì .toLocaleString đã làm việc đó.
};
