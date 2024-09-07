import Sidebar from "../components/Sidebar.jsx";
import { TruckItem } from "../components/TruckItem.jsx";
import React from 'react'

export default function Vehicle() {
  const [index, setIndex] = React.useState(0);
  return (
    <>
      <Sidebar />
      <main className="p-4 sm:ml-64 flex flex-row bg-gray-100">
        <div className="basis-[100%] lg:basis-1/2 p-4">
          <section className="flex flex-col items-start lg:flex-row lg:items-center lg:justify-between mb-4">
            <h3 className="text-2xl font-bold mb-2 md:mb-0">Shipment Management</h3>
            <button className="flex gap-3 items-center bg-orange-500 p-3 text-white rounded-full">
              Add Shipment
              <svg className="w-6 h-6 text-white" aria-hidden="true"
                   xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 7.757v8.486M7.757 12h8.486M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
              </svg>
            </button>
          </section>
          <div className="flex flex-wrap flex-col md:flex-row gap-3 flex-wrap mb-4">
            <button className="p-2 rounded-md text-sm flex gap-3 items-center bg-gray-200">
              View all
              <span className="rounded-md p-1 text-left bg-gray-300">00</span>
            </button>
            <button className="p-2 rounded-md text-sm flex gap-3 items-center bg-orange-100">
              View all
              <span className="rounded-md p-1 text-left bg-orange-200">00</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
            <TruckItem/>
            <TruckItem status="transit"/>
            <TruckItem status="fail"/>
            <TruckItem/>
          </div>
          <div className="text-center">
            <button className="px-3 py-2 bg-orange-500 text-white rounded-md">Load more</button>
          </div>
        </div>
        <div className="hidden lg:block md:basis-1/2 p-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center p-4 bg-white rounded-sm">
            <section className="flex-col md:flex-row md:gap-8">
              <p className="text-2xl">Truck name</p>
              <span className="flex items-center text-orange-500 text-lg">
                            <svg className="size-4 text-orange-500 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 13V8m0 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                            </svg>&nbsp;Transit
                        </span>
            </section>
            <div className="mt-4 mb:mt-0">
              <a href="" className="px-2 py-1 rounded-sm border text-xl flex gap-2">
                <svg className="size-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.427 14.768 17.2 13.542a1.733 1.733 0 0 0-2.45 0l-.613.613a1.732 1.732 0 0 1-2.45 0l-1.838-1.84a1.735 1.735 0 0 1 0-2.452l.612-.613a1.735 1.735 0 0 0 0-2.452L9.237 5.572a1.6 1.6 0 0 0-2.45 0c-3.223 3.2-1.702 6.896 1.519 10.117 3.22 3.221 6.914 4.745 10.12 1.535a1.601 1.601 0 0 0 0-2.456Z"/>
                </svg>
                Contact
              </a>
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={()=> setIndex(0)} className={`px-2 py-1 border-b ${index===0 && 'border-b-orange-500'}`}>Info</button>
            <button onClick={() => setIndex(1)} className={`px-2 py-1 border-b ${index === 1 && 'border-b-orange-500'}`}>Billing</button>
          </div>
          { index === 0 &&
            <section className="mt-4 bg-white p-4 rounded-sm">
              <p><span className="p-1 bg-orange-500 text-white mb-2 mr-2 inline-block">Truck</span>Name
              </p>
              <p><span className="p-1 bg-orange-500 text-white mb-2 mr-2 inline-block">Driver</span>Name</p>
            </section>
          }
          {
            index === 1 &&
            <section className="mt-4 p-4 bg-white rounded-sm">
              <p><span className="p-1 bg-orange-500 text-white mb-2 mr-2 inline-block">Order&nbsp;date</span>Date</p>
              <p><span className="p-1 bg-orange-500 text-white mb-2 mr-2 inline-block">Price</span>Prce</p>
              <p><span className="p-1 bg-orange-500 text-white mb-2 mr-2 inline-block">Origin</span>Đ. Trường Sơn, Phường 2, Tân Bình, Hồ Chí Minh, Việt Nam</p>
              <p><span className="p-1 bg-orange-500 text-white mb-2 mr-2 inline-block">Destination</span>Đ. Trường Sơn, Phường 2, Tân Bình, Hồ Chí Minh, Việt Nam</p>
              <p><span className="p-1 bg-orange-500 text-white mb-2 mr-2 inline-block">Delivery&nbsp;at</span>Date</p>
            </section>
          }
        </div>
      </main>
    </>
  )
}