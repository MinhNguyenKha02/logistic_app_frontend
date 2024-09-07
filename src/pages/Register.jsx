import { useReducer, useState } from "react";
import { AuthenticateReducer, initialState } from "../helper/Reducer.ts";
import {useNavigate} from "react-router-dom";

export default function Register() {
  const [state, dispatch] = useReducer(AuthenticateReducer, initialState);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const register = ()=>{
    const user = {
      name:name,
      email: email,
      password: password,
    }
    dispatch({
      type: "register",
      payload:{user:user}
    })
    navigate("/login")
  }

  return(
    <>
      {/*<h1>{state?.user.name}</h1>*/}

      <section
        className="p-8 rounded-md bg-black text-white fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <h1 className="text-2xl mb-4">Register</h1>
        <div className="mb-4">
          <label className="block mb-2" htmlFor="name">Name</label>
          <input type="text" id="name" name="name" className="text-black"
                 onChange={(e) => setName(e.target.value)}
                 placeholder="Enter Email" />
        </div>
        <div className="mb-4">
          <label className="block mb-2" htmlFor="email">Email</label>
          <input type="text" id="email" name="email" className="text-black"
                 onChange={(e) => setEmail(e.target.value)}
                 placeholder="Enter Email" />
        </div>
        <div className="mb-4">
          <label className="block mb-2" htmlFor="password">Password</label>
          <input type="text" id="password" className="text-black" name="password"
                 onChange={(e) => setPassword(e.target.value)}
                 placeholder="Enter Password" />
        </div>
        <div className="mb-4">
          <label className="block mb-2" htmlFor="confirmPassword">Confirm Password</label>
          <input type="text" id="confirmPassword" className="text-black" name="password"
                 onChange={(e) => setPassword(e.target.value)}
                 placeholder="Enter Password" />
        </div>
        <div className="mb-4 mt-8 flex gap-3">
          <button onClick={register} className="bg-orange-500 p-2 rounded-md text-white">Register</button>
          <button className="btn btn-primary bg-white p-2 rounded-md text-black">Cancel</button>
        </div>
      </section>
    </>
  )
}