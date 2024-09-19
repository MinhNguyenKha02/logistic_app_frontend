import React, { useContext, useReducer, useState } from "react";
import { AuthenticateReducer, initialState } from "../helper/Reducer.ts";
import { useNavigate } from "react-router-dom";
import { endpoints, standardApi } from "../helper/Apis.js";
import { toast, ToastContainer } from "react-toastify";
import { AuthContext } from "../helper/Context.js";

export default function Register() {
  const {state, dispatch} = useContext(AuthContext);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    const user = {
      name: name,
      email: email,
      password: password,
      password_confirmation: password,
      role: "customer",
    };
    const response = await standardApi().post(endpoints["register"], user);
    dispatch({
      type: "register",
      payload: { message: response.data.message },
    });
    toast.success(response.data.message);

    navigate("/login");
  };

  return (
    <>
      {/*<h1>{state?.user.name}</h1>*/}
      <ToastContainer position="top-right" />

      <section className="fixed left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-md bg-black p-8 text-white">
        <h1 className="mb-4 text-2xl">Register</h1>
        <div className="mb-4">
          <label className="mb-2 block" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="text-black"
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter Email"
          />
        </div>
        <div className="mb-4">
          <label className="mb-2 block" htmlFor="email">
            Email
          </label>
          <input
            type="text"
            id="email"
            name="email"
            className="text-black"
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
          <label className="mb-2 block" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <input
            type="text"
            id="confirmPassword"
            className="text-black"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password"
          />
        </div>
        <div className="mb-4 mt-8 flex gap-3">
          <button
            onClick={register}
            className="rounded-md bg-orange-500 p-2 text-white"
          >
            Register
          </button>
          <button className="btn btn-primary rounded-md bg-white p-2 text-black">
            Cancel
          </button>
        </div>
      </section>
    </>
  );
}
