import React, { useContext, useEffect, useState } from "react";
import { DetailPageContext } from "../helper/Context.js";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { authApi, endpoints } from "../helper/Apis.js";
import { ToastContainer, toast } from 'react-toastify';
import api from "js-cookie";


export default function TableShipment() {
  const [Data,setData]=useState([]);
  const [loading, setLoading] = useState(true)

  const {shipmentContext, setShipmentContext} = useContext(DetailPageContext);
  const navigate = useNavigate();
  const [del, setDel] = React.useState(!shipmentContext.del?false : true);
  const [detailOpen, setDetailOpen] = React.useState(!shipmentContext.detailOpen?false:true);

  const [orderDirectionIdIndex, setOrderDirectionIdIndex] = React.useState(2);
  const [orderDirectionStatusIndex, setOrderDirectionStatusIndex] = React.useState(2);
  const [orderDirectionVehicleIndex, setOrderDirectionVehicleIndex] = React.useState(2);
  const [orderDirectionCapacityIndex, setOrderDirectionCapacityIndex] = React.useState(2);
  const [orderDirectionOriginIndex, setOrderDirectionOriginIndex] = React.useState(2);
  const [orderDirectionDestinationIndex, setOrderDirectionDestinationIndex] = React.useState(2);
  const [orderDirectionEstimateIndex, setOrderDirectionEstimateIndex] = React.useState(2);
  const [orderDirectionArrivalIndex, setOrderDirectionArrivalIndex] = React.useState(2);
  const [detailOpens, setDetailOpens] = useState(  [!shipmentContext.detailOpens?
    Data.data.forEach((d) => !shipmentContext.detailOpen?false:true):false]
  )

  const [deleteIds, setDeleteIds] = React.useState([]);

  const [all, setAll] = React.useState(!shipmentContext.all?false:true);
  const [checkBoxOpen, setCheckBoxOpen] = React.useState(!shipmentContext.checkBoxOpen?false:true);
  const [message, setMessage] = React.useState({
    message:"",
    type:""
  })

  const check = function (){
    setAll(!all);
  }

  const changeMode = function (){
    setDel(!del)
    setCheckBoxOpen(!checkBoxOpen);
    setShipmentContext((prevState) => ({
      ...prevState,
      del: del,
      checkBoxOpen: checkBoxOpen
    }));
  }
  const [index, setIndex] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);

  const fetchData = async () => {
    setLoading(true)
    const token = Cookies.get("token")
    console.log(token)
    const response = await authApi(token).get(endpoints["shipments"])
    console.log(response.data)
    if(response) {
      setData(response.data.shipments)
      setLoading(false)
      console.log(response.data)
    }
  }
  const handleDeleteIds = async (e, id)=>{
    console.log(deleteIds)
    console.log(id)

    if(e.target.checked===true){
      setDeleteIds([...deleteIds, id])
    }else{

      setDeleteIds(deleteIds.filter((d) => d !== id))
    }
    console.log("after", deleteIds)
  }

  const handleDeleteAll = async ()=>{
    console.log(deleteIds)
    const token = Cookies.get("token")
    let done=false
    for (const id of deleteIds) {
      const index1 = deleteIds.indexOf(id);
      console.log(endpoints["inventoryDetail"](id))
      console.log(index1)
      const response = await authApi(token).delete(endpoints["inventoryDetail"](id))
      console.log("response", response)
      if(response.status===204&&index===deleteIds.length-1){
        fetchData()
        done=true
      }

    }
    if(done===true)
      setDeleteIds([])
  }

  const handleSearch = async (e)=>{
    const keyword = e.target.value;
    const token = Cookies.get("token");
    console.log(token);
    const response = await authApi(token).get(endpoints["searchShipment"](keyword))
    console.log(response.data)
    setData(response.data)
  }
  const orderBy = async (type) => {
    const directions = ["desc", "", "asc"]

    console.log(type)
    let direction
    switch (type) {
      case "id":
        direction = directions[orderDirectionIdIndex]

        break;
      case "capacity":
        direction=directions[orderDirectionCapacityIndex]
        break;
      case "status":

        direction=directions[orderDirectionStatusIndex]
        break;
      case "vehicle_id":
        direction=directions[orderDirectionVehicleIndex]
        break;
      case "origin_address":
        direction=directions[orderDirectionOriginIndex]
        break;
      case "destination_address":
        direction=directions[orderDirectionDestinationIndex]
        break;
      case "arrival_time":
        direction=directions[orderDirectionArrivalIndex]
        break;
      case "estimated_arrival_time":
        direction = directions[orderDirectionEstimateIndex]
    }
    const token = Cookies.get("token");
    const response = await authApi(token).get(endpoints["orderShipment"](type, direction))
    setData(response.data.shipments)
    console.log(response.data.shipments)

  }

  const getShipment = async (url) => {
    const token = Cookies.get("token");
    console.log(token);
    const response = await authApi(token).get(url)
    console.log(response.data)
    setData(response.data.shipments)
  }

  const deleteItem = async (id)=> {
    const token = Cookies.get("token");
    console.log(token);
    const response = await authApi(token).delete(endpoints["shipmentsDetail"](id))
    console.log(response)
    if(response.status===204){
      // setMessage(response.data.message)
      toast.success(response.data.message)
      fetchData()
    }
  }
  useEffect( ()=>{
    fetchData()
  }, [])

  const handleWhenAddOrUpdate = ()=>{
    if(shipmentContext.updateItem===true){
      fetchData()
      shipmentContext.updateItem=false
    }
    if(shipmentContext.addItem===true){
      fetchData()
      shipmentContext.addItem=false
    }
  }
  handleWhenAddOrUpdate()

  return(
    <>
      <ToastContainer position="top-right"/>
      <section className="bg-white rounded-lg p-4">
        <div className="mb-4 flex flex-col xl:flex-row justify-between">
          <h4 className="text-2xl flex gap-2 items-center">
            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                 width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M4.248 19C3.22 15.77 5.275 8.232 12.466 8.232V6.079a1.025 1.025 0 0 1 1.644-.862l5.479 4.307a1.108 1.108 0 0 1 0 1.723l-5.48 4.307a1.026 1.026 0 0 1-1.643-.861v-2.154C5.275 13.616 4.248 19 4.248 19Z" />
            </svg>
            Shipment List
          </h4>
          <div className="flex flex-col text-left lg:flex-row lg:items-center gap-4">

            <div className="p-2 border bg-gray-100 rounded-md">
              {
                del &&
                <input type="checkbox" onChange={() => changeMode()} checked name="checkAll" className="bg-gray-100 size-5" />
              }
              {
                !del &&
                <input type="checkbox" onChange={() => changeMode()} name="checkAll" className="bg-gray-100 size-5" />
              }
            </div>
            <div className="relative">
              <div className="absolute left-0 top-[50%] -translate-y-[50%] p-4">
                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                     xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                     viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeLinecap="round" strokeWidth="2"
                        d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
                </svg>
              </div>
              <input className="w-full rounded-md px-4 py-2 pl-14 bg-gray-100" type="text" id="search"
                     name="shipmentSearch"
                     placeholder="Search..."
                     onChange={(e)=>handleSearch(e)}/>
            </div>

            <button className="bg-orange-500 text-white rounded-md py-2 px-4 text-left">
              Export to CSV
            </button>
            {
              !del && shipmentContext.add ===false &&
              <button onClick={()=>{
                setOpenDialog(!openDialog)
                setShipmentContext((prevState) => ({
                  ...prevState, add: !shipmentContext.add
                }));
              }} className="bg-orange-500 text-white py-2 px-4 rounded-md text-left">
                Add shipment
              </button>
            }

            {
              del &&
              <button onClick={handleDeleteAll} className="px-4 py-2 bg-red-500 text-white text-left lg:text-center rounded-md">
                Delete
              </button>
            }
            {
              shipmentContext.add === true &&
              <button onClick={() => {
                setShipmentContext((prevState) => ({
                  ...prevState, add: !shipmentContext.add
                }));
              }
              } className="py-2 px-4 text-left lg:text-center rounded-md text-black border border-black">
                Cancel
              </button>
            }
          </div>
        </div>
        {loading &&
          <div
            className="flex items-center justify-center w-full h-56 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
            <div role="status">
              <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-orange-500"
                   viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor" />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill" />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        }
        {!loading &&
          <div className=" w-full">
            <div className="overflow-x-auto">
              <table className="text-sm text-left">
                <thead className="bg-orange-500 text-white">
                <tr>
                  {
                    checkBoxOpen
                    &&
                    all === false
                    &&
                    <th className="p-2">
                      <input className="size-5" onChange={() => {
                        setAll(!all);
                        setShipmentContext((prevState) => ({
                          ...prevState,
                          all: all
                        }));
                      }} type="checkbox"
                             name="shipmentId" id="shipmentId" />
                    </th>
                  }
                  {
                    checkBoxOpen
                    &&
                    all === true
                    &&
                    <th className="p-2">
                      <input className="size-5" onChange={() => {
                        setAll(!all);
                        setShipmentContext((prevState) => ({
                          ...prevState,
                          all: all
                        }));
                      }} type="checkbox"
                             name="shipmentId" checked id="shipmentId" />
                    </th>

                  }
                  {
                    !checkBoxOpen
                    &&
                    <th className="p-2">

                    </th>
                  }
                  <th onClick={() => {
                    orderBy("id");
                    setOrderDirectionIdIndex(orderDirectionIdIndex === 2 ? 0 : orderDirectionIdIndex + 1);
                  }} className="p-2"><span>Shipment Id&nbsp;</span>
                    {orderDirectionIdIndex === 0 &&
                      <svg className="inline-block size-6 text-white dark:text-white" aria-hidden="true"
                           xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="m5 15 7-7 7 7" />
                      </svg>
                    }
                    {orderDirectionIdIndex === 1 &&
                      <svg className="inline-block w-6 h-6 text-white dark:text-white" aria-hidden="true"
                           xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="m19 9-7 7-7-7" />
                      </svg>
                    }
                    {orderDirectionIdIndex === 2 &&

                      <svg className="inline-block w-6 h-6 text-white dark:text-white" aria-hidden="true"
                           xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                           viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                              strokeWidth="2" d="m8 15 4 4 4-4m0-6-4-4-4 4" />
                      </svg>
                    }

                  </th>
                  <th onClick={() => {
                    orderBy("status");
                    setOrderDirectionStatusIndex(orderDirectionStatusIndex === 2 ? 0 : orderDirectionStatusIndex + 1);
                  }} className="p-2"><span>Status&nbsp;</span>
                    {orderDirectionStatusIndex === 0 &&
                      <svg className="inline-block size-6 text-white dark:text-white" aria-hidden="true"
                           xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="m5 15 7-7 7 7" />
                      </svg>
                    }
                    {orderDirectionStatusIndex === 1 &&
                      <svg className="inline-block w-6 h-6 text-white dark:text-white" aria-hidden="true"
                           xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="m19 9-7 7-7-7" />
                      </svg>
                    }
                    {orderDirectionStatusIndex === 2 &&

                      <svg className="inline-block w-6 h-6 text-white dark:text-white" aria-hidden="true"
                           xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                           viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                              strokeWidth="2" d="m8 15 4 4 4-4m0-6-4-4-4 4" />
                      </svg>
                    }

                  </th>
                  <th onClick={() => {
                    orderBy("vehicle_id");
                    setOrderDirectionVehicleIndex(orderDirectionVehicleIndex === 2 ? 0 : orderDirectionVehicleIndex + 1);
                  }} className="p-2"><span>Vehicle&nbsp;</span>
                    {orderDirectionVehicleIndex === 0 &&
                      <svg className="inline-block size-6 text-white dark:text-white" aria-hidden="true"
                           xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="m5 15 7-7 7 7" />
                      </svg>
                    }
                    {orderDirectionVehicleIndex === 1 &&
                      <svg className="inline-block w-6 h-6 text-white dark:text-white" aria-hidden="true"
                           xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="m19 9-7 7-7-7" />
                      </svg>
                    }
                    {orderDirectionVehicleIndex === 2 &&

                      <svg className="inline-block w-6 h-6 text-white dark:text-white" aria-hidden="true"
                           xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                           viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                              strokeWidth="2" d="m8 15 4 4 4-4m0-6-4-4-4 4" />
                      </svg>
                    }

                  </th>

                  <th onClick={() => {
                    orderBy("capacity");
                    setOrderDirectionCapacityIndex(orderDirectionCapacityIndex === 2 ? 0 : orderDirectionCapacityIndex + 1);
                  }} className="p-2"><span>Capacity&nbsp;</span>
                    {orderDirectionCapacityIndex === 0 &&
                      <svg className="inline-block size-6 text-white dark:text-white" aria-hidden="true"
                           xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="m5 15 7-7 7 7" />
                      </svg>
                    }
                    {orderDirectionCapacityIndex === 1 &&
                      <svg className="inline-block w-6 h-6 text-white dark:text-white" aria-hidden="true"
                           xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="m19 9-7 7-7-7" />
                      </svg>
                    }
                    {orderDirectionCapacityIndex === 2 &&

                      <svg className="inline-block w-6 h-6 text-white dark:text-white" aria-hidden="true"
                           xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                           viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                              strokeWidth="2" d="m8 15 4 4 4-4m0-6-4-4-4 4" />
                      </svg>
                    }

                  </th>
                  <th onClick={() => {
                    orderBy("origin_address");
                    setOrderDirectionOriginIndex(orderDirectionOriginIndex === 2 ? 0 : orderDirectionOriginIndex + 1);
                  }} className="p-2"><span>Origin&nbsp;</span>
                    {orderDirectionOriginIndex === 0 &&
                      <svg className="inline-block size-6 text-white dark:text-white" aria-hidden="true"
                           xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="m5 15 7-7 7 7" />
                      </svg>
                    }
                    {orderDirectionOriginIndex === 1 &&
                      <svg className="inline-block w-6 h-6 text-white dark:text-white" aria-hidden="true"
                           xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="m19 9-7 7-7-7" />
                      </svg>
                    }
                    {orderDirectionOriginIndex === 2 &&

                      <svg className="inline-block w-6 h-6 text-white dark:text-white" aria-hidden="true"
                           xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                           viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                              strokeWidth="2" d="m8 15 4 4 4-4m0-6-4-4-4 4" />
                      </svg>
                    }

                  </th>
                  <th onClick={() => {
                    orderBy("destination_address");
                    setOrderDirectionDestinationIndex(orderDirectionDestinationIndex === 2 ? 0 : orderDirectionDestinationIndex + 1);
                  }} className="p-2"><span>Destination&nbsp;</span>
                    {orderDirectionDestinationIndex === 0 &&
                      <svg className="inline-block size-6 text-white dark:text-white" aria-hidden="true"
                           xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="m5 15 7-7 7 7" />
                      </svg>
                    }
                    {orderDirectionDestinationIndex === 1 &&
                      <svg className="inline-block w-6 h-6 text-white dark:text-white" aria-hidden="true"
                           xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="m19 9-7 7-7-7" />
                      </svg>
                    }
                    {orderDirectionDestinationIndex === 2 &&

                      <svg className="inline-block w-6 h-6 text-white dark:text-white" aria-hidden="true"
                           xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                           viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                              strokeWidth="2" d="m8 15 4 4 4-4m0-6-4-4-4 4" />
                      </svg>
                    }

                  </th>
                  <th onClick={() => {
                    orderBy("estimated_arrival_time");
                    setOrderDirectionEstimateIndex(orderDirectionEstimateIndex === 2 ? 0 : orderDirectionEstimateIndex + 1);
                  }} className="p-2"><span>Estimate date&nbsp;</span>
                    {orderDirectionEstimateIndex === 0 &&
                      <svg className="inline-block size-6 text-white dark:text-white" aria-hidden="true"
                           xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="m5 15 7-7 7 7" />
                      </svg>
                    }
                    {orderDirectionEstimateIndex === 1 &&
                      <svg className="inline-block w-6 h-6 text-white dark:text-white" aria-hidden="true"
                           xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="m19 9-7 7-7-7" />
                      </svg>
                    }
                    {orderDirectionEstimateIndex === 2 &&

                      <svg className="inline-block w-6 h-6 text-white dark:text-white" aria-hidden="true"
                           xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                           viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                              strokeWidth="2" d="m8 15 4 4 4-4m0-6-4-4-4 4" />
                      </svg>
                    }

                  </th>
                  <th onClick={() => {
                    orderBy("arrival_time");
                    setOrderDirectionArrivalIndex(orderDirectionArrivalIndex === 2 ? 0 : orderDirectionArrivalIndex + 1);
                  }} className="p-2"><span>Arrival date&nbsp;</span>
                    {orderDirectionArrivalIndex === 0 &&
                      <svg className="inline-block size-6 text-white dark:text-white" aria-hidden="true"
                           xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="m5 15 7-7 7 7" />
                      </svg>
                    }
                    {orderDirectionArrivalIndex === 1 &&
                      <svg className="inline-block w-6 h-6 text-white dark:text-white" aria-hidden="true"
                           xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="m19 9-7 7-7-7" />
                      </svg>
                    }
                    {orderDirectionArrivalIndex === 2 &&

                      <svg className="inline-block w-6 h-6 text-white dark:text-white" aria-hidden="true"
                           xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                           viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                              strokeWidth="2" d="m8 15 4 4 4-4m0-6-4-4-4 4" />
                      </svg>
                    }

                  </th>
                  <th className="p-2"></th>
                </tr>
                </thead>
                <tbody>
                {Data.data.length===0 && <tr className="text-center bg-orange-500 text-white p-4 rounded-sm"><td  colSpan={9} className="text-xl text-orange-500 bg-white p-5 ">Empty</td></tr>}
                {
                  Data.data.length>0 && Data.data.map((d, index)=>{
                    return <tr key={index} onClick={() => {
                      setShipmentContext((prevState) => ({
                        ...prevState,
                        id: 1,
                        del: del,
                        detailOpen: detailOpen,
                        all: all,
                        checkBoxOpen: checkBoxOpen
                      }));
                      navigate(`/shipment/${1}`);
                    }} className="border-b border-gray-200">
                      {
                        checkBoxOpen
                        &&
                        <td className="p-2">
                          {
                            !all &&
                            <input className="size-5" onChange={(e) => handleDeleteIds(e, d.id)} type="checkbox"
                                   name="shipmentId"
                                   id="shipmentId" checked="" />
                          }
                          {
                            all &&
                            <input className="size-5" onChange={(e) => handleDeleteIds(e,d.id)} type="checkbox"
                                   name="shipmentId"
                                   id="shipmentId" checked="true" />
                          }
                        </td>
                      }
                      {
                        !checkBoxOpen
                        &&
                        <td className="p-2">

                        </td>
                      }

                      <td className="p-2">{d.id}</td>
                      <td className="p-2">
                        <div className=" text-xs text-white gap-1 px-1 py-2 rounded-md bg-green-500 flex items-center">
                          <svg className="size-4 text-white dark:text-white" aria-hidden="true"
                               xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                               viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M9.5 11.5 11 13l4-3.5M12 20a16.405 16.405 0 0 1-5.092-5.804A16.694 16.694 0 0 1 5 6.666L12 4l7 2.667a16.695 16.695 0 0 1-1.908 7.529A16.406 16.406 0 0 1 12 20Z" />
                          </svg>
                          {d.status.toString().at(0).toUpperCase()+d.status.toString().slice(1)}
                        </div>
                      </td>
                      <td className="p-2">{d.vehicle_id}</td>
                      <td className="p-2">{d.capacity}</td>
                      <td className="p-2">{d.origin_address}</td>
                      <td className="p-2 ">{d.destination_address}</td>
                      <td className="p-2">{d.estimated_arrival_time}</td>
                      <td className="p-2">{d.arrival_time}</td>
                      <td>
                        <div onClick={() => {
                          let newDetailOpens = [...detailOpens];
                          newDetailOpens[index] = !newDetailOpens[index];
                          setDetailOpens(newDetailOpens);
                          setShipmentContext((prevState) => ({ ...prevState, detailOpens: newDetailOpens }));
                        }} className="relative cursor-pointer">
                          <svg
                               className="cursor-pointer w-6 h-6 text-gray-800 dark:text-white"
                               aria-hidden="true"
                               xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                               viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeWidth="2"
                                  d="M6 12h.01m6 0h.01m5.99 0h.01" />
                          </svg>
                          {detailOpens[index] &&
                            <section
                              className="bg-white cursor-pointer absolute top-100 -left-100 right-0 min-w-[100px] py-2 rounded-md shadow-md">
                              <p onClick={() => {

                                navigate(`/shipments/${d.id}`);
                              }} className="py-2 px-4 hover:bg-gray-100 hover:text-black">Edit</p>
                              <p onClick={()=>deleteItem(d.id)} className="py-2 px-4 hover:bg-gray-100 hover:text-black">Delete</p>
                            </section>
                          }
                        </div>
                      </td>
                    </tr>;
                  })
                }
                </tbody>
              </table>
            </div>
            {Data.data.length>0 && true &&
              <div className="mt-4 flex justify-end">
                <div className="flex gap-2">
                  {
                    Data.links.map((d,index)=>{
                      if(d.url)
                      {
                        if(d.label.includes("&")){
                          let symbol;
                          if(d.label.includes("Prev")){
                            symbol = d.label.split(" ")[0];
                            d.label = d.label.replace(symbol, "«")

                          }else if(d.label.includes("Next")){
                            symbol = d.label.split(" ")[1];
                            d.label= d.label.replace(symbol,"»")

                          }
                        }
                        if(d.active===false)
                          return <div key={index} data-url={d.url} onClick={()=>getShipment(d.url)} className="cursor-pointer px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200">{d.label}</div>
                        else
                          return <div key={index} data-url={d.url} onClick={()=>getShipment(d.url)} className="cursor-pointer px-3 py-2 rounded-md bg-gray-200 hover:bg-gray-200">{d.label}</div>
                      }
                    })
                  }
                </div>
              </div>
            }
          </div>
        }
      </section>
    </>
  )
}