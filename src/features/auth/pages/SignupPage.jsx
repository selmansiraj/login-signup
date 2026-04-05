import React, { useState } from "react";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import AuthTravelLayout from "../components/AuthTravelLayout";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  AUTH_API_BASE_URL,
  getApiErrorMessage,
  storeAuthSession
} from "../../../lib/authApi";

const initialForm = {
  fullname: "",
  username: "",
  email: "",
  phone: "",
  location: "",
  birthdate: "",
  password: ""
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernamePattern = /^[A-Za-z0-9_]{3,30}$/;
const fullnamePattern = /^[A-Za-z][A-Za-z\s.'-]{1,49}$/;
const phonePattern = /^[0-9+]{7,20}$/;
const strongPasswordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{6,}$/;

function EyeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M12 5C7 5 2.73 8.11 1 12c1.73 3.89 6 7 11 7s9.27-3.11 11-7c-1.73-3.89-6-7-11-7Zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm0-6.5A2.5 2.5 0 1 0 12 14a2.5 2.5 0 0 0 0-5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function EyeOffIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="m2.1 3.51 18.38 18.38 1.41-1.41-3.12-3.12C20.55 16.19 21.94 14.23 23 12c-1.73-3.89-6-7-11-7-1.55 0-3.04.3-4.41.85L3.51 2.1 2.1 3.51ZM12 8a4 4 0 0 1 4 4c0 .73-.2 1.41-.55 2l-1.52-1.52c.04-.15.07-.31.07-.48A2 2 0 0 0 12 10c-.17 0-.33.03-.48.07l-1.52-1.52A3.96 3.96 0 0 1 12 8Zm-8.78.47A17.6 17.6 0 0 0 1 12c1.73 3.89 6 7 11 7 1.8 0 3.5-.4 5.03-1.1l-2.17-2.17A3.96 3.96 0 0 1 12 17a4 4 0 0 1-4-4c0-1.05.41-2 1.08-2.72L7.46 8.66A9.9 9.9 0 0 0 3.22 8.47Z"
        fill="currentColor"
      />
    </svg>
  );
}

function GithubIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M12 1.75a10.25 10.25 0 0 0-3.24 19.98c.51.09.69-.22.69-.49v-1.73c-2.8.61-3.39-1.19-3.39-1.19-.46-1.16-1.12-1.47-1.12-1.47-.92-.62.07-.61.07-.61 1.01.07 1.55 1.04 1.55 1.04.9 1.54 2.36 1.1 2.94.84.09-.65.35-1.1.63-1.35-2.23-.25-4.58-1.11-4.58-4.96 0-1.1.39-2 .03-2.71 0 0 .84-.27 2.75 1.03a9.5 9.5 0 0 1 5.01 0c1.91-1.3 2.75-1.03 2.75-1.03-.36.71.03 1.61.03 2.71 0 3.86-2.36 4.7-4.6 4.95.36.31.67.91.67 1.84v2.73c0 .27.18.59.7.49A10.25 10.25 0 0 0 12 1.75Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function Signup() {
  const [form, setForm] = useState(initialForm);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const buildGooglePayload = () => ({
    username: form.username.trim(),
    phone: form.phone.trim().replace(/\s+/g, ""),
    location: form.location.trim(),
    birthdate: form.birthdate
  });

  const buildGithubPayload = () => ({
    username: form.username.trim(),
    phone: form.phone.trim().replace(/\s+/g, ""),
    location: form.location.trim(),
    birthdate: form.birthdate
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value
    }));
  };

  const handleSignup = async (event) => {
    event.preventDefault();

    const payload = {
      fullname: form.fullname.trim(),
      username: form.username.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim().replace(/\s+/g, ""),
      location: form.location.trim(),
      birthdate: form.birthdate,
      password: form.password
    };

    if (Object.values(payload).some((value) => !value)) {
      setErrorMessage("Fill in all fields before creating the account.");
      return;
    }

    if (!fullnamePattern.test(payload.fullname)) {
      setErrorMessage("Enter a valid full name.");
      return;
    }

    if (!usernamePattern.test(payload.username)) {
      setErrorMessage("Username must be 3-30 characters and use only letters, numbers, or underscore.");
      return;
    }

    if (!emailPattern.test(payload.email)) {
      setErrorMessage("Enter a valid email address.");
      return;
    }

    if (!phonePattern.test(payload.phone)) {
      setErrorMessage("Enter a valid phone number.");
      return;
    }

    if (!strongPasswordPattern.test(payload.password)) {
      setErrorMessage("Password must include a letter, number, special character, and be at least 6 characters.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      const res = await axios.post(`${AUTH_API_BASE_URL}/signup.php`, payload, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!res.data?.token || !res.data?.user) {
        setErrorMessage(res.data?.error || res.data?.message || "Signup failed.");
        return;
      }

      storeAuthSession({
        token: res.data.token,
        user: res.data.user
      });

      window.location.assign("/dashboard");
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "Signup failed."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const completeGoogleSignup = async (profile) => {
    const partialPayload = buildGooglePayload();

    if (Object.values(partialPayload).some((value) => !value)) {
      setErrorMessage("Fill username, phone, location, and birth date before using Google signup.");
      return;
    }

    if (!usernamePattern.test(partialPayload.username)) {
      setErrorMessage("Username must be 3-30 characters and use only letters, numbers, or underscore.");
      return;
    }

    if (!phonePattern.test(partialPayload.phone)) {
      setErrorMessage("Enter a valid phone number.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");
      const fullname = profile?.name?.trim();
      const email = profile?.email?.trim().toLowerCase();

      if (!fullname || !email) {
        setErrorMessage("Google did not return the required profile data.");
        return;
      }

      const res = await axios.post(
        `${AUTH_API_BASE_URL}/google_signup.php`,
        {
          fullname,
          email,
          googleId: profile?.sub || "",
          ...partialPayload
        },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      if (!res.data?.token || !res.data?.user) {
        setErrorMessage(res.data?.error || res.data?.message || "Google signup failed.");
        return;
      }

      storeAuthSession({
        token: res.data.token,
        user: res.data.user
      });

      window.location.assign("/dashboard");
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "Google signup failed."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const googleSignup = useGoogleLogin({
    scope: "openid profile email",
    onSuccess: async (tokenResponse) => {
      try {
        const profileResponse = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`
            }
          }
        );
        await completeGoogleSignup(profileResponse.data);
      } catch (error) {
        setErrorMessage("Google signup failed.");
        setIsSubmitting(false);
      }
    },
    onError: () => {
      setErrorMessage("Google signup failed.");
    }
  });

  const startGithubSignup = () => {
    const partialPayload = buildGithubPayload();

    if (Object.values(partialPayload).some((value) => !value)) {
      setErrorMessage("Fill username, phone, location, and birth date before using GitHub signup.");
      return;
    }

    if (!usernamePattern.test(partialPayload.username)) {
      setErrorMessage("Username must be 3-30 characters and use only letters, numbers, or underscore.");
      return;
    }

    if (!phonePattern.test(partialPayload.phone)) {
      setErrorMessage("Enter a valid phone number.");
      return;
    }

    sessionStorage.setItem("github_signup_payload", JSON.stringify(partialPayload));
    window.location.assign(`${AUTH_API_BASE_URL}/github_start.php?mode=signup`);
  };

  return (
    <AuthTravelLayout
      title={
        <>
          Sign up for a more
          <span className="travel-auth-title-accent">tourism-led experience</span>
        </>
      }
      subtitle="Create your account and start your route with a calmer travel-style signup."
      sideKicker="New traveller access"
      sideTitle="Create an account inside a moving route story"
      sideCopy="The signup side stays cinematic with landscape changes, floating ticket layers, and a calmer premium rhythm around your details."
      footer={
        <p className="travel-auth-switch">
          Already have an account?
          <a href="/login">Log in</a>
        </p>
      }
    >
      {errorMessage ? <div className="travel-auth-alert">{errorMessage}</div> : null}

      <form onSubmit={handleSignup} className="travel-auth-form">
        <div className="travel-auth-form-grid travel-auth-form-grid--two">
          <div className="travel-auth-form-field">
            <label htmlFor="signup-fullname" className="travel-auth-field-label">
              Full Name
            </label>
            <Input
              id="signup-fullname"
              name="fullname"
              placeholder="John Doe"
              value={form.fullname}
              onChange={handleChange}
              className="travel-auth-input"
              autoComplete="name"
            />
          </div>

          <div className="travel-auth-form-field">
            <label htmlFor="signup-username" className="travel-auth-field-label">
              Username
            </label>
            <Input
              id="signup-username"
              name="username"
              placeholder="johndoe"
              value={form.username}
              onChange={handleChange}
              className="travel-auth-input"
              autoComplete="username"
            />
          </div>

          <div className="travel-auth-form-field">
            <label htmlFor="signup-email" className="travel-auth-field-label">
              Email Address
            </label>
            <Input
              id="signup-email"
              name="email"
              type="email"
              placeholder="name@example.com"
              value={form.email}
              onChange={handleChange}
              className="travel-auth-input"
              autoComplete="email"
            />
          </div>

          <div className="travel-auth-form-field">
            <label htmlFor="signup-phone" className="travel-auth-field-label">
              Phone Number
            </label>
            <Input
              id="signup-phone"
              name="phone"
              placeholder="+123456789"
              value={form.phone}
              onChange={handleChange}
              className="travel-auth-input"
              autoComplete="tel"
            />
          </div>

          <div className="travel-auth-form-field">
            <label htmlFor="signup-location" className="travel-auth-field-label">
              Location
            </label>
            <Input
              id="signup-location"
              name="location"
              placeholder="Auckland, New Zealand"
              value={form.location}
              onChange={handleChange}
              className="travel-auth-input"
              autoComplete="address-level2"
            />
          </div>

          <div className="travel-auth-form-field">
            <label htmlFor="signup-birthdate" className="travel-auth-field-label">
              Birth Date
            </label>
            <Input
              id="signup-birthdate"
              name="birthdate"
              type="date"
              value={form.birthdate}
              onChange={handleChange}
              className="travel-auth-input travel-auth-date"
            />
          </div>
        </div>

        <div className="travel-auth-form-field">
          <label htmlFor="signup-password" className="travel-auth-field-label">
            Password
          </label>
          <div className="travel-auth-password-shell">
            <Input
              id="signup-password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              className="travel-auth-input travel-auth-input-with-toggle"
              autoComplete="new-password"
            />
            <button
              type="button"
              className="travel-auth-password-toggle"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOffIcon className="travel-auth-icon" /> : <EyeIcon className="travel-auth-icon" />}
            </button>
          </div>
        </div>

        <Button type="submit" size="lg" className="travel-auth-submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating your account..." : "Create Account"}
        </Button>
      </form>

      <div className="travel-auth-divider">
        <span>or continue with</span>
      </div>

      <div className="travel-auth-social-grid">
        <Button
          variant="soft"
          className="travel-auth-social"
          onClick={() => googleSignup()}
        >
          <span className="travel-auth-social-mark travel-auth-social-mark-google">G</span>
          Google
        </Button>

        <Button
          variant="soft"
          className="travel-auth-social"
          onClick={startGithubSignup}
        >
          <span className="travel-auth-social-mark travel-auth-social-mark-github">
            <GithubIcon className="travel-auth-social-icon" />
          </span>
          GitHub
        </Button>
      </div>
    </AuthTravelLayout>
  );
}
