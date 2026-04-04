import React, { useMemo, useState } from "react";
import axios from "axios";
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
  getAuthEndpointErrorMessage
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

const strongPasswordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{6,}$/;

export default function ResetPassword() {
  const token = useMemo(
    () => new URLSearchParams(window.location.search).get("token")?.trim() || "",
    []
  );
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!token) {
      setErrorMessage("This reset link is missing a token. Request a new one.");
      setSuccessMessage("");
      return;
    }

    if (!password || !confirmPassword) {
      setErrorMessage("Enter and confirm your new password.");
      setSuccessMessage("");
      return;
    }

    if (!strongPasswordPattern.test(password)) {
      setErrorMessage("Password must include a letter, number, special character, and be at least 6 characters.");
      setSuccessMessage("");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      setSuccessMessage("");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");
      setSuccessMessage("");

      const res = await axios.post(
        `${AUTH_API_BASE_URL}/reset_password.php`,
        { token, password },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      if (!res.data?.success) {
        setErrorMessage(
          res.data?.error ||
            res.data?.message ||
            "Unable to reset the password."
        );
        setSuccessMessage("");
        return;
      }

      setSuccessMessage(
        res.data?.message || "Password updated successfully. You can now log in."
      );
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      setErrorMessage(
        getAuthEndpointErrorMessage(
          error,
          "reset_password.php",
          "Unable to reset the password."
        )
      );
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
                <Typography className="eyebrow"><h1>Choose new password</h1></Typography>
                <Typography variant="body1" className="subtitle">
                  Set a fresh password for your account and head back into the app.
                </Typography>
              </Box>

              {!token ? (
                <Alert severity="warning">
                  This page needs a valid reset token from your email link.
                </Alert>
              ) : null}

              {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}
              {successMessage ? <Alert severity="success">{successMessage}</Alert> : null}

              <Stack component="form" spacing={2.5} onSubmit={handleSubmit}>
                <Box>
                  <Typography className="field-label">New Password</Typography>
                  <TextField
                    fullWidth
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
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

                <Box>
                  <Typography className="field-label">Confirm Password</Typography>
                  <TextField
                    fullWidth
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    variant="outlined"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            edge="end"
                            onClick={() => setShowConfirmPassword((current) => !current)}
                            onMouseDown={(event) => event.preventDefault()}
                            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                          >
                            {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
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
                  disabled={isSubmitting || !token}
                  className="primary-action"
                >
                  {isSubmitting ? "Updating password..." : "Update password"}
                </Button>
              </Stack>

              <Typography className="switch-copy">
                Want to sign in instead?{" "}
                <Link href="/login" underline="hover" className="switch-link">
                  Back to login
                </Link>
              </Typography>
            </Stack>
          </Box>

          <Box
            className="split-visual-panel"
            sx={{
              backgroundImage: `
                linear-gradient(rgba(97, 64, 156, 0.72), rgba(97, 64, 156, 0.72)),
                url(${duneImage})
              `
            }}
          >
            <Box className="visual-chip">
              <Typography className="visual-chip-text">NP</Typography>
            </Box>
            <Typography variant="h3" className="visual-title">
              Verified link.
              <br />
              New password.
            </Typography>
            <Typography className="visual-copy">
              Once the backend validates the token, this form submits the replacement password to your database.
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
