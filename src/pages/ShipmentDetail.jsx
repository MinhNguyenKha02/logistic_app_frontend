import { useParams } from "react-router-dom";
import { DetailPageContext } from "../helper/Context.js";
import React, { useCallback, useContext, useEffect, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Table from "../components/Table.jsx";
import TableShipment from "../components/TableShipment.jsx";
import Cookies from "js-cookie";
import { authApi, endpoints, standardApi } from "../helper/Apis.js";
import { ToastContainer, toast } from "react-toastify";
import { formatToMySQLDate } from "../helper/dateFormat.js";
import { echo } from "../helper/echo.js";

export default function ShipmentDetail() {
  const { id } = useParams();
  console.log(id);
  const [vehicleId, setVehicleId] = useState("");
  const [status, setStatus] = useState("");
  const [originAddressShipment, setOriginAddressShipment] = useState("");
  const [destinationAddressShipment, setDestinationAddressShipment] =
    useState("");
  const [estimateDateShipment, setEstimateDateShipment] = useState("");
  const [arrivalDateShipment, setArrivalDateShipment] = useState("");
  const [capacityShipment, setCapacityShipment] = useState("");
  useEffect(() => {
    const fetchShipmentById = async () => {
      const token = Cookies.get("token");
      const response = await authApi(token).get(
        endpoints["shipment-detail"](id),
      );
      console.log("shipment by id", response.data);
      setArrivalDateShipment(response.data.shipment.arrival_time);
      setEstimateDateShipment(response.data.shipment.estimated_arrival_time);
      setCapacityShipment(response.data.shipment.capacity);
      setDestinationAddressShipment(response.data.shipment.destination_address);
      setOriginAddressShipment(response.data.shipment.origin_address);
      setStatus(response.data.shipment.status);
      setVehicleId(response.data.shipment.vehicle_id);
      // setStatus(response.data.shipment.status)
      // setCapacity(response.data.shipment.capacity)
    };
    fetchShipmentById();
  }, []);

  const goBack = () => {
    window.history.back();
  };
  const [message, setMessage] = useState("");

  const [index, setIndex] = React.useState(0);
  const {
    shipmentContext,
    setShipmentContext,
    transactionContext,
    setTransactionContext,
    orderContext,
    setOrderContext,
  } = useContext(DetailPageContext);
  const SetIndex = function (index) {
    if (index === 3) {
      setIndex(3);
    } else if (index === 2) {
      setIndex(2);
    } else if (index === 1) {
      setIndex(1);
    } else if (index === 0) {
      setIndex(0);
    }
  };
  const [customer, setCustomer] = useState("");
  const [product, setProduct] = useState("");
  const [transaction, setTransaction] = useState("");

  const [products, setProducts] = useState([]);
  const [transactionsType, setTransactionsType] = useState([]);
  const [transactionType, setTransactionType] = useState("");
  const [transactionsStatus, setTransactionsStatus] = useState([]);
  const [transactionStatus, setTransactionStatus] = useState("success");
  const [units, setUnits] = useState([]);
  const [unit, setUnit] = useState("");
  const [ordersStatus, setOrdersStatus] = useState([]);
  const [orderStatus, setOrderStatus] = useState("pending");
  const [customers, setCustomers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [vehicle, setVehicle] = useState("");
  const [shipmentsStatus, setShipmentsStatus] = useState([]);
  const [shipmentStatus, setShipmentStatus] = useState("pending");
  const [orderDate, setOrderDate] = useState(formatToMySQLDate(new Date()));
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(100000);
  const [transactionDate, setTransactionDate] = useState(
    formatToMySQLDate(new Date()),
  );
  const [originAddress, setOriginAddress] = useState("");
  const [originAddressApartmentNumber, setOriginAddressApartmentNumber] =
    useState("");
  const [originAddressCity, setOriginAddressCity] = useState("");
  const [originAddressState, setOriginAddressState] = useState("");
  const [originAddressCountry, setOriginAddressCountry] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");

  const [shipmentDate, setShipmentDate] = useState(
    formatToMySQLDate(new Date()),
  );
  const [estimateDate, setEstimateDate] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
  const [capacity, setCapacity] = useState(0);
  const fetchTransactions = async () => {
    const token = Cookies.get("token");
    const response = await authApi(token).get(endpoints["transactions"]);
    console.log("transaction", response.data);
    setTransactions(response.data.transactions);
    // setUnits(response.data.units)
  };
  const [transactionCreated, setTransactionCreated] = useState(false);
  const [orderCreated, setOrderCreated] = useState(false);
  const [shipmentCreated, setShipmentCreated] = useState(false);
  const [latestOrder, setLatestOrder] = React.useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      const token = Cookies.get("token");
      const response = await authApi(token).get(endpoints["products"]);
      console.log(response.data.products);
      setProducts(response.data.products);
    };
    const fetchTransactionsType = async () => {
      const token = Cookies.get("token");
      const response = await authApi(token).get(endpoints["transactions-type"]);
      console.log(response.data.types);
      setTransactionsType(response.data.types);
    };
    const fetchTransactionsStatus = async () => {
      const token = Cookies.get("token");
      const response = await authApi(token).get(
        endpoints["transactions-status"],
      );
      console.log(response.data.statuss);
      setTransactionsStatus(response.data.statuss);
    };
    const fetchTransactionsUnit = async () => {
      const token = Cookies.get("token");
      const response = await authApi(token).get(endpoints["transactions-unit"]);
      console.log(response.data.units);
      setUnits(response.data.units);
    };

    const fetchCustomers = async () => {
      const token = Cookies.get("token");
      const response = await authApi(token).get(endpoints["users-all"]);
      console.log("customer", response.data);
      setCustomers(response.data.users);
      // setUnits(response.data.units)
    };
    const fetchOrdersStatus = async () => {
      const token = Cookies.get("token");
      const response = await authApi(token).get(endpoints["orders-status"]);
      console.log("order status", response.data.status);
      setOrdersStatus(response.data.status);
    };
    const fetchVehicles = async () => {
      const token = Cookies.get("token");
      const response = await authApi(token).get(endpoints["vehicles"]);
      console.log("vehicles", response.data.vehicles);
      setVehicles(response.data.vehicles);
    };
    const fetchShipmentStatus = async () => {
      const token = Cookies.get("token");
      const response = await authApi(token).get(endpoints["shipments-status"]);
      console.log("shipment-status", response.data.status);
      setShipmentsStatus(response.data.status);
    };
    const fetchLatestOrder = async () => {
      const token = Cookies.get("token");
      const response = await authApi(token).get(endpoints["latest-order"]);
      setLatestOrder(response.data.order);
    };
    fetchShipmentStatus();
    fetchVehicles();
    fetchTransactions();
    fetchCustomers();
    fetchOrdersStatus();
    fetchProducts();
    fetchTransactionsStatus();
    fetchTransactionsType();
    fetchTransactionsUnit();
    fetchLatestTransaction();
    fetchLatestOrder();
  }, [index]);

  const handleSubmitTransaction = async () => {
    setTransactionCreated(true);

    const dataTransaction = {
      product_id: product,
      date: transactionDate,
      type: transactionType,
      status: transactionStatus,
      quantity: quantity,
      unit: unit,
    };

    const token = Cookies.get("token");
    const response = await authApi(token)
      .post(endpoints["transactions"], dataTransaction)
      .catch((err) => {
        if (err.response.status === 422) {
          const data = err.response.data.errors;
          console.log(data);
          data.product_id?.forEach((d) => toast.error(d));
          data.date?.forEach((d) => toast.error(d));
          data.type?.forEach((d) => toast.error(d));
          data.status?.forEach((d) => toast.error(d));
          data.quantity?.forEach((d) => toast.error(d));
          data.unit?.forEach((d) => toast.error(d));
        }
      });
    console.log(response);
    if (response.status === 201) {
      toast.success(response.data.message, {
        onClick: () => {
          setTransactionContext((prev) => ({ ...prev, addItem: true }));
        },
        onClose: () => {
          setTransactionContext((prev) => ({ ...prev, addItem: true }));
        },
      });
      setIndex(index + 1);
    }
  };

  const handleSubmitOrder = async () => {
    setOrderCreated(true);

    const dataOrder = {
      customer_id: customer,
      product_id: product,
      transaction_id: latestTransaction.id,
      date: orderDate,
      status: orderStatus,
    };

    const token = Cookies.get("token");
    const response = await authApi(token)
      .post(endpoints["orders"], dataOrder)
      .catch((err) => {
        if (err.response.status === 422) {
          const data = err.response.data.errors;
          console.log(data);
          data.customer_id?.forEach((d) => toast.error(d));
          data.product_id?.forEach((d) => toast.error(d));
          data.transaction_id?.forEach((d) => toast.error(d));
          data.date?.forEach((d) => toast.error(d));
          data.status?.forEach((d) => toast.error(d));
        }
      });
    console.log(response);
    if (response && response.status === 201) {
      toast.success(response.data.message, {
        onClick: () => {
          setOrderContext((prev) => ({ ...prev, addItem: true }));
        },
        onClose: () => {
          setOrderContext((prev) => ({ ...prev, addItem: true }));
        },
      });
      setIndex(index + 1);
    }
  };

  const handleSubmitShipment = async () => {
    setShipmentCreated(true);
    const dataShipment = {
      vehicle_id: vehicle,
      date: shipmentDate,
      status: shipmentStatus,
      estimated_arrival_time: estimateDate,
      arrival_time: arrivalDate,
      capacity: capacity,
      origin_address: originAddress,
      destination_address: destinationAddress,
    };

    const token = Cookies.get("token");
    const response = await authApi(token)
      .post(endpoints["shipments"], dataShipment)
      .catch((err) => {
        if (err.response.status === 422) {
          const data = err.response.data.errors;
          console.log(data);
          data.vehicle_id?.forEach((d) => toast.error(d));
          data.date?.forEach((d) => toast.error(d));
          data.status?.forEach((d) => toast.error(d));
          data.estimated_arrival_time?.forEach((d) => toast.error(d));
          data.arrival_time?.forEach((d) => toast.error(d));
          data.capacity?.forEach((d) => toast.error(d));
          data.origin_address?.forEach((d) => toast.error(d));
          data.destination_address?.forEach((d) => toast.error(d));
        }
      });
    console.log(response);
    if (response.status === 201) {
      toast.success(response.data.message, {
        onClick: () => {
          setShipmentContext((prev) => ({ ...prev, addItem: true }));
        },
        onClose: () => {
          setShipmentContext((prev) => ({ ...prev, addItem: true }));
        },
      });
      setIndex(index + 1);
    }
  };
  const [receiptStatus, setReceiptStatus] = React.useState("pending");

  const handleSubmit = async () => {
    const dataReceipt = {
      order_id: latestOrder?.id ?? "",
      price: price,
      status: receiptStatus,
    };

    const token = Cookies.get("token");
    const response = await authApi(token)
      .post(endpoints["receipts"], dataReceipt)
      .catch((err) => {
        if (err.response.status === 422) {
          const data = err.response.data.errors;
          console.log(data);
          data.status?.forEach((d) => toast.error(d));
          data.price?.forEach((d) => toast.error(d));
          data.order_id?.forEach((d) => toast.error(d));
        }
      });
    console.log(response);
    if (response.status === 201) {
      toast.success(response.data.message, {
        onClick: () => {
          setShipmentContext((prev) => ({ ...prev, addItem: true }));
        },
        onClose: () => {
          setShipmentContext((prev) => ({ ...prev, addItem: true }));
        },
      });
      setOrderCreated(false);
      setTransactionCreated(false);
      setShipmentCreated(false);
      setShipmentContext((prevState) => ({
        ...prevState,
        add: !shipmentContext.add,
      }));
    }

    // const token = Cookies.get("token");
    // console.log(token)
    // const response = await authApi(token).post(endpoints["inventory"], data)
    // if(response.status===201){
    //     console.log("ok")
    //     toast.success(response.data.message)
    // }
  };

  useEffect(() => {
    const fetchVehicles = async () => {
      const token = Cookies.get("token");
      console.log(token);
      const response = await authApi(token).get(endpoints["vehicles"]);
      setVehicles(response.data.vehicles);
      console.log(response.data);
    };
    fetchVehicles();
  }, []);

  const [openAutocompleteOriginForm, setOpenAutocompleteOriginForm] =
    useState(false);
  const [openAutocompleteDestinationForm, setOpenAutocompleteDestinationForm] =
    useState(false);
  const [originAddresses, setOriginAddresses] = useState([]);
  const [destinationAddresses, setDestinationAddresses] = useState([]);
  const fetchAutocompleteWithOrigin = async (keyword) => {
    const response = await standardApi().get(
      endpoints["tomtom-search"](keyword),
    );
    console.log(response.data.results);
    setOriginAddresses(response.data.results);
  };
  const fetchAutocompleteWithDestination = async (keyword) => {
    const response = await standardApi().get(
      endpoints["tomtom-search"](keyword),
    );
    console.log(response.data.results);
    setDestinationAddresses(response.data.results);
  };
  const [latestTransaction, setLatestTransaction] = useState(null);
  const fetchLatestTransaction = async () => {
    const token = Cookies.get("token");
    const response = await authApi(token).get(endpoints["transaction-latest"]);
    setLatestTransaction(response.data.transaction);
    console.log(response.data.transaction);
  };

  const update = async () => {
    const data = {
      vehicle_id: vehicleId,
      status: status,
      origin_address: originAddressShipment,
      destination_address: destinationAddressShipment,
      estimated_arrival_time: estimateDateShipment,
      arrival_time: arrivalDateShipment,
      capacity: capacityShipment,
    };
    console.log(data);
    const token = Cookies.get("token");
    const response = await authApi(token)
      .patch(endpoints["shipment-detail"](id), data)
      .catch((err) => {
        if (err.response.status === 422) {
          const data = err.response.data.errors;
          data.capacity?.forEach((d) => toast.error(d));
          data.vehicle_id?.forEach((d) => toast.error(d));
          data.origin_address?.forEach((d) => toast.error(d));
          data.destination_address?.forEach((d) => toast.error(d));
          data.status?.forEach((d) => toast.error(d));
          data.arrival_time?.forEach((d) => toast.error(d));
          data.estimated_arrival_time?.forEach((d) => toast.error(d));
        }
      });
    console.log(response.data);
    if (response.status === 200) {
      toast.success(response.data.message, {
        onClick: () => {
          setShipmentContext((prev) => ({ ...prev, updateItem: true }));
        },
        onClose: () => {
          setShipmentContext((prev) => ({ ...prev, updateItem: true }));
        },
      });
    }
  };
  const [vehicleNames, setVehicleNames] = useState(null);
  const fetchVehicleName = useCallback(async (id) => {
    const token = Cookies.get("token");
    const response = await authApi(token).get(endpoints["vehicle-detail"](id));
    if (response.status === 200) {
      const response_ = await authApi(token).get(
        endpoints["user-detail"](response.data.vehicle.carrier_id),
      );
      if (response_.status === 200) {
        return response_.data.user.name;
      }
    }
  }, []);
  const fetchAllVehicleNames = useCallback(async () => {
    const names = {};
    if (!vehicleNames) {
      for (const d of vehicles) {
        if (!names[d.id]) {
          names[d.id] = await fetchVehicleName(d.id);
        }
      }
      setVehicleNames(names);
    }
  }, [vehicles]);
  useEffect(() => {
    if (vehicles.length > 0) {
      fetchAllVehicleNames();
    }
  }, [vehicles]);
  return (
    <>
      <ToastContainer position="top-right" />

      <Sidebar />
      <main className="flex h-screen flex-row bg-gray-100 p-4 sm:ml-64">
        <section className="basis-[100%] overflow-x-auto p-4 lg:basis-[60%]">
          <TableShipment />
        </section>
        <section className="hidden p-4 lg:block lg:basis-[40%]">
          <section className="relative rounded-lg bg-white">
            {shipmentContext.add && (
              <section className="absolute left-0 right-0 top-0 z-50 rounded-md bg-white p-4 px-8 text-black">
                <div className="mb-4 flex justify-between">
                  <div className="text-2xl">Add form</div>
                  <div
                    className="cursor-pointer"
                    onClick={() => {
                      setShipmentContext((prevState) => ({
                        ...prevState,
                        add: !shipmentContext.add,
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
                <div className="mt-8 bg-white">
                  <div className="overflow-y-auto">
                    <ul className="mb-4 flex flex-col flex-wrap justify-start gap-x-2 gap-y-4 pb-4 md:pb-6 lg:flex-row">
                      <li
                        onClick={() => {
                          if (transactionCreated === true) SetIndex(0);
                          else if (index === 0)
                            if (transactionCreated === false)
                              toast.info("Transaction is not created!");
                            else setIndex(0);
                          else if (index === 1)
                            if (orderCreated === false)
                              toast.info("Order is not created!");
                            else setIndex(0);
                          else if (index === 2)
                            if (shipmentCreated === false)
                              toast.info("Shipment is not created!");
                            else setIndex(0);
                        }}
                        className="cursor-pointe flex h-4 gap-2"
                      >
                        <span
                          className={`block rounded-full p-3 ${index === 0 ? "bg-orange-500 hover:bg-orange-400" : "border border-black bg-white hover:bg-gray-50"}`}
                        ></span>
                        <span
                          className={`${index === 0 ? "text-orange-500 hover:text-orange-400" : "text-black hover:text-gray-700"}`}
                        >
                          Create transaction
                        </span>
                      </li>
                      <li
                        onClick={() => {
                          if (orderCreated === true) SetIndex(1);
                          else if (index === 0)
                            if (transactionCreated === false)
                              toast.info("Transaction is not created!");
                            else SetIndex(1);
                          else if (index === 1)
                            if (orderCreated === false)
                              toast.info("Order is not created!");
                            else SetIndex(1);
                          else if (index === 2)
                            if (shipmentCreated === false)
                              toast.info("Shipment is not created!");
                            else SetIndex(1);
                        }}
                        className="cursor-pointe flex h-4 gap-2"
                      >
                        <svg
                          className={`inline h-6 w-6 ${index === 0 ? "text-orange-500" : "text-gray-800"} dark:text-white`}
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
                            d="M19 12H5m14 0-4 4m4-4-4-4"
                          />
                        </svg>

                        <span
                          className={`block rounded-full p-3 ${index === 1 ? "bg-orange-500 hover:bg-orange-400" : "border border-black bg-white hover:bg-gray-50"}`}
                        ></span>
                        <span
                          className={`${index === 1 ? "text-orange-500 hover:text-orange-400" : "text-black hover:text-gray-700"}`}
                        >
                          Create order
                        </span>
                      </li>

                      <li
                        onClick={() => {
                          if (shipmentCreated === true) SetIndex(2);
                          else if (index === 0)
                            if (transactionCreated === false)
                              toast.info("Transaction is not created!");
                            else SetIndex(2);
                          else if (index === 1)
                            if (orderCreated === false)
                              toast.info("Order is not created!");
                            else SetIndex(2);
                          else if (index === 2)
                            if (shipmentCreated === false)
                              toast.info("Shipment is not created!");
                            else SetIndex(2);
                        }}
                        className="flex h-4 cursor-pointer gap-2"
                      >
                        <svg
                          className={`h-6 w-6 ${index === 1 ? "text-orange-500" : "text-gray-800"} dark:text-white`}
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
                            d="M19 12H5m14 0-4 4m4-4-4-4"
                          />
                        </svg>
                        <span
                          className={`block rounded-full p-3 ${index === 2 ? "bg-orange-500 hover:bg-orange-400" : "border border-black bg-white hover:bg-gray-50"}`}
                        ></span>
                        <span
                          className={`${index === 2 ? "text-orange-500 hover:text-orange-400" : "text-black hover:text-gray-700"}`}
                        >
                          Create delivery info
                        </span>
                      </li>

                      <li
                        onClick={() => {
                          if (
                            transactionCreated === true &&
                            orderCreated === true &&
                            shipmentCreated === true
                          )
                            SetIndex(3);
                          else if (index === 0)
                            if (transactionCreated === false)
                              toast.info("Transaction is not created!");
                            else SetIndex(3);
                          else if (index === 1)
                            if (orderCreated === false)
                              toast.info("Order is not created!");
                            else SetIndex(3);
                          else if (index === 2)
                            if (shipmentCreated === false)
                              toast.info("Shipment is not created!");
                            else SetIndex(3);
                        }}
                        className="flex h-4 cursor-pointer gap-2"
                      >
                        <svg
                          className={`h-6 w-6 ${index === 2 ? "text-orange-500" : "text-gray-800"} dark:text-white`}
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
                            d="M19 12H5m14 0-4 4m4-4-4-4"
                          />
                        </svg>
                        <span
                          className={`block rounded-full p-3 ${index === 3 ? "bg-orange-500 hover:bg-orange-400" : "border border-black bg-white hover:bg-gray-50"}`}
                        ></span>
                        <span
                          className={`${index === 3 ? "text-orange-500 hover:text-orange-400" : "text-black hover:text-gray-700"}`}
                        >
                          Confirm Payment
                        </span>
                      </li>
                    </ul>

                    <div className="">
                      {index === 0 && (
                        <section className="w-full">
                          <form className="mx-auto">
                            {/*<div className="mb-4">*/}
                            {/*  <label htmlFor="orderDate" className="mb-2 block">*/}
                            {/*    Transaction date*/}
                            {/*  </label>*/}
                            {/*  <input*/}
                            {/*    type="datetime-local"*/}
                            {/*    className="w-full rounded-md"*/}
                            {/*    id="orderDate"*/}
                            {/*    name="name"*/}
                            {/*    placeholder="Enter Name"*/}
                            {/*    value={transactionDate}*/}
                            {/*    onChange={(e) =>*/}
                            {/*      setTransactionDate(e.target.value)*/}
                            {/*    }*/}
                            {/*  />*/}
                            {/*</div>*/}
                            {/*<div className="mb-4">*/}
                            {/*  <label className="mb-2 block" htmlFor="status">*/}
                            {/*    Status*/}
                            {/*  </label>*/}
                            {/*  <select*/}
                            {/*    id="status"*/}
                            {/*    className="w-full rounded-md"*/}
                            {/*    value={transactionStatus}*/}
                            {/*    onChange={(e) =>*/}
                            {/*      setTransactionStatus(e.target.value)*/}
                            {/*    }*/}
                            {/*  >*/}
                            {/*    <option selected={true}>*/}
                            {/*      Select your option*/}
                            {/*    </option>*/}
                            {/*    {transactionsStatus.map((s, index) => {*/}
                            {/*      return (*/}
                            {/*        <option key={index} value={s}>*/}
                            {/*          {s.toString().at(0).toUpperCase() +*/}
                            {/*            s.slice(1)}*/}
                            {/*        </option>*/}
                            {/*      );*/}
                            {/*    })}*/}
                            {/*  </select>*/}
                            {/*</div>*/}
                            <div className="mb-4">
                              <label className="mb-2 block" htmlFor="product">
                                Product Name
                              </label>
                              <select
                                id="product"
                                className="w-full rounded-md"
                                value={product}
                                onChange={(e) => setProduct(e.target.value)}
                              >
                                <option key={index} selected={true}>
                                  Select your option
                                </option>
                                ;
                                {products.map((p, index) => {
                                  return (
                                    <option key={index} value={p.id}>
                                      {p.name.toString().at(0).toUpperCase() +
                                        p.name.slice(1)}
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                            <div className="mb-4">
                              <label className="mb-2 block" htmlFor="type">
                                Type
                              </label>
                              <select
                                className="w-full rounded-md"
                                id="type"
                                value={transactionType}
                                onChange={(e) =>
                                  setTransactionType(e.target.value)
                                }
                              >
                                <option selected={true}>
                                  Select your option
                                </option>
                                ;
                                {transactionsType.map((type, index) => {
                                  return (
                                    <option key={index} value={type}>
                                      {type.toString().at(0).toUpperCase() +
                                        type.slice(1)}
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
                              <select
                                id="unit"
                                className="w-full rounded-md"
                                value={unit}
                                onChange={(e) => setUnit(e.target.value)}
                              >
                                <option selected={true}>
                                  Select your option
                                </option>
                                ;
                                {units.map((wh, index) => {
                                  return (
                                    <option key={index} value={wh}>
                                      {wh.toString().at(0).toUpperCase() +
                                        wh.slice(1)}
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                          </form>
                        </section>
                      )}
                      {index === 1 && (
                        <section className="w-full">
                          <form className="mx-auto">
                            {/*<div className="mb-4">*/}
                            {/*  <label htmlFor="orderDate" className="mb-2 block">*/}
                            {/*    Order date*/}
                            {/*  </label>*/}
                            {/*  <input*/}
                            {/*    type="datetime-local"*/}
                            {/*    className="w-full rounded-md"*/}
                            {/*    id="orderDate"*/}
                            {/*    name="name"*/}
                            {/*    placeholder="Enter Name"*/}
                            {/*    value={orderDate}*/}
                            {/*    onChange={(e) => setOrderDate(e.target.value)}*/}
                            {/*  />*/}
                            {/*</div>*/}

                            {/*<div className="mb-4 flex justify-between gap-4">*/}
                            {/*  <div className="basis-1/2">*/}
                            {/*    <label className="mb-2 block" htmlFor="status">*/}
                            {/*      Status*/}
                            {/*    </label>*/}
                            {/*    <select*/}
                            {/*      id="status"*/}
                            {/*      className="w-full rounded-md"*/}
                            {/*      value={orderStatus}*/}
                            {/*      onChange={(e) =>*/}
                            {/*        setOrderStatus(e.target.value)*/}
                            {/*      }*/}
                            {/*    >*/}
                            {/*      <option selected={true}>*/}
                            {/*        Select your option*/}
                            {/*      </option>*/}
                            {/*      {ordersStatus.map((s, index) => {*/}
                            {/*        return (*/}
                            {/*          <option key={index} value={s}>*/}
                            {/*            {s.toString().at(0).toUpperCase() +*/}
                            {/*              s.slice(1)}*/}
                            {/*          </option>*/}
                            {/*        );*/}
                            {/*      })}*/}
                            {/*    </select>*/}
                            {/*  </div>*/}
                            {/*  <div className="basis-1/2">*/}
                            {/*    <label className="mb-2 block" htmlFor="product">*/}
                            {/*      Product Name*/}
                            {/*    </label>*/}
                            {/*    <select*/}
                            {/*      id="product"*/}
                            {/*      className="w-full rounded-md"*/}
                            {/*      value={product}*/}
                            {/*      onChange={(e) => setProduct(e.target.value)}*/}
                            {/*    >*/}
                            {/*      <option selected={true}>*/}
                            {/*        Select your option*/}
                            {/*      </option>*/}
                            {/*      {products.map((s, index) => {*/}
                            {/*        return (*/}
                            {/*          <option key={index} value={s.id}>*/}
                            {/*            {s.name.toString().at(0).toUpperCase() +*/}
                            {/*              s.name.slice(1)}*/}
                            {/*          </option>*/}
                            {/*        );*/}
                            {/*      })}*/}
                            {/*    </select>*/}
                            {/*  </div>*/}
                            {/*</div>*/}
                            {/*<div className="mb-4">*/}
                            {/*  <label*/}
                            {/*    className="mb-2 block"*/}
                            {/*    htmlFor="transaction"*/}
                            {/*  >*/}
                            {/*    Transaction*/}
                            {/*  </label>*/}

                            {/*  <input*/}
                            {/*    className="w-full rounded-md border border-black px-3 py-2"*/}
                            {/*    readOnly={true}*/}
                            {/*    value={latestTransaction.id}*/}
                            {/*  />*/}
                            {/*</div>*/}
                            <div className="mb-4">
                              <label className="mb-2 block" htmlFor="customer">
                                Customer
                              </label>
                              <select
                                id="customer"
                                className="w-full rounded-md"
                                value={customer}
                                onChange={(e) => setCustomer(e.target.value)}
                              >
                                <option selected={true}>
                                  Select your option
                                </option>
                                {customers.map((s, index) => {
                                  return (
                                    <option key={index} value={s.id}>
                                      {s.name.toString().at(0).toUpperCase() +
                                        s.name.slice(1)}
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                            {/*<div className="mb-4">*/}
                            {/*  <label className="mb-2 block" htmlFor="unit">*/}
                            {/*    Unit*/}
                            {/*  </label>*/}
                            {/*  <select*/}
                            {/*    id="unit"*/}
                            {/*    className="w-full rounded-md"*/}
                            {/*    value={unit}*/}
                            {/*    onChange={(e) => setUnit(e.target.value)}*/}
                            {/*  >*/}
                            {/*    <option selected={true}>*/}
                            {/*      Select your option*/}
                            {/*    </option>*/}
                            {/*    {units.map((s, index) => {*/}
                            {/*      return (*/}
                            {/*        <option key={index} value={s}>*/}
                            {/*          {s.toString().at(0).toUpperCase() +*/}
                            {/*            s.slice(1)}*/}
                            {/*        </option>*/}
                            {/*      );*/}
                            {/*    })}*/}
                            {/*  </select>*/}
                            {/*</div>*/}
                            {/*<div className="mb-4">*/}
                            {/*  <label htmlFor="quantity" className="mb-2 block">*/}
                            {/*    Quantity*/}
                            {/*  </label>*/}
                            {/*  <input*/}
                            {/*    type="number"*/}
                            {/*    className="w-full rounded-md"*/}
                            {/*    id="quantity"*/}
                            {/*    name="quantity"*/}
                            {/*    placeholder="Quantity"*/}
                            {/*    value={quantity}*/}
                            {/*    onChange={(e) => setQuantity(e.target.value)}*/}
                            {/*  />*/}
                            {/*</div>*/}

                            {/*<div className="mb-4">*/}
                            {/*  <label htmlFor="price" className="mb-2 block">*/}
                            {/*    Price*/}
                            {/*  </label>*/}
                            {/*  <input*/}
                            {/*    type="text"*/}
                            {/*    className="w-full rounded-md"*/}
                            {/*    id="price"*/}
                            {/*    name="price"*/}
                            {/*    placeholder="Price"*/}
                            {/*    value={price}*/}
                            {/*    onChange={(e) => setPrice(e.target.value)}*/}
                            {/*  />*/}
                            {/*</div>*/}
                          </form>
                        </section>
                      )}
                      {index === 2 && (
                        <section className="w-full">
                          <form className="mx-auto">
                            <div className="relative mb-4">
                              <label htmlFor="origin" className="mb-2 block">
                                Origin
                              </label>
                              <input
                                autoComplete="address-line1"
                                type="text"
                                className="w-full rounded-md"
                                id="origin"
                                name="origin"
                                placeholder="Enter Origin"
                                value={originAddress}
                                onChange={(e) => {
                                  setOriginAddress(e.target.value);
                                  setOpenAutocompleteOriginForm(true);
                                  fetchAutocompleteWithOrigin(e.target.value);
                                }}
                              />
                              {openAutocompleteOriginForm &&
                                originAddresses && (
                                  <div className="bottom-100 absolute z-10 w-full rounded-b-sm border border-t-0 border-black bg-white shadow-sm">
                                    {originAddresses.map((address, index) => {
                                      return (
                                        <div
                                          key={index}
                                          className="mb-1 cursor-pointer px-3 py-2"
                                          onClick={() => {
                                            setOpenAutocompleteOriginForm(
                                              false,
                                            );
                                            setOriginAddress(
                                              address.address.freeformAddress,
                                            );
                                          }}
                                        >
                                          <h4 className="text-md">
                                            {address.address.freeformAddress}
                                          </h4>
                                          <span className="text-xs">
                                            type:&nbsp;{address.type}
                                          </span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                            </div>

                            <div className="relative mb-4">
                              <label htmlFor="origin" className="mb-2 block">
                                Destination
                              </label>
                              <input
                                autoComplete="address-line1"
                                type="text"
                                className="w-full rounded-md"
                                id="origin"
                                name="origin"
                                placeholder="Enter Destination"
                                value={destinationAddress}
                                onChange={(e) => {
                                  setDestinationAddress(e.target.value);
                                  setOpenAutocompleteDestinationForm(true);
                                  fetchAutocompleteWithDestination(
                                    e.target.value,
                                  );
                                }}
                              />
                              {openAutocompleteDestinationForm &&
                                destinationAddresses && (
                                  <div className="bottom-100 absolute z-10 w-full rounded-b-sm border border-t-0 border-black bg-white shadow-sm">
                                    {destinationAddresses.map(
                                      (address, index) => {
                                        return (
                                          <div
                                            key={index}
                                            className="mb-1 cursor-pointer px-3 py-2"
                                            onClick={() => {
                                              setOpenAutocompleteDestinationForm(
                                                false,
                                              );
                                              setDestinationAddress(
                                                address.address.freeformAddress,
                                              );
                                            }}
                                          >
                                            <h4 className="text-md">
                                              {address.address.freeformAddress}
                                            </h4>
                                            <span className="text-xs">
                                              type:&nbsp;{address.type}
                                            </span>
                                          </div>
                                        );
                                      },
                                    )}
                                  </div>
                                )}
                            </div>

                            {/*<div className="mb-4">*/}
                            {/*  <label*/}
                            {/*    htmlFor="shipmentDate"*/}
                            {/*    className="mb-2 block"*/}
                            {/*  >*/}
                            {/*    Shipment Date*/}
                            {/*  </label>*/}
                            {/*  <input*/}
                            {/*    type="datetime-local"*/}
                            {/*    className="w-full rounded-md"*/}
                            {/*    id="shipmentDate"*/}
                            {/*    name="shipmentDate"*/}
                            {/*    placeholder="Enter Origin"*/}
                            {/*    value={shipmentDate}*/}
                            {/*    onChange={(e) =>*/}
                            {/*      setShipmentDate(e.target.value)*/}
                            {/*    }*/}
                            {/*  />*/}
                            {/*</div>*/}
                            <div className="mb-4">
                              <label
                                htmlFor="estimateDate"
                                className="mb-2 block"
                              >
                                Estimate Date
                              </label>
                              <input
                                type="datetime-local"
                                className="w-full rounded-md"
                                id="estimateDate"
                                name="arrivalDate"
                                placeholder="Enter estimate date"
                                value={estimateDate}
                                onChange={(e) =>
                                  setEstimateDate(e.target.value)
                                }
                              />
                            </div>
                            <div className="mb-4">
                              <label
                                htmlFor="arrivalDate"
                                className="mb-2 block"
                              >
                                Arrival Date
                              </label>
                              <input
                                type="datetime-local"
                                className="w-full rounded-md"
                                id="arrivalDate"
                                name="arrivalDate"
                                placeholder="Enter Arrival Date"
                                value={arrivalDate}
                                onChange={(e) => setArrivalDate(e.target.value)}
                              />
                            </div>
                            <div className="mb-4">
                              <label htmlFor="capacity" className="mb-2 block">
                                Capacity
                              </label>
                              <input
                                type="text"
                                className="w-full rounded-md"
                                id="capacity"
                                name="shipmentDate"
                                placeholder="Enter Capacity"
                                value={capacity}
                                onChange={(e) => setCapacity(e.target.value)}
                              />
                            </div>
                            <div className="mb-4 flex flex-col justify-between gap-4 md:flex-row">
                              <label className="mb-2 block" htmlFor="vehicle">
                                Vehicle
                              </label>
                              <select
                                id="vehicle"
                                className="w-full rounded-md"
                                value={vehicle}
                                onChange={(e) => setVehicle(e.target.value)}
                              >
                                <option selected={true}>
                                  Select your option
                                </option>
                                {vehicleNames !== null &&
                                  vehicles.map((s, index) => {
                                    return (
                                      <option key={index} value={s.id}>
                                        {s.type.toString().at(0).toUpperCase() +
                                          s.type.slice(1) +
                                          " - " +
                                          vehicleNames[s.id]}
                                      </option>
                                    );
                                  })}
                              </select>
                              {/*<div className="basis-1/2">*/}
                              {/*  <label className="mb-2 block" htmlFor="status">*/}
                              {/*    Status*/}
                              {/*  </label>*/}
                              {/*  <select*/}
                              {/*    id="status"*/}
                              {/*    className="w-full rounded-md"*/}
                              {/*    value={shipmentStatus}*/}
                              {/*    onChange={(e) =>*/}
                              {/*      setShipmentStatus(e.target.value)*/}
                              {/*    }*/}
                              {/*  >*/}
                              {/*    <option selected={true}>*/}
                              {/*      Select your option*/}
                              {/*    </option>*/}
                              {/*    {shipmentsStatus.map((s, index) => {*/}
                              {/*      return (*/}
                              {/*        <option key={index} value={s}>*/}
                              {/*          {s.toString().at(0).toUpperCase() +*/}
                              {/*            s.slice(1)}*/}
                              {/*        </option>*/}
                              {/*      );*/}
                              {/*    })}*/}
                              {/*  </select>*/}
                              {/*</div>*/}
                            </div>
                          </form>
                        </section>
                      )}
                      {index === 3 && (
                        <section className="w-full">
                          <section className="flex flex-col">
                            <p className="mb-4 flex items-baseline">
                              <span className="mb-2 mr-4 inline-block rounded-sm bg-orange-500 p-2 text-white">
                                Order date
                              </span>
                              <span>
                                {orderDate !== "" && orderDate}{" "}
                                {orderDate === "" && "XX/XX/xxxx"}
                              </span>
                            </p>
                            <p className="mb-4 flex items-baseline">
                              <span className="mb-2 mr-4 inline-block rounded-sm bg-orange-500 p-2 text-white">
                                Product
                              </span>
                              <span>
                                {product !== "" && product}
                                {product === "" && "Product name"}
                              </span>
                            </p>
                            <p className="mb-4 flex items-baseline">
                              <span className="mb-2 mr-4 inline-block rounded-sm bg-orange-500 p-2 text-white">
                                Quantity
                              </span>
                              <span>{quantity}</span>
                            </p>
                            <p className="mb-4 flex items-baseline">
                              <span className="mb-2 mr-4 inline-block rounded-sm bg-orange-500 p-2 text-white">
                                Price
                              </span>
                              <span>{price}</span>
                            </p>
                            <p className="mb-4 flex items-baseline">
                              <span className="mb-2 mr-4 inline-block rounded-sm bg-orange-500 p-2 text-white">
                                Shipment date
                              </span>
                              <span>
                                {shipmentDate !== "" && shipmentDate}
                                {shipmentDate === "" && "XX/XX/XXXX"}
                              </span>
                            </p>
                            <p className="mb-4 flex items-center">
                              <span className="mb-2 mr-4 inline-block rounded-sm bg-orange-500 p-2 text-white">
                                Origin
                              </span>
                              <span>
                                {originAddress !== "" && originAddress}
                                {originAddress === "" && "Origin address"}
                              </span>
                            </p>
                            <p className="mb-4 flex items-center">
                              <span className="mb-2 mr-4 inline-block rounded-sm bg-orange-500 p-2 text-white">
                                Destination
                              </span>
                              <span>
                                {destinationAddress !== "" &&
                                  destinationAddress}
                                {destinationAddress === "" &&
                                  "Destination address"}
                              </span>
                            </p>
                            <p className="mb-4 flex items-baseline">
                              <span className="mb-2 mr-4 inline-block rounded-sm bg-orange-500 p-2 text-white">
                                Vehicle
                              </span>
                              <span>
                                {vehicle !== "" && vehicle}
                                {vehicle === "" && "Vehicle"}
                              </span>
                            </p>
                            <p className="flex items-baseline text-lg">
                              <span className="mb-2 mr-4 inline-block rounded-sm bg-orange-500 p-2 text-white">
                                Price
                              </span>
                              <span>
                                {price !== "" && price}
                                {price === "" && "Price"}
                              </span>
                            </p>
                          </section>
                        </section>
                      )}
                    </div>

                    <div className="py-4">
                      {index > 0 && (
                        <button
                          className="mr-4 rounded-md border border-black bg-white px-4 py-2 text-black"
                          onClick={() => {
                            if (index === 0)
                              if (transactionCreated === true)
                                SetIndex(index - 1 < 0 ? 0 : index - 1);
                              else toast.info("Transaction is not created!");
                            if (index === 1)
                              if (orderCreated === true)
                                SetIndex(index - 1 < 0 ? 0 : index - 1);
                              else toast.info("Order is not created!");
                            if (index === 2)
                              if (shipmentCreated === true)
                                SetIndex(index - 1 < 0 ? 0 : index - 1);
                              else toast.info("Shipment is not created!");
                          }}
                        >
                          Prev
                        </button>
                      )}
                      {index < 3 && (
                        <button
                          className="mr-4 rounded-md border border-black bg-white px-4 py-2 text-black"
                          onClick={() => {
                            if (index === 0)
                              if (transactionCreated === true)
                                setIndex(index + 1);
                              else toast.info("Transaction is not created!");
                            if (index === 1)
                              if (orderCreated === true) setIndex(index + 1);
                              else toast.info("Order is not created!");
                            if (index === 2)
                              if (shipmentCreated === true) setIndex(index + 1);
                              else toast.info("Shipment is not created!");
                          }}
                        >
                          Next
                        </button>
                      )}
                      {index === 0 && (
                        <button
                          onClick={handleSubmitTransaction}
                          className="rounded-md bg-orange-500 px-4 py-2 text-white"
                        >
                          Create Transaction
                        </button>
                      )}
                      {index === 1 && (
                        <button
                          onClick={handleSubmitOrder}
                          className="rounded-md bg-orange-500 px-4 py-2 text-white"
                        >
                          Create order
                        </button>
                      )}
                      {index === 2 && (
                        <button
                          onClick={handleSubmitShipment}
                          className="rounded-md bg-orange-500 px-4 py-2 text-white"
                        >
                          Create shipment
                        </button>
                      )}
                      {index === 3 && (
                        <button
                          onClick={handleSubmit}
                          className="rounded-md bg-orange-500 px-4 py-2 text-white"
                        >
                          Submit
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            )}
            <section className="px-8 py-4">
              <div className="flex justify-between">
                <h1 className="mb-4 text-2xl">Edit Form</h1>
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    goBack();
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
              <section>
                <div>
                  <div className="relative mb-4">
                    <label
                      htmlFor="originAddressShipment"
                      className="mb-2 block"
                    >
                      Origin
                    </label>
                    <input
                      autoComplete="address-line1"
                      type="text"
                      className="w-full rounded-md"
                      id="originAddressShipment"
                      name="origin"
                      placeholder="Enter Origin"
                      value={originAddressShipment}
                      onChange={(e) => {
                        setOriginAddressShipment(e.target.value);
                        setOpenAutocompleteOriginForm(true);
                        fetchAutocompleteWithOrigin(e.target.value);
                      }}
                    />
                    {openAutocompleteOriginForm && originAddresses && (
                      <div className="bottom-100 absolute left-0 right-0 z-10 mt-1 rounded-b-sm bg-white">
                        {originAddresses.map((address, index) => {
                          return (
                            <div
                              key={index}
                              className="mb-1 cursor-pointer border border-black px-3 py-2"
                              onClick={() => {
                                setOpenAutocompleteOriginForm(false);
                                setOriginAddressShipment(
                                  address.address.freeformAddress,
                                );
                              }}
                            >
                              <h4 className="text-md">
                                {address.address.freeformAddress}
                              </h4>
                              <span className="text-xs">
                                type:&nbsp;{address.type}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="relative mb-4">
                    <label
                      htmlFor="destinateAddressShipment"
                      className="mb-2 block"
                    >
                      Destination
                    </label>
                    <input
                      autoComplete="address-line1"
                      type="text"
                      className="w-full rounded-md"
                      id="destinateAddressShipment"
                      name="destination"
                      placeholder="Enter Destination"
                      value={destinationAddressShipment}
                      onChange={(e) => {
                        setDestinationAddressShipment(e.target.value);
                        setOpenAutocompleteDestinationForm(true);
                        fetchAutocompleteWithDestination(e.target.value);
                      }}
                    />
                    {openAutocompleteDestinationForm &&
                      destinationAddresses && (
                        <div className="bottom-100 absolute left-0 right-0 z-10 mt-1 rounded-b-sm bg-white">
                          {destinationAddresses.map((address, index) => {
                            return (
                              <div
                                key={index}
                                className="mb-1 cursor-pointer border border-black px-3 py-2"
                                onClick={() => {
                                  setOpenAutocompleteDestinationForm(false);
                                  setDestinationAddressShipment(
                                    address.address.freeformAddress,
                                  );
                                }}
                              >
                                <h4 className="text-md">
                                  {address.address.freeformAddress}
                                </h4>
                                <span className="text-xs">
                                  type:&nbsp;{address.type}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                  </div>

                  <div className="mb-4">
                    <label htmlFor="estimateDate" className="mb-2 block">
                      Estimate Date
                    </label>
                    <input
                      type="datetime-local"
                      className="w-full rounded-md"
                      id="estimateDate"
                      name="arrivalDate"
                      placeholder="Enter estimate date"
                      value={estimateDateShipment}
                      onChange={(e) => setEstimateDateShipment(e.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="arrivalDate" className="mb-2 block">
                      Arrival Date
                    </label>
                    <input
                      type="datetime-local"
                      className="w-full rounded-md"
                      id="arrivalDate"
                      name="arrivalDate"
                      placeholder="Enter Arrival Date"
                      value={arrivalDateShipment}
                      onChange={(e) => setArrivalDateShipment(e.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="capacity" className="mb-2 block">
                      Capacity
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-md"
                      id="capacity"
                      name="shipmentDate"
                      placeholder="Enter Capacity"
                      value={capacityShipment}
                      onChange={(e) => setCapacityShipment(e.target.value)}
                    />
                  </div>
                  <div className="mb-4 flex flex-col justify-between gap-4 md:flex-row">
                    <div className="basis-1/2">
                      <label className="mb-2 block" htmlFor="vehicle">
                        Vehicle
                      </label>
                      <select
                        id="vehicle"
                        className="w-full rounded-md"
                        value={vehicleId}
                        onChange={(e) => setVehicleId(e.target.value)}
                        onClick={(e) => setVehicleId(e.target.value)}
                        onInput={(e) => setVehicleId(e.target.value)}
                      >
                        {vehicleNames !== null &&
                          vehicles.map((s, index) => {
                            if (s.id === vehicleId)
                              return (
                                <option
                                  key={index}
                                  value={s.id}
                                  selected={true}
                                >
                                  {s.type.toString().at(0).toUpperCase() +
                                    s.type.slice(1) +
                                    " - " +
                                    vehicleNames[s.id]}
                                </option>
                              );
                            else
                              return (
                                <option key={index} value={s.id}>
                                  {s.type.toString().at(0).toUpperCase() +
                                    s.type.slice(1) +
                                    " - " +
                                    vehicleNames[s.id]}
                                </option>
                              );
                          })}
                      </select>
                    </div>
                    <div className="basis-1/2">
                      <label className="mb-2 block" htmlFor="status">
                        Status
                      </label>
                      <select
                        id="status"
                        className="w-full rounded-md"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                      >
                        {shipmentsStatus.map((s, index) => {
                          if (s === status)
                            return (
                              <option key={index} value={s} selected={true}>
                                {s.toString().at(0).toUpperCase() + s.slice(1)}
                              </option>
                            );
                          else
                            return (
                              <option key={index} value={s}>
                                {s.toString().at(0).toUpperCase() + s.slice(1)}
                              </option>
                            );
                        })}
                      </select>
                    </div>
                  </div>
                  <div className="mb-4 flex gap-2">
                    <button
                      onClick={update}
                      className="rounded-md bg-orange-500 px-4 py-2 text-white hover:bg-orange-600"
                    >
                      Update
                    </button>
                    <button
                      onClick={goBack}
                      className="rounded-md border border-black px-4 py-2"
                    >
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
  );
}
