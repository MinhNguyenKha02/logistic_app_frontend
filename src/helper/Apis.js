import axios from 'axios';

const BASE_URL = "http://127.0.0.1:8000/api";

export const authApi = (token) => {
  return axios.create({
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
}
export const standardApi = ()=> {
  return axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
})}

export const endpoints = {
  "transactions-type":"/transactions-type",
  "transactions-status":"/transactions-status",
  "transactions-unit":"/transactions-unit",
  "transactions":"/transactions",
  "users":"/users",
  "orders-status":"/orders-status",
  "shipments-status":"/shipments-status",
  "order": (type, direction) => `/inventory?type=${type}&direction=${direction}`,
  "orderShipment": (type, direction) => `/shipments?type=${type}&direction=${direction}`,
  "search":(keyword) => `/search-inventories?keyword=${keyword}`,
  "searchShipment":(keyword) => `/search-shipments?keyword=${keyword}`,
  "products": "/products",
  "warehouses": "/warehouses",
  "vehicles": "/vehicles",
  "units": "/units",
  "inventory": "/inventory",
  "inventoryDetail": (id) => `/inventory/${id}`,
  "inventory-unit":  `/inventory-unit`,
  "shipments":"/shipments",
  "orders":"/orders",
  "shipmentsDetail":(id) => `/shipments/${id}`,
  "login": "/login",
  "logout": "/logout",
  "current-user": "/current-user",
  "mapbox-search":(keyword)=>`https://api.mapbox.com/search/searchbox/v1/
  suggest?q=${keyword}&language=en&session_token=0e67ebf9-8c31-4981-891c-b1c38b102bf9&
  access_token=${import.meta.env.VITE_MAP_BOX_API_KEY}`

}