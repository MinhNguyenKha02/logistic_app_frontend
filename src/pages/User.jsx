import Sidebar from "../components/Sidebar";
import Table from "../components/Table.jsx";
import React, { useContext, useEffect, useState } from "react";
import { authApi, endpoints } from "../helper/Apis.js";
import Cookies from "js-cookie";
import { DetailPageContext } from "../helper/Context.js";
import { ToastContainer, toast } from "react-toastify";
import TableUser from "../components/TableUser.jsx";
import { echo } from "../helper/echo.js";

export default function UserPage() {
  const { userContext, setUserContext } = useContext(DetailPageContext);
  // "name", "email", "password", "role";
  const [roles, setRoles] = useState([]);

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [role, setRole] = React.useState("");

  const [message, setMessage] = React.useState("");

  const handleSubmit = async () => {
    const data = {
      name: name,
      email: email,
      password: password,
      password_confirmation: password,
      role: role,
    };
    console.log(data);
    const token = Cookies.get("token");
    console.log(token);
    const response = await authApi(token)
      .post(endpoints["users"], data)
      .catch((err) => {
        if (err.response.status === 422) {
          const data = err.response.data.errors;
          console.log(data);
          data.role?.forEach((d) => toast.error(d));
          data.email?.forEach((d) => toast.error(d));
          data.name?.forEach((d) => toast.error(d));
          data.password?.forEach((d) => toast.error(d));
        }
      });
    console.log(response);
    if (response.status === 201) {
      // setMessage(response.data.message)
      // setMessage(response.data.message)

      toast.success(response.data.message, {
        onClick: () => {
          setUserContext((prev) => ({ ...prev, addItem: true }));
        },
        onClose: () => {
          setUserContext((prev) => ({ ...prev, addItem: true }));
        },
      });
    }
  };

  useEffect(() => {
    const fetchRole = async () => {
      const token = Cookies.get("token");
      const response = await authApi(token).get(endpoints["roles"]);
      console.log(response.data.roles);
      setRoles(response.data.roles);
    };
    fetchRole();
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

  return (
    <>
      <ToastContainer position="top-right" />

      <Sidebar />
      <main className="flex h-screen flex-row bg-gray-100 p-4 sm:ml-64">
        <section className="basis-[100%] overflow-x-auto p-4 lg:basis-[60%]">
          <TableUser />
        </section>
        <section className="hidden p-4 lg:block lg:basis-[40%]">
          <section className="relative rounded-lg bg-white">
            {userContext.add && (
              <section className="absolute left-0 right-0 top-0 rounded-md bg-white p-4 px-8 text-black">
                <div className="mb-4 flex justify-between">
                  <div className="text-2xl">Add form</div>
                  <div
                    className="cursor-pointer"
                    onClick={() => {
                      setUserContext((prevState) => ({
                        ...prevState,
                        add: !userContext.add,
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
                    <label htmlFor="email" className="mb-2 block">
                      Email
                    </label>
                    <input
                      id="email"
                      className="w-full rounded-md"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="text"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="name" className="mb-2 block">
                      Name
                    </label>
                    <input
                      id="name"
                      className="w-full rounded-md"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      type="text"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="role" className="mb-2 block">
                      Role
                    </label>
                    <select
                      id="name"
                      className="w-full rounded-md"
                      defaultValue={role}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      {roles.map((wh, index) => {
                        if (index === 0)
                          return (
                            <option selected={true}>Select your option</option>
                          );
                        return (
                          <option value={wh}>
                            {wh.at(0).toUpperCase() + wh.slice(1)}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="password" className="mb-2 block">
                      Password
                    </label>
                    <input
                      id="password"
                      className="w-full rounded-md"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type="password"
                    />
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
                        setUserContext((prevState) => ({
                          ...prevState,
                          add: !userContext.add,
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
