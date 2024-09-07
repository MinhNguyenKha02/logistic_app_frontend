import { useReducer, useState } from "react";
import { AuthenticateReducer, initialState } from "../helper/Reducer.ts";
import {endpoints, standardApi} from "../helper/Apis.js";
import {useNavigate} from "react-router-dom";
import Cookies from "js-cookie";

export default function Login() {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(AuthenticateReducer, initialState);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    const user = {
      email: email,
      password: password,
    }
    const response = await standardApi().post(endpoints["login"], user);
    console.log(response.data);
    Cookies.set("token", response.data.token, {path:"/",secure:true, sameSite:"strict"});
    navigate("/inventory");
  }

  return(
    <>
      {/*<p>{state.user.name}</p>*/}
      <section className="p-8 rounded-md bg-black text-white fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <h1 className="text-2xl mb-4">Register</h1>
        <div className="mb-4">
          <label className="block mb-2" htmlFor="email">Email</label>
          <input type="text" id="email" className="text-black" name="email" onChange={(e) => setEmail(e.target.value)}
                 placeholder="Enter Email" />
        </div>
        <div className="mb-4">
          <label className="block mb-2" htmlFor="password">Password</label>
          <input type="text" id="password" className="text-black" name="password" onChange={(e) => setPassword(e.target.value)}
                 placeholder="Enter Password" />
        </div>
        <div className="mb-4">
          <input type="checkbox" id="remember" className="mr-2"/>
          <label htmlFor="remember">Remember me</label>
        </div>
        <div className="mb-4 mt-8 flex gap-3">
          <button onClick={login} className="bg-orange-500 p-2 rounded-md text-white">Register</button>
          <button className="btn btn-primary bg-white p-2 rounded-md text-black">Cancel</button>
        </div>
      </section>
    </>
  )
}