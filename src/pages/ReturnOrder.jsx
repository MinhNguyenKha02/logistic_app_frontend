import { ToastContainer } from "react-toastify";
import Sidebar from "../components/Sidebar";
import TableOrder from "../components/TableOrder.jsx";
import TableRetunOrder from "../components/TableRetunOrder.jsx";
import React from "react";

export default function ReturnOrderPage() {
  return (
    <>
      <ToastContainer position="top-right" />

      <Sidebar />
      <main className="flex h-screen flex-row bg-gray-100 p-4 sm:ml-64">
        <section className="basis-[100%] overflow-x-auto p-4 lg:basis-[60%]"></section>
      </main>
    </>
  );
}
