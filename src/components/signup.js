import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {

  const navigate = useNavigate();

  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [birthdate, setBirthdate] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    const data = {
      fullname,
      username,
      password,
      phone,
      email,
      location,
      birthdate
    };

    try {

      const res = await fetch(
        "http://localhost/php/signup.php",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify(data)
        }
      );

      const result = await res.json();

      if (result.status === "success") {

        alert("Signup Success");

        navigate("/");

      }
      else {

        alert(result.msg);

      }

    }
    catch (error) {

      alert("Fetch Error");

    }

  };

  return (

    <form onSubmit={handleSubmit}>

      <h2>Signup</h2>

      <input
        placeholder="Full Name"
        onChange={(e)=>setFullname(e.target.value)}
        required
      />

      <input
        placeholder="Username"
        onChange={(e)=>setUsername(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e)=>setPassword(e.target.value)}
        required
      />

      <input
        placeholder="Phone"
        onChange={(e)=>setPhone(e.target.value)}
        required
      />

      <input
        placeholder="Email"
        onChange={(e)=>setEmail(e.target.value)}
        required
      />

      <input
        placeholder="Location"
        onChange={(e)=>setLocation(e.target.value)}
        required
      />

      <input
        type="date"
        onChange={(e)=>setBirthdate(e.target.value)}
        required
      />

      <button>
        Signup
      </button>

      <p
        onClick={() => navigate("/")}
      >
        Go to Login
      </p>

    </form>

  );

}