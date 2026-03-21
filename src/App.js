import React, { useState } from "react";
import Login from "./components/login.js";
import Signup from "./components/signup.js";

function App() {
  const [page,setPage] = useState("login");
  return page==="login"
    ? <Login goToSignup={()=>setPage("signup")}/>
    : <Signup goToLogin={()=>setPage("login")}/>;
}

export default App;