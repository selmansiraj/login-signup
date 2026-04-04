import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Edit() {

  const location = useLocation();
  const navigate = useNavigate();

  const user = location.state?.user;

  const [fullname, setFullname] =
    useState(user.fullname);

  const [phone, setPhone] =
    useState(user.phone);

  const [locationUser, setLocationUser] =
    useState(user.location);

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!fullname || !phone || !locationUser) {

      alert("All fields required");
      return;

    }

    try {

      const res = await fetch(
        "http://localhost/php/edit.php",
        {

          method: "POST",

          headers: {
            "Content-Type":
            "application/json"
          },

          body: JSON.stringify({

            username: user.username,
            fullname,
            phone,
            location: locationUser

          })

        }
      );

      const result =
      await res.json();

      if (result.status === "success") {

        alert("Profile Updated");

        // Return to dashboard
        navigate(
          "/dashboard",
          {
           state:{
            user: result.user
           }
          }
        );

      }

    }
    catch (error) {

      alert("Update failed");

    }

  };

  return (

    <div className="form-container">

      <h2>Edit Profile</h2>

      <form onSubmit={handleSubmit}>

        <input
          value={fullname}
          onChange={(e)=>
            setFullname(e.target.value)
          }
        />

        <input
          value={phone}
          onChange={(e)=>
            setPhone(e.target.value)
          }
        />

        <input
          value={locationUser}
          onChange={(e)=>
            setLocationUser(e.target.value)
          }
        />

        <button>
          Update
        </button>

      </form>

    </div>

  );

}

export default Edit;