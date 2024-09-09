import { ToastContainer } from "react-toastify";
import Sidebar from "../components/Sidebar.jsx";

export default function Tracking() {

  return (
    <>
      <ToastContainer position="top-right"/>

      <Sidebar/>
      <main className="h-screen p-4 sm:ml-64 flex flex-row bg-gray-100">
        <div className="flex">
          <div className="h-screen w-1/3">
          </div>
          <div className="h-screen w-2/3">

          </div>
        </div>
      </main>
    </>
  )
}