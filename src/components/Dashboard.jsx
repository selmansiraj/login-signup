import React, { useState } from "react";
import axios from "axios";
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  Stack,
  SvgIcon,
  TextField,
  Typography
} from "@mui/material";
import {
  AUTH_API_BASE_URL,
  clearAuthSession,
  getApiErrorMessage,
  getStoredUser,
  updateStoredUser
} from "../lib/authApi";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const fullnamePattern = /^[A-Za-z][A-Za-z\s.'-]{1,49}$/;
const phonePattern = /^[0-9+]{7,20}$/;

function MailIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M4 6.75h16A1.25 1.25 0 0 1 21.25 8v8A1.25 1.25 0 0 1 20 17.25H4A1.25 1.25 0 0 1 2.75 16V8A1.25 1.25 0 0 1 4 6.75Zm0 1.5v.2l8 5.12 8-5.12v-.2H4Zm16 7.5V10.2l-7.33 4.69a1.25 1.25 0 0 1-1.34 0L4 10.2v5.55h16Z" />
    </SvgIcon>
  );
}

function PhoneIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M7.71 3.75h8.58A1.96 1.96 0 0 1 18.25 5.7v12.6a1.96 1.96 0 0 1-1.96 1.95H7.71a1.96 1.96 0 0 1-1.96-1.95V5.7a1.96 1.96 0 0 1 1.96-1.95Zm0 1.5a.46.46 0 0 0-.46.45v12.6c0 .24.21.45.46.45h8.58c.25 0 .46-.21.46-.45V5.7a.46.46 0 0 0-.46-.45H7.71Zm2.79 11.75h3a.75.75 0 0 1 0 1.5h-3a.75.75 0 0 1 0-1.5Z" />
    </SvgIcon>
  );
}

function PinIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M12 2.75a5.75 5.75 0 0 1 5.75 5.75c0 4.06-4.5 9.72-5.09 10.46a.84.84 0 0 1-1.32 0c-.59-.74-5.09-6.4-5.09-10.46A5.75 5.75 0 0 1 12 2.75Zm0 7.75a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
    </SvgIcon>
  );
}

function CalendarIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M7.25 2.75a.75.75 0 0 1 .75.75V5h8V3.5a.75.75 0 0 1 1.5 0V5h.5A2.25 2.25 0 0 1 20.25 7.25v10.5A2.25 2.25 0 0 1 18 20H6a2.25 2.25 0 0 1-2.25-2.25V7.25A2.25 2.25 0 0 1 6 5h.5V3.5a.75.75 0 0 1 .75-.75Zm11.5 6.5H5.25v8.5c0 .41.34.75.75.75h12c.41 0 .75-.34.75-.75v-8.5ZM6 6.5a.75.75 0 0 0-.75.75v.5h13.5v-.5A.75.75 0 0 0 18 6.5H6Z" />
    </SvgIcon>
  );
}

function UserIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M12 3.25A4.25 4.25 0 1 1 7.75 7.5 4.25 4.25 0 0 1 12 3.25Zm0 10c3.87 0 7 2.04 7 4.56 0 .66-.53 1.19-1.19 1.19H6.19A1.19 1.19 0 0 1 5 17.81c0-2.52 3.13-4.56 7-4.56Z" />
    </SvgIcon>
  );
}

function ShieldIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="m12 2.75 6 2.18v4.81c0 4.11-2.42 7.84-6 9.51-3.58-1.67-6-5.4-6-9.51V4.93l6-2.18Zm-1 10.9 4.4-4.39-1.06-1.06L11 11.53 9.66 10.2 8.6 11.26 11 13.65Z" />
    </SvgIcon>
  );
}

function LogoutArrowIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M13.75 4.75a.75.75 0 0 1 .75-.75h3A1.75 1.75 0 0 1 19.25 5.75v12.5A1.75 1.75 0 0 1 17.5 20h-3a.75.75 0 0 1 0-1.5h3a.25.25 0 0 0 .25-.25V5.75a.25.25 0 0 0-.25-.25h-3a.75.75 0 0 1-.75-.75Zm-1.22 3.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 1 1-1.06-1.06l1.97-1.97H5.5a.75.75 0 0 1 0-1.5h9l-1.97-1.97a.75.75 0 0 1 0-1.06Z" />
    </SvgIcon>
  );
}

