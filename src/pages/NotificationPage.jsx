import Sidebar from "../components/Sidebar.jsx";
import { toast, ToastContainer } from "react-toastify";
import React, { useEffect, useState } from "react";
import { Notification } from "../components/Notification.jsx";
import Cookies from "js-cookie";
import { authApi, endpoints } from "../helper/Apis.js";
import { echo } from "../helper/echo.js";

export default function NotificationPage() {
  const [currentUser, setCurrentUser] = useState({});
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = Cookies.get("token");
      const response = await authApi(token).get(endpoints["current-user"]);
      setCurrentUser(response.data);
    };
    fetchCurrentUser();
  }, []);
  useEffect(() => {
    const token = Cookies.get("token");
    currentUser &&
      echo(token)
        .private(`notification.${currentUser.id}`)
        .notification((notification) => toast.info(notification["message"]));
  }, []);
  return (
    <>
      <ToastContainer position="top-right" />

      <Sidebar />
      <main className="flex h-screen flex-row bg-gray-100 p-4 sm:ml-64">
        {currentUser?.id && <Notification userId={currentUser?.id} />}
      </main>
    </>
  );
}
