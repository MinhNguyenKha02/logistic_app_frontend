import React, { useContext, useEffect, useState } from "react";
import { DetailPageContext } from "../helper/Context.js";
import { useNavigate } from "react-router-dom";
import { endpoints, authApi } from "../helper/Apis.js";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import api from "js-cookie";
import { dateFormat, formatDate, isDate } from "../helper/dateFormat.js";

export default function TableUser() {
  const [Data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const { userContext, setUserContext } = useContext(DetailPageContext);
  const navigate = useNavigate();
  const [del, setDel] = React.useState(!userContext.del ? false : true);
  const [detailOpen, setDetailOpen] = React.useState(
    !userContext.detailOpen ? false : true,
  );
  // 'id',
  //   'name',
  //   'email',
  //   'password',
  //   'role'
  const [orderDirectionIdIndex, setOrderDirectionIdIndex] = React.useState(2);
  const [orderDirectionNameIndex, setOrderDirectionNameIndex] =
    React.useState(2);
  const [orderDirectionEmailIndex, setOrderDirectionEmailIndex] =
    React.useState(2);
  const [orderDirectionRoleIndex, setOrderDirectionRoleIndex] =
    React.useState(2);
  const [orderDirectionCreatedIndex, setOrderDirectionCreatedIndex] =
    React.useState(2);
  const [orderDirectionUpdatedIndex, setOrderDirectionUpdatedIndex] =
    React.useState(2);
  const [detailOpens, setDetailOpens] = useState([
    !userContext.detailOpens
      ? Data.data.forEach((d) => (!userContext.detailOpen ? false : true))
      : false,
  ]);

  const [deleteIds, setDeleteIds] = React.useState([]);

  const [all, setAll] = React.useState(!userContext.all ? false : true);
  const [checkBoxOpen, setCheckBoxOpen] = React.useState(
    !userContext.checkBoxOpen ? false : true,
  );

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
    setUserContext((prevState) => ({
      ...prevState,
      del: del,
      checkBoxOpen: checkBoxOpen,
    }));
  };

  const handleDeleteIdsAll = () => {
    console.log(Data);
  };

  const handleDeleteIds = async (e, id) => {
    console.log(deleteIds);
    console.log(id);

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
    console.log(token);
    const response = await authApi(token).get(endpoints["users"]);
    if (response) {
      setData(response.data.users);
      setLoading(false);
      console.log(response.data);
    }
  };
  const handleDeleteAll = async () => {
    // now I am not finish
    console.log(deleteIds);
    const token = Cookies.get("token");
    let done = false;
    for (const id of deleteIds) {
      const index = deleteIds.indexOf(id);
      console.log(endpoints["user-detail"](id));
      console.log(index);
      const response = await authApi(token).delete(
        endpoints["user-detail"](id),
      );
      console.log("response", response);
      if (response.status === 204 && index === deleteIds.length - 1) {
        fetchData();
        toast.success(response.data.message || "Deleted");
        done = true;
      }
    }
    if (done === true) setDeleteIds([]);
  };

  const getUser = async (url) => {
    const token = Cookies.get("token");
    console.log(token);
    const response = await authApi(token).get(url);
    console.log(response.data);
    setData(response.data.users);
  };

  const handleSearch = async (e) => {
    let keyword = e.target.value;
    if (isDate(keyword)) {
      keyword = formatDate(keyword);
    }
    const token = Cookies.get("token");
    console.log(token);
    const response = await authApi(token).get(
      endpoints["search-user"](keyword),
    );
    setData(response.data.users);
  };

  const orderBy = async (type) => {
    const directions = ["desc", "", "asc"];

    console.log(type);
    let direction;
    switch (type) {
      case "id":
        direction = directions[orderDirectionIdIndex];
        break;
      case "name":
        direction = directions[orderDirectionNameIndex];
        break;
      case "email":
        direction = directions[orderDirectionEmailIndex];
        break;
      case "role":
        direction = directions[orderDirectionRoleIndex];
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
      endpoints["order-user"](type, direction),
    );
    setData(response.data.users);
  };

  const deleteItem = async (id) => {
    const token = Cookies.get("token");
    console.log("token", token);
    const response = await authApi(token).delete(endpoints["user-detail"](id));
    console.log("response", response);
    if (response.status === 204) {
      toast.success(response.data.message || "Deleted", {
        onClick: () => {
          setUserContext((prev) => ({ ...prev, updateItem: true }));
        },
        onClose: () => {
          setUserContext((prev) => ({ ...prev, updateItem: true }));
        },
      });
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleWhenAddOrUpdate = () => {
    if (userContext.updateItem === true) {
      fetchData();
      userContext.updateItem = false;
    }
    if (userContext.addItem === true) {
      fetchData();
      userContext.addItem = false;
    }
  };
  handleWhenAddOrUpdate();

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
            User List{""}
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
              <div className="rounded-md border bg-gray-100 p-2">
                {del && (
                  <input
                    type="checkbox"
                    onChange={() => changeMode()}
                    checked
                    name="checkAll"
                    className="size-5 bg-gray-100"
                  />
                )}
                {!del && (
                  <input
                    type="checkbox"
                    onChange={() => changeMode()}
                    name="checkAll"
                    className="size-5 bg-gray-100"
                  />
                )}
              </div>
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
              {!del && userContext.add === false && (
                <button
                  onClick={() => {
                    setUserContext((prevState) => ({
                      ...prevState,
                      add: !userContext.add,
                    }));
                  }}
                  className="rounded-md bg-orange-500 px-4 py-2 text-left text-white lg:text-center"
                >
                  Add
                </button>
              )}
              {del && (
                <button
                  onClick={handleDeleteAll}
                  className="rounded-md bg-red-500 px-4 py-2 text-left text-white lg:text-center"
                >
                  Delete
                </button>
              )}
              {userContext.add === true && (
                <button
                  onClick={() => {
                    setUserContext((prevState) => ({
                      ...prevState,
                      add: !userContext.add,
                    }));
                  }}
                  className="rounded-md border border-black px-4 py-2 text-left text-black lg:text-center"
                >
                  Cancel
                </button>
              )}
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
                      {checkBoxOpen && all === false && (
                        <th className="p-2">
                          <input
                            className="size-5"
                            onChange={() => {
                              setAll(!all);
                              setUserContext((prevState) => ({
                                ...prevState,
                                all: all,
                              }));
                              handleDeleteIdsAll();
                            }}
                            type="checkbox"
                            name="shipmentId"
                            id="shipmentId"
                          />
                        </th>
                      )}
                      {checkBoxOpen && all === true && (
                        <th className="p-2">
                          <input
                            className="size-5"
                            onChange={() => {
                              setAll(!all);
                              setUserContext((prevState) => ({
                                ...prevState,
                                all: all,
                              }));
                            }}
                            type="checkbox"
                            name="shipmentId"
                            checked
                            id="shipmentId"
                          />
                        </th>
                      )}
                      {!checkBoxOpen && <th className="p-2"></th>}
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
                        <span>User Id&nbsp;</span>
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
                          orderBy("name");
                          setOrderDirectionNameIndex(
                            orderDirectionNameIndex === 2
                              ? 0
                              : orderDirectionNameIndex + 1,
                          );
                        }}
                        className="p-2"
                      >
                        <span>Name&nbsp;</span>
                        {orderDirectionNameIndex === 0 && (
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
                        {orderDirectionNameIndex === 1 && (
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
                        {orderDirectionNameIndex === 2 && (
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
                          orderBy("email");
                          setOrderDirectionEmailIndex(
                            orderDirectionEmailIndex === 2
                              ? 0
                              : orderDirectionEmailIndex + 1,
                          );
                        }}
                        className="p-2"
                      >
                        Email&nbsp;
                        {orderDirectionEmailIndex === 0 && (
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
                        {orderDirectionEmailIndex === 1 && (
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
                        {orderDirectionEmailIndex === 2 && (
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
                          orderBy("role");
                          setOrderDirectionRoleIndex(
                            orderDirectionRoleIndex === 2
                              ? 0
                              : orderDirectionRoleIndex + 1,
                          );
                        }}
                        className="p-2"
                      >
                        Role&nbsp;
                        {orderDirectionRoleIndex === 0 && (
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
                        {orderDirectionRoleIndex === 1 && (
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
                        {orderDirectionRoleIndex === 2 && (
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
                      <th className="p-2"></th>
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
                            {checkBoxOpen && (
                              <td className="p-2">
                                {!all && (
                                  <input
                                    className="checkbox size-5"
                                    onChange={(e) => {
                                      handleDeleteIds(e, d.id);
                                    }}
                                    type="checkbox"
                                    name="shipmentId"
                                    id="shipmentId"
                                  />
                                )}
                                {all && (
                                  <input
                                    className="checkbox size-5"
                                    onChange={(e) => {
                                      handleDeleteIds(e, d.id);
                                    }}
                                    type="checkbox"
                                    name="shipmentId"
                                    id="shipmentId"
                                    checked="true"
                                  />
                                )}
                              </td>
                            )}
                            {!checkBoxOpen && <td className="p-2"></td>}
                            <td className="p-2">{d.id}</td>
                            <td className="p-2">{d.name}</td>
                            <td className="p-2">{d.email}</td>
                            <td className="p-2">{d.role}</td>
                            <td className="p-2">{dateFormat(d.created_at)}</td>
                            <td className="p-2">{dateFormat(d.updated_at)}</td>
                            <td>
                              <div
                                onClick={() => {
                                  let newDetailOpens = [...detailOpens];
                                  newDetailOpens[index] =
                                    !newDetailOpens[index];
                                  setDetailOpens(newDetailOpens);
                                  setUserContext((prevState) => ({
                                    ...prevState,
                                    detailOpens: newDetailOpens,
                                  }));
                                }}
                                className="relative cursor-pointer p-2"
                              >
                                <svg
                                  className="size-8 text-gray-800 dark:text-white"
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
                                    d="M6 12h.01m6 0h.01m5.99 0h.01"
                                  />
                                </svg>
                                {detailOpens[index] && (
                                  <section className="top-100 -left-100 absolute right-0 z-20 min-w-[100px] cursor-pointer rounded-md border border-black bg-white py-2 shadow-md">
                                    <p
                                      onClick={() => {
                                        setUserContext((prevState) => ({
                                          ...prevState,
                                          id: d.id,
                                          del: del,
                                          detailOpen: detailOpen,
                                          all: all,
                                          checkBoxOpen: checkBoxOpen,
                                        }));
                                        navigate(`/users/${d.id}`);
                                      }}
                                      className="px-4 py-2 hover:bg-gray-100 hover:text-black"
                                    >
                                      Edit
                                    </p>
                                    <p
                                      onClick={() => deleteItem(d.id)}
                                      className="px-4 py-2 hover:bg-gray-100 hover:text-black"
                                    >
                                      Delete
                                    </p>
                                  </section>
                                )}
                              </div>
                            </td>
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
                            onClick={() => getUser(d.url)}
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
                            onClick={() => getUser(d.url)}
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