function MetricCard({ label, value, tone = "default" }) {
  return (
    <Box className={`metric-card metric-${tone}`}>
      <Typography className="metric-label">{label}</Typography>
      <Typography className="metric-value">{value}</Typography>
    </Box>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <Box className="info-item">
      <Box className="info-icon">{icon}</Box>
      <Box>
        <Typography className="info-label">{label}</Typography>
        <Typography className="info-value">{value || "-"}</Typography>
      </Box>
    </Box>
  );
}

export default function Dashboard() {
  const initialUser = getStoredUser() || {};
  const [user, setUser] = useState(initialUser);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [form, setForm] = useState({
    fullname: initialUser.fullname || "",
    username: initialUser.username || "",
    email: initialUser.email || "",
    phone: initialUser.phone || "",
    location: initialUser.location || "",
    birthdate: initialUser.birthdate || ""
  });

  const syncFormWithUser = (nextUser) => {
    setForm({
      fullname: nextUser.fullname || "",
      username: nextUser.username || "",
      email: nextUser.email || "",
      phone: nextUser.phone || "",
      location: nextUser.location || "",
      birthdate: nextUser.birthdate || ""
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value
    }));
  };

  const handleStartEdit = () => {
    setErrorMessage("");
    setSuccessMessage("");
    syncFormWithUser(user);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    syncFormWithUser(user);
    setErrorMessage("");
    setSuccessMessage("");
    setIsEditing(false);
  };

  const handleSave = async (event) => {
    event.preventDefault();

    const payload = {
      username: (user.username || "").trim(),
      fullname: form.fullname.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim().replace(/\s+/g, ""),
      location: form.location.trim(),
      birthdate: form.birthdate
    };

    if (Object.values(payload).some((value) => !value)) {
      setErrorMessage("Fill in all profile fields before saving.");
      return;
    }

    if (!fullnamePattern.test(payload.fullname)) {
      setErrorMessage("Enter a valid full name.");
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

    try {
      setIsSaving(true);
      setErrorMessage("");
      setSuccessMessage("");

      const res = await axios.post(`${AUTH_API_BASE_URL}/edit.php`, payload, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!res.data?.user) {
        setErrorMessage(res.data?.error || res.data?.message || "Update failed.");
        return;
      }

      setUser(res.data.user);
      updateStoredUser(res.data.user);
      syncFormWithUser(res.data.user);
      setSuccessMessage(res.data?.message || "Profile updated successfully.");
      setIsEditing(false);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "Update failed."));
    } finally {
      setIsSaving(false);
    }
  };

  const logout = () => {
    clearAuthSession();
    window.location.assign("/");
  };

  return (
    <Box className="page-shell dashboard-shell">
      <Container maxWidth="lg">
        <Box className="profile-card dashboard-card">
          <Box className="dashboard-topbar">
            <Box>
              <Typography className="dashboard-kicker">CONTROL PANEL</Typography>
              <Typography className="dashboard-heading">Account Dashboard</Typography>
            </Box>
            <Chip
              icon={<ShieldIcon sx={{ fontSize: 18 }} />}
              label={isEditing ? "Editing Profile" : "Account Secured"}
              className="verified-chip"
            />
          </Box>

          <Box className="profile-banner" />

          <Box className="profile-body">
            <Box className="profile-avatar-card">
              <Typography className="profile-avatar-text">
                {(user?.fullname || user?.username || "U").charAt(0).toUpperCase()}
              </Typography>
            </Box>

            <Box className="profile-header">
              <Box>
                <Typography className="dashboard-overline">PROFILE OVERVIEW</Typography>
                <Typography className="profile-name">
                  {user?.fullname || "User"}
                </Typography>
                <Typography className="profile-username">
                  @{user?.username || "account"}
                </Typography>
              </Box>
            </Box>

            {(errorMessage || successMessage) ? (
              <Stack sx={{ mb: 3 }}>
                {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}
                {successMessage ? <Alert severity="success">{successMessage}</Alert> : null}
              </Stack>
            ) : null}

            <Box className="dashboard-hero-grid">
              <Box className="dashboard-hero-panel">
                <Typography className="hero-title">Professional account hub</Typography>
                <Typography className="hero-copy">
                  Manage your core details, keep your contact information current,
                  and move between view and edit mode without losing context.
                </Typography>
              </Box>

              <Box className="dashboard-metrics">
                <MetricCard
                  label="Profile Status"
                  value={isEditing ? "Editing" : "Complete"}
                  tone="accent"
                />
                <MetricCard
                  label="Primary Contact"
                  value={user?.email ? "Email Ready" : "Missing"}
                />
                <MetricCard
                  label="Location"
                  value={user?.location || "Not Set"}
                />
              </Box>
            </Box>

            <Divider className="dashboard-divider" />

            {isEditing ? (
              <Box component="form" onSubmit={handleSave} className="edit-form">
                <Typography className="section-title">EDIT PROFILE</Typography>
                <Grid container spacing={2.2}>
                  <Grid item xs={12} md={6}>
                    <Typography className="field-label">Full Name</Typography>
                    <TextField fullWidth name="fullname" value={form.fullname} onChange={handleChange} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography className="field-label">Username</Typography>
                    <TextField fullWidth name="username" value={form.username} disabled />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography className="field-label">Email</Typography>
                    <TextField fullWidth name="email" type="email" value={form.email} onChange={handleChange} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography className="field-label">Phone</Typography>
                    <TextField fullWidth name="phone" value={form.phone} onChange={handleChange} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography className="field-label">Location</Typography>
                    <TextField fullWidth name="location" value={form.location} onChange={handleChange} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography className="field-label">Birth Date</Typography>
                    <TextField
                      fullWidth
                      name="birthdate"
                      type="date"
                      value={form.birthdate}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                </Grid>

                <Box className="dashboard-actions">
                  <Button
                    type="submit"
                    variant="contained"
                    disableElevation
                    disabled={isSaving}
                    className="primary-action compact-action"
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={handleCancelEdit}
                    className="logout-button compact-action"
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            ) : (
              <>
                <Box className="profile-grid">
                  <Box className="detail-panel">
                    <Box className="panel-head">
                      <Typography className="section-title">CONTACT INFORMATION</Typography>
                      <Typography className="panel-subtitle">Direct communication channels</Typography>
                    </Box>
                    <Stack spacing={2.5} sx={{ mt: 3 }}>
                      <InfoItem icon={<MailIcon sx={{ fontSize: 19 }} />} label="EMAIL" value={user?.email} />
                      <InfoItem icon={<PhoneIcon sx={{ fontSize: 19 }} />} label="PHONE" value={user?.phone} />
                    </Stack>
                  </Box>

                  <Box className="detail-panel">
                    <Box className="panel-head">
                      <Typography className="section-title">PERSONAL DETAILS</Typography>
                      <Typography className="panel-subtitle">Core account identity data</Typography>
                    </Box>
                    <Stack spacing={2.5} sx={{ mt: 3 }}>
                      <InfoItem icon={<PinIcon sx={{ fontSize: 19 }} />} label="LOCATION" value={user?.location} />
                      <InfoItem icon={<CalendarIcon sx={{ fontSize: 19 }} />} label="BIRTH DATE" value={user?.birthdate} />
                      <InfoItem icon={<UserIcon sx={{ fontSize: 19 }} />} label="USERNAME" value={`@${user?.username || "account"}`} />
                    </Stack>
                  </Box>
                </Box>

                <Box className="dashboard-actions">
                  <Button
                    variant="contained"
                    onClick={handleStartEdit}
                    className="primary-action compact-action"
                  >
                    Edit Profile
                  </Button>

                  <Button
                    variant="outlined"
                    startIcon={<LogoutArrowIcon className="logout-icon" />}
                    onClick={logout}
                    className="logout-button compact-action"
                  >
                    Log Out
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
