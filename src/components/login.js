import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {

  const navigate = useNavigate();

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    const data = {
      login,
      password
    };

    try {

      const res = await fetch(
        "http://localhost/php/login.php",
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

        navigate(
          "/dashboard",
          {
            state: {
              username: result.username
            }
          }
        );

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

      <h2>Login</h2>

      <input
        placeholder="Username / Phone / Email"
        onChange={(e)=>setLogin(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e)=>setPassword(e.target.value)}
        required
      />

      <button>
        Login
      </button>

      <p
        onClick={() => navigate("/signup")}
      >
        Go to Signup
      </p>

    </form>

  );

}