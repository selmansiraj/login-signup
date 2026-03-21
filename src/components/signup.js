import React, { useState } from "react";

export default function Signup({goToLogin}){
  const [data,setData] = useState({
    fullname:"", username:"", password:"",
    phone:"", email:"", location:"", birthdate:""
  });

  const handleChange = e => setData({...data,[e.target.name]:e.target.value});

  const handleSubmit = async e => {
    e.preventDefault();
    let res = await fetch("http://localhost/php/signup.php",{
      method:"POST",
      body: JSON.stringify(data)
    });
    let resp = await res.json();
    if(resp.status==="success"){ alert("Signup Success"); goToLogin();}
    else alert("Error: "+resp.msg);
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Signup</h2>
      <input name="fullname" placeholder="Full Name" onChange={handleChange} required/>
      <input name="username" placeholder="User Name" onChange={handleChange} required/>
      <input name="password" type="password" placeholder="Password" onChange={handleChange} required/>
      <input name="phone" placeholder="Phone" onChange={handleChange} required/>
      <input name="email" placeholder="Email" onChange={handleChange} required/>
      <input name="location" placeholder="Location" onChange={handleChange} required/>
      <input name="birthdate" type="date" placeholder="Birth Date" onChange={handleChange} required/>
      <button>Signup</button>
      <p onClick={goToLogin}>Go to Login</p>
    </form>
  );
}