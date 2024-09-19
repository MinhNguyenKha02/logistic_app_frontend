import { BrowserRouter, Routes, Route } from "react-router-dom";
import Shipment from "./pages/Shipment.jsx";
import Inventory from "./pages/Inventory.jsx";
import InventoryDetail from "./pages/InventoryDetail.jsx";
import Home from "./pages/Home.jsx";
import Vehicle from "./pages/Vehicle.jsx";

import { useReducer, useState } from "react";

import { DetailPageContext, AuthContext } from "./helper/Context.js";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import ShipmentDetail from "./pages/ShipmentDetail.jsx";
import Tracking from "./pages/Tracking.jsx";
import { AuthenticateReducer, initialState } from "./helper/Reducer.ts";
import User from "./pages/User.jsx";
import UserDetail from "./pages/UserDetail.jsx";
import Transaction from "./pages/Transaction.jsx";
import Order from "./pages/Order.jsx";

import NotificationPage from "./pages/NotificationPage.jsx";

function App() {
  const [state, dispatch] = useReducer(AuthenticateReducer, initialState);

  const [userContext, setUserContext] = useState({
    id: "",
    del: null,
    detailOpen: null,
    all: null,
    checkBoxOpen: false,
    add: false,
    detailOpens: [],
    updateItem: null,
    addItem: null,
  });

  const [inventoryContext, setInventoryContext] = useState({
    id: "",
    del: null,
    detailOpen: null,
    all: null,
    checkBoxOpen: false,
    add: false,
    detailOpens: [],
    updateItem: null,
    addItem: null,
  });
  const [shipmentContext, setShipmentContext] = useState({
    id: "",
    del: null,
    detailOpen: null,
    all: null,
    checkBoxOpen: false,
    add: false,
    detailOpens: [],
    updateItem: null,
    addItem: null,
  });

  const [transactionContext, setTransactionContext] = useState({
    id: "",
    del: null,
    detailOpen: null,
    all: null,
    checkBoxOpen: false,
    add: false,
    detailOpens: [],
    updateItem: null,
    addItem: null,
  });

  const [orderContext, setOrderContext] = useState({
    id: "",
    del: null,
    detailOpen: null,
    all: null,
    checkBoxOpen: false,
    add: false,
    detailOpens: [],
    updateItem: null,
    addItem: null,
  });

  const [returnOrderContext, setReturnOrderContext] = useState({
    id: "",
    del: null,
    detailOpen: null,
    all: null,
    checkBoxOpen: false,
    add: false,
    detailOpens: [],
    updateItem: null,
    addItem: null,
  });

  return (
    <>
      <AuthContext.Provider value={{ state, dispatch }}>
        <DetailPageContext.Provider
          value={{
            userContext,
            setUserContext,
            inventoryContext,
            setInventoryContext,
            shipmentContext,
            setShipmentContext,
            transactionContext,
            setTransactionContext,
            orderContext,
            setOrderContext,
            returnOrderContext,
            setReturnOrderContext,
          }}
        >
          <BrowserRouter>
            <Routes>
              <Route path="/" index element={<Home />} />
              <Route path="/tracking" index element={<Tracking />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/shipments" element={<Shipment />} />
              <Route path="/shipments/:id" element={<ShipmentDetail />} />
              <Route path="/inventory/:id" element={<InventoryDetail />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/users" element={<User />} />
              <Route path="/users/:id" element={<UserDetail />} />
              <Route path="/vehicle" element={<Vehicle />} />
              <Route path="/transactions" element={<Transaction />} />
              <Route path="/orders" element={<Order />} />
              <Route path="/notification" element={<NotificationPage />} />
            </Routes>
          </BrowserRouter>
        </DetailPageContext.Provider>
      </AuthContext.Provider>
    </>
  );
}

export default App;
