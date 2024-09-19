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

export const formatToMySQLDate = (date) => {
  const pad = (n) => (n < 10 ? "0" + n : n);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};
