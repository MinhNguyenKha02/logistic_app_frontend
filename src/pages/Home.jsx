import Cookies from "js-cookie";
export default function Home() {
  return(
      <>
        home page
        <button onClick={() => console.log(Cookies.get())}>Get token</button>
        <button onClick={() => console.log(Cookies.remove("token"))}>Remove token</button>
      </>
    )
}