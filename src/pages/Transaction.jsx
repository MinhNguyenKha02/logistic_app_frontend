import { toast, ToastContainer } from "react-toastify";
import Sidebar from "../components/Sidebar.jsx";
import React, { useCallback, useContext, useEffect, useState } from "react";
import TableTransaction from "../components/TableTransaction.jsx";
import TableRetunOrder from "../components/TableRetunOrder.jsx";
import TableOrder from "../components/TableOrder.jsx";
import Cookies from "js-cookie";
import { authApi, endpoints, standardApi } from "../helper/Apis.js";
import {
  dateFormat,
  formatPriceVND,
  formatToMySQLDate,
  timeAgo,
} from "../helper/dateFormat.js";
import { echo } from "../helper/echo.js";
import { DetailPageContext } from "../helper/Context.js";
import StatisticsComponent from "../components/Statistics.jsx";

export default function Transaction() {
  const [latestShipment, setLatestShipment] = React.useState({});
  const [currentUser, setCurrentUser] = React.useState({});
  const [shipments, setShipments] = React.useState([]);
  const fetchCurrentUser = async () => {
    const token = Cookies.get("token");
    const response = await authApi(token).get(endpoints["current-user"]);
    setCurrentUser(response.data);
    Cookies.set("user_id", response.data.id);
  };
  useEffect(() => {
    const getLatestShipment = async () => {
      const token = Cookies.get("token");
      const response = await authApi(token).get(endpoints["shipment-latest"]);
      setLatestShipment(response.data.shipment);
    };
    const getShipments = async () => {
      const token = Cookies.get("token");
      const response = await authApi(token).get(endpoints["shipments"]);
      setShipments(response.data.shipments);
    };
    fetchCurrentUser();
    getShipments();
    getLatestShipment();
  }, []);

  const [onlineUsers, setOnlineUserss] = React.useState([]);
  const [partner, setPartner] = React.useState("");
  const [conversation, setConversation] = React.useState({});
  const [messages, setMessages] = React.useState([]);
  const [formattedDate, setFormattedDate] = React.useState("");
  const getOnlineUsers = React.useCallback(async () => {
    const token = Cookies.get("token");
    const response = await authApi(token).get(endpoints["online-users"]);
    setOnlineUserss(response.data.users);
  }, []);

  const getOrCreateConversation = React.useCallback(async () => {
    const token = Cookies.get("token");
    const data = {
      user_one_id: currentUser.id,
      user_two_id: partner,
    };
    const response = await authApi(token).post(
      endpoints["conversations"],
      data,
    );
    setConversation(response.data);
  }, [currentUser.id, partner]);

  const getMessages = React.useCallback(async () => {
    if (conversation) {
      const token = Cookies.get("token");
      const response = await authApi(token).get(endpoints["get-messages"], {
        params: { conversation_id: conversation.conversation.id ?? "" },
      });
      setMessages(response.data.messages);
    }
  }, [conversation]);

  const [text, setText] = useState("");

  const sendMessage = React.useCallback(async () => {
    console.log(text);
    if ((!currentUser && !conversation) || text === "") return;
    const token = Cookies.get("token");
    console.log(conversation);
    const message = {
      sender_id: currentUser.id,
      content: text,
      conversation_id: conversation.conversation.id,
    };
    const response = await authApi(token).post(
      endpoints["send-message"],
      message,
    );
    if (response.status === 200 && conversation) getMessages();
  }, [conversation, text]);

  const messagesEndRef = React.useRef(null);

  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    };
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (conversation) {
      getMessages();
      const token = Cookies.get("token");
      echo(token)
        .join(`conversation.${conversation?.conversation?.id}`)
        .here((data) =>
          console.log("current users in conversation channel", data),
        )
        .joining((data) =>
          console.log("current users joined in conversation channel", data),
        )
        .listen(`.sendMessage`, async (data) => {
          await getMessages();
        });
    }
  }, [conversation]);

  useEffect(() => {
    if (currentUser) {
      getOnlineUsers();
    }
  }, [currentUser]);

  useEffect(() => {
    if (partner && currentUser) getOrCreateConversation();
  }, [partner]);

  useEffect(() => {
    conversation &&
      setFormattedDate(timeAgo(conversation?.user_two?.last_active_at));
  }, [conversation]);

  const fetchSenderById = async (id) => {
    const token = Cookies.get("token");
    const response = await authApi(token).get(endpoints["user-detail"](id));
    if (response.status === 200) return response.data.user.name;
  };
  const [senders, setSenders] = React.useState([]);
  const fetchAllSenderNames = useCallback(async () => {
    const names = {};
    for (const d of messages) {
      if (!names[d.sender_id]) {
        names[d.sender_id] = await fetchSenderById(d.sender_id);
      }
    }
    setSenders(names);
  }, [messages]);
  useEffect(() => {
    const fetchData = async () => {
      if (messages) {
        await fetchAllSenderNames();
      }
    };
    fetchData();
  }, [messages, fetchAllSenderNames]);

  useEffect(() => {
    const token = Cookies.get("token");

    async function updateStatus(data) {
      console.log("online user data will update", data);
      if (!data) return;
      const response = await authApi(token).post(
        endpoints["update-status"],
        data,
      );
      console.log("online users updated", response.data);
    }

    echo(token)
      .join("current.users")
      .here((data) => console.log("current users in online channel", data))
      .joining(async (data) => {
        console.log("user logged", data);
        const _data = {
          is_active: true,
          user_id: data.id,
        };
        await updateStatus(_data);
      })
      .listen(".online.users", async () => {
        await getOnlineUsers();
      });
  }, []);
  const [originAddress, setOriginAddress] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [shipmentDate, setShipmentDate] = useState(
    formatToMySQLDate(new Date()),
  );
  const [estimateDate, setEstimateDate] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
  const [capacity, setCapacity] = useState(0);
  const [shipmentStatus, setShipmentStatus] = useState("pending");
  const [vehicles, setVehicles] = useState([]);
  const [vehicle, setVehicle] = useState("");
  useEffect(() => {
    const fetchVehicles = async () => {
      const token = Cookies.get("token");
      const response = await authApi(token).get(endpoints["vehicles"]);
      setVehicles(response.data.vehicles);
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
    setOriginAddresses(response.data.results);
  };
  const fetchAutocompleteWithDestination = async (keyword) => {
    const response = await standardApi().get(
      endpoints["tomtom-search"](keyword),
    );
    setDestinationAddresses(response.data.results);
  };
  const { shipmentContext, setShipmentContext } = useContext(DetailPageContext);
  const [orderId, setOrderId] = useState("");
  const [shipmentModal, setShipmentModal] = React.useState(false);

  const handleSubmitShipment = async (e) => {
    e.preventDefault();
    const dataShipment = {
      vehicle_id: vehicle,
      date: shipmentDate,
      status: "shipping",
      estimated_arrival_time: estimateDate,
      arrival_time: arrivalDate,
      capacity: capacity,
      origin_address: originAddress,
      destination_address: destinationAddress,
      order_id: orderId,
    };
    const token = Cookies.get("token");
    const response = await authApi(token)
      .post(endpoints["add-breakdown-shipment"], dataShipment)
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
    if (response.status === 201) {
      toast.success(response.data.message, {
        onClick: () => {
          setShipmentModal(false);
          setShipmentContext((prev) => ({ ...prev, addItem: true }));
        },
        onClose: () => {
          setShipmentModal(false);
          setShipmentContext((prev) => ({ ...prev, addItem: true }));
        },
      });
    }
  };

  useEffect(() => {
    const token = Cookies.get("token");
    echo(token)
      .join("breakdown")
      .here(async (data) => console.log(data))
      .listen(".sendBreakdown", async (data) => {
        console.log("breakdown data", data);
        setShipmentModal(true);
        setOrderId(data.order_id);
        setOriginAddress(data.origin);
        setCapacity(data.shipment.capacity);
        setDestinationAddress(data.shipment.destination_address);
        setEstimateDate(data.shipment.estimated_arrival_time);
      });
  }, []);

  const [userQuantity, setUserQuantity] = useState();
  const [inventoryQuantity, setInventoryQuantity] = useState();
  const [productQuantity, setProductQuantity] = useState();
  const [orderQuantity, setOrderQuantity] = useState();
  const [returnOrderQuantity, setReturnOrderQuantity] = useState();
  const [transactionQuantity, setTransactionQuantity] = useState();
  const [revenue, setRevenue] = useState();
  const [times, setTimes] = useState(["week", "month", "year"]);

  const [userTime, setUserTime] = useState("week");
  const [inventoryTime, setInventoryTime] = useState("week");
  const [productTime, setProductTime] = useState("week");
  const [orderTime, setOrderTime] = useState("Week");
  const [returnOrderTime, setReturnOrderTime] = useState("week");
  const [transactionTime, setTransactionTime] = useState("week");
  const [revenueTime, setRevenueTime] = useState("week");

  async function fetchUserQuantity() {
    const token = Cookies.get("token");
    const response = await authApi(token).get(endpoints["user-quantity"], {
      params: {
        time: userTime,
      },
    });
    setUserQuantity(response.data.user_count);
  }

  useEffect(() => {
    fetchUserQuantity();
  }, [userTime]);
  const fetchInventoryQuantity = async () => {
    const token = Cookies.get("token");
    const response = await authApi(token).get(endpoints["inventory-quantity"], {
      params: {
        time: inventoryTime,
      },
    });
    setInventoryQuantity(response.data.inventory_count);
  };
  useEffect(() => {
    fetchInventoryQuantity();
  }, [inventoryTime]);
  const fetchProductQuantity = async () => {
    const token = Cookies.get("token");
    const response = await authApi(token).get(endpoints["product-quantity"], {
      params: {
        time: productTime,
      },
    });
    setProductQuantity(response.data.product_count);
  };
  useEffect(() => {
    fetchProductQuantity();
  }, [productTime]);
  const fetchOrderQuantity = async () => {
    const token = Cookies.get("token");
    const response = await authApi(token).get(endpoints["order-quantity"], {
      params: {
        time: orderTime,
      },
    });
    setOrderQuantity(response.data.order_count);
  };
  useEffect(() => {
    fetchOrderQuantity();
  }, [orderTime]);
  const fetchReturnOrderQuantity = async () => {
    const token = Cookies.get("token");
    const response = await authApi(token).get(
      endpoints["return-order-quantity"],
      {
        params: {
          time: returnOrderTime,
        },
      },
    );
    setReturnOrderQuantity(response.data.return_order_count);
  };
  useEffect(() => {
    fetchReturnOrderQuantity();
  }, [returnOrderTime]);
  const fetchTransactionQuantity = async () => {
    const token = Cookies.get("token");
    const response = await authApi(token).get(
      endpoints["transaction-quantity"],
      {
        params: {
          time: transactionTime,
        },
      },
    );
    console.log(response.data);

    setTransactionQuantity(response.data.transaction_count);
  };
  useEffect(() => {
    fetchTransactionQuantity();
  }, [transactionTime]);
  const fetchRevenue = async () => {
    const token = Cookies.get("token");
    const response = await authApi(token).get(endpoints["revenue"], {
      params: {
        time: revenueTime,
      },
    });
    setRevenue(response.data.total_revenue);
  };
  fetchRevenue();
  useEffect(() => {}, [revenueTime]);

  useEffect(() => {
    const token = Cookies.get("token");

    echo(token)
      .join("createOrder")
      .listen(".sendCreateOrder", async () => {
        await fetchOrderQuantity();
        await fetchReturnOrderQuantity();
        await fetchTransactionQuantity();
        await fetchRevenue();
      });
    echo(token)
      .join("completeOrder")
      .listen(".sendCompleteOrder", async () => {
        await fetchOrderQuantity();
        await fetchReturnOrderQuantity();
        await fetchTransactionQuantity();
        await fetchRevenue();
      });
    echo(token)
      .join("changeReturnOrder")
      .listen(".sendChangeReturnOrder", async () => {
        await fetchOrderQuantity();
        await fetchReturnOrderQuantity();
        await fetchTransactionQuantity();
        await fetchRevenue();
      });
    echo(token)
      .join("createSupply")
      .listen(".sendCreateSupply", async () => {
        await fetchOrderQuantity();
        await fetchReturnOrderQuantity();
        await fetchTransactionQuantity();
        await fetchRevenue();
      });
  }, []);

  const [orderIdBreakdown, setOrderIdBreakdown] = useState();
  const searchOrderBreakdown = async () => {
    if (!orderIdBreakdown) alert("please type order id breakdown");
    fetchOrderBreakdownById(orderIdBreakdown);
  };

  const fetchOrderBreakdownById = async (id) => {
    const token = Cookies.get("token");
    const response = await authApi(token).get(
      endpoints["get-order-breakdown"](id),
      { params: { order_id: id } },
    );
    if (response.status === 200) {
      setOrderId(response.data.order.id);
      setOriginAddress(response.data.shipment.origin_address);
      setCapacity(response.data.shipment.capacity);
      setDestinationAddress(response.data.shipment.destination_address);
      setEstimateDate(response.data.shipment.estimated_arrival_time);
      setArrivalDate(response.data.shipment.arrival_time);
    } else toast.warning("Order is not breakdown");
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
      <main className="flex h-screen flex-col gap-4 bg-gray-100 p-4 sm:ml-64 lg:flex-row lg:gap-0">
        <section className="basis-[100%] overflow-x-auto p-4 lg:basis-[60%]">
          <section className="flex gap-4 overflow-x-auto p-2">
            <section className="rounded-md bg-orange-500 p-2 text-white">
              <section className="flex items-center justify-between gap-2">
                <h4 className="font-bold">User quantity</h4>
                <select
                  onChange={(e) => setUserTime(e.target.value)}
                  className="text-black"
                >
                  {times.map((time, index) => (
                    <option key={index} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </section>
              <section className="my-6 flex items-center justify-center text-black">
                <h1 className="bg-white px-6 py-3 text-2xl">{userQuantity}</h1>
              </section>
            </section>
            <section className="rounded-md bg-orange-500 p-2 text-white">
              <section className="flex items-center justify-between gap-2">
                <h4 className="font-bold">Inventory quantity</h4>
                <select
                  onChange={(e) => setInventoryTime(e.target.value)}
                  className="text-black"
                >
                  {times.map((time, index) => (
                    <option key={index} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </section>
              <section className="my-6 flex items-center justify-center text-black">
                <h1 className="bg-white px-6 py-3 text-2xl">
                  {inventoryQuantity}
                </h1>
              </section>
            </section>
            <section className="rounded-md bg-orange-500 p-2 text-white">
              <section className="flex items-center justify-between gap-2">
                <h4 className="font-bold">Product quantity</h4>
                <select
                  onChange={(e) => setProductTime(e.target.value)}
                  className="text-black"
                >
                  {times.map((time, index) => (
                    <option key={index} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </section>
              <section className="my-6 flex items-center justify-center text-black">
                <h1 className="bg-white px-6 py-3 text-2xl">
                  {productQuantity}
                </h1>
              </section>
            </section>
            <section className="rounded-md bg-orange-500 p-2 text-white">
              <section className="flex items-center justify-between gap-2">
                <h4 className="font-bold">Order quantity</h4>
                <select
                  onChange={(e) => setOrderTime(e.target.value)}
                  className="text-black"
                >
                  {times.map((time, index) => (
                    <option key={index} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </section>
              <section className="my-6 flex items-center justify-center text-black">
                <h1 className="bg-white px-6 py-3 text-2xl">{orderQuantity}</h1>
              </section>
            </section>
            <section className="rounded-md bg-orange-500 p-2 text-white">
              <section className="flex items-center justify-between gap-2">
                <h4 className="font-bold">Return order quantity</h4>
                <select
                  onChange={(e) => setReturnOrderTime(e.target.value)}
                  className="text-black"
                >
                  {times.map((time, index) => (
                    <option key={index} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </section>
              <section className="my-6 flex items-center justify-center text-black">
                <h1 className="bg-white px-6 py-3 text-2xl">
                  {returnOrderQuantity}
                </h1>
              </section>
            </section>
            <section className="rounded-md bg-orange-500 p-2 text-white">
              <section className="flex items-center justify-between gap-2">
                <h4 className="font-bold">Transaction quantity</h4>
                <select
                  onChange={(e) => setTransactionTime(e.target.value)}
                  className="text-black"
                >
                  {times.map((time, index) => (
                    <option key={index} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </section>
              <section className="my-6 flex items-center justify-center text-black">
                <h1 className="bg-white px-6 py-3 text-2xl">
                  {transactionQuantity}
                </h1>
              </section>
            </section>
            <section className="rounded-md bg-orange-500 p-2 text-white">
              <section className="flex items-center justify-between gap-2">
                <h4 className="font-bold">Revenue quantity</h4>
                <select
                  onChange={(e) => setRevenueTime(e.target.value)}
                  className="text-black"
                >
                  {times.map((time, index) => (
                    <option key={index} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </section>
              <section className="my-6 flex items-center justify-center text-black">
                <h1 className="bg-white px-6 py-3 text-2xl">
                  {formatPriceVND(revenue)}
                </h1>
              </section>
            </section>
          </section>
          <StatisticsComponent />
          <button
            onClick={() => setShipmentModal(true)}
            className="my-4 w-full rounded-md bg-orange-500 p-2 text-white"
          >
            Create breakdown shipment
          </button>
          <TableTransaction />
          <TableOrder />
          <TableRetunOrder />

          <section className="mt-3 flex flex-col gap-3 lg:flex-row">
            <section className="lg:w-[30%} inline-flex w-full flex-col bg-white">
              <section className="inline-flex flex-col p-4">
                <h3 className="rouned-md bg-orange-500 p-2 text-xl text-white">
                  Latest order
                </h3>
                <section className="mt-3 inline-flex flex-col items-start rounded-md border border-dashed border-orange-500 bg-white p-3">
                  <span className="mb-3 inline-block italic text-orange-500">
                    Info:&nbsp;{latestShipment?.id} - Vehicle:&nbsp;
                    {latestShipment?.vehicle_id}
                  </span>
                  <div className="itms-center mb-4 inline-flex w-fit gap-3 rounded-md bg-orange-500 p-2 text-xl text-white">
                    <svg
                      className="size-7 text-white"
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
                        d="M9.5 11.5 11 13l4-3.5M12 20a16.405 16.405 0 0 1-5.092-5.804A16.694 16.694 0 0 1 5 6.666L12 4l7 2.667a16.695 16.695 0 0 1-1.908 7.529A16.406 16.406 0 0 1 12 20Z"
                      />
                    </svg>
                    {latestShipment?.status?.toString().at(0).toUpperCase() +
                      latestShipment?.status?.toString().slice(1)}
                  </div>
                  <div className="inline-flex flex-col items-start gap-2">
                    <h3 className="text-orange-500">
                      {latestShipment?.origin_address}
                    </h3>
                    <div className="inline-block rounded-full border border-solid border-orange-500 p-2">
                      <svg
                        className="h-8 w-8 text-orange-500"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" />
                        <path d="M15 13l4 -4l-4 -4m4 4h-11a4 4 0 0 0 0 8h1" />
                      </svg>
                    </div>
                    <h3 className="text-orange-500">
                      {latestShipment?.destination_address}
                    </h3>
                  </div>
                </section>
              </section>
            </section>
            <section className="w-full bg-white p-4 text-orange-500 lg:w-[70%]">
              <p className="text-xl">Transaction history</p>
              <div className="timneline ms-3 mt-3">
                {shipments?.data?.map((data, index) => {
                  return (
                    <ol
                      key={index}
                      className="relative border-s border-gray-200 p-4"
                    >
                      <li className="mb-10 ms-6">
                        <h2 className="mb-1 flex items-center text-lg font-bold text-black">
                          {data.id}
                          <span className="me-2 ms-3 rounded bg-orange-100 px-2.5 py-0.5 text-sm font-medium text-orange-800">
                            {data.status.toString().at(0).toUpperCase() +
                              data.status.toString().slice(1)}
                          </span>
                        </h2>
                        <span className="absolute -start-3 flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 ring-8 ring-white">
                          <svg
                            className="h-6 w-6 text-orange-800 dark:text-white"
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
                              d="M8 16.881V7.119a1 1 0 0 1 1.636-.772l5.927 4.881a1 1 0 0 1 0 1.544l-5.927 4.88A1 1 0 0 1 8 16.882Z"
                            />
                          </svg>
                        </span>
                        <h3 className="text-md mb-1 flex items-center font-semibold text-black">
                          {data.origin_address}
                        </h3>
                        <span className="absolute -start-3 flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 ring-8 ring-white">
                          <svg
                            className="h-6 w-6 text-orange-800 dark:text-white"
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
                              d="M16 16.881V7.119a1 1 0 0 0-1.636-.772l-5.927 4.881a1 1 0 0 0 0 1.544l5.927 4.88a1 1 0 0 0 1.636-.77Z"
                            />
                          </svg>
                        </span>
                        <h3 className="text-md mb-1 flex items-center font-semibold text-black">
                          {data.destination_address}
                        </h3>
                        <time className="mt-2 block text-sm font-normal leading-none text-gray-400">
                          {dateFormat(data.updated_at)}
                        </time>
                      </li>
                    </ol>
                  );
                })}
              </div>
            </section>
          </section>
        </section>
        <section className="flex basis-[100%] overflow-x-auto p-4 sm:flex-col lg:basis-[40%]">
          <div className="h-full w-full sm:order-2">
            <div className="flex gap-2 bg-orange-500 p-3 text-white">
              <section>
                <h4 className="text-xl">
                  {conversation?.user_two?.name ?? "Loading"}
                </h4>
                <span className="italic">{formattedDate ?? "Loading"}</span>
              </section>
              <div
                onClick={async () => await getOnlineUsers()}
                className="mb-2 w-fit cursor-pointer rounded-md bg-orange-500 p-1"
              >
                <svg
                  className="h-6 w-6 text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17.651 7.65a7.131 7.131 0 0 0-12.68 3.15M18.001 4v4h-4m-7.652 8.35a7.13 7.13 0 0 0 12.68-3.15M6 20v-4h4"
                  />
                </svg>
              </div>
            </div>
            <div className="chat-frame relative h-[550px]">
              <div className="h-full w-full bg-red-50">
                <div className="h-full w-full overflow-x-scroll pb-[65px]">
                  {messages.length > 0 &&
                    messages.map((message, index) => {
                      return (
                        <div key={index}>
                          {
                            <div className="my-4 flex items-start justify-start gap-2.5 p-4">
                              <img
                                className="size-8 rounded-full object-cover"
                                src="https://plus.unsplash.com/premium_photo-1689551670902-19b441a6afde?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                alt="Jese image"
                              />
                              <div className="leading-1.5 flex w-full max-w-[320px] flex-col">
                                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {senders[message.sender_id]}
                                  </span>
                                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                                    {dateFormat(new Date().toISOString())}
                                  </span>
                                </div>
                                <p className="mt-1 w-fit rounded-md bg-orange-500 p-3 text-sm font-normal text-white dark:text-white">
                                  {message.content}
                                </p>
                                <span className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">
                                  Sent {timeAgo(message.created_at)}
                                </span>
                              </div>
                            </div>
                          }
                        </div>
                      );
                    })}
                  <div ref={messagesEndRef} />
                </div>
              </div>
              <div className="z-2 absolute bottom-0 flex w-full gap-4 bg-white p-4">
                <div className="w-full">
                  <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    type="text"
                    className="h-full w-full rounded-md border border-solid border-orange-500 text-orange-500 placeholder:text-orange-500"
                    placeholder="message"
                  />
                </div>
                <button
                  onClick={async () =>
                    setText(await navigator.clipboard.readText())
                  }
                  className="rounded-md bg-orange-500 p-3 text-white"
                >
                  <svg
                    className="h-6 w-6 text-white"
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
                      d="M9 20H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h2.429M7 8h3M8 8V4h4v2m4 0V5h-4m3 4v3a1 1 0 0 1-1 1h-3m9-3v9a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1v-6.397a1 1 0 0 1 .27-.683l2.434-2.603a1 1 0 0 1 .73-.317H19a1 1 0 0 1 1 1Z"
                    />
                  </svg>
                </button>
                <button
                  onClick={async () => await getMessages()}
                  className="rounded-md bg-orange-500 p-3 text-white"
                >
                  <svg
                    className="h-6 w-6 text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17.651 7.65a7.131 7.131 0 0 0-12.68 3.15M18.001 4v4h-4m-7.652 8.35a7.13 7.13 0 0 0 12.68-3.15M6 20v-4h4"
                    />
                  </svg>
                </button>
                <button
                  onClick={async () => await sendMessage()}
                  className="rounded-md bg-orange-500 p-3 text-white"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
          <div className="mb-4 w-full sm:order-1">
            <div className="flex gap-4 overflow-x-scroll bg-gray-100">
              {onlineUsers.map((user, index) => {
                return (
                  <div
                    onClick={() => {
                      setPartner(user.id);
                    }}
                    key={index}
                    className="mb-2 inline-flex min-w-[200px] items-center rounded-lg bg-white p-4 text-black"
                  >
                    <div className="flex w-[90%] items-start lg:items-center">
                      <div className="w-[70%]">
                        <h4>{user.name}</h4>
                      </div>
                      <div className="w-[30%]">
                        <div className="relative">
                          <div className="relative inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gray-100 dark:bg-gray-600">
                            <span className="font-medium text-gray-600 dark:text-gray-300">
                              {user.name.split(" ")[0].at(0) +
                                user.name.split(" ")[1].at(0)}
                            </span>
                          </div>
                          <span
                            className={`dark:border-gray-800$ absolute bottom-0 left-7 h-3.5 w-3.5 rounded-full border-2 border-white ${user.is_active ? "bg-green-400" : "bg-red-400"}`}
                          ></span>
                        </div>
                      </div>
                    </div>
                    <div className="w-[10%]">
                      <svg
                        className="size-6 text-black"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" />
                        <circle cx="12" cy="12" r="1" />
                        <circle cx="12" cy="19" r="1" />
                        <circle cx="12" cy="5" r="1" />
                      </svg>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      {shipmentModal && (
        <section className="z-5 fixed inset-0 flex items-center justify-center bg-gray-50">
          <section className="w-[50%] bg-white">
            <section className="mb-4 flex items-center bg-orange-500 p-2">
              <h2 className="my-1 w-full rounded-md p-2 text-white">
                Create shipment
              </h2>
              <div className="ml-2 w-[5%]">
                <svg
                  onClick={() => setShipmentModal(false)}
                  className="size-7 text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m15 9-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </div>
            </section>
            <section className="my-4 flex flex-col gap-4">
              <div>
                <label htmlFor="">Order ID</label>
                <input
                  className="mt-2 w-full rounded-md p-2"
                  type="text"
                  placeholder="Order which breakdown"
                  onChange={(e) => setOrderIdBreakdown(e.target.value)}
                  onInput={(e) => setOrderIdBreakdown(e.target.value)}
                />
              </div>
              <button
                className="h-full rounded-md bg-orange-500 p-2 text-white"
                onClick={searchOrderBreakdown}
              >
                Search
              </button>
            </section>
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
                {openAutocompleteOriginForm && originAddresses && (
                  <div className="bottom-100 absolute z-10 w-full rounded-b-sm border border-t-0 border-black bg-white shadow-sm">
                    {originAddresses.map((address, index) => {
                      return (
                        <div
                          key={index}
                          className="mb-1 cursor-pointer px-3 py-2"
                          onClick={() => {
                            setOpenAutocompleteOriginForm(false);
                            setOriginAddress(address.address.freeformAddress);
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
                    fetchAutocompleteWithDestination(e.target.value);
                  }}
                />
                {openAutocompleteDestinationForm && destinationAddresses && (
                  <div className="bottom-100 absolute z-10 w-full rounded-b-sm border border-t-0 border-black bg-white shadow-sm">
                    {destinationAddresses.map((address, index) => {
                      return (
                        <div
                          key={index}
                          className="mb-1 cursor-pointer px-3 py-2"
                          onClick={() => {
                            setOpenAutocompleteDestinationForm(false);
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
                  value={estimateDate}
                  onChange={(e) => setEstimateDate(e.target.value)}
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
                  <option selected={true}>Select your option</option>
                  {vehicleNames !== null &&
                    vehicles.map((s, index) => {
                      return (
                        <option key={index} value={s.id}>
                          {s.type.toString().at(0).toUpperCase() +
                            s.type.slice(1) +
                            " - " +
                            (vehicleNames[s.id] || s.id)}
                        </option>
                      );
                    })}
                </select>
              </div>
              <div className="mb-4">
                <button
                  className="rounded-md bg-orange-500 p-2 text-white"
                  onClick={async (e) => handleSubmitShipment(e)}
                >
                  Submit
                </button>
              </div>
            </form>
          </section>
        </section>
      )}
    </>
  );
}
