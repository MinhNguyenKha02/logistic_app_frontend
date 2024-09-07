import React from "react";

export default function Sidebar() {
    const [isOpen, setIsOpen] = React.useState(false);
    return (
        <div className="bg-white">

            <button data-drawer-target="logo-sidebar" data-drawer-toggle="logo-sidebar" aria-controls="logo-sidebar"
                    type="button"
                    className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                <span className="sr-only">Open sidebar</span>
                <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
                     xmlns="http://www.w3.org/2000/svg">
                    <path clipRule="evenodd" fillRule="evenodd"
                          d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                </svg>
            </button>

            <aside id="logo-sidebar"
                   className="bg-white fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
                   aria-label="Sidebar">
                <div className="h-full px-3 py-4 overflow-y-auto dark:bg-gray-800">
                    <a href="https://flowbite.com/" className="flex items-center ps-2.5 mb-5">
                        <img src="https://flowbite.com/docs/images/logo.svg" className="h-6 me-3 sm:h-7"
                             alt="Flowbite Logo"/>
                        <span
                            className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Flowbite</span>
                    </a>
                    <ul className="space-y-2 font-medium">
                        <li onClick={() => setIsOpen(!isOpen)}
                            className="flex justify-between items-center relative cursor-pointer hover:bg-gray-100 p-2 rounded-lg">
                            <section className="flex gap-3 items-center">
                                <img className="size-10 rounded-full object-cover"
                                     src="https://plus.unsplash.com/premium_photo-1689551670902-19b441a6afde?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                     alt="Rounded avatar" />
                                <section>
                                    <h4 className="text-lg">User name</h4>
                                    <p className="text-sm font-normal">Role name</p>
                                </section>
                            </section>
                            <div>
                                <svg className="w-6 h-6 text-gray-800 dark:text-white " aria-hidden="true"
                                     xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                     viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                          strokeWidth="2" d="m19 9-7 7-7-7" />
                                </svg>
                            </div>
                            {isOpen &&
                              <ul
                                className="mt-1 absolute p-2 pl-0 left-0 right-0 top-full w-full bg-white shadow-lg rounded-sm">
                                  <li className="mb-1">
                                      <a href="" className="px-2 py-1 hover:bg-gray-100 flex gap-3">
                                          <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                                               xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                               viewBox="0 0 24 24">
                                              <path stroke="currentColor" strokeWidth="2"
                                                    d="M7 17v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3Zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                          </svg>


                                          Profile
                                      </a>
                                  </li>
                                  <li className="mb-1">
                                      <a href=""
                                         className="px-2 py-1 hover:bg-gray-100 flex gap-3">
                                          <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                                               xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                               viewBox="0 0 24 24">
                                              <path stroke="currentColor" strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M20 12H8m12 0-4 4m4-4-4-4M9 4H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h2" />
                                          </svg>
                                          Logout
                                      </a>
                                  </li>
                              </ul>
                            }
                        </li>
                        <li>
                            <a href="#"
                               className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                                     xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                     viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                          strokeWidth="2" d="M10 6.025A7.5 7.5 0 1 0 17.975 14H10V6.025Z" />
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="M13.5 3c-.169 0-.334.014-.5.025V11h7.975c.011-.166.025-.331.025-.5A7.5 7.5 0 0 0 13.5 3Z" />
                                </svg>

                                <span className="ms-3">Dashboard</span>
                            </a>
                        </li>
                        <li>
                            <a href="#"
                               className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                                     xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                     viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="M12 5.365V3m0 2.365a5.338 5.338 0 0 1 5.133 5.368v1.8c0 2.386 1.867 2.982 1.867 4.175 0 .593 0 1.292-.538 1.292H5.538C5 18 5 17.301 5 16.708c0-1.193 1.867-1.789 1.867-4.175v-1.8A5.338 5.338 0 0 1 12 5.365ZM8.733 18c.094.852.306 1.54.944 2.112a3.48 3.48 0 0 0 4.646 0c.638-.572 1.236-1.26 1.33-2.112h-6.92Z" />
                                </svg>

                                <span className="flex-1 ms-3 whitespace-nowrap">Notification</span>
                            </a>
                        </li>
                        <li>
                            <a href="#"
                               className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                                     xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                     viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeWidth="2"
                                          d="m3.5 5.5 7.893 6.036a1 1 0 0 0 1.214 0L20.5 5.5M4 19h16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z" />
                                </svg>

                                <span className="flex-1 ms-3 whitespace-nowrap">Inbox</span>
                                <span
                                  className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">3</span>
                            </a>
                        </li>
                        <li>
                            <a href="#"
                               className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                                     xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                     viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeWidth="2"
                                          d="M16 19h4a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-2m-2.236-4a3 3 0 1 0 0-4M3 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg>

                                <span className="flex-1 ms-3 whitespace-nowrap">Costumer</span>
                            </a>
                        </li>
                        <li>
                            <a href="#"
                               className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                                     xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                     viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeWidth="2"
                                          d="M16 19h4a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-2m-2.236-4a3 3 0 1 0 0-4M3 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg>

                                <span className="flex-1 ms-3 whitespace-nowrap">Users</span>
                            </a>
                        </li>
                        <li>
                            <a href="#"
                               className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                                     xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                     viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeWidth="2"
                                          d="M8 7V6a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-1M3 18v-7a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm8-3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                                </svg>


                                <span className="flex-1 ms-3 whitespace-nowrap">Payment</span>
                            </a>
                        </li>
                        <li>
                            <a href="#"
                               className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                                     xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                     viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                          strokeWidth="2" d="m16 10 3-3m0 0-3-3m3 3H5v3m3 4-3 3m0 0 3 3m-3-3h14v-3" />
                                </svg>

                                <span className="flex-1 ms-3 whitespace-nowrap">Shipments</span>
                            </a>
                        </li>
                        <li>
                            <a href="#"
                               className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                                     xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                     viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="M9 8h6m-6 4h6m-6 4h6M6 3v18l2-2 2 2 2-2 2 2 2-2 2 2V3l-2 2-2-2-2 2-2-2-2 2-2-2Z" />
                                </svg>

                                <span className="flex-1 ms-3 whitespace-nowrap">Transactions</span>
                            </a>
                        </li>
                        <li>
                            <a href="#"
                               className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                                     xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                     viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                          strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>


                                <span className="flex-1 ms-3 whitespace-nowrap">History</span>
                            </a>
                        </li>
                        <li>
                            <a href="#"
                               className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                                     xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                     viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="M9 10V6a3 3 0 0 1 3-3v0a3 3 0 0 1 3 3v4m3-2 .917 11.923A1 1 0 0 1 17.92 21H6.08a1 1 0 0 1-.997-1.077L6 8h12Z" />
                                </svg>


                                <span className="flex-1 ms-3 whitespace-nowrap">Return</span>
                            </a>
                        </li>
                        <li>
                            <a href="#"
                               className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                                     xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                     viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="M18 14v4.833A1.166 1.166 0 0 1 16.833 20H5.167A1.167 1.167 0 0 1 4 18.833V7.167A1.166 1.166 0 0 1 5.167 6h4.618m4.447-2H20v5.768m-7.889 2.121 7.778-7.778" />
                                </svg>


                                <span className="flex-1 ms-3 whitespace-nowrap">Delivery</span>
                            </a>
                        </li>
                        <li>
                            <a href="#"
                               className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                                     xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                     viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinejoin="round" strokeWidth="2"
                                          d="M10 12v1h4v-1m4 7H6a1 1 0 0 1-1-1V9h14v9a1 1 0 0 1-1 1ZM4 5h16a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" />
                                </svg>

                                <span className="flex-1 ms-3 whitespace-nowrap">Inventory</span>
                            </a>
                        </li>
                        <li>
                            <a href="#"
                               className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                                     xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                     viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="m8.032 12 1.984 1.984 4.96-4.96m4.55 5.272.893-.893a1.984 1.984 0 0 0 0-2.806l-.893-.893a1.984 1.984 0 0 1-.581-1.403V7.04a1.984 1.984 0 0 0-1.984-1.984h-1.262a1.983 1.983 0 0 1-1.403-.581l-.893-.893a1.984 1.984 0 0 0-2.806 0l-.893.893a1.984 1.984 0 0 1-1.403.581H7.04A1.984 1.984 0 0 0 5.055 7.04v1.262c0 .527-.209 1.031-.581 1.403l-.893.893a1.984 1.984 0 0 0 0 2.806l.893.893c.372.372.581.876.581 1.403v1.262a1.984 1.984 0 0 0 1.984 1.984h1.262c.527 0 1.031.209 1.403.581l.893.893a1.984 1.984 0 0 0 2.806 0l.893-.893a1.985 1.985 0 0 1 1.403-.581h1.262a1.984 1.984 0 0 0 1.984-1.984V15.7c0-.527.209-1.031.581-1.403Z" />
                                </svg>


                                <span className="flex-1 ms-3 whitespace-nowrap">Vehicle</span>
                            </a>
                        </li>
                        <li>
                            <a href="#"
                               className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                                     xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                     viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="M16 12H4m12 0-4 4m4-4-4-4m3-4h2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-2" />
                                </svg>

                                <span className="flex-1 ms-3 whitespace-nowrap">Sign in</span>
                            </a>
                        </li>
                        <li>
                            <a href="#"
                               className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                                     xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                     viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="M20 12H8m12 0-4 4m4-4-4-4M9 4H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h2" />
                                </svg>
                                <span className="flex-1 ms-3 whitespace-nowrap">Sign out</span>
                            </a>
                        </li>
                        <li>
                            <a href="#">

                            </a>
                        </li>
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
    )
}