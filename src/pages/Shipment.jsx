import Sidebar from "../components/Sidebar.jsx";
import {TruckItem} from "../components/TruckItem.jsx";
import React, { useContext, useEffect, useState } from "react";
import TableShipment from "../components/TableShipment.jsx";
import { DetailPageContext } from "../helper/Context.js";
import Cookies from "js-cookie";
import { authApi, endpoints } from "../helper/Apis.js";
import { ToastContainer, toast } from 'react-toastify';

export default function Shipment() {
    const [index, setIndex] = React.useState(0);
    const {shipmentContext, setShipmentContext, transactionContext, setTransactionContext, orderContext , setOrderContext} = useContext(DetailPageContext)

    const SetIndex = function(index) {
        if(index===3){
            setIndex(3)
        }else if(index===2){
          setIndex(2)
        } else if(index ===1){
            setIndex(1);
        }else if(index ===0) {
            setIndex(0);
        }
    }
    const [customer, setCustomer] = useState("");
    const [product, setProduct] = useState("");
    const [transaction, setTransaction] = useState("");

    const [products,setProducts]=useState([])
    const [transactionsType,setTransactionsType]=useState([]);
    const [transactionType,setTransactionType] = useState("")
    const [transactionsStatus, setTransactionsStatus]=useState([]);
    const [transactionStatus, setTransactionStatus]=useState("")
    const [units,setUnits] = useState([])
    const [unit, setUnit] = useState("")
    const [ordersStatus, setOrdersStatus] = useState([])
    const [orderStatus, setOrderStatus]=useState("")
    const [customers, setCustomers]=useState([])
    const [transactions,setTransactions]=useState([])
    const [vehicles, setVehicles] = useState([])
    const [vehicle, setVehicle]=useState("")
    const [shipmentsStatus, setShipmentsStatus]=useState([])
    const [shipmentStatus, setShipmentStatus] = useState("")
    const [orderDate,setOrderDate]=useState("")
    const [quantity, setQuantity]=useState(0)
    const [price,setPrice] = useState(0)
    const [transactionDate, setTransactionDate] = useState("")
    const [origin, setOrigin] = useState("")
    const [destination, setDestination] = useState("")

    const [shipmentDate, setShipmentDate]=useState("")
    const [estimateDate, setEstimateDate]=useState("")
    const [arrivalDate, setArrivalDate]=useState("")
    const [capacity, setCapacity] = useState(0)
    const fetchTransactions = async ()=>{
        const token = Cookies.get("token")
        const response = await authApi(token).get(endpoints["transactions"])
        console.log("transaction",response.data)
        setTransactions(response.data.transactions)
        // setUnits(response.data.units)
    }
    const [transactionCreated, setTransactionCreated] = useState(false)
    const [orderCreated, setOrderCreated] = useState(false)
    const [shipmentCreated, setShipmentCreated] = useState(false)
    useEffect(()=>{
        const fetchProducts = async ()=>{
            const token = Cookies.get("token")
            const response = await authApi(token).get(endpoints["products"])
            console.log(response.data.products)
            setProducts(response.data.products)
        }
        const fetchTransactionsType = async ()=>{
            const token = Cookies.get("token")
            const response = await authApi(token).get(endpoints["transactions-type"])
            console.log(response.data.types)
            setTransactionsType(response.data.types)
        }
        const fetchTransactionsStatus = async ()=>{
            const token = Cookies.get("token")
            const response = await authApi(token).get(endpoints["transactions-status"])
            console.log(response.data.statuss)
            setTransactionsStatus(response.data.statuss)
        }
        const fetchTransactionsUnit = async ()=>{
            const token = Cookies.get("token")
            const response = await authApi(token).get(endpoints["transactions-unit"])
            console.log(response.data.units)
            setUnits(response.data.units)
        }

        const fetchCustomers = async ()=>{
            const token = Cookies.get("token")
            const response = await authApi(token).get(endpoints["users"])
            console.log("customer",response.data)
            setCustomers(response.data.users)
            // setUnits(response.data.units)
        }
        const fetchOrdersStatus= async ()=>{
            const token = Cookies.get("token")
            const response = await authApi(token).get(endpoints["orders-status"])
            console.log("order status",response.data.status)
            setOrdersStatus(response.data.status)
        }
        const fetchVehicles= async ()=>{
            const token = Cookies.get("token")
            const response = await authApi(token).get(endpoints["vehicles"])
            console.log("vehicles",response.data.vehicles)
            setVehicles(response.data.vehicles)
        }
        const fetchShipmentStatus= async ()=>{
            const token = Cookies.get("token")
            const response = await authApi(token).get(endpoints["shipments-status"])
            console.log("shipment-status",response.data.status)
            setShipmentsStatus(response.data.status)
        }
        fetchShipmentStatus()
        fetchVehicles()
        fetchTransactions()
        fetchCustomers()
        fetchOrdersStatus()
        fetchProducts()
        fetchTransactionsStatus()
        fetchTransactionsType()
        fetchTransactionsUnit()
    },[])

    const handleSubmitTransaction = async ()=>{
        setTransactionCreated(true)

        const dataTransaction = {
            "product_id": product,
            "date": transactionDate,
            "type": transactionType,
            "status": transactionStatus,
            "quantity": quantity,
            "unit": unit
        }

        const token = Cookies.get("token")
        const response = await authApi(token).post(endpoints["transactions"], dataTransaction)
          .catch(err=>{
              if(err.response.status === 422){
                  const data = err.response.data.errors
                  console.log(data)
                  data.product_id?.forEach(d=>toast.error(d))
                  data.date?.forEach(d=>toast.error(d))
                  data.type?.forEach(d=>toast.error(d))
                  data.status?.forEach(d=>toast.error(d))
                  data.quantity?.forEach(d=>toast.error(d))
                  data.unit?.forEach(d=>toast.error(d))
              }
          })
        console.log(response)
        if(response.status===201){
            toast.success(response.data.message, {onClick:()=>{
                    setTransactionContext((prev)=>({...prev, addItem:true}))}, onClose:()=>{
                    setTransactionContext((prev)=>({...prev, addItem:true}))
                }})
            setIndex(index+1)
        }
    }

    const handleSubmitOrder=async () => {
        setOrderCreated(true)

        const dataOrder = {
            "customer_id": customer,
            "product_id": product,
            "transaction_id": transaction,
            "date": orderDate,
            "status": orderStatus
        }

        const token = Cookies.get("token")
        const response = await authApi(token).post(endpoints["orders"], dataOrder)
          .catch(err=>{
              if(err.response.status === 422){
                  const data = err.response.data.errors
                  console.log(data)
                  data.customer_id?.forEach(d=>toast.error(d))
                  data.product_id?.forEach(d=>toast.error(d))
                  data.transaction_id?.forEach(d=>toast.error(d))
                  data.date?.forEach(d=>toast.error(d))
                  data.status?.forEach(d=>toast.error(d))
              }
          })
        console.log(response)
        if(response&&response.status===201){
            toast.success(response.data.message, {onClick:()=>{
                    setOrderContext((prev)=>({...prev, addItem:true}))}, onClose:()=>{
                    setOrderContext((prev)=>({...prev, addItem:true}))
                }})
            setIndex(index+1)

        }

    }

    const handleSubmitShipment = async ()=>{
        setShipmentCreated(true)
        const dataShipment = {
            "vehicle_id": vehicle,
            "date": shipmentDate,
            "status": shipmentStatus,
            "estimated_arrival_time": estimateDate,
            "arrival_time": arrivalDate,
            "capacity": capacity,
            "origin_address": origin,
            "destination_address": destination
        }

        const token = Cookies.get("token")
        const response = await authApi(token).post(endpoints["shipments"], dataShipment)
          .catch(err=>{
              if(err.response.status === 422){
                  const data = err.response.data.errors
                  console.log(data)
                  data.vehicle_id?.forEach(d=>toast.error(d))
                  data.date?.forEach(d=>toast.error(d))
                  data.status?.forEach(d=>toast.error(d))
                  data.estimated_arrival_time?.forEach(d=>toast.error(d))
                  data.arrival_time?.forEach(d=>toast.error(d))
                  data.capacity?.forEach(d=>toast.error(d))
                  data.origin_address?.forEach(d=>toast.error(d))
                  data.destination_address?.forEach(d=>toast.error(d))
              }
          })
        console.log(response)
        if(response.status===201){
            toast.success(response.data.message, {onClick:()=>{
                    setShipmentContext((prev)=>({...prev, addItem:true}))}, onClose:()=>{
                    setShipmentContext((prev)=>({...prev, addItem:true}))
                }})
            setIndex(index+1)
        }

    }
    const handleSubmit = async () => {
        setOrderCreated(false)
        setTransactionCreated(false)
        setShipmentCreated(false)
        setShipmentContext((prevState) => ({ ...prevState, add: !shipmentContext.add }));
        // const token = Cookies.get("token");
        // console.log(token)
        // const response = await authApi(token).post(endpoints["inventory"], data)
        // if(response.status===201){
        //     console.log("ok")
        //     toast.success(response.data.message)
        // }
    }
    return (
        <>
            <ToastContainer position="top-right"/>
            <Sidebar/>
            <main className="h-screen p-4 sm:ml-64 flex flex-row bg-gray-100">
                <div className="basis-[100%] lg:basis-[60%] p-0 lg:p-4 overflow-x-auto">
                    <TableShipment/>
                </div>
                <div className="hidden lg:block lg:basis-[40%] p-4">
                    <section className="rounded-lg bg-white relative">
                        {shipmentContext.add &&
                          <section className="p-4 px-8 text-black rounded-md bg-white absolute top-0 left-0 right-0">
                              <div className="flex justify-between mb-4">
                                  <div className="text-2xl">Add form</div>
                                  <div className="cursor-pointer" onClick={() => {
                                      setShipmentContext((prevState) => ({ ...prevState, add: !shipmentContext.add }));
                                  }}>
                                      <svg className="w-6 h-6 text-black dark:text-white" aria-hidden="true"
                                           xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                           viewBox="0 0 24 24">
                                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M6 18 17.94 6M18 18 6.06 6" />
                                      </svg>
                                  </div>
                              </div>
                            <div className="bg-white mt-8">
                                    <div className="overflow-y-auto">

                                        <ul
                                          className="flex justify-start flex-col lg:flex-row pb-4 gap-x-2 gap-y-4 md:pb-6 mb-4 flex-wrap">
                                            <li onClick={() =>{
                                                if(transactionCreated===true)
                                                    SetIndex(0)
                                                else
                                                    if(index===0)
                                                        if(transactionCreated===false)
                                                            toast.info("Transaction is not created!")
                                                        else
                                                            setIndex(0)
                                                    else if(index===1)
                                                        if(orderCreated===false)
                                                            toast.info("Order is not created!")
                                                        else
                                                            setIndex(0)
                                                    else if(index===2)
                                                        if(shipmentCreated===false)
                                                            toast.info("Shipment is not created!")
                                                        else
                                                            setIndex(0)
                                            }} className="h-4 flex gap-2 cursor-pointe">
                                                <span
                                                  className={`block rounded-full p-3 ${index === 0 ? "bg-orange-500 hover:bg-orange-400" : "bg-white hover:bg-gray-50 border-black border"}`}></span>
                                                <span
                                                  className={`${index === 0 ? "text-orange-500 hover:text-orange-400" : "text-black hover:text-gray-700"}`}>Create transaction</span>
                                            </li>
                                            <li onClick={() => {
                                                if(orderCreated===true)
                                                    SetIndex(1)
                                                else
                                                    if(index===0)
                                                        if(transactionCreated===false)
                                                            toast.info("Transaction is not created!")
                                                        else
                                                            SetIndex(1)

                                                    else if(index===1)
                                                        if(orderCreated===false)
                                                            toast.info("Order is not created!")
                                                        else
                                                            SetIndex(1)

                                                    else if(index===2)
                                                        if(shipmentCreated===false)
                                                            toast.info("Shipment is not created!")
                                                        else
                                                            SetIndex(1)

                                            }} className="h-4 flex gap-2 cursor-pointe">
                                                <svg className={`w-6 h-6 inline ${index===0?'text-orange-500':'text-gray-800'} dark:text-white`}
                                                     aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                                     width="24"
                                                     height="24" fill="none" viewBox="0 0 24 24">
                                                    <path stroke="currentColor" strokeLinecap="round"
                                                          strokeLinejoin="round" strokeWidth="2"
                                                          d="M19 12H5m14 0-4 4m4-4-4-4" />
                                                </svg>

                                                <span
                                                  className={`block rounded-full p-3 ${index === 1 ? "bg-orange-500 hover:bg-orange-400" : "bg-white hover:bg-gray-50 border-black border"}`}></span>
                                                <span
                                                  className={`${index === 1 ? "text-orange-500 hover:text-orange-400" : "text-black hover:text-gray-700"}`}>Create order</span>

                                            </li>

                                            <li onClick={() => {
                                                if(shipmentCreated===true)
                                                    SetIndex(2)
                                                else
                                                    if(index===0)
                                                        if(transactionCreated===false)
                                                            toast.info("Transaction is not created!")
                                                        else
                                                            SetIndex(2)

                                                    else if(index===1)
                                                        if(orderCreated===false)
                                                            toast.info("Order is not created!")
                                                        else
                                                            SetIndex(2)

                                                    else if(index===2)
                                                        if(shipmentCreated===false)
                                                            toast.info("Shipment is not created!")
                                                        else
                                                            SetIndex(2)

                                            }} className="h-4 flex gap-2 cursor-pointer">
                                                <svg className={`w-6 h-6  ${index===1?'text-orange-500':'text-gray-800'} dark:text-white`}
                                                     aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24"
                                                     height="24" fill="none" viewBox="0 0 24 24">
                                                    <path stroke="currentColor" strokeLinecap="round"
                                                          strokeLinejoin="round" strokeWidth="2"
                                                          d="M19 12H5m14 0-4 4m4-4-4-4" />
                                                </svg>
                                                <span
                                                  className={`block rounded-full p-3 ${index === 2 ? "bg-orange-500 hover:bg-orange-400" : "bg-white hover:bg-gray-50 border-black border"}`}></span>
                                                <span
                                                  className={`${index === 2 ? "text-orange-500 hover:text-orange-400" : "text-black hover:text-gray-700"}`}>Create delivery info</span>
                                            </li>

                                            <li onClick={() =>{
                                                if(transactionCreated===true&&orderCreated===true&&shipmentCreated===true)
                                                    SetIndex(3)
                                                else
                                                if(index===0)
                                                    if(transactionCreated===false)
                                                        toast.info("Transaction is not created!")
                                                    else
                                                        SetIndex(3)
                                                else if(index===1)
                                                    if(orderCreated===false)
                                                        toast.info("Order is not created!")
                                                    else
                                                        SetIndex(3)
                                                else if(index===2)
                                                    if(shipmentCreated===false)
                                                        toast.info("Shipment is not created!")
                                                    else
                                                        SetIndex(3)
                                            }} className="h-4 flex gap-2 cursor-pointer">
                                                <svg className={`w-6 h-6  ${index===2?'text-orange-500':'text-gray-800'} dark:text-white`}
                                                     aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                                     width="24"
                                                     height="24" fill="none" viewBox="0 0 24 24">
                                                    <path stroke="currentColor" strokeLinecap="round"
                                                          strokeLinejoin="round" strokeWidth="2"
                                                          d="M19 12H5m14 0-4 4m4-4-4-4" />
                                                </svg>
                                                <span
                                                  className={`block rounded-full p-3 ${index === 3 ? "bg-orange-500 hover:bg-orange-400" : "bg-white hover:bg-gray-50 border-black border"}`}></span>
                                                <span
                                                  className={`${index === 3 ? "text-orange-500 hover:text-orange-400" : "text-black hover:text-gray-700"}`}>Confirm Payment</span>
                                            </li>
                                        </ul>

                                        <div className="">
                                            {index === 0 &&
                                              <section className="w-full">
                                                  <form className="mx-auto">
                                                      <div className="mb-4">
                                                          <label htmlFor="orderDate" className="mb-2 block">Transaction
                                                              date</label>
                                                          <input type="datetime-local" className="w-full rounded-md"
                                                                 id="orderDate" name="name"
                                                                 placeholder="Enter Name"
                                                                value={transactionDate}
                                                                 onChange={(e)=>setTransactionDate(e.target.value)}
                                                          />
                                                      </div>
                                                      <div className="mb-4">
                                                          <label className="mb-2 block"
                                                                 htmlFor="status">Status</label>
                                                          <select id="status" className="w-full rounded-md"
                                                                  value={transactionStatus}
                                                                  onChange={(e) => setTransactionStatus(e.target.value)}>
                                                              <option selected={true}>Select your
                                                                  option
                                                              </option>
                                                              {transactionsStatus.map((s, index) => {
                                                                  return <option key={index}
                                                                    value={s}>{s.toString().at(0).toUpperCase() + s.slice(1)}</option>;
                                                              })
                                                              }
                                                          </select>
                                                      </div>
                                                      <div className="mb-4">
                                                          <label className="mb-2 block" htmlFor="product">
                                                              Product Name
                                                          </label>
                                                          <select id="product" className="w-full rounded-md" value={product}
                                                                  onChange={(e) => setProduct(e.target.value)}>
                                                              <option key={index} selected={true}>Select your
                                                                  option</option>;
                                                              {products.map((p, index) => {
                                                                  return <option key={index} value={p.id}>{p.name.toString().at(0).toUpperCase()+p.name.slice(1)}</option>;
                                                              })
                                                              }
                                                          </select>
                                                      </div>
                                                      <div className="mb-4">
                                                          <label className="mb-2 block" htmlFor="type">
                                                              Type
                                                          </label>
                                                          <select className="w-full rounded-md" id="type" value={transactionType}
                                                                  onChange={(e) => setTransactionType(e.target.value)}>
                                                              <option selected={true}>Select your
                                                                  option</option>;
                                                              {transactionsType.map((type, index) => {
                                                                  return <option key={index} value={type}>{type.toString().at(0).toUpperCase()+type.slice(1)}</option>;
                                                              })
                                                              }
                                                          </select>
                                                      </div>
                                                      <div className="mb-4">
                                                          <label htmlFor="quantity"
                                                                 className="mb-2 block">Quantity</label>
                                                          <input type="number" className="w-full rounded-md" id="quantity"
                                                                 name="quantity"
                                                                 placeholder="Quantity"
                                                                value={quantity}
                                                                 onChange={(e) => setQuantity(e.target.value)}
                                                          />
                                                      </div>


                                                      <div className="mb-4">
                                                          <label className="mb-2 block" htmlFor="unit">
                                                              Unit
                                                          </label>
                                                          <select id="unit" className="w-full rounded-md" value={unit}
                                                                  onChange={(e) => setUnit(e.target.value)}>
                                                              <option selected={true}>Select your
                                                                  option</option>;
                                                              {units.map((wh, index) => {
                                                                  return <option key={index} value={wh}>{wh.toString().at(0).toUpperCase()+wh.slice(1)}</option>;
                                                              })
                                                              }
                                                          </select>
                                                      </div>
                                                  </form>


                                              </section>}
                                            {index === 1 &&
                                              <section className="w-full">
                                                  <form className="mx-auto">
                                                      <div className="mb-4">
                                                          <label htmlFor="orderDate" className="mb-2 block">Order
                                                              date</label>
                                                          <input type="datetime-local" className="w-full rounded-md"
                                                                 id="orderDate" name="name"
                                                                 placeholder="Enter Name"
                                                                value={orderDate}
                                                                 onChange={(e)=>setOrderDate(e.target.value)}
                                                          />
                                                      </div>
                                                      <div className="flex justify-between gap-4 mb-4">
                                                          <div className="basis-1/2">
                                                              <label className="mb-2 block"
                                                                     htmlFor="status">Status</label>
                                                              <select id="status" className="w-full rounded-md"
                                                                      value={orderStatus}
                                                                      onChange={(e) => setOrderStatus(e.target.value)}>
                                                                  <option selected={true}>Select your
                                                                      option
                                                                  </option>
                                                                  {ordersStatus.map((s, index) => {
                                                                      return <option key={index}
                                                                                     value={s}>{s.toString().at(0).toUpperCase() + s.slice(1)}</option>;
                                                                  })
                                                                  }
                                                              </select>
                                                          </div>
                                                          <div className="basis-1/2">
                                                              <label className="mb-2 block" htmlFor="product">
                                                                  Product Name
                                                              </label>
                                                              <select id="product" className="w-full rounded-md"
                                                                      value={product}
                                                                      onChange={(e) => setProduct(e.target.value)}>
                                                                  <option selected={true}>Select your
                                                                      option
                                                                  </option>
                                                                  {products.map((s, index) => {
                                                                      return <option key={index}
                                                                                     value={s.id}>{s.name.toString().at(0).toUpperCase() + s.name.slice(1)}</option>;
                                                                  })
                                                                  }
                                                              </select>
                                                          </div>
                                                      </div>
                                                      <div className="mb-4">
                                                          <label className="mb-2 block" htmlFor="transaction">
                                                              Transaction
                                                          </label>
                                                          <select id="transaction" className="w-full rounded-md"
                                                                  value={transaction}
                                                                  onChange={(e) => setTransaction(e.target.value)}>
                                                              <option selected={true}>Select your
                                                                  option
                                                              </option>
                                                              {transactions.map((s, index) => {
                                                                  return <option key={index}
                                                                                 value={s.id}>{s.id.toString().at(0).toUpperCase() + s.id.slice(1)}</option>;
                                                              })
                                                              }
                                                          </select>
                                                      </div>
                                                      <div className="mb-4">
                                                          <label className="mb-2 block" htmlFor="customer">
                                                              Customer
                                                          </label>
                                                          <select id="customer" className="w-full rounded-md"
                                                                  value={customer}
                                                                  onChange={(e) => setCustomer(e.target.value)}>
                                                              <option selected={true}>Select your
                                                                  option
                                                              </option>
                                                              {customers.map((s, index) => {
                                                                  return <option key={index}
                                                                                 value={s.id}>{s.name.toString().at(0).toUpperCase() + s.name.slice(1)}</option>;
                                                              })
                                                              }
                                                          </select>
                                                      </div>
                                                      <div className="mb-4">
                                                          <label className="mb-2 block" htmlFor="unit">
                                                              Unit
                                                          </label>
                                                          <select id="unit" className="w-full rounded-md"
                                                                  value={unit}
                                                                  onChange={(e) => setUnit(e.target.value)}>
                                                              <option selected={true}>Select your
                                                                  option
                                                              </option>
                                                              {units.map((s, index) => {
                                                                  return <option key={index}
                                                                                 value={s}>{s.toString().at(0).toUpperCase() + s.slice(1)}</option>;
                                                              })
                                                              }
                                                          </select>
                                                      </div>
                                                      <div className="mb-4">
                                                          <label htmlFor="quantity"
                                                                 className="mb-2 block">Quantity</label>
                                                          <input type="number" className="w-full rounded-md" id="quantity"
                                                                 name="quantity"
                                                                 placeholder="Quantity"
                                                                value={quantity}
                                                                 onChange={(e)=>setQuantity(e.target.value)}
                                                          />
                                                      </div>


                                                      <div className="mb-4">
                                                          <label htmlFor="price" className="mb-2 block">Price</label>
                                                          <input type="text" className="w-full rounded-md" id="price"
                                                                 name="price"
                                                                 placeholder="Price"
                                                                value={price}
                                                                 onChange={(e)=>setPrice(e.target.value)}
                                                          />
                                                      </div>
                                                  </form>


                                              </section>}
                                            {index === 2 &&
                                              <section className="w-full">
                                                  <form className="mx-auto">
                                                      <div className="mb-4">
                                                          <label htmlFor="origin" className="block mb-2">Origin</label>
                                                          <input type="text" className="w-full rounded-md" id="origin"
                                                                 name="origin"
                                                                 placeholder="Enter Origin"
                                                                value={origin}
                                                                 onChange={(e)=>setOrigin(e.target.value)}
                                                          />
                                                      </div>
                                                      <div className="mb-4">
                                                          <label htmlFor="destination"
                                                                 className="block mb-2">Destination</label>
                                                          <input type="text" className="w-full rounded-md"
                                                                 id="destination" name="destination"
                                                                 placeholder="Enter Destination"
                                                                value={destination}
                                                                 onChange={(e)=>setDestination(e.target.value)}
                                                          />
                                                      </div>
                                                      <div className="mb-4">
                                                          <label htmlFor="shipmentDate" className="block mb-2">Shipment
                                                              Date</label>
                                                          <input type="datetime-local" className="w-full rounded-md"
                                                                 id="shipmentDate"
                                                                 name="shipmentDate"
                                                                 placeholder="Enter Origin"
                                                                 value={shipmentDate}
                                                                 onChange={(e)=>setShipmentDate(e.target.value)}
                                                          />
                                                      </div>
                                                      <div className="mb-4">
                                                          <label htmlFor="estimateDate" className="block mb-2">Estimate
                                                              Date</label>
                                                          <input type="datetime-local" className="w-full rounded-md"
                                                                 id="estimateDate"
                                                                 name="arrivalDate"
                                                                 placeholder="Enter estimate date"
                                                                value={estimateDate}
                                                                 onChange={(e)=>setEstimateDate(e.target.value)}
                                                          />
                                                      </div>
                                                      <div className="mb-4">
                                                          <label htmlFor="arrivalDate" className="block mb-2">Arrival
                                                              Date</label>
                                                          <input type="datetime-local" className="w-full rounded-md"
                                                                 id="arrivalDate"
                                                                 name="arrivalDate"
                                                                 placeholder="Enter Arrival Date"
                                                                value={arrivalDate}
                                                                 onChange={(e)=>setArrivalDate(e.target.value)}
                                                          />
                                                      </div>
                                                      <div className="mb-4">
                                                          <label htmlFor="capacity" className="block mb-2">Capacity</label>
                                                          <input type="text" className="w-full rounded-md"
                                                                 id="capacity"
                                                                 name="shipmentDate"
                                                                 placeholder="Enter Origin"
                                                                value={capacity}
                                                                 onChange={(e)=>setCapacity(e.target.value)}
                                                          />
                                                      </div>
                                                      <div
                                                        className="mb-4 flex flex-col md:flex-row justify-between gap-4">
                                                          <div className="basis-1/2">
                                                              <label className="block mb-2" htmlFor="vehicle">
                                                                  Vehicle
                                                              </label>
                                                              <select id="vehicle" className="w-full rounded-md"
                                                                      value={vehicle}
                                                                      onChange={(e) => setVehicle(e.target.value)}>
                                                                  <option selected={true}>Select your
                                                                      option
                                                                  </option>
                                                                  {vehicles.map((s, index) => {
                                                                      return <option key={index}
                                                                                     value={s.id}>{s.type.toString().at(0).toUpperCase() + s.type.slice(1) + " - " + s.id}</option>;
                                                                  })
                                                                  }
                                                              </select>
                                                          </div>
                                                          <div className="basis-1/2">
                                                              <label className="block mb-2"
                                                                     htmlFor="status">Status</label>
                                                              <select id="status" className="w-full rounded-md"
                                                                      value={shipmentStatus}
                                                                      onChange={(e) => setShipmentStatus(e.target.value)}>
                                                                  <option selected={true}>Select your
                                                                      option
                                                                  </option>
                                                                  {shipmentsStatus.map((s, index) => {
                                                                      return <option key={index}
                                                                                     value={s}>{s.toString().at(0).toUpperCase() + s.slice(1)}</option>;
                                                                  })
                                                                  }
                                                              </select>
                                                          </div>
                                                      </div>
                                                  </form>


                                              </section>}
                                            {index === 3 && <section className="w-full">
                                                <section className="flex flex-col">
                                                    <p className="mb-4 flex items-baseline"><span
                                                      className="bg-orange-500 mb-2 mr-4 inline-block text-white p-2 rounded-sm">Order date</span><span>{orderDate!=="" && orderDate} {orderDate===""&&'XX/XX/xxxx'}</span>
                                                    </p>
                                                    <p className="mb-4 flex items-baseline"><span
                                                      className="bg-orange-500 mb-2 mr-4 inline-block text-white p-2 rounded-sm">Product</span><span>{product!==""&&product}{product===""&&'Product name'}</span>
                                                    </p>
                                                        <p className="mb-4 flex items-baseline"><span
                                                          className="bg-orange-500 mb-2 mr-4 inline-block text-white p-2 rounded-sm">Quantity</span><span>{quantity}</span>
                                                        </p>
                                                        <p className="mb-4 flex items-baseline"><span
                                                          className="bg-orange-500 mb-2 mr-4 inline-block text-white p-2 rounded-sm">Price</span><span>{price}</span>
                                                        </p>
                                                        <p className="mb-4 flex items-baseline"><span
                                                          className="bg-orange-500 mb-2 mr-4 inline-block text-white p-2 rounded-sm">Shipment date</span><span>{shipmentDate!==""&&shipmentDate}{shipmentDate===""&&'XX/XX/XXXX'}</span>
                                                        </p>
                                                        <p className="mb-4 flex items-center">
                                                        <span
                                                          className="bg-orange-500 mb-2 mr-4 inline-block text-white p-2 rounded-sm">Origin</span>
                                                            <span>{origin!==""&&origin}{origin===""&&'Origin address'}</span>
                                                        </p>
                                                        <p className="mb-4 flex items-center"><span
                                                          className="bg-orange-500 mb-2 mr-4 inline-block text-white p-2 rounded-sm">Destination</span>
                                                            <span>{destination!==""&&destination}{destination===""&&'Destination address'}</span>
                                                        </p>
                                                        <p className="mb-4 flex items-baseline"><span
                                                          className="bg-orange-500 mb-2 mr-4 inline-block text-white p-2 rounded-sm">Vehicle</span>
                                                            <span>{vehicle!==""&&vehicle}{vehicle===""&&'Vehicle'}</span>
                                                        </p>
                                                </section>
                                            </section>}
                                        </div>

                                        <div className="py-4">
                                            {index > 0 &&
                                              <button
                                                className="mr-4 bg-white text-black border-black border rounded-md px-4 py-2 "
                                                onClick={() => {
                                                    if (index === 0)
                                                        if (transactionCreated === true)
                                                            SetIndex(index - 1 < 0 ? 0 : index - 1);
                                                        else
                                                            toast.info("Transaction is not created!");
                                                    if (index === 1)
                                                        if (orderCreated === true)
                                                            SetIndex(index - 1 < 0 ? 0 : index - 1);
                                                        else
                                                            toast.info("Order is not created!");
                                                    if (index === 2)
                                                        if (shipmentCreated === true)
                                                            SetIndex(index - 1 < 0 ? 0 : index - 1);
                                                        else
                                                            toast.info("Shipment is not created!");
                                                }}>Prev
                                              </button>

                                            }
                                            {
                                              index < 3 &&
                                              <button
                                                className="mr-4 bg-white text-black border border-black rounded-md px-4 py-2 "
                                                onClick={() => {

                                                    if (index === 0)
                                                        if (transactionCreated === true)
                                                            setIndex(index + 1);
                                                        else
                                                            toast.info("Transaction is not created!");
                                                    if (index === 1)
                                                        if (orderCreated === true)
                                                            setIndex(index + 1);
                                                        else
                                                            toast.info("Order is not created!");
                                                    if (index === 2)
                                                        if (shipmentCreated === true)
                                                            setIndex(index + 1);
                                                        else
                                                            toast.info("Shipment is not created!")
                                                      }} >Next
                                              </button>
                                            }
                                            {
                                              index === 0
                                              &&
                                              <button onClick={handleSubmitTransaction} className="bg-orange-500 text-white rounded-md px-4 py-2"
                                              >Create Transaction
                                              </button>
                                            }
                                            {
                                              index === 1
                                              &&
                                              <button onClick={handleSubmitOrder} className="bg-orange-500 text-white rounded-md px-4 py-2"
                                              >Create order
                                              </button>
                                            }
                                            {
                                              index === 2
                                              &&
                                              <button onClick={handleSubmitShipment} className="bg-orange-500 text-white rounded-md px-4 py-2"
                                              >Create shipment
                                              </button>
                                            }
                                            {
                                              index === 3
                                              &&
                                              <button onClick={handleSubmit} className="bg-orange-500 text-white rounded-md px-4 py-2"
                                              >Submit
                                              </button>
                                            }
                                        </div>
                                    </div>

                                </div>
                          </section>

                        }
                    </section>

                </div>
            </main>
        </>
    )
}