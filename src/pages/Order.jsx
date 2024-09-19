import { toast, ToastContainer } from "react-toastify";
import Sidebar from "../components/Sidebar.jsx";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Cookies from "js-cookie";
import { authApi, endpoints, standardApi } from "../helper/Apis.js";
import { DetailPageContext } from "../helper/Context.js";
import {
  dateFormat,
  formatToMySQLDate,
  timeAgo,
  formatPriceVND,
} from "../helper/dateFormat.js";
import tt from "@tomtom-international/web-sdk-maps";
import { services } from "@tomtom-international/web-sdk-services";
import { echo } from "../helper/echo.js";

export default function Home() {
  const [index, setIndex] = React.useState(0);
  const {
    shipmentContext,
    setShipmentContext,
    transactionContext,
    setTransactionContext,
    orderContext,
    setOrderContext,
  } = useContext(DetailPageContext);
  const [minimapFeature, setMinimapFeature] = useState();
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
  const [currentUser, setCurrentUser] = React.useState({});

  const [customer, setCustomer] = useState("");
  const [product, setProduct] = useState("");
  const [transaction, setTransaction] = useState("");

  const [products, setProducts] = useState([]);
  const [transactionsType, setTransactionsType] = useState([]);
  const [transactionType, setTransactionType] = useState("");
  const [transactionsStatus, setTransactionsStatus] = useState([]);
  const [transactionStatus, setTransactionStatus] = useState("processing");
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
    setTransactions(response.data.transactions);
    // setUnits(response.data.units)
  };
  const [transactionCreated, setTransactionCreated] = useState(false);
  const [orderCreated, setOrderCreated] = useState(false);
  const [shipmentCreated, setShipmentCreated] = useState(false);
  const [latestOrderByCurrentUser, setLatestOrderByCurrentUser] =
    React.useState({});
  const [latestOrder, setLatestOrder] = React.useState({});
  const fetchCurrentUser = async () => {
    const token = Cookies.get("token");
    const response = await authApi(token).get(endpoints["current-user"]);
    setCurrentUser(response.data);
    Cookies.set("user_id", response.data.id);
    setCustomer(response.data.id);
  };
  useEffect(() => {
    const fetchProducts = async () => {
      const token = Cookies.get("token");
      const response = await authApi(token).get(endpoints["products"]);
      setProducts(response.data.products);
    };
    const fetchTransactionsType = async () => {
      const token = Cookies.get("token");
      const response = await authApi(token).get(endpoints["transactions-type"]);
      setTransactionsType(response.data.types);
    };
    const fetchTransactionsStatus = async () => {
      const token = Cookies.get("token");
      const response = await authApi(token).get(
        endpoints["transactions-status"],
      );
      setTransactionsStatus(response.data.statuss);
    };
    const fetchTransactionsUnit = async () => {
      const token = Cookies.get("token");
      const response = await authApi(token).get(endpoints["transactions-unit"]);
      setUnits(response.data.units);
    };

    const fetchCustomers = async () => {
      const token = Cookies.get("token");
      const response = await authApi(token).get(endpoints["users-all"]);
      setCustomers(response.data.users);
      // setUnits(response.data.units)
    };
    const fetchOrdersStatus = async () => {
      const token = Cookies.get("token");
      const response = await authApi(token).get(endpoints["orders-status"]);
      setOrdersStatus(response.data.status);
    };
    const fetchVehicles = async () => {
      const token = Cookies.get("token");
      const response = await authApi(token).get(endpoints["vehicles"]);
      setVehicles(response.data.vehicles);
    };
    const fetchShipmentStatus = async () => {
      const token = Cookies.get("token");
      const response = await authApi(token).get(endpoints["shipments-status"]);
      setShipmentsStatus(response.data.status);
    };
    const fetchLatestOrder = async () => {
      const token = Cookies.get("token");
      const response = await authApi(token).get(endpoints["latest-order"]);
      setLatestOrder(response.data.order);
    };
    fetchCurrentUser();
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

    console.log("data transaction", dataTransaction);

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
  const [reason, setReason] = useState("");
  const handleSubmitReturnOrder = async () => {
    setReturnOrderCreated(true);

    const dataReturnOrder = {
      customer_id: customer,
      product_id: product,
      transaction_id: latestTransaction.id,
      date: orderDate,
      reason: reason,
      status: orderStatus,
    };

    const token = Cookies.get("token");
    const response = await authApi(token)
      .post(endpoints["return-orders"], dataReturnOrder)
      .catch((err) => {
        if (err.response.status === 422) {
          const data = err.response.data.errors;
          console.log(data);
          data.customer_id?.forEach((d) => toast.error(d));
          data.product_id?.forEach((d) => toast.error(d));
          data.transaction_id?.forEach((d) => toast.error(d));
          data.date?.forEach((d) => toast.error(d));
          data.reason?.forEach((d) => toast.error(d));
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
      vehicle_id: "",
      date: shipmentDate,
      status: shipmentStatus,
      estimated_arrival_time: estimateDate,
      arrival_time: arrivalDate,
      capacity: capacity,
      origin_address: originAddress,
      destination_address: destinationAddress,
    };

    const token = Cookies.get("token");
    if (orderCreated === true) {
      const response = await authApi(token)
        .post(endpoints["store-order-shipment"], dataShipment)
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
    } else if (returnOrderCreated === true) {
      const response = await authApi(token)
        .post(endpoints["store-return-order-shipment"], dataShipment)
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
    }
  };
  const [receiptStatus, setReceiptStatus] = React.useState("processing");
  const handleSubmit = async () => {
    if (isOpenReturnCreate) {
      setOrderCreated(false);
      setReturnOrderCreated(false);
      setTransactionCreated(false);
      setShipmentCreated(false);

      setOriginAddress(null);
      setDestinationAddress(null);
      setVehicle(null);
      setShipmentDate(formatToMySQLDate(new Date()));
      setShipmentStatus("pending");
      setEstimateDate(null);
      setArrivalDate(null);
      setCapacity(null);
      setCustomer(null);
      setLatestTransaction(null);
      setOrderDate(formatToMySQLDate(new Date()));
      setOrderStatus("pending");
      setProduct(null);
      setTransactionDate(formatToMySQLDate(new Date()));
      setTransactionType("");
      setTransactionStatus("processing");
      setQuantity(null);
      setUnit(null);

      setShipmentContext((prevState) => ({
        ...prevState,
        add: !shipmentContext.add,
      }));
      setIsOpenCreate(false);
      setIsOpenReturnCreate(false);
      setIndex(0);
    }
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
      toast.success(response.data.message);
      setOrderCreated(false);
      setReturnOrderCreated(false);
      setTransactionCreated(false);
      setShipmentCreated(false);

      setOriginAddress(null);
      setDestinationAddress(null);
      setVehicle(null);
      setShipmentDate(formatToMySQLDate(new Date()));
      setShipmentStatus("pending");
      setEstimateDate(null);
      setArrivalDate(null);
      setCapacity(null);
      setCustomer(null);
      setLatestTransaction(null);
      setOrderDate(formatToMySQLDate(new Date()));
      setOrderStatus("pending");
      setProduct(null);
      setTransactionDate(formatToMySQLDate(new Date()));
      setTransactionType("");
      setTransactionStatus("processing");
      setQuantity(null);
      setUnit(null);

      setShipmentContext((prevState) => ({
        ...prevState,
        add: !shipmentContext.add,
      }));
      setIsOpenCreate(false);
      setIsOpenReturnCreate(false);
      setIndex(0);
    }

    // const token = Cookies.get("token");
    // console.log(token)
    // const response = await authApi(token).post(endpoints["inventory"], data)
    // if(response.status===201){
    //     console.log("ok")
    //     toast.success(response.data.message)
    // }
  };
  const fetchOrdersByCurrentUser = async () => {
    const token = Cookies.get("token");
    const response = await authApi(token).get(
      endpoints["orders-by-current-user"],
    );
    setOrders(response.data.orders);
  };
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    if (currentUser.id) {
      fetchOrdersByCurrentUser();
    }
  }, [currentUser.id]);
  const [orderId, setOrderId] = useState(null);
  const getOrderById = async (orderId) => {
    const token = Cookies.get("token");
    const response = await authApi(token).get(
      endpoints["order-by-id"](orderId),
      { params: { order_id: orderId } },
    );
    setLatestOrderByCurrentUser(response.data);
  };
  const getReturnOrderById = async (returnOrderId) => {
    const token = Cookies.get("token");
    const response = await authApi(token).get(
      endpoints["return-order-by-id"](returnOrderId),
      { params: { return_order_id: returnOrderId } },
    );
    setLatestOrderByCurrentUser(response.data);
  };
  const fetchLatestOrderByCurrentUser = async () => {
    if (currentUser) {
      const token = Cookies.get("token");
      const data = { user_id: currentUser.id ?? Cookies.get("user_id") };
      const response = await authApi(token).get(
        endpoints["latest-order-by-current-user"],
        { params: data },
      );
      setLatestOrderByCurrentUser(response.data);
    }
  };

  useEffect(() => {
    if (!currentUser.id) return;
    fetchLatestOrderByCurrentUser();
  }, [currentUser.id]);
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
  const [latestTransaction, setLatestTransaction] = useState(null);
  const fetchLatestTransaction = async () => {
    const token = Cookies.get("token");
    const response = await authApi(token).get(endpoints["transaction-latest"]);
    setLatestTransaction(response.data.transaction);
  };
  const getCurrentOrder = async () => {
    currentUser && (await fetchLatestOrderByCurrentUser());
  };

  const [isOpenCreate, setIsOpenCreate] = React.useState(false);

  const SAN_FRANCISCO = [-122.4194, 37.7749];
  const mapRef = useRef();

  let map = useRef(null);
  let markers = useRef([]);
  const addMarker = (event) => {
    if (markers.current.length < 2) {
      const marker = new tt.Marker({ color: "grey" })
        .setLngLat(event.lngLat)
        .addTo(map.current);
      markers.current = [...markers.current, marker];
      // markers.current.push(marker);
      // setMarkers(prev=>[...prev,marker])
    }
  };
  let layerId = useRef(`layer-${Math.random().toString(36).substr(2, 9)}`);

  const calculateRoute = async (routeOptions, color) => {
    try {
      const response = await services.calculateRoute(routeOptions);
      const geojsonData = response.toGeoJson();
      map.current.addLayer({
        id: layerId.current,
        type: "line",
        source: {
          type: "geojson",
          data: geojsonData,
        },
        paint: {
          "line-color": color,
          "line-width": 6,
        },
      });
    } catch (err) {}
  };

  const route = async () => {
    if (markers.current.length > 2) return;
    const key = import.meta.env.VITE_TOM_TOM_API_KEY;
    const locations = markers.current
      .map((marker) => marker.getLngLat())
      .reverse();

    calculateRoute(
      {
        key,
        locations,
        travelMode: "truck",
        vehicleLoadType: "otherHazmatExplosive",
        vehicleWeight: 8000,
      },
      "grey",
    );
  };
  const deleteRoute = async () => {
    if (firstMarker) firstMarker = null;
    if (markers.current.length === 2) {
      markers.current.forEach((marker) => marker.remove());
      markers.current = [];
      if (map.current.getSource(layerId.current))
        map.current.removeSource(layerId.current);
      if (map.current.getSource(layerId.current))
        map.current.removeLayer(layerId.current);
      setTimeout(() => {
        layerId.current = `layer-${Math.random().toString(36).substr(2, 9)}`;
      }, 1000);
    }
  };
  let waypoints = [];
  let breakdown = false;
  const carBreakDown = async () => {
    breakdown = true;
    let origin = waypoints[0].split(",");
    const response = await services.reverseGeocode({
      key: import.meta.env.VITE_TOM_TOM_API_KEY,
      position: { lng: origin[0], lat: origin[1] },
    });
    const address = response.addresses[0]?.address.freeformAddress;
    if (address) {
      const token = Cookies.get("token");
      const data = {
        status: "breakdown",
        origin_address_breakdown: address,
      };
      for (const shipment of latestOrderByCurrentUser.shipments) {
        const response = await authApi(token).patch(
          endpoints["shipment-detail"](shipment.id),
          data,
        );
        if (response.status === 200) {
          fetchLatestOrderByCurrentUser();
          const data = {
            origin: address,
            order_id:
              latestOrderByCurrentUser.order.id ??
              latestOrderByCurrentUser.return_order.id,
          };
          await authApi(token).post(endpoints["breakdown"], data);
        }
      }
    }
  };
  let firstMarker = null;
  const startTracking = async () => {
    const key = import.meta.env.VITE_TOM_TOM_API_KEY;
    const locations = markers.current
      .map((marker) => marker.getLngLat())
      .reverse();
    const response = await services.calculateRoute({
      key,
      locations,
      travelMode: "truck",
      vehicleLoadType: "otherHazmatExplosive",
      vehicleWeight: 8000,
    });
    waypoints = response.routes[0].legs[0].points;
    waypoints = waypoints.map((point) => `${point.lng},${point.lat}`);
    if (map.current.getLayer(layerId.current)) {
      map.current.removeLayer(layerId.current);
      map.current.removeSource(layerId.current);
    }
    map.current.addLayer({
      id: layerId.current,
      type: "line",
      source: {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      },
      paint: {
        "line-color": "orange",
        "line-width": 6,
      },
    });
    const updateFirstMarker = (lng, lat) => {
      if (firstMarker) {
        firstMarker.setLngLat({ lat: lat, lng: lng }).addTo(map.current); // Update the position of the existing marker
      } else {
        firstMarker = new tt.Marker({ color: "grey" }) // Create a new marker if it doesn't exist
          .setLngLat({ lat: lat, lng: lng })
          .addTo(map.current);
      }
    };

    while (waypoints.length > 1 && breakdown === false) {
      try {
        // Step 1: Format the waypoints
        const locations = [waypoints[0], waypoints[waypoints.length - 1]];
        // Step 2: Calculate the route for the current waypoints
        const response = await services.calculateRoute(
          {
            key,
            locations,
            travelMode: "truck",
            vehicleLoadType: "otherHazmatExplosive",
            vehicleWeight: 8000,
          },
          "orange",
        );
        const geojsonData = response.toGeoJson();
        map.current.getSource(layerId.current).setData(geojsonData);
        let [lng, lat] = waypoints[0].split(",");
        updateFirstMarker(Number(lng), Number(lat));
        waypoints.shift();

        if (waypoints.length === 1) {
          let [lng, lat] = waypoints[0].split(",");
          updateFirstMarker(Number(lng), Number(lat));
          markers.current[0].remove();
          toast.success("You have arrived at your destination!", {
            onClose: () => {
              async function updateStatus() {
                const token = Cookies.get("token");
                const data = {
                  status: "delivered",
                };
                const response = await authApi(token).patch(
                  endpoints["shipment-detail-delivery"](
                    latestOrderByCurrentUser.shipments[
                      latestOrderByCurrentUser.shipments.length - 1
                    ].id,
                  ),
                  data,
                );
                if (response.status === 200) {
                  fetchLatestOrderByCurrentUser();
                  fetchOrdersByCurrentUser();
                }
              }

              updateStatus();
            },
          });
        }
      } catch (err) {
        console.log(err);
      }
    }
  };
  const geoCodeAddress = async (address) => {
    if (markers.current.length === 2) {
      deleteRoute();
    }
    const response = await services.geocode({
      key: import.meta.env.VITE_TOM_TOM_API_KEY,
      query: address,
    });
    addMarker({ lngLat: response?.results[0].position });
    map.current.setCenter(response?.results[0].position);
    if (markers.current.length === 2) {
      map.current.setZoom(14);
      route();
    }
  };

  useEffect(() => {
    if (Object.keys(latestOrderByCurrentUser).length !== 0) {
      firstMarker = null;
      latestOrderByCurrentUser.shipments.length
        ? geoCodeAddress(
            latestOrderByCurrentUser.shipments[
              latestOrderByCurrentUser.shipments.length - 1
            ]?.destination_address,
          )
        : geoCodeAddress(
            latestOrderByCurrentUser.shipments.destination_address,
          );
      latestOrderByCurrentUser.shipments.length
        ? geoCodeAddress(
            latestOrderByCurrentUser.shipments[
              latestOrderByCurrentUser.shipments.length - 1
            ]?.origin_address,
          )
        : geoCodeAddress(latestOrderByCurrentUser.shipments.origin_address);
    }
  }, [latestOrderByCurrentUser]);

  useEffect(() => {
    map.current = tt.map({
      key: import.meta.env.VITE_TOM_TOM_API_KEY,
      container: mapRef.current,
      center: SAN_FRANCISCO,
      zoom: 14,
    });
    map.current.on("click", addMarker);
  }, []);

  useEffect(() => {
    const token = Cookies.get("token");
    echo(token)
      .join("latestOrder")
      .listen(".sendLatestOrder", async () => {
        await getCurrentOrder();
        if (Object.keys(latestOrderByCurrentUser).length !== 0) {
          latestOrderByCurrentUser.shipments.length
            ? geoCodeAddress(
                latestOrderByCurrentUser.shipments[
                  latestOrderByCurrentUser.shipments.length - 1
                ]?.destination_address,
              )
            : geoCodeAddress(
                latestOrderByCurrentUser.shipments.destination_address,
              );
          latestOrderByCurrentUser.shipments.length
            ? geoCodeAddress(
                latestOrderByCurrentUser.shipments[
                  latestOrderByCurrentUser.shipments.length - 1
                ]?.origin_address,
              )
            : geoCodeAddress(latestOrderByCurrentUser.shipments.origin_address);
        }
      });
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
    if ((!currentUser && !conversation) || text === "") return;
    const token = Cookies.get("token");
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
      if (!data) return;
      const response = await authApi(token).post(
        endpoints["update-status"],
        data,
      );
    }

    echo(token)
      .join("current.users")
      .joining(async (data) => {
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

  const [returnOrders, setReturnOrders] = useState([]);

  async function fetchReturnOrdersByCurrentUser() {
    const token = Cookies.get("token");
    const response = await authApi(token).get(
      endpoints["return-orders-by-current-user"],
    );
    setReturnOrders(response.data.return_orders);
  }

  useEffect(() => {
    fetchReturnOrdersByCurrentUser();
  }, []);

  const [payModal, setPayModal] = useState(false);
  const [otp, setOtp] = useState(NaN);
  const [otpModal, setOtpModal] = useState(false);
  const [paymentBtn, setPaymentBtn] = useState(false);
  const sendOtp = async () => {
    const token = Cookies.get("token");
    const response = await authApi(token).get(endpoints["otp"]);
    if (response.status === 200) {
      setOtpModal(true);
    }
  };

  const confirmOtp = async () => {
    const token = Cookies.get("token");
    const response = await authApi(token).post(endpoints["confirm-otp"], {
      otp: otp,
    });
    if (response.status === 200) {
      setPaymentBtn(true);
      setOtpModal(false);
    }
  };
  const [isPaid, setIsPaid] = useState(false);
  const confirmPay = async () => {
    const token = Cookies.get("token");
    const data = {
      status: "paid",
    };
    const response = await authApi(token).patch(
      latestOrderByCurrentUser.order.id
        ? endpoints["order-detail-delivery"](latestOrderByCurrentUser.order.id)
        : endpoints["return-order-detail-delivery"](
            latestOrderByCurrentUser.return_order.id,
          ),
      data,
    );
    if (response.status === 200) {
      setIsPaid(true);
      setPaymentBtn(false);
      toast.success("Payment successfuily");
      fetchLatestOrderByCurrentUser();
      fetchOrdersByCurrentUser();
      fetchReturnOrdersByCurrentUser();
    }
  };

  const confirmOrderDelivery = async () => {
    const token = Cookies.get("token");
    const data = {
      status: "shipping",
    };
    await authApi(token).patch(
      endpoints["confirm-order"](latestOrderByCurrentUser?.order?.id),
      data,
    );
  };

  const confirmReturnOrderDelivery = async () => {
    const token = Cookies.get("token");
    const data = {
      status: "shipping",
    };
    await authApi(token).patch(
      endpoints["confirm-return-order"](
        latestOrderByCurrentUser?.return_order?.id,
      ),
      data,
    );
  };

  const pay = async () => {
    setPayModal(true);
    isPaid === false && sendOtp();
  };
  useEffect(() => {
    const token = Cookies.get("token");
    echo(token)
      .join("changeOrder")
      .listen(".sendChangeOrder", async () => {
        await fetchOrdersByCurrentUser();
        await fetchReturnOrdersByCurrentUser();
      });
  }, []);
  const refresh = async () => {
    await fetchLatestOrderByCurrentUser();
    await fetchOrdersByCurrentUser();
    await fetchReturnOrdersByCurrentUser();
  };
  useEffect(() => {
    const token = Cookies.get("token");
    echo(token)
      .join("completeOrder")
      .listen(".sendCompleteOrder", async () => {
        await fetchLatestOrderByCurrentUser();
        await fetchOrdersByCurrentUser();
        await fetchReturnOrdersByCurrentUser();
      });

    echo(token)
      .join("createOrder")
      .listen(".sendCreateOrder", async () => {
        await fetchLatestOrderByCurrentUser();
        await fetchOrdersByCurrentUser();
        await fetchReturnOrdersByCurrentUser();
      });

    echo(token)
      .join("changeReturnOrder")
      .listen(".sendChangeReturnOrder", async () => {
        await fetchOrdersByCurrentUser();
        await fetchReturnOrdersByCurrentUser();
      });
  }, []);
  const [isOpenReturnCreate, setIsOpenReturnCreate] = useState(false);
  const [returnOrderCreated, setReturnOrderCreated] = useState(false);

  const scrollOrderContainerRef = useRef(null);
  const scrollOrderHorizontally = (direction) => {
    if (scrollOrderContainerRef.current) {
      const scrollAmount = direction === "left" ? -200 : 200;
      scrollOrderContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const scrollReturnOrderContainerRef = useRef(null);
  const scrollReturnOrderHorizontally = (direction) => {
    if (scrollReturnOrderContainerRef.current) {
      const scrollAmount = direction === "left" ? -200 : 200;
      scrollReturnOrderContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <ToastContainer position="top-right" />

      <Sidebar />
      <main className="h-screen flex-row bg-gray-100 p-4 sm:ml-64">
        <section className="h-fit">
          <h3 className="text-md mb-3 font-semibold">Order page</h3>
          {currentUser?.role !== "driver" && (
            <>
              <button
                className="mr-2 rounded-md bg-orange-500 px-3 py-2 text-white"
                onClick={() => {
                  setTransactionType("purchase");
                  setIsOpenCreate(!isOpenCreate);
                }}
              >
                Create order
              </button>
              <button
                className="rounded-md bg-orange-500 px-3 py-2 text-white"
                onClick={() => {
                  setTransactionType("return");
                  setIsOpenReturnCreate(!isOpenReturnCreate);
                }}
              >
                Create return order
              </button>
            </>
          )}
          {isOpenCreate && (
            <section className="overflow-y-auto bg-gray-100 p-4">
              <div className="flex justify-between">
                <h2 className="mb-4 text-lg font-semibold">Order create</h2>
                <svg
                  onClick={() => setIsOpenCreate(false)}
                  className="size-7 text-orange-500"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm7.707-3.707a1 1 0 0 0-1.414 1.414L10.586 12l-2.293 2.293a1 1 0 1 0 1.414 1.414L12 13.414l2.293 2.293a1 1 0 0 0 1.414-1.414L13.414 12l2.293-2.293a1 1 0 0 0-1.414-1.414L12 10.586 9.707 8.293Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
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
                        {/*<div className="mb-4">*/}
                        {/*  <label className="mb-2 block" htmlFor="type">*/}
                        {/*    Type*/}
                        {/*  </label>*/}
                        {/*  <select*/}
                        {/*    className="w-full rounded-md"*/}
                        {/*    id="type"*/}
                        {/*    value={transactionType}*/}
                        {/*    onChange={(e) => setTransactionType(e.target.value)}*/}
                        {/*  >*/}
                        {/*    <option selected={true}>Select your option</option>;*/}
                        {/*    {transactionsType.map((type, index) => {*/}
                        {/*      return (*/}
                        {/*        <option key={index} value={type}>*/}
                        {/*          {type.toString().at(0).toUpperCase() +*/}
                        {/*            type.slice(1)}*/}
                        {/*        </option>*/}
                        {/*      );*/}
                        {/*    })}*/}
                        {/*  </select>*/}
                        {/*</div>*/}
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
                            <option selected={true}>Select your option</option>;
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
                            <option>Select your option</option>
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
                          {openAutocompleteOriginForm && originAddresses && (
                            <div className="bottom-100 absolute z-10 w-full rounded-b-sm border border-t-0 border-black bg-white shadow-sm">
                              {originAddresses.map((address, index) => {
                                return (
                                  <div
                                    key={index}
                                    className="mb-1 cursor-pointer px-3 py-2"
                                    onClick={() => {
                                      setOpenAutocompleteOriginForm(false);
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
                              fetchAutocompleteWithDestination(e.target.value);
                            }}
                          />
                          {openAutocompleteDestinationForm &&
                            destinationAddresses && (
                              <div className="bottom-100 absolute z-10 w-full rounded-b-sm border border-t-0 border-black bg-white shadow-sm">
                                {destinationAddresses.map((address, index) => {
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
                        {/*<div className="mb-4 flex flex-col justify-between gap-4 md:flex-row">*/}
                        {/*  <label className="mb-2 block" htmlFor="vehicle">*/}
                        {/*    Vehicle*/}
                        {/*  </label>*/}
                        {/*  <select*/}
                        {/*    id="vehicle"*/}
                        {/*    className="w-full rounded-md"*/}
                        {/*    value={vehicle}*/}
                        {/*    onChange={(e) => setVehicle(e.target.value)}*/}
                        {/*  >*/}
                        {/*    <option selected={true}>Select your option</option>*/}
                        {/*    {vehicles.map((s, index) => {*/}
                        {/*      return (*/}
                        {/*        <option key={index} value={s.id}>*/}
                        {/*          {s.type.toString().at(0).toUpperCase() +*/}
                        {/*            s.type.slice(1) +*/}
                        {/*            " - " +*/}
                        {/*            s.id}*/}
                        {/*        </option>*/}
                        {/*      );*/}
                        {/*    })}*/}
                        {/*  </select>*/}
                        {/*</div>*/}
                      </form>
                    </section>
                  )}
                  {index === 3 && (
                    <section className="w-full rounded-md border border-orange-200 p-4">
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
                            {destinationAddress !== "" && destinationAddress}
                            {destinationAddress === "" && "Destination address"}
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
                  {index > 0 && index < 3 && (
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
                          if (transactionCreated === true) setIndex(index + 1);
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
                      Complete
                    </button>
                  )}
                </div>
              </div>
            </section>
          )}
          {isOpenReturnCreate && (
            <section className="ml-2 overflow-y-auto bg-gray-100 p-4">
              <div className="flex justify-between">
                <h2 className="mb-4 text-lg font-semibold">
                  Return order create
                </h2>
                <svg
                  onClick={() => setIsOpenReturnCreate(false)}
                  className="size-7 text-orange-500"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm7.707-3.707a1 1 0 0 0-1.414 1.414L10.586 12l-2.293 2.293a1 1 0 1 0 1.414 1.414L12 13.414l2.293 2.293a1 1 0 0 0 1.414-1.414L13.414 12l2.293-2.293a1 1 0 0 0-1.414-1.414L12 10.586 9.707 8.293Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
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
                        if (returnOrderCreated === false)
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
                      if (returnOrderCreated === true) SetIndex(1);
                      else if (index === 0)
                        if (transactionCreated === false)
                          toast.info("Transaction is not created!");
                        else SetIndex(1);
                      else if (index === 1)
                        if (returnOrderCreated === false)
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
                      Create return order
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
                        if (returnOrderCreated === false)
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
                        returnOrderCreated === true &&
                        shipmentCreated === true
                      )
                        SetIndex(3);
                      else if (index === 0)
                        if (transactionCreated === false)
                          toast.info("Transaction is not created!");
                        else SetIndex(3);
                      else if (index === 1)
                        if (returnOrderCreated === false)
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
                        {/*<div className="mb-4">*/}
                        {/*  <label className="mb-2 block" htmlFor="type">*/}
                        {/*    Type*/}
                        {/*  </label>*/}
                        {/*  <select*/}
                        {/*    className="w-full rounded-md"*/}
                        {/*    id="type"*/}
                        {/*    value={transactionType}*/}
                        {/*    onChange={(e) => setTransactionType(e.target.value)}*/}
                        {/*  >*/}
                        {/*    <option selected={true}>Select your option</option>;*/}
                        {/*    {transactionsType.map((type, index) => {*/}
                        {/*      return (*/}
                        {/*        <option key={index} value={type}>*/}
                        {/*          {type.toString().at(0).toUpperCase() +*/}
                        {/*            type.slice(1)}*/}
                        {/*        </option>*/}
                        {/*      );*/}
                        {/*    })}*/}
                        {/*  </select>*/}
                        {/*</div>*/}
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
                            <option selected={true}>Select your option</option>;
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
                            <option>Select your option</option>
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
                        <div className="mb-4">
                          <label className="mb-2 block" htmlFor="customer">
                            Reason
                          </label>
                          <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            rows="4"
                            className="w-full rounded-md p-2.5 text-sm"
                            placeholder="Reason..."
                          ></textarea>
                        </div>
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
                          {openAutocompleteOriginForm && originAddresses && (
                            <div className="bottom-100 absolute z-10 w-full rounded-b-sm border border-t-0 border-black bg-white shadow-sm">
                              {originAddresses.map((address, index) => {
                                return (
                                  <div
                                    key={index}
                                    className="mb-1 cursor-pointer px-3 py-2"
                                    onClick={() => {
                                      setOpenAutocompleteOriginForm(false);
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
                              fetchAutocompleteWithDestination(e.target.value);
                            }}
                          />
                          {openAutocompleteDestinationForm &&
                            destinationAddresses && (
                              <div className="bottom-100 absolute z-10 w-full rounded-b-sm border border-t-0 border-black bg-white shadow-sm">
                                {destinationAddresses.map((address, index) => {
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
                        {/*<div className="mb-4 flex flex-col justify-between gap-4 md:flex-row">*/}
                        {/*  <label className="mb-2 block" htmlFor="vehicle">*/}
                        {/*    Vehicle*/}
                        {/*  </label>*/}
                        {/*  <select*/}
                        {/*    id="vehicle"*/}
                        {/*    className="w-full rounded-md"*/}
                        {/*    value={vehicle}*/}
                        {/*    onChange={(e) => setVehicle(e.target.value)}*/}
                        {/*  >*/}
                        {/*    <option selected={true}>Select your option</option>*/}
                        {/*    {vehicles.map((s, index) => {*/}
                        {/*      return (*/}
                        {/*        <option key={index} value={s.id}>*/}
                        {/*          {s.type.toString().at(0).toUpperCase() +*/}
                        {/*            s.type.slice(1) +*/}
                        {/*            " - " +*/}
                        {/*            s.id}*/}
                        {/*        </option>*/}
                        {/*      );*/}
                        {/*    })}*/}
                        {/*  </select>*/}
                        {/*</div>*/}
                      </form>
                    </section>
                  )}
                  {index === 3 && (
                    <section className="w-full rounded-md border border-orange-200 p-4">
                      <section className="flex flex-col">
                        <p className="mb-4 flex items-baseline">
                          <span className="mb-2 mr-4 inline-block rounded-sm bg-orange-500 p-2 text-white">
                            return order date
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
                            {destinationAddress !== "" && destinationAddress}
                            {destinationAddress === "" && "Destination address"}
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
                            Reason
                          </span>
                          <span>
                            {reason !== "" && reason}
                            {reason === "" && "Price"}
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
                  {index > 0 && index < 3 && (
                    <button
                      className="mr-4 rounded-md border border-black bg-white px-4 py-2 text-black"
                      onClick={() => {
                        if (index === 0)
                          if (transactionCreated === true)
                            SetIndex(index - 1 < 0 ? 0 : index - 1);
                          else toast.info("Transaction is not created!");
                        if (index === 1)
                          if (returnOrderCreated === true)
                            SetIndex(index - 1 < 0 ? 0 : index - 1);
                          else toast.info("Return order is not created!");
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
                          if (transactionCreated === true) setIndex(index + 1);
                          else toast.info("Transaction is not created!");
                        if (index === 1)
                          if (returnOrderCreated === true) setIndex(index + 1);
                          else toast.info("Return order is not created!");
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
                      onClick={handleSubmitReturnOrder}
                      className="rounded-md bg-orange-500 px-4 py-2 text-white"
                    >
                      Create return order
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
                      Complete
                    </button>
                  )}
                </div>
              </div>
            </section>
          )}
        </section>
        <section className="flex gap-4">
          <section className="w-[calc(50%-8px)] overflow-x-auto">
            <section className="mt-4 flex items-center justify-between rounded-tl-md rounded-tr-md bg-orange-500 p-2 text-white">
              <h3 className="flex flex-col gap-2">
                Order list&nbsp;
                <svg
                  onClick={refresh}
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
                    d="M17.651 7.65a7.131 7.131 0 0 0-12.68 3.15M18.001 4v4h-4m-7.652 8.35a7.13 7.13 0 0 0 12.68-3.15M6 20v-4h4"
                  />
                </svg>
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => scrollOrderHorizontally("left")}
                  className="ml-2"
                >
                  <svg
                    className="text-white"
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
                      d="m15 19-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => scrollOrderHorizontally("right")}
                  className=""
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
                      d="m9 5 7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </section>
            {orders && (
              <section
                ref={scrollOrderContainerRef}
                className="flex gap-4 overflow-x-auto rounded-bl-md rounded-br-md border border-orange-500 p-4"
              >
                {orders.map((order, index) => {
                  return (
                    <section
                      onClick={() => getOrderById(order.id)}
                      className="flex min-w-[160px] flex-col items-start gap-2 text-wrap break-words rounded-md border border-gray-500 p-2"
                      id={index}
                    >
                      <h4 className="text-md text-wrap break-words">
                        {order.id}
                      </h4>
                      <span
                        className={`flex items-center justify-center gap-2`}
                      >
                        <span
                          className={`p-2 text-white ${order.status === "success" || order.status === "paid" ? "bg-green-500" : "bg-yellow-500"}`}
                        >
                          {order.status}
                        </span>

                        {order.status === "pending" &&
                        currentUser.role === "driver" ? (
                          <svg
                            onClick={confirmOrderDelivery}
                            className="size-6 text-orange-500"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm13.707-1.293a1 1 0 0 0-1.414-1.414L11 12.586l-1.793-1.793a1 1 0 0 0-1.414 1.414l2.5 2.5a1 1 0 0 0 1.414 0l4-4Z"
                              clip-rule="evenodd"
                            />
                          </svg>
                        ) : (
                          ""
                        )}
                      </span>
                    </section>
                  );
                })}
              </section>
            )}
          </section>
          <section className="w-[calc(50%-8px)]">
            <section className="mt-4 flex items-center justify-between rounded-tl-md rounded-tr-md bg-orange-500 p-2 text-white">
              <h3 className="flex flex-col gap-2">
                Return order list&nbsp;
                <svg
                  onClick={refresh}
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
                    d="M17.651 7.65a7.131 7.131 0 0 0-12.68 3.15M18.001 4v4h-4m-7.652 8.35a7.13 7.13 0 0 0 12.68-3.15M6 20v-4h4"
                  />
                </svg>
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => scrollReturnOrderHorizontally("left")}
                  className="ml-2"
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
                      d="m15 19-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => scrollReturnOrderHorizontally("right")}
                  className=""
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
                      d="m9 5 7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </section>
            {returnOrders && (
              <section
                ref={scrollReturnOrderContainerRef}
                className="flex gap-4 overflow-x-scroll rounded-bl-md rounded-br-md border border-orange-500 p-4"
              >
                {returnOrders.map((returnOrder, index) => {
                  return (
                    <section
                      onClick={() => {
                        getReturnOrderById(returnOrder.id);
                      }}
                      className="flex min-w-[160px] flex-col items-start gap-2 rounded-md border border-gray-500 p-2"
                      id={index}
                    >
                      <h4 className="text-md">{returnOrder.id}</h4>
                      <span
                        className={`flex items-center justify-center gap-2`}
                      >
                        <span
                          className={`p-2 text-white ${returnOrder.status === "returned" || returnOrder.status === "paid" ? "bg-green-500" : "bg-yellow-500"}`}
                        >
                          {returnOrder.status}
                        </span>

                        {returnOrder.status === "pending" &&
                        currentUser.role === "driver" ? (
                          <svg
                            onClick={confirmReturnOrderDelivery}
                            className="size-6 text-orange-500"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm13.707-1.293a1 1 0 0 0-1.414-1.414L11 12.586l-1.793-1.793a1 1 0 0 0-1.414 1.414l2.5 2.5a1 1 0 0 0 1.414 0l4-4Z"
                              clip-rule="evenodd"
                            />
                          </svg>
                        ) : (
                          ""
                        )}
                      </span>
                    </section>
                  );
                })}
              </section>
            )}
          </section>
        </section>

        <h3 className="mt-4 flex items-center rounded-tl-md rounded-tr-md bg-orange-500 p-2 text-white">
          Current order{" "}
          <button onClick={getCurrentOrder}>
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
                d="M17.651 7.65a7.131 7.131 0 0 0-12.68 3.15M18.001 4v4h-4m-7.652 8.35a7.13 7.13 0 0 0 12.68-3.15M6 20v-4h4"
              />
            </svg>
          </button>
        </h3>
        {latestOrderByCurrentUser && (
          <>
            <section className="rounded-bl-md rounded-br-md border border-orange-500 p-2">
              <h4>
                <span className="font-bold">Name</span>:{" "}
                {latestOrderByCurrentUser?.product?.name}
              </h4>
              <h4>
                <span className="font-bold">Type</span>:{" "}
                {latestOrderByCurrentUser?.category?.name}
              </h4>
              {latestOrderByCurrentUser?.shipments?.map((shipment, index) => {
                return (
                  <ul key={index} className="list-inside list-disc">
                    <li>
                      <section className="mb-1">
                        <h4>
                          <span className="font-bold">Origin</span>:{" "}
                          {shipment.origin_address}
                        </h4>
                        <h4>
                          <span className="font-bold">Destination</span>:{" "}
                          {shipment.destination_address}
                        </h4>
                        <h4>
                          <span className="font-bold">Estimated</span>:{" "}
                          {dateFormat(shipment.estimated_arrival_time)}
                        </h4>
                        <h4>
                          <span className="font-bold">Arrival</span>:{" "}
                          {dateFormat(shipment.arrival_time)}
                        </h4>
                        <h4>
                          <span className="font-bold">Status</span>:{" "}
                          {shipment.status}
                        </h4>
                      </section>
                    </li>
                  </ul>
                );
              })}
            </section>
          </>
        )}
        {payModal && (
          <>
            <h3 className="mt-4 flex items-center rounded-tl-md rounded-tr-md bg-orange-500 p-2 text-white">
              Pay section
            </h3>
            <section className="rounded-bl-md rounded-br-md border border-orange-500 p-2">
              <h4>
                <span className="font-bold">Payment status</span>:{" "}
                {(latestOrderByCurrentUser?.order?.status === "paid" ??
                latestOrderByCurrentUser?.return_order?.status === "paid") ? (
                  <span className="rounded-sm bg-green-500 p-1 text-white">
                    Paid
                  </span>
                ) : (
                  (latestOrderByCurrentUser?.order?.status ??
                  latestOrderByCurrentUser?.return_order?.status)
                )}
              </h4>
              <h4>
                <span className="font-bold">Product</span>:{" "}
                <ul>
                  <li className="ml-4">
                    <h5>
                      <span className="font-bold">Name</span>:{" "}
                      {latestOrderByCurrentUser?.product?.name}
                    </h5>
                  </li>
                  <li className="ml-4">
                    <h5>
                      <span className="font-bold">Type</span>:{" "}
                      {latestOrderByCurrentUser?.category?.name}
                    </h5>
                  </li>
                  <li className="ml-4">
                    <h5>
                      <span className="font-bold">Weight</span>:{" "}
                      {latestOrderByCurrentUser?.product?.weight}
                    </h5>
                  </li>
                  <li className="ml-4">
                    <h5>
                      <span className="font-bold">Dimensions</span>:{" "}
                      {latestOrderByCurrentUser?.product?.dimensions}
                    </h5>
                  </li>
                </ul>
              </h4>
              <h4>
                <span className="font-bold">Price</span>:{" "}
                {formatPriceVND(latestOrderByCurrentUser?.receipt?.price)}
              </h4>
              {otpModal === true && (
                <>
                  <h4 className="mb-1">
                    <span className="font-bold">Otp:</span>
                  </h4>
                  <div className="flex gap-2">
                    <input
                      className="w-[70%] rounded-md border border-orange-500 p-2"
                      placeholder="otp"
                      value={otp}
                      onChange={(e) => {
                        setOtp(e.target.value);
                      }}
                    />
                    <button
                      className="w-[30%] rounded-md bg-orange-500 text-center text-white"
                      onClick={confirmOtp}
                    >
                      Complete
                    </button>
                  </div>
                </>
              )}
              {paymentBtn === true && (
                <div className="mt-2">
                  <button
                    className="rounded-md bg-orange-500 p-2 text-white"
                    onClick={confirmPay}
                  >
                    Confirm payment
                  </button>
                </div>
              )}
            </section>
          </>
        )}
        <section className="flex flex-wrap gap-2">
          <button
            className="mt-4 rounded-md bg-orange-500 p-2 text-white"
            onClick={startTracking}
          >
            Start track
          </button>
          {currentUser && currentUser?.role === "employee" && (
            <button
              className="mt-4 rounded-md bg-orange-500 p-2 text-white"
              onClick={deleteRoute}
            >
              Remove route
            </button>
          )}
          {currentUser && currentUser?.role === "driver" && (
            <button
              onClick={carBreakDown}
              className="mt-4 rounded-md bg-orange-500 p-2 text-white"
            >
              Car breakdown
            </button>
          )}
          {currentUser &&
          latestOrderByCurrentUser?.order?.status === "delivered" &&
          currentUser?.role === "customer" ? (
            <button
              className="mt-4 rounded-md bg-orange-500 p-2 text-white"
              onClick={pay}
            >
              Pay
            </button>
          ) : (
            ""
          )}
        </section>

        <section className="my-4 w-full">
          <div
            ref={mapRef}
            id="map"
            className="relative h-[400px] w-full"
          ></div>
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
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17.651 7.65a7.131 7.131 0 0 0-12.68 3.15M18.001 4v4h-4m-7.652 8.35a7.13 7.13 0 0 0 12.68-3.15M6 20v-4h4"
            />
          </svg>
        </div>

        <section className="flex basis-[100%] flex-col overflow-x-auto sm:flex-col lg:basis-[40%]">
          <div className="h-full w-full sm:order-2">
            <div className="bg-orange-500 p-3 text-white">
              <h4 className="text-xl">
                {currentUser?.id === conversation?.user_two?.id
                  ? conversation?.user_one?.name
                  : conversation?.user_two?.name}
              </h4>
              <span className="italic">{formattedDate ?? "Loading"}</span>
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
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
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
    </>
  );
}
