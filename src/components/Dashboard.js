import React from "react";
import { useLocation } from "react-router-dom";

export default function Dashboard() {

  const location = useLocation();

  const username =
    location.state?.username || "User";

  return (

    <div>

      <h1>
        Welcome {username}
      </h1>

    </div>

  );

}