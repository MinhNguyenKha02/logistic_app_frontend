import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { authApi, endpoints } from "../helper/Apis.js";
import { useNavigate } from "react-router-dom";
import { echo } from "../helper/echo.js";
import { toast, ToastContainer } from "react-toastify";
import { Notification } from "./Notification.jsx";

export default function Sidebar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);
  const [user, setUser] = React.useState({});
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = Cookies.get("token");
      const response = await authApi(token).get(endpoints["current-user"]);
      setUser(response.data);
    };
    fetchCurrentUser();
  }, []);

  const logOut = async (e) => {
    e.preventDefault();
    const token = Cookies.get("token");

    async function updateStatus(data) {
      if (!data) return;
      const response = await authApi(token).post(
        endpoints["update-status"],
        data,
      );
    }

    await updateStatus({
      user_id: user ? user.id : "",
      is_active: false,
    });

    const response = await authApi(token).post(endpoints["logout"]);
    if (response.status === 200 || response.status === 204) {
      navigate("/login");
    }
  };

  const [openAvatar, setOpenAvatar] = useState(false);
  const [openNotification, setOpenNotification] = useState(false);
  useEffect(() => {
    const token = Cookies.get("token");
    user &&
      echo(token)
        .private(`notification.${user.id}`)
        .notification((notification) => toast.info(notification["message"]));
  }, []);
  const [data, setData] = useState([]);
  const fetchNotificationByUserId = async () => {
    const token = Cookies.get("token");
    const response = await authApi(token).get(
      endpoints["get-notifications-by-current-user"],
    );
    if (response.status === 200) {
      setData(response.data.notifications);
    }
  };
  useEffect(() => {
    fetchNotificationByUserId();
  }, []);
  return (
    <div className="bg-white">
      <ToastContainer position="top-right" />
      <div className="flex items-center gap-2">
        <button
          data-drawer-target="default-sidebar"
          data-drawer-toggle="default-sidebar"
          aria-controls="logo-sidebar"
          type="button"
          className="ms-3 mt-2 inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 sm:hidden"
        >
          <span className="sr-only">Open sidebar</span>
          <svg
            className="h-6 w-6"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clipRule="evenodd"
              fillRule="evenodd"
              d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
            ></path>
          </svg>
        </button>
        <section>
          <div className="relative">
            <section
              onClick={() => setOpenAvatar(!openAvatar)}
              className="flex items-center gap-2"
            >
              <img
                className="size-8 rounded-full object-cover"
                src="https://plus.unsplash.com/premium_photo-1690086519096-0594592709d3?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Jese image"
              />
              {user.name}
            </section>
            {openAvatar && (
              <section className="border-black-500 absolute bottom-[-50px] left-0 border bg-white bg-opacity-50 px-4 py-2 text-center text-black">
                <button onClick={logOut}>Logout</button>
              </section>
            )}
          </div>
        </section>
      </div>
      <aside
        id="default-sidebar"
        className="z-2 fixed left-0 top-0 h-screen w-64 -translate-x-full overflow-y-auto bg-white transition-transform sm:translate-x-0"
        aria-label="Sidenav"
      >
        {openNotification && (
          <section className="z-5 absolute left-0 top-[50px] bg-white">
            {user?.id && <Notification userId={user?.id} />}
          </section>
        )}
        <div className="h-full overflow-y-auto px-3 py-4 dark:bg-gray-800">
          <section className="mb-5 flex gap-4">
            <button
              onClick={() => setOpenNotification(!openNotification)}
              type="button"
              className="relative inline-flex items-center rounded-lg bg-white p-2 text-center text-sm font-medium text-black"
            >
              <svg
                className="size-7 text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17.133 12.632v-1.8a5.406 5.406 0 0 0-4.154-5.262.955.955 0 0 0 .021-.106V3.1a1 1 0 0 0-2 0v2.364a.955.955 0 0 0 .021.106 5.406 5.406 0 0 0-4.154 5.262v1.8C6.867 15.018 5 15.614 5 16.807 5 17.4 5 18 5.538 18h12.924C19 18 19 17.4 19 16.807c0-1.193-1.867-1.789-1.867-4.175ZM8.823 19a3.453 3.453 0 0 0 6.354 0H8.823Z" />
              </svg>
              <span className="sr-only">Notifications</span>
              <div className="absolute -end-2 -top-2 inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-red-500 text-xs font-bold text-white dark:border-gray-900">
                {data.length}
              </div>
            </button>
            <a
              href="https://flowbite.com/"
              className="flex items-center ps-2.5"
            >
              <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
                Flowbite
              </span>
            </a>
          </section>
          <ul
            className={`relative ${openNotification ? "z-[-1]" : "z-[0]"} space-y-2 bg-white font-medium`}
          >
            <li
              onClick={() => setIsOpen(!isOpen)}
              className="relative z-0 flex cursor-pointer items-center justify-between rounded-lg bg-white p-2"
            >
              <section className="flex items-center gap-3">
                <img
                  className="size-10 rounded-full object-cover"
                  src="https://plus.unsplash.com/premium_photo-1689551670902-19b441a6afde?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Rounded avatar"
                />
                <section>
                  <h4 className="text-lg">{user.name || "Empty"} </h4>
                  <p className="text-sm font-normal">{user.role || "Empty"}</p>
                </section>
              </section>
              <div>
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
                    d="m19 9-7 7-7-7"
                  />
                </svg>
              </div>
              {isOpen && (
                <ul className="absolute left-0 right-0 top-full mt-1 w-full rounded-sm bg-white p-2 pl-0 shadow-lg">
                  <li className="mb-1">
                    <a
                      href=""
                      className="flex gap-3 px-2 py-1 hover:bg-gray-100"
                    >
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
                          strokeWidth="2"
                          d="M7 17v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3Zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                      </svg>
                      Profile
                    </a>
                  </li>
                  <li className="mb-1">
                    <a
                      onClick={logOut}
                      href=""
                      className="flex gap-3 px-2 py-1 hover:bg-gray-100"
                    >
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
                          d="M20 12H8m12 0-4 4m4-4-4-4M9 4H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h2"
                        />
                      </svg>
                      Logout
                    </a>
                  </li>
                </ul>
              )}
            </li>

            {user.role === "employee" && (
              <>
                <li>
                  <a
                    href="/transactions"
                    className="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                  >
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
                        d="M12 5.365V3m0 2.365a5.338 5.338 0 0 1 5.133 5.368v1.8c0 2.386 1.867 2.982 1.867 4.175 0 .593 0 1.292-.538 1.292H5.538C5 18 5 17.301 5 16.708c0-1.193 1.867-1.789 1.867-4.175v-1.8A5.338 5.338 0 0 1 12 5.365ZM8.733 18c.094.852.306 1.54.944 2.112a3.48 3.48 0 0 0 4.646 0c.638-.572 1.236-1.26 1.33-2.112h-6.92Z"
                      />
                    </svg>

                    <span className="ms-3 flex-1 whitespace-nowrap">
                      Transactions
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="/inventory"
                    className="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                  >
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
                        d="m3.5 5.5 7.893 6.036a1 1 0 0 0 1.214 0L20.5 5.5M4 19h16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z"
                      />
                    </svg>

                    <span className="ms-3 flex-1 whitespace-nowrap">
                      Inventory
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="/shipments"
                    className="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                  >
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
                        d="M16 19h4a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-2m-2.236-4a3 3 0 1 0 0-4M3 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>

                    <span className="ms-3 flex-1 whitespace-nowrap">
                      Shipments
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="/users"
                    className="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                  >
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
                        d="M16 19h4a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-2m-2.236-4a3 3 0 1 0 0-4M3 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>

                    <span className="ms-3 flex-1 whitespace-nowrap">Users</span>
                  </a>
                </li>
              </>
            )}
            {(user.role === "driver" || user.role === "customer") && (
              <li>
                <a
                  href="/orders"
                  className="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                >
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
                      d="M16 19h4a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-2m-2.236-4a3 3 0 1 0 0-4M3 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>

                  <span className="ms-3 flex-1 whitespace-nowrap">Orders</span>
                </a>
              </li>
            )}
          </ul>
        </div>
      </aside>

      {/*<div className="p-4 sm:ml-64">*/}
      {/*    <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">*/}
      {/*        <div className="grid grid-cols-3 gap-4 mb-4">*/}
      {/*            <div className="flex items-center justify-center h-24 rounded bg-gray-50 dark:bg-gray-800">*/}
      {/*                <p className="text-2xl text-gray-400 dark:text-gray-500">*/}
      {/*                    <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"*/}
      {/*                         fill="none" viewBox="0 0 18 18">*/}
      {/*                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"*/}
      {/*                              strokeWidth="2" d="M9 1v16M1 9h16"/>*/}
      {/*                    </svg>*/}
      {/*                </p>*/}
      {/*            </div>*/}
      {/*            <div className="flex items-center justify-center h-24 rounded bg-gray-50 dark:bg-gray-800">*/}
      {/*                <p className="text-2xl text-gray-400 dark:text-gray-500">*/}
      {/*                    <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"*/}
      {/*                         fill="none" viewBox="0 0 18 18">*/}
      {/*                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"*/}
      {/*                              strokeWidth="2" d="M9 1v16M1 9h16"/>*/}
      {/*                    </svg>*/}
      {/*                </p>*/}
      {/*            </div>*/}
      {/*            <div className="flex items-center justify-center h-24 rounded bg-gray-50 dark:bg-gray-800">*/}
      {/*                <p className="text-2xl text-gray-400 dark:text-gray-500">*/}
      {/*                    <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"*/}
      {/*                         fill="none" viewBox="0 0 18 18">*/}
      {/*                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"*/}
      {/*                              strokeWidth="2" d="M9 1v16M1 9h16"/>*/}
      {/*                    </svg>*/}
      {/*                </p>*/}
      {/*            </div>*/}
      {/*        </div>*/}
      {/*        <div className="flex items-center justify-center h-48 mb-4 rounded bg-gray-50 dark:bg-gray-800">*/}
      {/*            <p className="text-2xl text-gray-400 dark:text-gray-500">*/}
      {/*                <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"*/}
      {/*                     viewBox="0 0 18 18">*/}
      {/*                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"*/}
      {/*                          strokeWidth="2" d="M9 1v16M1 9h16"/>*/}
      {/*                </svg>*/}
      {/*            </p>*/}
      {/*        </div>*/}
      {/*        <div className="grid grid-cols-2 gap-4 mb-4">*/}
      {/*            <div className="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">*/}
      {/*                <p className="text-2xl text-gray-400 dark:text-gray-500">*/}
      {/*                    <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"*/}
      {/*                         fill="none" viewBox="0 0 18 18">*/}
      {/*                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"*/}
      {/*                              strokeWidth="2" d="M9 1v16M1 9h16"/>*/}
      {/*                    </svg>*/}
      {/*                </p>*/}
      {/*            </div>*/}
      {/*            <div className="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">*/}
      {/*                <p className="text-2xl text-gray-400 dark:text-gray-500">*/}
      {/*                    <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"*/}
      {/*                         fill="none" viewBox="0 0 18 18">*/}
      {/*                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"*/}
      {/*                              strokeWidth="2" d="M9 1v16M1 9h16"/>*/}
      {/*                    </svg>*/}
      {/*                </p>*/}
      {/*            </div>*/}
      {/*            <div className="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">*/}
      {/*                <p className="text-2xl text-gray-400 dark:text-gray-500">*/}
      {/*                    <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"*/}
      {/*                         fill="none" viewBox="0 0 18 18">*/}
      {/*                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"*/}
      {/*                              strokeWidth="2" d="M9 1v16M1 9h16"/>*/}
      {/*                    </svg>*/}
      {/*                </p>*/}
      {/*            </div>*/}
      {/*            <div className="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">*/}
      {/*                <p className="text-2xl text-gray-400 dark:text-gray-500">*/}
      {/*                    <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"*/}
      {/*                         fill="none" viewBox="0 0 18 18">*/}
      {/*                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"*/}
      {/*                              strokeWidth="2" d="M9 1v16M1 9h16"/>*/}
      {/*                    </svg>*/}
      {/*                </p>*/}
      {/*            </div>*/}
      {/*        </div>*/}
      {/*        <div className="flex items-center justify-center h-48 mb-4 rounded bg-gray-50 dark:bg-gray-800">*/}
      {/*            <p className="text-2xl text-gray-400 dark:text-gray-500">*/}
      {/*                <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"*/}
      {/*                     viewBox="0 0 18 18">*/}
      {/*                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"*/}
      {/*                          strokeWidth="2" d="M9 1v16M1 9h16"/>*/}
      {/*                </svg>*/}
      {/*            </p>*/}
      {/*        </div>*/}
      {/*        <div className="grid grid-cols-2 gap-4">*/}
      {/*            <div className="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">*/}
      {/*                <p className="text-2xl text-gray-400 dark:text-gray-500">*/}
      {/*                    <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"*/}
      {/*                         fill="none" viewBox="0 0 18 18">*/}
      {/*                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"*/}
      {/*                              strokeWidth="2" d="M9 1v16M1 9h16"/>*/}
      {/*                    </svg>*/}
      {/*                </p>*/}
      {/*            </div>*/}
      {/*            <div className="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">*/}
      {/*                <p className="text-2xl text-gray-400 dark:text-gray-500">*/}
      {/*                    <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">*/}
      {/*                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16"/>*/}
      {/*                    </svg>*/}
      {/*                </p>*/}
      {/*            </div>*/}
      {/*            <div className="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">*/}
      {/*                <p className="text-2xl text-gray-400 dark:text-gray-500">*/}
      {/*                    <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">*/}
      {/*                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16"/>*/}
      {/*                    </svg>*/}
      {/*                </p>*/}
      {/*            </div>*/}
      {/*            <div className="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">*/}
      {/*                <p className="text-2xl text-gray-400 dark:text-gray-500">*/}
      {/*                    <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">*/}
      {/*                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16"/>*/}
      {/*                    </svg>*/}
      {/*                </p>*/}
      {/*            </div>*/}
      {/*        </div>*/}
      {/*    </div>*/}
      {/*</div>*/}
    </div>
  );
}
