import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api";

export const authApi = (token) => {
  return axios.create({
    baseURL: BASE_URL,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};
export const standardApi = () => {
  return axios.create({
    baseURL: BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const endpoints = {
  "get-notifications-by-current-user": `/get-notifications-by-current-user`,
  "mark-as-read": (id) => `/mark-as-read?notification_id=${id}`,
  "get-order-breakdown": (order_id) =>
    `/get-order-breakdown?order_id=${order_id}`,
  "revenue-each-week": "/revenue-each-week",
  "statistics-each-week": "/statistics-each-week",
  "vehicle-detail": (vehicleId) => `/vehicles/${vehicleId}`,
  "warehouse-detail": (warehouseId) => `/warehouses/${warehouseId}`,
  "category-detail": (categoryId) => `/categories/${categoryId}`,
  "product-detail": (productId) => `/products/${productId}`,
  "confirm-order": (orderId) => `/confirm-order/${orderId}`,
  "confirm-return-order": (orderId) => `/confirm-return-order/${orderId}`,
  "return-order-detail-delivery": (orderId) =>
    `/return-order-delivery-by-id/${orderId}`,
  "order-detail-delivery": (orderId) => `/order-delivery-by-id/${orderId}`,
  "shipment-detail-delivery": (shipment_id) =>
    `/shipment-delivery-by-id/${shipment_id}`,
  "store-order-shipment": "/store-order-shipment",
  "store-return-order-shipment": "/store-return-order-shipment",
  "send-message": "/send-message",
  "get-messages": "/get-messages",
  "latest-order": "/latest-order",
  receipts: "/receipts",
  "latest-order-by-current-user": "/latest-order-by-current-user",
  "latest-return-order-by-current-user": "/latest-return-order-by-current-user",
  "update-status": "/update-status",
  conversations: "/conversations",
  "online-users": "/online-users",
  "transactions-type": "/transactions-type",
  "transactions-status": "/transactions-status",
  "transactions-unit": "/transactions-unit",
  transactions: "/transactions",
  users: "/users",
  "users-all": "/users-all",
  roles: "/roles",
  "user-detail": (id) => `/users/${id}`,
  "orders-status": "/orders-status",
  "shipments-status": "/shipments-status",
  order: (type, direction) => `/inventory?type=${type}&direction=${direction}`,
  "order-user": (type, direction) =>
    `/users?type=${type}&direction=${direction}`,
  "order-transaction": (type, direction) =>
    `/transactions?type=${type}&direction=${direction}`,
  "order-shipment": (type, direction) =>
    `/shipments?type=${type}&direction=${direction}`,
  "order-orders": (type, direction) =>
    `/orders?type=${type}&direction=${direction}`,
  "order-return-orders": (type, direction) =>
    `/return-orders?type=${type}&direction=${direction}`,
  search: (keyword) => `/search-inventories?keyword=${keyword}`,
  "search-user": (keyword) => `/search-users?keyword=${keyword}`,
  "search-shipment": (keyword) => `/search-shipments?keyword=${keyword}`,
  "search-transaction": (keyword) => `/search-transactions?keyword=${keyword}`,
  "search-order": (keyword) => `/search-orders?keyword=${keyword}`,
  "search-return-order": (keyword) =>
    `/search-return-orders?keyword=${keyword}`,
  products: "/products",
  warehouses: "/warehouses",
  vehicles: "/vehicles",
  units: "/units",
  inventory: "/inventory",
  "inventory-detail": (id) => `/inventory/${id}`,
  "inventory-unit": `/inventory-unit`,
  shipments: "/shipments",
  orders: "/orders",
  "order-detail": (id) => `/orders/${id}`,
  "return-order-detail": (id) => `/return-orders/${id}`,
  "shipment-detail": (id) => `/shipments/${id}`,
  login: "/login",
  register: "/register",
  logout: "/logout",
  "current-user": "/current-user",
  "tomtom-search": (
    keyword,
  ) => `https://api.tomtom.com/search/2/search/${keyword}.json?key=${import.meta.env.VITE_TOM_TOM_API_KEY}&limit=5
  &typeahead=true&limit=5`,
  "transaction-latest": "/transaction-latest",
  "shipment-latest": "/shipment-latest",
  send: "/send",
  status: "/status",
  "transaction-detail": (id) => `/transactions/${id}`,
  payment: "/payment",
  "vnpay-callback": "/vnpay-callback",
  breakdown: "/breakdown",
  "add-breakdown-shipment": "/add-breakdown-shipment",
  otp: "/otp",
  "confirm-otp": "/confirm-otp",
  "return-orders": "/return-orders",
  "return-orders-detail": (id) => `/return-orders/${id}`,
  "user-quantity": "/user-quantity",
  "inventory-quantity": "/inventory-quantity",
  "product-quantity": "/product-quantity",
  "order-quantity": "/order-quantity",
  "return-order-quantity": "/return-order-quantity",
  "transaction-quantity": "/transaction-quantity",
  revenue: "/revenue",
  "orders-by-current-user": "/orders-by-current-user",
  "return-orders-by-current-user": "/return-orders-by-current-user",
  "order-by-id": (order_id) => `/order-by-id?order_id=${order_id}`,
  "return-order-by-id": (return_order_id) =>
    `/return-order-by-id?return_order_id=${return_order_id}`,
};
