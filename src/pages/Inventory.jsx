import Sidebar from '../components/Sidebar';
import Table from '../components/Table.jsx';
import React, { useContext, useEffect, useState } from "react";
import {authApi, endpoints} from "../helper/Apis.js";
import Cookies from "js-cookie";
import { DetailPageContext } from "../helper/Context.js";
import { ToastContainer, toast } from 'react-toastify';
export default function InventoryPage(){

    const [text, setText] = useState("");
    const {inventoryContext, setInventoryContext} = useContext(DetailPageContext);

    const [warehouses, setWarehouses] = useState([])
    const [products, setProducts] = useState([])
    const [units, setUnits] = useState([])

    const [warehouse, setWarehouse] = React.useState("");
    const [product, setProduct] = React.useState("");
    const [unit, setUnit] = React.useState("");
    const [quantity, setQuantity] = React.useState("")

    const [message, setMessage] = React.useState("")

    const handleSubmit = async () => {
      const data = {
        "warehouse_id":warehouse,
        "product_id":product,
        "unit":unit,
        "quantity":quantity
      }
      const token = Cookies.get("token");
      console.log(token)
      const response = await authApi(token).post(endpoints["inventory"], data)
        .catch(err=>{
          if(err.response.status === 422){
            const data = err.response.data.errors
            console.log(data)
            data.quantity?.forEach(d=>toast.error(d))
            data.product_id?.forEach(d=>toast.error(d))
            data.warehouse_id?.forEach(d=>toast.error(d))
            data.unit?.forEach(d=>toast.error(d))
          }
        })
      console.log(response)
      if(response.status===201){
        // setMessage(response.data.message)
        // setMessage(response.data.message)

        toast.success(response.data.message, {onClick:()=>{
            setInventoryContext((prev)=>({...prev, addItem:true}))}, onClose:()=>{
            setInventoryContext((prev)=>({...prev, addItem:true}))
          }})

      }
    }


    useEffect(()=>{
      const fetchProducts = async () => {
        const token = Cookies.get("token")
        console.log(token)
        const response = await authApi(token).get(endpoints["products"])
        setProducts(response.data.products)
        console.log(response.data)
      }
      fetchProducts()

      const fetchWarehouses = async () => {
        const token = Cookies.get("token")
        const response = await authApi(token).get(endpoints["warehouses"])
        console.log(response.data)
        setWarehouses(response.data.warehouses)
      }
      fetchWarehouses()

      const fetchUnits = async () => {
        const token = Cookies.get("token")
        const response = await authApi(token).get(endpoints["inventory-unit"])
        console.log(response.data.units)
        setUnits(response.data.units)
      }
      fetchUnits()
    },[])

    return(
        <>
          <ToastContainer position="top-right"/>

            <Sidebar/>
          <main className="h-screen p-4 sm:ml-64 flex flex-row bg-gray-100">
            <section className="basis-[100%] lg:basis-[60%] p-4 overflow-x-auto">
              <Table/>
            </section>
            <section className="hidden lg:block lg:basis-[40%] p-4">
              <section className="rounded-lg bg-white relative">
                {inventoryContext.add
                  &&
                  <section
                    className="p-4 px-8 text-black rounded-md bg-white absolute top-0 left-0 right-0">
                    <div className="flex justify-between mb-4">
                      <div className="text-2xl">Add form</div>
                      <div className="cursor-pointer" onClick={() => {
                        setInventoryContext((prevState) => ({...prevState, add:!inventoryContext.add}))
                      }}>
                        <svg className="w-6 h-6 text-black dark:text-white" aria-hidden="true"
                             xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M6 18 17.94 6M18 18 6.06 6" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <div className="mb-4">
                        <label htmlFor="product" className="mb-2 block">Product</label>
                        <select id="product" className="w-full rounded-md" value={product} onChange={(e) => setProduct(e.target.value)}>
                          {products.map((p, index) => {
                            if(index===0){
                              return <option selected={true}>Select your option</option>;
                            }
                            return <option value={p.id}>{p.name.toString().at(0).toUpperCase() + p.name.slice(1)}</option>;
                          })
                          }
                        </select>
                      </div>
                      <div className="mb-4">
                        <label htmlFor="warehouse" className="mb-2 block">Warehouse</label>
                        <select id="warehouse" className="w-full rounded-md" value={warehouse} onChange={(e) => setWarehouse(e.target.value)}>
                          {warehouses.map((wh,index) => {
                            if(index===0)
                                return <option selected={true}>Select your option</option>;
                            return <option value={wh.id}>{wh.name.at(0).toUpperCase()+wh.name.slice(1)}</option>;
                          })
                          }
                        </select>
                      </div>
                      <div className="mb-4">
                        <label htmlFor="quantity" className="mb-2 block">Quantity</label>
                        <input type="number" className="w-full rounded-md" id="quantity"
                               name="name"
                               placeholder="Enter quantity"
                               onChange={(e) => setQuantity(e.target.value)} />
                      </div>
                      <div className="mb-4">
                        <label htmlFor="unit" className="mb-2 block">Unit</label>
                        <select id="unit" className="w-full rounded-md" value={unit}
                                onChange={(e) => setUnit(e.target.value)}>
                          <option selected={true}>Select your option</option>;
                          {units.map((wh, index) => {
                            return <option key={index} value={wh}>{wh.at(0).toUpperCase() + wh.slice(1)}</option>;
                          })
                          }
                        </select>
                      </div>
                      <div className="mb-8">
                        {message && <p className="p-2 rounded-md text-green-500 bg-green-100">{message}</p>}
                      </div>
                      <div className="mb-4 gap-2 flex">
                        <button onClick={handleSubmit}
                                className="px-4 py-2 bg-orange-500 text-white hover:bg-orange-600 rounded-md">
                          Add
                        </button>
                        <button onClick={() =>
                          setInventoryContext((prevState) => ({ ...prevState, add: !inventoryContext.add }))
                        } className="px-4 py-2 border border-black rounded-md">
                          Cancel
                        </button>
                      </div>
                    </div>
                  </section>
                }

              </section>
            </section>
          </main>
        </>
    )
}