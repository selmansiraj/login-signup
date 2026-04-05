import React, { useState } from "react";
import axios from "axios";
import AuthTravelLayout from "../../auth/components/AuthTravelLayout";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  ADMIN_API_BASE_URL,
  getAdminApiErrorMessage,
  storeAdminSession
} from "../../../lib/adminApi";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!username.trim() || !password) {
      setErrorMessage("Enter the admin username and password.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      const response = await axios.post(
        `${ADMIN_API_BASE_URL}/admin_login.php`,
        {
          username: username.trim(),
          password
        },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      if (!response.data?.token || !response.data?.admin) {
        setErrorMessage(response.data?.error || response.data?.message || "Admin login failed.");
        return;
      }

      storeAdminSession({
        token: response.data.token,
        admin: response.data.admin
      });

      window.location.assign("/admin-dashboard");
    } catch (error) {
      setErrorMessage(getAdminApiErrorMessage(error, "Admin login failed."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthTravelLayout
      title={
        <>
          Admin
          <span className="travel-auth-title-accent">control login</span>
        </>
      }
      subtitle="Sign in to manage users, route timings, and ticket reports from the admin console."
      sideKicker="Control room"
      sideTitle="The admin desk keeps the travel system in order"
      sideCopy="A cleaner command view for schedules, confirmations, and route changes with a calm dark interface."
      topRightAction={
        <Button variant="ghost" className="travel-auth-home-button travel-auth-admin-button" onClick={() => window.location.assign("/login")}>
          User login
        </Button>
      }
      footer={
        <p className="travel-auth-switch">
          Need the traveller page?
          <a href="/login">Back to login</a>
        </p>
      }
    >
      {errorMessage ? <div className="travel-auth-alert">{errorMessage}</div> : null}

      <form onSubmit={handleSubmit} className="travel-auth-form">
        <div className="travel-auth-form-field">
          <label htmlFor="admin-username" className="travel-auth-field-label">
            Admin username
          </label>
          <Input
            id="admin-username"
            placeholder="admin"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
            className="travel-auth-input"
          />
        </div>

        <div className="travel-auth-form-field">
          <label htmlFor="admin-password" className="travel-auth-field-label">
            Password
          </label>
          <Input
            id="admin-password"
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            className="travel-auth-input"
          />
        </div>

        <Button type="submit" size="lg" className="travel-auth-submit" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Enter admin desk"}
        </Button>
      </form>
    </AuthTravelLayout>
  );
}
