import React, { useCallback, useContext, useEffect, useState } from "react";
import { DetailPageContext } from "../helper/Context.js";
import { useNavigate } from "react-router-dom";
import { endpoints, authApi } from "../helper/Apis.js";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import api from "js-cookie";
import { echo } from "../helper/echo.js";
import { dateFormat, formatDate, isDate } from "../helper/dateFormat.js";

export default function TableTransaction() {
  const [Data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const { transactionContext, setTransactionContext } =
    useContext(DetailPageContext);
  const navigate = useNavigate();
  const [del, setDel] = React.useState(!transactionContext.del ? false : true);
  const [detailOpen, setDetailOpen] = React.useState(
    !transactionContext.detailOpen ? false : true,
  );

  const [orderDirectionIdIndex, setOrderDirectionIdIndex] = React.useState(2);
  const [orderDirectionQuantityIndex, setOrderDirectionQuantityIndex] =
    React.useState(2);
  const [orderDirectionUnitIndex, setOrderDirectionUnitIndex] =
    React.useState(2);
  const [orderDirectionDateIndex, setOrderDirectionDateIndex] =
    React.useState(2);
  const [orderDirectionTypeIndex, setOrderDirectionTypeIndex] =
    React.useState(2);
  const [orderDirectionProductIndex, setOrderDirectionProductIndex] =
    React.useState(2);
  const [orderDirectionStatusIndex, setOrderDirectionStatusIndex] =
    React.useState(2);
  const [orderDirectionCreatedIndex, setOrderDirectionCreatedIndex] =
    React.useState(2);
  const [orderDirectionUpdatedIndex, setOrderDirectionUpdatedIndex] =
    React.useState(2);
  const [detailOpens, setDetailOpens] = useState([
    !transactionContext.detailOpens
      ? Data.data.forEach((d) =>
          !transactionContext.detailOpen ? false : true,
        )
      : false,
  ]);

  const [deleteIds, setDeleteIds] = React.useState([]);

  const [all, setAll] = React.useState(!transactionContext.all ? false : true);
  const [checkBoxOpen, setCheckBoxOpen] = React.useState(
    !transactionContext.checkBoxOpen ? false : true,
  );

  const [statuss, setStatuss] = React.useState([]);
  const fetchStatus = async () => {
    const token = Cookies.get("token");
    const response = await authApi(token).get(endpoints["transactions-status"]);
    setStatuss(response.data.statuss);
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const [message, setMessage] = React.useState({
    message: "",
    type: "",
  });

  const check = function () {
    setAll(!all);
  };

  const changeMode = function () {
    setDel(!del);
    setCheckBoxOpen(!checkBoxOpen);
    setTransactionContext((prevState) => ({
      ...prevState,
      del: del,
      checkBoxOpen: checkBoxOpen,
    }));
  };

  const handleDeleteIdsAll = () => {};

  const handleDeleteIds = async (e, id) => {
    if (e.target.checked === true) {
      setDeleteIds(deleteIds.filter((d) => d !== id));
      setDeleteIds([...deleteIds, id]);
    } else {
      setDeleteIds(deleteIds.filter((d) => d !== id));
    }
  };
  const fetchData = async () => {
    setLoading(true);
    const token = Cookies.get("token");
    const response = await authApi(token).get(endpoints["transactions"]);
    if (response) {
      setData(response.data.transactions);
      setLoading(false);
    }
  };
  const handleDeleteAll = async () => {
    const token = Cookies.get("token");
    let done = false;
    for (const id of deleteIds) {
      const index = deleteIds.indexOf(id);
      const response = await authApi(token).delete(
        endpoints["transaction-detail"](id),
      );
      if (response.status === 204 && index === deleteIds.length - 1) {
        fetchData();
        done = true;
      }
    }
    if (done === true) setDeleteIds([]);
  };

  const getTransaction = async (url) => {
    const token = Cookies.get("token");
    const response = await authApi(token).get(url);
    setData(response.data.transactions);
  };

  const handleSearch = async (e) => {
    let keyword = e.target.value;
    if (isDate(keyword)) {
      keyword = formatDate(keyword);
    }
    const token = Cookies.get("token");
    const response = await authApi(token).get(
      endpoints["search-transaction"](keyword),
    );
    setData(response.data.transactions);
  };

  const orderBy = async (type) => {
    const directions = ["desc", "", "asc"];
    let direction;
    switch (type) {
      case "id":
        direction = directions[orderDirectionIdIndex];
        break;
      case "date":
        direction = directions[orderDirectionDateIndex];
        break;
      case "type":
        direction = directions[orderDirectionTypeIndex];
        break;
      case "unit":
        direction = directions[orderDirectionUnitIndex];
        break;
      case "quantity":
        direction = directions[orderDirectionQuantityIndex];
        break;
      case "status":
        direction = directions[orderDirectionStatusIndex];
        break;
      case "product_id":
        direction = directions[orderDirectionProductIndex];
        break;
      case "created_at":
        direction = directions[orderDirectionCreatedIndex];
        break;
      case "updated_at":
        direction = directions[orderDirectionUpdatedIndex];
        break;
    }
    const token = Cookies.get("token");
    const response = await authApi(token).get(
      endpoints["order-transaction"](type, direction),
    );
    setData(response.data.transactions);
  };

  const deleteItem = async (id) => {
    const token = Cookies.get("token");
    const response = await authApi(token).delete(
      endpoints["transaction-detail"](id),
    );
    if (response.status === 204) {
      toast.success(response.data.message || "Deleted", {
        onClick: () => {
          setTransactionContext((prev) => ({ ...prev, updateItem: true }));
        },
        onClose: () => {
          setTransactionContext((prev) => ({ ...prev, updateItem: true }));
        },
      });
    }
  };
  useEffect(() => {
    fetchData();
    const token = Cookies.get("token");
    echo(token)
      .join("changeOrder")
      .listen(".sendChangeOrder", async () => await fetchData());

    echo(token)
      .join("createOrder")
      .listen(".sendCreateOrder", async () => {
        await fetchData();
      });
  }, []);

  const handleWhenAddOrUpdate = () => {
    if (transactionContext.updateItem === true) {
      fetchData();
      transactionContext.updateItem = false;
    }
    if (transactionContext.addItem === true) {
      fetchData();
      transactionContext.addItem = false;
    }
  };
  handleWhenAddOrUpdate();
  const changeStatus = async (id, status) => {
    setStatus(status);
    setIsOpen(!isOpen);
    const data = {
      status: status,
    };
    const token = Cookies.get("token");
    const response = await authApi(token).patch(
      endpoints["transaction-detail"](id),
      data,
    );
    console.log(response.data);
    toast.success("Update successfully", {
      onClick: () => {
        setTransactionContext((prev) => ({ ...prev, updateItem: true }));
      },
      onClose: () => {
        setTransactionContext((prev) => ({ ...prev, updateItem: true }));
      },
    });
  };
  const [isOpen, setIsOpen] = React.useState(false);
  const [statusIndex, setStatusIndex] = React.useState(0);
  const [status, setStatus] = React.useState("");
  useEffect(() => {
    const token = Cookies.get("token");
    echo(token)
      .join("changeOrder")
      .listen(".sendChangeOrder", async () => {
        await fetchData();
      });
    echo(token)
      .join("createOrder")
      .listen(".sendCreateOrder", async () => {
        await fetchData();
      });
    echo(token)
      .join("createSupply")
      .listen(".sendCreateSupply", async () => {
        await fetchData();
      });
  }, []);

  const [productNames, setProductNames] = useState({});

  const fetchProductName = async (id) => {
    const token = Cookies.get("token");
    const response = await authApi(token).get(endpoints["product-detail"](id));
    return response.data.product.name;
  };

  const fetchAllProductNames = useCallback(async () => {
    const names = {};
    for (const d of Data.data) {
      if (!names[d.product_id]) {
        names[d.product_id] = await fetchProductName(d.product_id);
      }
    }
    setProductNames(names);
  }, [Data]);

  useEffect(() => {
    const fetchData = async () => {
      if (Data && Data?.data) {
        await fetchAllProductNames();
      }
    };
    fetchData();
  }, [Data, fetchAllProductNames]);
  return (
    <>
      <ToastContainer position="top-right" />
      <section className="rounded-lg bg-white p-4">
        <div className="mb-4 flex flex-col justify-between gap-2 xl:flex-row">
          <h4 className="flex items-center gap-2 text-2xl">
            <svg
              className="h-6 w-6 text-gray-800 dark:text-white"
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
                d="M4.248 19C3.22 15.77 5.275 8.232 12.466 8.232V6.079a1.025 1.025 0 0 1 1.644-.862l5.479 4.307a1.108 1.108 0 0 1 0 1.723l-5.48 4.307a1.026 1.026 0 0 1-1.643-.861v-2.154C5.275 13.616 4.248 19 4.248 19Z"
              />
            </svg>
            Transaction List{""}
            <button onClick={() => fetchData()}>
              <svg
                className="h-6 w-6 text-black"
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
          </h4>
          <div className="flex flex-col gap-4 text-left lg:flex-row lg:items-center">
            <div className="flex flex-wrap justify-end gap-2">
              <div className="relative">
                <div className="absolute left-0 top-[50%] -translate-y-[50%] p-4">
                  <svg
                    className="h-6 w-6 text-gray-800 dark:text-white"
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
                      strokeWidth="2"
                      d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                    />
                  </svg>
                </div>
                <input
                  onChange={(e) => handleSearch(e)}
                  className="w-full rounded-md bg-gray-100 px-4 py-2 pl-14"
                  type="text"
                  id="search"
                  name="shipmentSearch"
                  placeholder="Search..."
                />
              </div>
              <button className="rounded-md bg-orange-500 px-4 py-2 text-left text-white">
                Export to CSV
              </button>
            </div>
          </div>
        </div>
        {loading && (
          <div className="flex h-56 w-full items-center justify-center rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
            <div role="status">
              <svg
                aria-hidden="true"
                className="h-8 w-8 animate-spin fill-orange-500 text-gray-200 dark:text-gray-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        )}
        {!loading && (
          <div className="w-full">
            <div className="overflow-x-auto">
              {
                <table className="w-full text-left text-sm">
                  <thead className="bg-orange-500 text-white">
                    <tr>
                      <th className="p-2"></th>

                      <th
                        onClick={() => {
                          orderBy("id");
                          setOrderDirectionIdIndex(
                            orderDirectionIdIndex === 2
                              ? 0
                              : orderDirectionIdIndex + 1,
                          );
                        }}
                        className="p-2"
                      >
                        <span>Transaction Id&nbsp;</span>
                        {orderDirectionIdIndex === 0 && (
                          <svg
                            className="inline-block size-6 text-white dark:text-white"
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
                              d="m5 15 7-7 7 7"
                            />
                          </svg>
                        )}
                        {orderDirectionIdIndex === 1 && (
                          <svg
                            className="inline-block h-6 w-6 text-white dark:text-white"
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
                              d="m19 9-7 7-7-7"
                            />
                          </svg>
                        )}
                        {orderDirectionIdIndex === 2 && (
                          <svg
                            className="inline-block h-6 w-6 text-white dark:text-white"
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
                              d="m8 15 4 4 4-4m0-6-4-4-4 4"
                            />
                          </svg>
                        )}
                      </th>
                      <th
                        onClick={() => {
                          orderBy("quantity");
                          setOrderDirectionQuantityIndex(
                            orderDirectionQuantityIndex === 2
                              ? 0
                              : orderDirectionQuantityIndex + 1,
                          );
                        }}
                        className="p-2"
                      >
                        <span>Quantity&nbsp;</span>
                        {orderDirectionQuantityIndex === 0 && (
                          <svg
                            className="inline-block size-6 text-white dark:text-white"
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
                              d="m5 15 7-7 7 7"
                            />
                          </svg>
                        )}
                        {orderDirectionQuantityIndex === 1 && (
                          <svg
                            className="inline-block h-6 w-6 text-white dark:text-white"
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
                              d="m19 9-7 7-7-7"
                            />
                          </svg>
                        )}
                        {orderDirectionQuantityIndex === 2 && (
                          <svg
                            className="inline-block h-6 w-6 text-white dark:text-white"
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
                              d="m8 15 4 4 4-4m0-6-4-4-4 4"
                            />
                          </svg>
                        )}
                      </th>
                      <th
                        onClick={() => {
                          orderBy("status");
                          setOrderDirectionStatusIndex(
                            orderDirectionStatusIndex === 2
                              ? 0
                              : orderDirectionStatusIndex + 1,
                          );
                        }}
                        className="p-2"
                      >
                        <span>Status&nbsp;</span>
                        {orderDirectionStatusIndex === 0 && (
                          <svg
                            className="inline-block size-6 text-white dark:text-white"
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
                              d="m5 15 7-7 7 7"
                            />
                          </svg>
                        )}
                        {orderDirectionStatusIndex === 1 && (
                          <svg
                            className="inline-block h-6 w-6 text-white dark:text-white"
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
                              d="m19 9-7 7-7-7"
                            />
                          </svg>
                        )}
                        {orderDirectionStatusIndex === 2 && (
                          <svg
                            className="inline-block h-6 w-6 text-white dark:text-white"
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
                              d="m8 15 4 4 4-4m0-6-4-4-4 4"
                            />
                          </svg>
                        )}
                      </th>
                      <th
                        onClick={() => {
                          orderBy("date");
                          setOrderDirectionDateIndex(
                            orderDirectionDateIndex === 2
                              ? 0
                              : orderDirectionDateIndex + 1,
                          );
                        }}
                        className="p-2"
                      >
                        <span>Date&nbsp;</span>
                        {orderDirectionDateIndex === 0 && (
                          <svg
                            className="inline-block size-6 text-white dark:text-white"
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
                              d="m5 15 7-7 7 7"
                            />
                          </svg>
                        )}
                        {orderDirectionDateIndex === 1 && (
                          <svg
                            className="inline-block h-6 w-6 text-white dark:text-white"
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
                              d="m19 9-7 7-7-7"
                            />
                          </svg>
                        )}
                        {orderDirectionDateIndex === 2 && (
                          <svg
                            className="inline-block h-6 w-6 text-white dark:text-white"
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
                              d="m8 15 4 4 4-4m0-6-4-4-4 4"
                            />
                          </svg>
                        )}
                      </th>
                      <th
                        onClick={() => {
                          orderBy("unit");
                          setOrderDirectionUnitIndex(
                            orderDirectionUnitIndex === 2
                              ? 0
                              : orderDirectionUnitIndex + 1,
                          );
                        }}
                        className="p-2"
                      >
                        Unit&nbsp;
                        {orderDirectionUnitIndex === 0 && (
                          <svg
                            className="inline-block size-6 text-white dark:text-white"
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
                              d="m5 15 7-7 7 7"
                            />
                          </svg>
                        )}
                        {orderDirectionUnitIndex === 1 && (
                          <svg
                            className="inline-block h-6 w-6 text-white dark:text-white"
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
                              d="m19 9-7 7-7-7"
                            />
                          </svg>
                        )}
                        {orderDirectionUnitIndex === 2 && (
                          <svg
                            className="inline-block h-6 w-6 text-white dark:text-white"
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
                              d="m8 15 4 4 4-4m0-6-4-4-4 4"
                            />
                          </svg>
                        )}
                      </th>
                      <th
                        onClick={() => {
                          orderBy("type");
                          setOrderDirectionTypeIndex(
                            orderDirectionTypeIndex === 2
                              ? 0
                              : orderDirectionTypeIndex + 1,
                          );
                        }}
                        className="p-2"
                      >
                        Type&nbsp;
                        {orderDirectionTypeIndex === 0 && (
                          <svg
                            className="inline-block size-6 text-white dark:text-white"
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
                              d="m5 15 7-7 7 7"
                            />
                          </svg>
                        )}
                        {orderDirectionTypeIndex === 1 && (
                          <svg
                            className="inline-block h-6 w-6 text-white dark:text-white"
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
                              d="m19 9-7 7-7-7"
                            />
                          </svg>
                        )}
                        {orderDirectionTypeIndex === 2 && (
                          <svg
                            className="inline-block h-6 w-6 text-white dark:text-white"
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
                              d="m8 15 4 4 4-4m0-6-4-4-4 4"
                            />
                          </svg>
                        )}
                      </th>
                      <th
                        onClick={() => {
                          orderBy("product_id");
                          setOrderDirectionProductIndex(
                            orderDirectionProductIndex === 2
                              ? 0
                              : orderDirectionProductIndex + 1,
                          );
                        }}
                        className="p-2"
                      >
                        Product&nbsp;
                        {orderDirectionProductIndex === 0 && (
                          <svg
                            className="inline-block size-6 text-white dark:text-white"
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
                              d="m5 15 7-7 7 7"
                            />
                          </svg>
                        )}
                        {orderDirectionProductIndex === 1 && (
                          <svg
                            className="inline-block h-6 w-6 text-white dark:text-white"
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
                              d="m19 9-7 7-7-7"
                            />
                          </svg>
                        )}
                        {orderDirectionProductIndex === 2 && (
                          <svg
                            className="inline-block h-6 w-6 text-white dark:text-white"
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
                              d="m8 15 4 4 4-4m0-6-4-4-4 4"
                            />
                          </svg>
                        )}
                      </th>
                      <th
                        onClick={() => {
                          orderBy("created_at");
                          setOrderDirectionCreatedIndex(
                            orderDirectionCreatedIndex === 2
                              ? 0
                              : orderDirectionCreatedIndex + 1,
                          );
                        }}
                        className="p-2"
                      >
                        Create&nbsp;
                        {orderDirectionCreatedIndex === 0 && (
                          <svg
                            className="inline-block size-6 text-white dark:text-white"
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
                              d="m5 15 7-7 7 7"
                            />
                          </svg>
                        )}
                        {orderDirectionCreatedIndex === 1 && (
                          <svg
                            className="inline-block h-6 w-6 text-white dark:text-white"
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
                              d="m19 9-7 7-7-7"
                            />
                          </svg>
                        )}
                        {orderDirectionCreatedIndex === 2 && (
                          <svg
                            className="inline-block h-6 w-6 text-white dark:text-white"
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
                              d="m8 15 4 4 4-4m0-6-4-4-4 4"
                            />
                          </svg>
                        )}
                      </th>
                      <th
                        onClick={() => {
                          orderBy("updated_at");
                          setOrderDirectionUpdatedIndex(
                            orderDirectionUpdatedIndex === 2
                              ? 0
                              : orderDirectionUpdatedIndex + 1,
                          );
                        }}
                        className="p-2"
                      >
                        Update&nbsp;
                        {orderDirectionUpdatedIndex === 0 && (
                          <svg
                            className="inline-block size-6 text-white dark:text-white"
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
                              d="m5 15 7-7 7 7"
                            />
                          </svg>
                        )}
                        {orderDirectionUpdatedIndex === 1 && (
                          <svg
                            className="inline-block h-6 w-6 text-white dark:text-white"
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
                              d="m19 9-7 7-7-7"
                            />
                          </svg>
                        )}
                        {orderDirectionUpdatedIndex === 2 && (
                          <svg
                            className="inline-block h-6 w-6 text-white dark:text-white"
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
                              d="m8 15 4 4 4-4m0-6-4-4-4 4"
                            />
                          </svg>
                        )}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Data.data.length === 0 && (
                      <tr className="rounded-sm bg-orange-500 p-4 text-center text-white">
                        <td
                          colSpan={9}
                          className="bg-white p-5 text-xl text-orange-500"
                        >
                          Empty
                        </td>
                      </tr>
                    )}
                    {Data &&
                      Data.data.map((d, index) => {
                        return (
                          <tr
                            key={index}
                            className="cursor-pointer border-b border-gray-200"
                          >
                            <td className="p-2"></td>
                            <td className="p-2">{d.id}</td>
                            <td className="p-2">{d.quantity}</td>
                            <td className="relative p-2">
                              <div
                                onClick={() => {
                                  setIsOpen(!isOpen);
                                  setStatusIndex(index);
                                  setStatus(d.status);
                                }}
                                className={`flex items-center gap-1 rounded-md ${d.status === "success" ? "bg-green-500" : "bg-yellow-500"} px-1 py-2 text-xs text-white`}
                              >
                                <svg
                                  className="size-4 text-white dark:text-white"
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
                                {d.status.toString().at(0).toUpperCase() +
                                  d.status.toString().slice(1)}
                              </div>
                              {isOpen && index === statusIndex && statuss && (
                                <div className="absolute left-0 top-0 h-[200px] w-full bg-white">
                                  {statuss.map((_status, index) => (
                                    <p
                                      key={index}
                                      className="flex justify-start gap-2 px-1 py-1 hover:bg-gray-100 hover:text-black"
                                      onClick={() =>
                                        changeStatus(d.id, _status)
                                      }
                                    >
                                      <input
                                        type="radio"
                                        defaultValue="success"
                                        value={status}
                                        checked={status === _status} // Replace d.status if it's incorrectly scoped
                                      />
                                      <label>
                                        {_status.at(0).toUpperCase() +
                                          _status.slice(1)}
                                      </label>
                                    </p>
                                  ))}
                                </div>
                              )}
                            </td>
                            <td className="p-2">{d.date}</td>
                            <td className="p-2">{d.unit}</td>
                            <td className="p-2">{d.type}</td>
                            <td className="p-2">
                              {productNames[d.product_id]}
                            </td>
                            <td className="p-2">{dateFormat(d.created_at)}</td>
                            <td className="p-2">{dateFormat(d.updated_at)}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              }
            </div>
            {Data.data.length > 0 && true && (
              <div className="ml-auto mt-4 flex w-[400px] justify-end">
                <div className="flex gap-2 overflow-x-auto">
                  {Data.links.map((d, index) => {
                    if (d.url) {
                      if (d.label.includes("&")) {
                        let symbol;
                        if (d.label.includes("Prev")) {
                          symbol = d.label.split(" ")[0];
                          d.label = d.label.replace(symbol, "«");
                        } else if (d.label.includes("Next")) {
                          symbol = d.label.split(" ")[1];
                          d.label = d.label.replace(symbol, "»");
                        }
                      }
                      if (d.active === false)
                        return (
                          <div
                            key={index}
                            data-url={d.url}
                            onClick={() => getTransaction(d.url)}
                            className={` ${d.label.includes("Next") || d.label.includes("Previous") ? "min-w-[100px]" : ""} cursor-pointer rounded-md bg-gray-100 px-3 py-2 text-center hover:bg-gray-200`}
                          >
                            {d.label}
                          </div>
                        );
                      else
                        return (
                          <div
                            key={index}
                            data-url={d.url}
                            onClick={() => getTransaction(d.url)}
                            className="cursor-pointer rounded-md bg-gray-200 px-3 py-2 hover:bg-gray-200"
                          >
                            {d.label}
                          </div>
                        );
                    }
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </>
  );
}
