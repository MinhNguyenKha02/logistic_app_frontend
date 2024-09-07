import { useParams } from "react-router-dom";
import { DetailPageContext } from "../helper/Context.js";
import React, { useContext, useEffect, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Table from "../components/Table.jsx";
import TableShipment from "../components/TableShipment.jsx";
import Cookies from "js-cookie";
import { authApi, endpoints } from "../helper/Apis.js";
import { ToastContainer, toast } from 'react-toastify';

export default function ShipmentDetail() {
  const {id} = useParams();
  console.log(id)
  const {shipmentContext, setShipmentContext} = useContext(DetailPageContext);
  const [vehicle, setVehicle] = useState("");
  const [status, setStatus] = useState("");
  const [vehicles, setVehicles] = useState([])
  const [date, setDate] = useState("")
  const goBack = ()=>{
    window.history.back()
  }
  const [message, setMessage] = useState("");
  const update = async () => {
    console.log("update clicked")

    // const token = Cookies.get("token")
    // const data = {
    //   quantity:quantity,
    //   unit:unit,
    //   warehouse_id:warehouse,
    //   product_id:product
    // }
    // const response = await authApi(token).patch(endpoints["inventoryDetail"](id), data)
    // console.log(response.data)
    // if(response.data.message) {
    //   setMessage(response.data.message)
    //   setTimeout(()=>{location.reload()},750)
    // }
  }
  useEffect(()=>{
    const fetchVehicles = async () => {
      const token = Cookies.get("token")
      console.log(token)
      const response = await authApi(token).get(endpoints["vehicles"])
      setVehicles(response.data.vehicles)
      console.log(response.data)
    }
    fetchVehicles()

  },[])
  return (
    <>
      <ToastContainer position="top-right"/>

      <Sidebar/>
      <main className="h-screen p-4 sm:ml-64 flex flex-row bg-gray-100">
        <section className="basis-[100%] lg:basis-[60%] p-4 overflow-x-auto">
          <TableShipment/>
        </section>
        <section className="hidden lg:block lg:basis-[40%] p-4">
          <section className="rounded-lg bg-white px-8 py-4 relative">
            <section>
              <div className="flex justify-between">
                <h1 className="text-2xl mb-4">Edit Form</h1>
                <div className="cursor-pointer" onClick={() => {
                  goBack()
                }}>
                  <svg className="w-6 h-6 text-black dark:text-white" aria-hidden="true"
                       xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M6 18 17.94 6M18 18 6.06 6" />
                  </svg>
                </div>
              </div>
              <section>
                <div>
                  <div className="mb-4">
                    <label htmlFor="name1" className="mb-2 block">Date</label>
                    <input type="text" className="w-full rounded-md" id="name1" name="name"
                           placeholder="Enter Name" value={date}
                           onChange={(e) => setDate(e.target.value)} />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="name2" className="mb-2 block">Status</label>
                    <select value={status} onChange={(e)=>setStatus(e.target.value)}>
                      <option value="pending">Pending</option>
                    </select>

                  </div>
                  <div className="mb-4">
                    <label htmlFor="name2" className="mb-2 block">Vehicle</label>
                    <select className="w-full rounded-md" onChange={(e) => setVehicle(e.target.value)}>
                      {vehicles.map((vh, index) => {
                        if (vh.id === vehicle)
                          return <option key={index} value={vh.id} selected>{vh.id}</option>;
                        else
                          return <option key={index} value={vh.id}>{vh.id}</option>;
                      })

                      }
                    </select>
                  </div>

                  <div className="mb-8">
                    {message &&
                      <p className="p-2 rounded-md text-green-500 bg-green-100">{message}</p>
                    }
                  </div>
                  <div className="mb-4 gap-2 flex">
                    <button onClick={update}
                            className="px-4 py-2 bg-orange-500 text-white hover:bg-orange-600 rounded-md">
                      Confirm
                    </button>
                    <button onClick={goBack} className="px-4 py-2 border border-black rounded-md">
                      Cancel
                    </button>
                  </div>

                </div>
              </section>
            </section>
          </section>
        </section>
      </main>
    </>
  )
}