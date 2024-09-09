import {BrowserRouter, Routes, Route} from "react-router-dom";
import Shipment from "./pages/Shipment.jsx";
import Inventory from "./pages/Inventory.jsx";
import InventoryDetail from "./pages/InventoryDetail.jsx";
import Home from "./pages/Home.jsx";
import Vehicle from "./pages/Vehicle.jsx";

import { useState } from "react";

import { DetailPageContext } from "./helper/Context.js";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import ShipmentDetail from "./pages/ShipmentDetail.jsx";
import Tracking from "./pages/Tracking.jsx";
function App() {

  const [inventoryContext, setInventoryContext] = useState({
    id:"",
    del:null,
    detailOpen:null,
    all:null,
    checkBoxOpen:false,
    add:false,
    detailOpens:[],
    updateItem:null,
    addItem:null
  });
  const [shipmentContext, setShipmentContext] = useState({
    id:"",
    del:null,
    detailOpen:null,
    all:null,
    checkBoxOpen:false,
    add:false,
    detailOpens:[],
    updateItem:null,
    addItem:null
  });

  const [transactionContext, setTransactionContext] = useState({
    id:"",
    del:null,
    detailOpen:null,
    all:null,
    checkBoxOpen:false,
    add:false,
    detailOpens:[],
    updateItem:null,
    addItem:null
  });

  const [orderContext, setOrderContext] = useState({
    id:"",
    del:null,
    detailOpen:null,
    all:null,
    checkBoxOpen:false,
    add:false,
    detailOpens:[],
    updateItem:null,
    addItem:null
  });


  return (
    <>
    <DetailPageContext.Provider value={{ inventoryContext, setInventoryContext, shipmentContext, setShipmentContext
                                        , transactionContext, setTransactionContext, orderContext , setOrderContext }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" index element={<Home/>} />
          <Route path="/tracking" index element={<Tracking/>} />
          <Route path="/register"  element={<Register/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/shipment" element={<Shipment/>} />
          <Route path="/shipment/:id" element={<ShipmentDetail/>} />
          <Route path="/inventory/:id" element={<InventoryDetail/>} />
          <Route path="/inventory" element={<Inventory/>} />
          <Route path="/vehicle" element={<Vehicle/>} />
        </Routes>
      </BrowserRouter>
    </DetailPageContext.Provider>
    </>
  )
}

export default App
