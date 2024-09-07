import React, { useContext, useEffect, useState } from "react";
import { DetailPageContext } from "../helper/Context.js";
import {useNavigate} from "react-router-dom";
import {endpoints, authApi} from "../helper/Apis.js";
import Cookies from "js-cookie";
import { ToastContainer, toast } from 'react-toastify';
export default function Table() {
    const [Data,setData]=useState([]);
    const [loading, setLoading] = useState(true)

    const {inventoryContext, setInventoryContext} = useContext(DetailPageContext)
    console.log("inventoryContext inventory", inventoryContext);
    const navigate = useNavigate();
    const [del, setDel] = React.useState(!inventoryContext.del?false : true);
    const [detailOpen, setDetailOpen] = React.useState(!inventoryContext.detailOpen?false:true);
    const [orderDirectionIdIndex, setOrderDirectionIdIndex] = React.useState(2);
    const [orderDirectionQuantityIndex, setOrderDirectionQuantityIndex] = React.useState(2);
    const [orderDirectionUnitIndex, setOrderDirectionUnitIndex] = React.useState(2);
    const [orderDirectionProductIndex, setOrderDirectionProductIndex] = React.useState(2);
    const [orderDirectionWarehouseIndex, setOrderDirectionWarehouseIndex] = React.useState(2);
    const [orderDirectionCreatedIndex, setOrderDirectionCreatedIndex] = React.useState(2);
    const [orderDirectionUpdatedIndex, setOrderDirectionUpdatedIndex] = React.useState(2);
    const [detailOpens, setDetailOpens] = useState(  [!inventoryContext.detailOpens?
       Data.data.forEach((d) => !inventoryContext.detailOpen?false:true):false]
    )

    const [deleteIds, setDeleteIds] = React.useState([]);

    const [all, setAll] = React.useState(!inventoryContext.all?false:true);
    const [checkBoxOpen, setCheckBoxOpen] = React.useState(!inventoryContext.checkBoxOpen?false:true);

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
      setInventoryContext((prevState) => ({
        ...prevState,
        del: del,
        checkBoxOpen: checkBoxOpen
      }));
  }

  const handleDeleteIdsAll = ()=>{
      console.log(Data)
  }

  const handleDeleteIds = async (id)=>{
      console.log(deleteIds)
      console.log(id)

      if(e.target.checked===true){
        setDeleteIds([...deleteIds, id])
      }else{
        setDeleteIds(deleteIds.filter((d) => d !== id))
      }
  }
  const fetchData = async () => {
    setLoading(true)
    const token = Cookies.get("token")
    console.log(token)
    const response = await authApi(token).get(endpoints["inventory"])
    if(response) {
      setData(response.data.inventories)
      setLoading(false)
      console.log(response.data)
    }
  }
  const handleDeleteAll = async ()=>{
      console.log(deleteIds)
      const token = Cookies.get("token")
      let done=false
      // for (const id of deleteIds) {
      //   const index = deleteIds.indexOf(id);
      //   console.log(endpoints["inventoryDetail"](id))
      //   console.log(index)
      //   const response = await authApi(token).delete(endpoints["inventoryDetail"](id))
      //   console.log("response", response)
      //   if(response.status===204&&index===deleteIds.length-1){
      //     fetchData()
      //     done=true
      //   }
      // }
      // if(done===true)
      //   setDeleteIds([])
  }



  const getInventory = async (url) => {
        const token = Cookies.get("token");
        console.log(token);
        const response = await authApi(token).get(url)
        console.log(response.data)
        setData(response.data.inventories)
    }

  const handleSearch = async (e)=>{
    const keyword = e.target.value;
    const token = Cookies.get("token");
    console.log(token);
    const response = await authApi(token).get(endpoints["search"](keyword))
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
      case "quantity":
        direction=directions[orderDirectionQuantityIndex]
        break;
      case "unit":

        direction=directions[orderDirectionUnitIndex]
        break;
      case "warehouse_id":
        direction=directions[orderDirectionWarehouseIndex]
        break;
      case "product_id":
        direction=directions[orderDirectionProductIndex]
        break;
      case "created_at":
        direction=directions[orderDirectionCreatedIndex]
        break;
      case "updated_at":
        direction=directions[orderDirectionUpdatedIndex]
        break;
    }
      const token = Cookies.get("token");
      const response = await authApi(token).get(endpoints["order"](type, direction))
      setData(response.data.inventories)

    }

  const deleteItem = async (id)=> {
    const token = Cookies.get("token");
    const response = await authApi(token).delete(endpoints["inventoryDetail"](id))
    if(response.status===204){
      setMessage(response.data.message)
      toast.success(response.data.message)
      fetchData()
    }
  }
  useEffect( ()=>{

    fetchData()
  }, [])

  const handleWhenAddOrUpdate = ()=>{
      if(inventoryContext.updateItem===true){
        fetchData()
        inventoryContext.updateItem=false
      }
      if(inventoryContext.addItem===true){
        fetchData()
        inventoryContext.addItem=false
      }
  }
  handleWhenAddOrUpdate()

  return(
    <>
      <ToastContainer position="top-right"/>
      <section className="bg-white rounded-lg p-4">
        <div className="mb-4 flex gap-2 flex-col xl:flex-row justify-between">
          <h4 className="text-2xl flex gap-2 items-center">
            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                 width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M4.248 19C3.22 15.77 5.275 8.232 12.466 8.232V6.079a1.025 1.025 0 0 1 1.644-.862l5.479 4.307a1.108 1.108 0 0 1 0 1.723l-5.48 4.307a1.026 1.026 0 0 1-1.643-.861v-2.154C5.275 13.616 4.248 19 4.248 19Z" />
            </svg>
            Inventory List
          </h4>
          <div className="flex flex-col text-left lg:flex-row lg:items-center gap-4">
            <div className="flex flex-wrap gap-2 justify-end">
              <div className="p-2 border bg-gray-100 rounded-md">
                {
                  del &&
                  <input type="checkbox" onChange={() => changeMode()} checked name="checkAll"
                         className="bg-gray-100 size-5" />
                }
                {
                  !del &&
                  <input type="checkbox" onChange={()=>changeMode()} name="checkAll" className="bg-gray-100 size-5" />
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
                <input onChange={(e)=>handleSearch(e)} className="w-full rounded-md px-4 py-2 pl-14 bg-gray-100" type="text" id="search"
                       name="shipmentSearch"
                       placeholder="Search..." />
              </div>
              <button className="bg-orange-500 text-white rounded-md py-2 px-4 text-left">
                Export to CSV
              </button>
              {
                !del && inventoryContext.add === false &&
                <button onClick={() => {
                  setInventoryContext((prevState) => ({
                    ...prevState, add: !inventoryContext.add
                  }));
                }
                } className="py-2 px-4 text-left lg:text-center rounded-md text-white bg-orange-500">
                  Add
                </button>
              }
              {
                del &&
                <button onClick={handleDeleteAll} className="py-2 px-4 bg-red-500 text-white text-left lg:text-center rounded-md">
                  Delete
                </button>
              }
              {
                inventoryContext.add === true &&
                <button onClick={() => {
                  setInventoryContext((prevState) => ({
                    ...prevState, add: !inventoryContext.add
                  }));
                }
                } className="py-2 px-4 text-left lg:text-center rounded-md text-black border border-black">
                  Cancel
                </button>
              }

            </div>
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
          <div className="w-full">
            <div className="overflow-x-auto">
              {
                <table className="text-sm text-left w-full">
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
                          setInventoryContext((prevState) => ({
                            ...prevState,
                            all: all
                          }));
                          handleDeleteIdsAll()
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
                          setInventoryContext((prevState) => ({
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
                  <th onClick={()=>{
                            orderBy("id")
                            setOrderDirectionIdIndex(orderDirectionIdIndex === 2 ? 0 : orderDirectionIdIndex+1)
                  }} className="p-2"><span >Inventory Id&nbsp;</span>
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
                      orderBy("quantity");
                      setOrderDirectionQuantityIndex(orderDirectionQuantityIndex === 2 ? 0 : orderDirectionQuantityIndex + 1);

                    }} className="p-2"><span>Quantity&nbsp;</span>
                      {orderDirectionQuantityIndex === 0 &&
                        <svg className="inline-block size-6 text-white dark:text-white" aria-hidden="true"
                             xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="m5 15 7-7 7 7" />
                        </svg>
                      }
                      {orderDirectionQuantityIndex === 1 &&
                        <svg className="inline-block w-6 h-6 text-white dark:text-white" aria-hidden="true"
                             xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="m19 9-7 7-7-7" />
                        </svg>
                      }
                      {orderDirectionQuantityIndex === 2 &&
                        <svg className="inline-block w-6 h-6 text-white dark:text-white" aria-hidden="true"
                             xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                             viewBox="0 0 24 24">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                strokeWidth="2" d="m8 15 4 4 4-4m0-6-4-4-4 4" />
                        </svg>
                      }
                    </th>
                    <th onClick={() => {
                      orderBy("unit");
                      setOrderDirectionUnitIndex(orderDirectionUnitIndex === 2 ? 0 : orderDirectionUnitIndex + 1);
                    }} className="p-2 ">Unit&nbsp;
                      {orderDirectionUnitIndex === 0 &&
                        <svg className="inline-block  size-6 text-white dark:text-white" aria-hidden="true"
                             xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="m5 15 7-7 7 7" />
                      </svg>
                    }
                    {orderDirectionUnitIndex === 1 &&
                      <svg className="inline-block w-6 h-6 text-white dark:text-white" aria-hidden="true"
                           xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="m19 9-7 7-7-7" />
                      </svg>
                    }
                    {orderDirectionUnitIndex === 2 &&
                      <svg className="inline-block w-6 h-6 text-white dark:text-white" aria-hidden="true"
                           xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                           viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                              strokeWidth="2" d="m8 15 4 4 4-4m0-6-4-4-4 4" />
                      </svg>}
                  </th>
                  <th onClick={()=>{
                    orderBy("warehouse_id")
                    setOrderDirectionWarehouseIndex(orderDirectionWarehouseIndex===2?0:orderDirectionWarehouseIndex+1)
                  }} className="p-2 ">Warehouse&nbsp;
                    {orderDirectionWarehouseIndex === 0 &&
                      <svg className="inline-block  size-6 text-white dark:text-white" aria-hidden="true"
                           xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="m5 15 7-7 7 7" />
                      </svg>
                    }
                    {orderDirectionWarehouseIndex === 1 &&
                      <svg className="inline-block w-6 h-6 text-white dark:text-white" aria-hidden="true"
                           xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="m19 9-7 7-7-7" />
                      </svg>
                    }
                    {orderDirectionWarehouseIndex === 2 &&
                      <svg className="inline-block w-6 h-6 text-white dark:text-white" aria-hidden="true"
                           xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                           viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                              strokeWidth="2" d="m8 15 4 4 4-4m0-6-4-4-4 4" />
                      </svg>}
                  </th>
                  <th onClick={()=>{
                    orderBy("product_id")
                    setOrderDirectionProductIndex(orderDirectionProductIndex===2?0:orderDirectionProductIndex+1)
                  }} className=" p-2 ">Product&nbsp;
                    {orderDirectionProductIndex === 0 &&
                      <svg className="inline-block  size-6 text-white dark:text-white" aria-hidden="true"
                           xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="m5 15 7-7 7 7" />
                      </svg>
                    }
                    {orderDirectionProductIndex === 1 &&
                      <svg className="inline-block w-6 h-6 text-white dark:text-white" aria-hidden="true"
                           xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="m19 9-7 7-7-7" />
                      </svg>
                    }
                    {orderDirectionProductIndex === 2 &&
                      <svg className="inline-block w-6 h-6 text-white dark:text-white" aria-hidden="true"
                           xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                           viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                              strokeWidth="2" d="m8 15 4 4 4-4m0-6-4-4-4 4" />
                      </svg>}
                  </th>
                  <th onClick={()=>{
                    orderBy("created_at")
                    setOrderDirectionCreatedIndex(orderDirectionCreatedIndex===2?0:orderDirectionCreatedIndex+1)
                  }} className=" p-2 ">Create&nbsp;
                    {orderDirectionCreatedIndex === 0 &&
                      <svg className="inline-block  size-6 text-white dark:text-white" aria-hidden="true"
                           xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="m5 15 7-7 7 7" />
                      </svg>
                    }
                    {orderDirectionCreatedIndex === 1 &&
                      <svg className="inline-block w-6 h-6 text-white dark:text-white" aria-hidden="true"
                           xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="m19 9-7 7-7-7" />
                      </svg>
                    }
                    {orderDirectionCreatedIndex === 2 &&
                      <svg className="inline-block w-6 h-6 text-white dark:text-white" aria-hidden="true"
                           xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                           viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                              strokeWidth="2" d="m8 15 4 4 4-4m0-6-4-4-4 4" />
                      </svg>}
                  </th>
                  <th onClick={()=>{
                    orderBy("updated_at")
                    setOrderDirectionUpdatedIndex(orderDirectionUpdatedIndex===2?0:orderDirectionUpdatedIndex+1)
                  }} className=" p-2 ">Update&nbsp;
                    {orderDirectionUpdatedIndex === 0 &&
                      <svg className="inline-block  size-6 text-white dark:text-white" aria-hidden="true"
                           xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="m5 15 7-7 7 7" />
                      </svg>
                    }
                    {orderDirectionUpdatedIndex === 1 &&
                      <svg className="inline-block w-6 h-6 text-white dark:text-white" aria-hidden="true"
                           xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="m19 9-7 7-7-7" />
                      </svg>
                    }
                    {orderDirectionUpdatedIndex === 2 &&
                      <svg className="inline-block w-6 h-6 text-white dark:text-white" aria-hidden="true"
                           xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                           viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                              strokeWidth="2" d="m8 15 4 4 4-4m0-6-4-4-4 4" />
                      </svg>}
                  </th>
                  <th className="p-2"></th>
                </tr>
                </thead>
                <tbody>
                {Data.data.length===0 && <tr className="text-center bg-orange-500 text-white p-4 rounded-sm"><td  colSpan={9} className="text-xl text-orange-500 bg-white p-5 ">Empty</td></tr>}
                {
                 Data && Data.data.map((d, index) => {
                    return <tr key={index} className="cursor-pointer border-b border-gray-200">
                      {
                        checkBoxOpen
                        &&
                        <td className="p-2">
                          {
                            !all &&
                            <input className="size-5 checkbox" onChange={()=>{
                              handleDeleteIds( d.id)
                            }} type="checkbox"
                                   name="shipmentId"
                                   id="shipmentId"  />
                          }
                          {
                            all &&
                            <input className="size-5 checkbox" onChange={()=>{
                              handleDeleteIds( d.id)
                            }} type="checkbox"
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
                      <td className="p-2">{d.quantity}</td>
                      <td className="p-2">{d.unit}</td>
                      <td className="p-2">{d.warehouse_id}</td>
                      <td className="p-2">{d.product_id}</td>
                      <td className="p-2">{d.created_at}</td>
                      <td className="p-2">{d.updated_at}</td>
                      <td>
                        <div onClick={() => {
                          let newDetailOpens = [...detailOpens];
                          newDetailOpens[index] = !newDetailOpens[index];
                          setDetailOpens(newDetailOpens);
                          setInventoryContext((prevState) => ({ ...prevState, detailOpens: newDetailOpens }));

                        }} className="relative cursor-pointer p-2">
                          <svg
                            className=" size-8 text-gray-800 dark:text-white"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                            viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeWidth="2"
                                  d="M6 12h.01m6 0h.01m5.99 0h.01" />
                          </svg>
                          {detailOpens[index] &&
                            <section
                              className="bg-white cursor-pointer border border-black absolute top-100 z-20 -left-100 right-0 min-w-[100px] py-2 rounded-md shadow-md">
                              <p onClick={() => {
                                setInventoryContext((prevState) => ({
                                  ...prevState,
                                  id: d.id,
                                  del: del,
                                  detailOpen: detailOpen,
                                  all: all,
                                  checkBoxOpen: checkBoxOpen
                                }));
                                navigate(`/inventory/${d.id}`);
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
            }

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
                        return <div key={index} data-url={d.url} onClick={()=>getInventory(d.url)} className="cursor-pointer px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200">{d.label}</div>
                      else
                        return <div key={index} data-url={d.url} onClick={()=>getInventory(d.url)} className="cursor-pointer px-3 py-2 rounded-md bg-gray-200 hover:bg-gray-200">{d.label}</div>
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