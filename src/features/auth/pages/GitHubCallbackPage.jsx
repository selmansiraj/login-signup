import React, { useEffect, useMemo, useState } from "react";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import axios from "axios";
import {
  AUTH_API_BASE_URL,
  getApiErrorMessage,
  storeAuthSession
} from "../../../lib/authApi";

function parseGithubUser(encodedUser) {
  if (!encodedUser) {
    return null;
  }

  try {
    return JSON.parse(window.atob(encodedUser));
  } catch (error) {
    return null;
  }
}

export default function GithubCallback() {
  const searchParams = useMemo(
    () => new URLSearchParams(window.location.search),
    []
  );
  const [message, setMessage] = useState("Finishing GitHub sign in...");
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    const completeSignup = async () => {
      const encodedProfile = searchParams.get("profile")?.trim();
      const rawPendingSignup = sessionStorage.getItem("github_signup_payload");
      let pendingSignup = null;

      if (!encodedProfile || !rawPendingSignup) {
        setMessage("GitHub signup could not be completed.");
        setCanGoBack(true);
        return;
      }

      try {
        pendingSignup = JSON.parse(rawPendingSignup);
      } catch (error) {
        setMessage("GitHub signup could not be completed.");
        setCanGoBack(true);
        return;
      }

      const profile = parseGithubUser(encodedProfile);

      if (!profile?.fullname || !profile?.email) {
        setMessage("GitHub did not return the required profile data.");
        setCanGoBack(true);
        return;
      }

      try {
        const response = await axios.post(
          `${AUTH_API_BASE_URL}/github_signup.php`,
          {
            fullname: profile.fullname,
            email: profile.email,
            githubId: profile.githubId || "",
            ...pendingSignup
          },
          {
            headers: {
              "Content-Type": "application/json"
            }
          }
        );

        if (!response.data?.token || !response.data?.user) {
          setMessage(
            response.data?.error ||
              response.data?.message ||
              "GitHub signup could not be completed."
          );
          setCanGoBack(true);
          return;
        }

        sessionStorage.removeItem("github_signup_payload");
        storeAuthSession({
          token: response.data.token,
          user: response.data.user
        });
        window.location.replace("/dashboard");
      } catch (error) {
        setMessage(getApiErrorMessage(error, "GitHub signup failed."));
        setCanGoBack(true);
      }
    };

    const error = searchParams.get("error")?.trim();
    const token = searchParams.get("token")?.trim();
    const user = parseGithubUser(searchParams.get("user")?.trim());
    const mode = searchParams.get("mode")?.trim();

    if (error) {
      setMessage(error);
      setCanGoBack(true);
      return;
    }

    if (mode === "signup") {
      completeSignup();
      return;
    }

    if (!token || !user) {
      setMessage("GitHub sign in could not be completed.");
      setCanGoBack(true);
      return;
    }

    storeAuthSession({ token, user });
    window.location.replace("/dashboard");
  }, [searchParams]);

  return (
    <Box className="page-shell">
      <Container maxWidth="sm">
        <Box className="split-card auth-feedback-card">
          <Box className="split-form-panel">
            <Stack spacing={2.5} sx={{ width: "100%", textAlign: "center" }}>
              <Typography className="eyebrow">
                <h1>GitHub sign in</h1>
              </Typography>
              <Typography className="subtitle">{message}</Typography>
              {canGoBack ? (
                <Button
                  href={searchParams.get("mode")?.trim() === "signup" ? "/signup" : "/login"}
                  variant="contained"
                  disableElevation
                  className="primary-action"
                >
                  Back
                </Button>
              ) : null}
            </Stack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
