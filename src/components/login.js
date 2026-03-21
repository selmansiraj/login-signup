import React, { useState } from "react";

export default function Login({goToSignup}){
  const [login,setLogin] = useState("");
  const [password,setPassword] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    let res = await fetch("http://localhost/php/login.php",{
      method:"POST",
      body: JSON.stringify({login,password})
    });
    let resp = await res.json();
    if(resp.status==="success") alert("Login Success");
    else alert("Invalid Email, Phone or Username");
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input placeholder="Email / Phone / Username" value={login} onChange={e=>setLogin(e.target.value)} required/>
      <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required/>
      <button>Login</button>
      <p onClick={goToSignup}>Go to Signup</p>
    </form>
  );
}