import React, { useState } from "react";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import {
  Alert,
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  SvgIcon,
  TextField,
  Typography
} from "@mui/material";
import duneImage from "../assets/dune.jpg";
import {
  AUTH_API_BASE_URL,
  getApiErrorMessage,
  storeAuthSession
} from "../lib/authApi";

function EyeIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M12 5C7 5 2.73 8.11 1 12c1.73 3.89 6 7 11 7s9.27-3.11 11-7c-1.73-3.89-6-7-11-7Zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm0-6.5A2.5 2.5 0 1 0 12 14a2.5 2.5 0 0 0 0-5Z" />
    </SvgIcon>
  );
}

function EyeOffIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="m2.1 3.51 18.38 18.38 1.41-1.41-3.12-3.12C20.55 16.19 21.94 14.23 23 12c-1.73-3.89-6-7-11-7-1.55 0-3.04.3-4.41.85L3.51 2.1 2.1 3.51ZM12 8a4 4 0 0 1 4 4c0 .73-.2 1.41-.55 2l-1.52-1.52c.04-.15.07-.31.07-.48A2 2 0 0 0 12 10c-.17 0-.33.03-.48.07l-1.52-1.52A3.96 3.96 0 0 1 12 8Zm-8.78.47A17.6 17.6 0 0 0 1 12c1.73 3.89 6 7 11 7 1.8 0 3.5-.4 5.03-1.1l-2.17-2.17A3.96 3.96 0 0 1 12 17a4 4 0 0 1-4-4c0-1.05.41-2 1.08-2.72L7.46 8.66A9.9 9.9 0 0 0 3.22 8.47Z" />
    </SvgIcon>
  );
}

function GithubIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M12 1.75a10.25 10.25 0 0 0-3.24 19.98c.51.09.69-.22.69-.49v-1.73c-2.8.61-3.39-1.19-3.39-1.19-.46-1.16-1.12-1.47-1.12-1.47-.92-.62.07-.61.07-.61 1.01.07 1.55 1.04 1.55 1.04.9 1.54 2.36 1.1 2.94.84.09-.65.35-1.1.63-1.35-2.23-.25-4.58-1.11-4.58-4.96 0-1.1.39-2 .03-2.71 0 0 .84-.27 2.75 1.03a9.5 9.5 0 0 1 5.01 0c1.91-1.3 2.75-1.03 2.75-1.03-.36.71.03 1.61.03 2.71 0 3.86-2.36 4.7-4.6 4.95.36.31.67.91.67 1.84v2.73c0 .27.18.59.7.49A10.25 10.25 0 0 0 12 1.75Z" />
    </SvgIcon>
  );
}

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const completeGoogleLogin = async (profile) => {
    try {
      setIsSubmitting(true);
      setErrorMessage("");
      const email = profile?.email?.trim().toLowerCase();

      if (!email) {
        setErrorMessage("Google did not return a valid email.");
        return;
      }

      const res = await axios.post(
        `${AUTH_API_BASE_URL}/google_login.php`,
        {
          email,
          fullname: profile?.name || "",
          googleId: profile?.sub || ""
        },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      if (!res.data?.token || !res.data?.user) {
        setErrorMessage(res.data?.error || res.data?.message || "Google login failed.");
        return;
      }

      storeAuthSession({
        token: res.data.token,
        user: res.data.user
      });

      window.location.assign("/dashboard");
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "Google login failed."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const googleLogin = useGoogleLogin({
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
        await completeGoogleLogin(profileResponse.data);
      } catch (error) {
        setErrorMessage("Google login failed.");
        setIsSubmitting(false);
      }
    },
    onError: () => {
      setErrorMessage("Google login failed.");
    }
  });

  const handleLogin = async (event) => {
    event.preventDefault();

    const normalizedIdentifier = identifier.trim();

    if (!normalizedIdentifier || !password) {
      setErrorMessage("Enter your login ID and password.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      const res = await axios.post(
        `${AUTH_API_BASE_URL}/login.php`,
        { identifier: normalizedIdentifier, password },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      if (!res.data?.token || !res.data?.user) {
        setErrorMessage(res.data?.error || res.data?.message || "Invalid login.") ;
        return;
      }

      storeAuthSession({
        token: res.data.token,
        user: res.data.user
      });

      window.location.assign("/dashboard");
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "Login failed."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box className="page-shell">
      <Container maxWidth="lg">
        <Box className="split-card">
          <Box className="split-form-panel">
            <Stack spacing={3.5}>
              <Box>
                <Typography className="eyebrow"><h1>Welcome back</h1></Typography>
                <Typography variant="body1" className="subtitle">
                  Step into your account and pick up where you left off.
                </Typography>
              </Box>

              {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

              <Stack component="form" spacing={2.5} onSubmit={handleLogin}>
                <Box>
                  <Typography className="field-label">Login ID</Typography><br />
                  <TextField
                    fullWidth
                    placeholder="Full name, username, email, or phone"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    variant="outlined"
                  />
                </Box>

                <Box>
                  <Box className="field-head">
                    <Typography className="field-label">Password</Typography>
                    <Link href="/forgot-password" underline="hover" className="field-link">
                      Forgot password?
                    </Link>
                  </Box>
                  <TextField
                    fullWidth
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    variant="outlined"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            edge="end"
                            onClick={() => setShowPassword((current) => !current)}
                            onMouseDown={(event) => event.preventDefault()}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                          >
                            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  disableElevation
                  disabled={isSubmitting}
                  className="primary-action"
                >
                  {isSubmitting ? "Logging in..." : "Log in"}
                </Button>
              </Stack>

              <Box className="google-section">
                <Typography className="section-divider">OR CONTINUE WITH</Typography>
                <Button
                  type="button"
                  variant="outlined"
                  onClick={() => googleLogin()}
                  className="social-icon-action"
                  aria-label="Sign in with Google"
                >
                  <span className="google-mark">G</span>
                </Button>
                <Button
                  type="button"
                  variant="outlined"
                  onClick={() => window.location.assign(`${AUTH_API_BASE_URL}/github_start.php`)}
                  className="social-icon-action github-action"
                  aria-label="Sign in with GitHub"
                >
                  <span className="github-mark">
                    <GithubIcon sx={{ fontSize: 16 }} />
                  </span>
                </Button>
              </Box>

              <Typography className="switch-copy">
                Don&apos;t have an account?{" "}
                <Link href="/signup" underline="hover" className="switch-link">
                  Sign up
                </Link>
              </Typography>
            </Stack>
          </Box>

          <Box
            className="split-visual-panel"
            sx={{
              backgroundImage: `
                linear-gradient(rgba(42, 53, 126, 0.72), rgba(42, 53, 126, 0.72)),
                url(${duneImage})
              `
            }}
          >
            <Box className="visual-chip">
              <Typography className="visual-chip-text">SS</Typography>
            </Box>
            <Typography variant="h3" className="visual-title">
              Secure Access.
              <br />
              Everywhere.
            </Typography><br />
            <Typography className="visual-copy">
              Built for low-friction access with a calmer, secured interface that still keeps security front and center.
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
