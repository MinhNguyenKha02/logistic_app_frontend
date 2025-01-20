import { formatDistanceToNow } from "date-fns";

export const formatPriceVND = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

export const timeAgo = (dateString) => {
  if (dateString === "0000-00-00 00:00:00" || !dateString) return "offline";
  const formattedTime = formatDistanceToNow(new Date(dateString), {
    addSuffix: true,
  });

  return formattedTime;
};

export const dateFormat = (dateString) => {
  const date = new Date(dateString);

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return `${day}/${month}/${year} at ${hour}:${minute}:${second}`;
};

export function isDate(keyword) {
  // Match both DD/MM/YYYY and DD-MM-YYYY formats
  const regex = /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/;
  const match = keyword.match(regex);

  if (match) {
    const [_, day, month, year] = match.map(Number);

    // Check if the parsed values form a valid date
    const date = new Date(year, month - 1, day); // Month is 0-based
    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  }

  return false;
}

export function formatDate(dateString) {
  const regex = /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/;
  const match = dateString.match(regex);

  const [_, day, month, year] = match.map(Number);

  // Create a new Date object (month is 0-based, so subtract 1)
  const date = new Date(year, month - 1, day);

  // Helper function to pad single digits with a leading zero
  const pad = (num) => String(num).padStart(2, "0");

  const formattedDay = pad(date.getDate());
  const formattedMonth = pad(date.getMonth() + 1);
  const formattedYear = date.getFullYear();
  const hour = pad(date.getHours());
  const minute = pad(date.getMinutes());
  const second = pad(date.getSeconds());

  return `${formattedYear}-${formattedMonth}-${formattedDay} ${hour}:${minute}:${second}`;
}

export const formatToMySQLDate = (date) => {
  const pad = (n) => (n < 10 ? "0" + n : n);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};
