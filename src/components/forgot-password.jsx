import React, { useState } from "react";
import axios from "axios";
import {
  Alert,
  Box,
  Button,
  Container,
  Link,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import duneImage from "../assets/dune.jpg";
import {
  AUTH_API_BASE_URL,
  getAuthEndpointErrorMessage
} from "../lib/authApi";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setErrorMessage("Enter the email address linked to your account.");
      setSuccessMessage("");
      return;
    }

    if (!emailPattern.test(normalizedEmail)) {
      setErrorMessage("Enter a valid email address.");
      setSuccessMessage("");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");
      setSuccessMessage("");

      const res = await axios.post(
        `${AUTH_API_BASE_URL}/forgot_password.php`,
        { email: normalizedEmail },
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
            "Unable to send the reset link right now."
        );
        setSuccessMessage("");
        return;
      }

      setSuccessMessage(
        res.data?.message ||
          "If the email exists, a reset link has been sent to that address."
      );
      setEmail("");
    } catch (error) {
      setErrorMessage(
        getAuthEndpointErrorMessage(
          error,
          "forgot_password.php",
          "Unable to send the reset link right now."
        )
      );
      setSuccessMessage("");
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
                <Typography className="eyebrow"><h1>Reset password</h1></Typography>
                <Typography variant="body1" className="subtitle">
                  Enter your email and we&apos;ll send you a link to choose a new password.
                </Typography>
              </Box>

              {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}
              {successMessage ? <Alert severity="success">{successMessage}</Alert> : null}

              <Stack component="form" spacing={2.5} onSubmit={handleSubmit}>
                <Box>
                  <Typography className="field-label">Email Address</Typography>
                  <TextField
                    fullWidth
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    variant="outlined"
                  />
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  disableElevation
                  disabled={isSubmitting}
                  className="primary-action"
                >
                  {isSubmitting ? "Sending link..." : "Send reset link"}
                </Button>
              </Stack>

              <Typography className="switch-copy">
                Remembered your password?{" "}
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
                linear-gradient(rgba(17, 111, 123, 0.72), rgba(17, 111, 123, 0.72)),
                url(${duneImage})
              `
            }}
          >
            <Box className="visual-chip">
              <Typography className="visual-chip-text">RP</Typography>
            </Box>
            <Typography variant="h3" className="visual-title">
              Recovery link.
              <br />
              Fresh start.
            </Typography>
            <Typography className="visual-copy">
              The link in your email should open the secure password reset page and let you update your account.
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
