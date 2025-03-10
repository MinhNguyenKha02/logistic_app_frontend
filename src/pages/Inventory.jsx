import Sidebar from "../components/Sidebar";
import Table from "../components/Table.jsx";
import React, { useContext, useEffect, useState } from "react";
import { authApi, endpoints } from "../helper/Apis.js";
import Cookies from "js-cookie";
import { DetailPageContext } from "../helper/Context.js";
import { ToastContainer, toast } from "react-toastify";
import { echo } from "../helper/echo.js";

export default function InventoryPage() {
  const [text, setText] = useState("");
  const { inventoryContext, setInventoryContext } =
    useContext(DetailPageContext);

  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [units, setUnits] = useState([]);

  const [warehouse, setWarehouse] = React.useState("");
  const [product, setProduct] = React.useState("");
  const [unit, setUnit] = React.useState("");
  const [quantity, setQuantity] = React.useState("");

  const [message, setMessage] = React.useState("");

  const handleSubmit = async () => {
    const data = {
      warehouse_id: warehouse,
      product_id: product,
      unit: unit,
      quantity: quantity,
    };
    const token = Cookies.get("token");
    console.log(token);
    const response = await authApi(token)
      .post(endpoints["inventory"], data)
      .catch((err) => {
        if (err.response.status === 422) {
          const data = err.response.data.errors;
          console.log(data);
          data.quantity?.forEach((d) => toast.error(d));
          data.product_id?.forEach((d) => toast.error(d));
          data.warehouse_id?.forEach((d) => toast.error(d));
          data.unit?.forEach((d) => toast.error(d));
        }
      });
    console.log(response);
    if (response.status === 201) {
      // setMessage(response.data.message)
      // setMessage(response.data.message)

      toast.success(response.data.message, {
        onClick: () => {
          setInventoryContext((prev) => ({ ...prev, addItem: true }));
        },
        onClose: () => {
          setInventoryContext((prev) => ({ ...prev, addItem: true }));
        },
      });
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const token = Cookies.get("token");
      console.log(token);
      const response = await authApi(token).get(endpoints["products"]);
      setProducts(response.data.products);
      console.log(response.data);
    };
    fetchProducts();

    const fetchWarehouses = async () => {
      const token = Cookies.get("token");
      const response = await authApi(token).get(endpoints["warehouses"]);
      console.log(response.data);
      setWarehouses(response.data.warehouses);
    };
    fetchWarehouses();

    const fetchUnits = async () => {
      const token = Cookies.get("token");
      const response = await authApi(token).get(endpoints["inventory-unit"]);
      console.log(response.data.units);
      setUnits(response.data.units);
    };
    fetchUnits();
  }, []);
  const [user, setUser] = React.useState({});
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = Cookies.get("token");
      const response = await authApi(token).get(endpoints["current-user"]);
      setUser(response.data);
    };
    fetchCurrentUser();
  }, []);
  useEffect(() => {
    const token = Cookies.get("token");
    user &&
      echo(token)
        .private(`notification.${user.id}`)
        .notification((notification) => toast.info(notification["message"]));
  }, []);
  return (
    <>
      <ToastContainer position="top-right" />

      <Sidebar />
      <main className="flex h-screen flex-row bg-gray-100 p-4 sm:ml-64">
        <section className="basis-[100%] overflow-x-auto p-4 lg:basis-[60%]">
          <Table />
        </section>
        <section className="hidden p-4 lg:block lg:basis-[40%]">
          <section className="relative rounded-lg bg-white">
            {inventoryContext.add && (
              <section className="absolute left-0 right-0 top-0 rounded-md bg-white p-4 px-8 text-black">
                <div className="mb-4 flex justify-between">
                  <div className="text-2xl">Add form</div>
                  <div
                    className="cursor-pointer"
                    onClick={() => {
                      setInventoryContext((prevState) => ({
                        ...prevState,
                        add: !inventoryContext.add,
                      }));
                    }}
                  >
                    <svg
                      className="h-6 w-6 text-black dark:text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18 17.94 6M18 18 6.06 6"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <div className="mb-4">
                    <label htmlFor="product" className="mb-2 block">
                      Product
                    </label>
                    <select
                      id="product"
                      className="w-full rounded-md"
                      value={product}
                      onChange={(e) => setProduct(e.target.value)}
                    >
                      {products.map((p, index) => {
                        if (index === 0) {
                          return (
                            <option selected={true}>Select your option</option>
                          );
                        }
                        return (
                          <option value={p.id}>
                            {p.name.toString().at(0).toUpperCase() +
                              p.name.slice(1)}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="warehouse" className="mb-2 block">
                      Warehouse
                    </label>
                    <select
                      id="warehouse"
                      className="w-full rounded-md"
                      value={warehouse}
                      onChange={(e) => setWarehouse(e.target.value)}
                    >
                      {warehouses.map((wh, index) => {
                        if (index === 0)
                          return (
                            <option selected={true}>Select your option</option>
                          );
                        return (
                          <option value={wh.id}>
                            {wh.name.at(0).toUpperCase() + wh.name.slice(1)}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="quantity" className="mb-2 block">
                      Quantity
                    </label>
                    <input
                      type="number"
                      className="w-full rounded-md"
                      id="quantity"
                      name="name"
                      placeholder="Enter quantity"
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="unit" className="mb-2 block">
                      Unit
                    </label>
                    <select
                      id="unit"
                      className="w-full rounded-md"
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                    >
                      <option selected={true}>Select your option</option>;
                      {units.map((wh, index) => {
                        return (
                          <option key={index} value={wh}>
                            {wh.at(0).toUpperCase() + wh.slice(1)}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="mb-8">
                    {message && (
                      <p className="rounded-md bg-green-100 p-2 text-green-500">
                        {message}
                      </p>
                    )}
                  </div>
                  <div className="mb-4 flex gap-2">
                    <button
                      onClick={handleSubmit}
                      className="rounded-md bg-orange-500 px-4 py-2 text-white hover:bg-orange-600"
                    >
                      Add
                    </button>
                    <button
                      onClick={() =>
                        setInventoryContext((prevState) => ({
                          ...prevState,
                          add: !inventoryContext.add,
                        }))
                      }
                      className="rounded-md border border-black px-4 py-2"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </section>
            )}
          </section>
        </section>
      </main>
    </>
  );
}
