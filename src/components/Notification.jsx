import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { authApi, endpoints } from "../helper/Apis.js";
import { dateFormat, timeAgo } from "../helper/dateFormat.js";

export function Notification({ userId }) {
  const [data, setData] = useState([]);
  const fetchNotificationByUserId = async (id) => {
    const token = Cookies.get("token");
    const response = await authApi(token).get(
      endpoints["get-notifications-by-current-user"],
    );
    if (response.status === 200) {
      setData(response.data.notifications);
    }
  };
  useEffect(() => {
    fetchNotificationByUserId(userId);
  }, [userId]);

  const [isRead, setIsRead] = useState(false);

  const markAsRead = async (id) => {
    const token = Cookies.get("token");
    const response = await authApi(token).patch(endpoints["mark-as-read"](id), {
      notification_id: id,
    });
    if (response.status === 200) {
      setIsRead(true);
    }
  };

  return (
    <>
      <section
        className="flex flex-col gap-4"
        onClick={() => fetchNotificationByUserId(userId)}
      >
        <section className="flex flex-col gap-4">
          {data &&
            data.length > 0 &&
            data?.map((item, index) => {
              return (
                <div
                  key={index}
                  id="toast-notification"
                  className="h-fit w-full max-w-xs rounded-lg bg-white p-4 text-gray-900 shadow dark:bg-gray-800 dark:text-gray-300"
                  role="alert"
                >
                  <div className="flex items-center rounded-md px-1 py-4">
                    <div className="font-normal">
                      <div className="text-md mb-2 font-bold">
                        {JSON.parse(item.data).message}
                      </div>
                      <span className="text-xs font-normal">
                        {dateFormat(item.updated_at)} (
                        {timeAgo(item.updated_at)})
                      </span>
                    </div>
                  </div>
                  <div
                    onClick={() => markAsRead(item.id)}
                    className={`w-full rounded-md ${item.read_at ? "bg-orange-600" : "bg-orange-500"} px-4 py-2 text-right text-sm italic text-white`}
                  >
                    {item.read_at ? "Read" : "Mark as read"}
                  </div>
                </div>
              );
            })}
        </section>
      </section>
    </>
  );
}
