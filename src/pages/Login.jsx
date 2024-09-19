import { useContext, useEffect, useState } from "react";
import { endpoints, standardApi } from "../helper/Apis.js";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Echo from "laravel-echo";
import { pusher } from "../helper/pusher.js";
import { echo } from "../helper/echo.js";
import { toast, ToastContainer } from "react-toastify";
import { AuthContext } from "../helper/Context.js";

export default function Login() {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState("");

  const login = async () => {
    const user = {
      email: email,
      password: password,
      remember: remember,
    };
    const response = await standardApi().post(endpoints["login"], user);
    if (response.status === 200) {
      console.log("oke");
      console.log("response", response);
      Cookies.set("token", response.data.token, {
        path: "/",
        secure: true,
        sameSite: "strict",
      });
      const token = Cookies.get("token");
      console.log("token", token);

      const channel2 = echo(token).join("my-channel");
      channel2
        .here((data) => console.log("data", data))
        .joining((data) => console.log(data, "joined"))
        .leaving((data) => console.log(data, "left"))
        .listen(".my-event", (data) => console.log(data));
      navigate("/orders");
    }
  };

  useEffect(() => {
    if (state) {
      toast.success(state.message);
    }
  }, [state]);

  return (
    <>
      <ToastContainer position="top-right" />

      {/*<p>{state.user.name}</p>*/}
      <section className="fixed left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-md bg-black p-8 text-white">
        <h1 className="mb-4 text-2xl">Register</h1>
        <div className="mb-4">
          <label className="mb-2 block" htmlFor="email">
            Email
          </label>
          <input
            type="text"
            id="email"
            className="text-black"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Email"
          />
        </div>
        <div className="mb-4">
          <label className="mb-2 block" htmlFor="password">
            Password
          </label>
          <input
            type="text"
            id="password"
            className="text-black"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password"
          />
        </div>
        <div className="mb-4">
          <input
            type="checkbox"
            id="remember"
            name="rememeber"
            className="mr-2"
          />
          <label htmlFor="remember">Remember me</label>
        </div>
        <div className="mb-4 mt-8 flex gap-3">
          <button
            onClick={login}
            className="rounded-md bg-orange-500 p-2 text-white"
          >
            Log in
          </button>
          <button className="btn btn-primary rounded-md bg-white p-2 text-black">
            Cancel
          </button>
        </div>
      </section>
    </>
  );
}
