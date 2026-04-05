import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import {
  ADMIN_API_BASE_URL,
  clearAdminSession,
  fetchAdminDashboard,
  getAdminApiErrorMessage,
  getStoredAdmin
} from "../../../lib/adminApi";

function StatCard({ label, value, hint }) {
  return (
    <Card className="admin-stat-card">
      <CardContent className="admin-stat-card-content">
        <span className="admin-stat-label">{label}</span>
        <strong className="admin-stat-value">{value}</strong>
        <span className="admin-stat-hint">{hint}</span>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const [admin] = useState(() => getStoredAdmin());
  const [dashboard, setDashboard] = useState({
    users: [],
    tickets: [],
    routes: [],
    adminActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [savingRouteId, setSavingRouteId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!admin) {
      window.location.assign("/admin-login");
      return;
    }

    let active = true;

    const loadDashboard = async () => {
      try {
        setLoading(true);
        setErrorMessage("");
        const response = await fetchAdminDashboard();

        if (!active) {
          return;
        }

        setDashboard({
          users: response.data?.users || [],
          tickets: response.data?.tickets || [],
          routes: response.data?.routes || [],
          adminActivity: response.data?.adminActivity || []
        });
      } catch (error) {
        if (active) {
          setErrorMessage(getAdminApiErrorMessage(error, "Admin dashboard failed to load."));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      active = false;
    };
  }, [admin]);

  const summary = useMemo(() => {
    const confirmedTickets = dashboard.tickets.filter((ticket) => String(ticket.status || "").toLowerCase().includes("confirm")).length;

    return {
      users: dashboard.users.length,
      tickets: dashboard.tickets.length,
      confirmedTickets,
      routes: dashboard.routes.length
    };
  }, [dashboard]);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${ADMIN_API_BASE_URL}/admin_logout.php`,
        {
          adminId: admin?.id || null
        },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    } catch (error) {
      // Best effort logout, clear session anyway.
    } finally {
      clearAdminSession();
      window.location.assign("/admin-login");
    }
  };

  const handleRouteChange = (routeId, field, value) => {
    setDashboard((current) => ({
      ...current,
      routes: current.routes.map((route) =>
        String(route.id) === String(routeId)
          ? {
              ...route,
              [field]: value
            }
          : route
      )
    }));
  };

  const handleSaveRoute = async (route) => {
    try {
      setSavingRouteId(route.id);
      setErrorMessage("");
      setSuccessMessage("");

      const response = await axios.post(
        `${ADMIN_API_BASE_URL}/admin_route_update.php`,
        route,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      if (!response.data?.route) {
        setErrorMessage(response.data?.error || response.data?.message || "Unable to save route.");
        return;
      }

      setDashboard((current) => ({
        ...current,
        routes: current.routes.map((item) => (String(item.id) === String(response.data.route.id) ? response.data.route : item))
      }));
      setSuccessMessage(response.data?.message || "Route updated.");
    } catch (error) {
      setErrorMessage(getAdminApiErrorMessage(error, "Unable to save route."));
    } finally {
      setSavingRouteId(null);
    }
  };

  const adminName = admin?.username || "Admin";

  return (
    <div className="admin-dashboard-shell">
      <div className="admin-dashboard-orb admin-orb-a" />
      <div className="admin-dashboard-orb admin-orb-b" />
      <div className="admin-dashboard-orb admin-orb-c" />

      <div className="admin-dashboard-inner">
        <header className="admin-dashboard-header">
          <div>
            <span className="admin-dashboard-kicker">Administrator console</span>
            <h1 className="admin-dashboard-title">Welcome back, {adminName}</h1>
            <p className="admin-dashboard-copy">
              Manage tickets, review travellers, and adjust route timing from one focused control room.
            </p>
          </div>

          <Button variant="soft" className="admin-dashboard-logout" onClick={handleLogout}>
            Log out
          </Button>
        </header>

        {(errorMessage || successMessage) ? (
          <div className="admin-dashboard-feedback-row">
            {errorMessage ? <div className="admin-dashboard-feedback is-error">{errorMessage}</div> : null}
            {successMessage ? <div className="admin-dashboard-feedback is-success">{successMessage}</div> : null}
          </div>
        ) : null}

        <section className="admin-dashboard-stats">
          <StatCard label="Registered users" value={summary.users} hint="All traveller accounts" />
          <StatCard label="Ticket reports" value={summary.tickets} hint="Confirmed or saved passes" />
          <StatCard label="Confirmed" value={summary.confirmedTickets} hint="Tickets marked ready" />
          <StatCard label="Routes" value={summary.routes} hint="Editable travel timings" />
        </section>

        <section className="admin-dashboard-grid admin-dashboard-grid--swipe">
          <Card className="admin-panel">
            <CardHeader className="admin-panel-head">
              <div>
                <span className="admin-panel-kicker">Users</span>
                <CardTitle className="admin-panel-title">Traveller accounts</CardTitle>
              </div>
              <CardDescription className="admin-panel-copy">People who registered in the app</CardDescription>
            </CardHeader>

            <CardContent className="admin-panel-body">
              {loading ? (
                <div className="admin-panel-empty">Loading users...</div>
              ) : dashboard.users.length ? (
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Location</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboard.users.map((user) => (
                        <tr key={user.id}>
                          <td>{user.fullname || "-"}</td>
                          <td>@{user.username || "-"}</td>
                          <td>{user.email || "-"}</td>
                          <td>{user.location || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="admin-panel-empty">No users found.</div>
              )}
            </CardContent>
          </Card>

          <Card className="admin-panel">
            <CardHeader className="admin-panel-head">
              <div>
                <span className="admin-panel-kicker">Tickets</span>
                <CardTitle className="admin-panel-title">Ticket reports</CardTitle>
              </div>
              <CardDescription className="admin-panel-copy">Confirmed passes by traveller</CardDescription>
            </CardHeader>

            <CardContent className="admin-panel-body">
              {loading ? (
                <div className="admin-panel-empty">Loading tickets...</div>
              ) : dashboard.tickets.length ? (
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Traveller</th>
                        <th>Email</th>
                        <th>Route</th>
                        <th>Status</th>
                        <th>Issued</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboard.tickets.map((ticket) => (
                        <tr key={ticket.id}>
                          <td>{ticket.traveller || "-"}</td>
                          <td>{ticket.contact_email || "-"}</td>
                          <td>{ticket.route_name || ticket.routeName || "-"}</td>
                          <td>{ticket.status || "-"}</td>
                          <td>{ticket.created_at || ticket.issued_on || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="admin-panel-empty">No ticket reports yet.</div>
              )}
            </CardContent>
          </Card>
        </section>

        <Card className="admin-panel admin-panel--routes">
          <CardHeader className="admin-panel-head">
            <div>
              <span className="admin-panel-kicker">Routes</span>
              <CardTitle className="admin-panel-title">Adjust route timings</CardTitle>
            </div>
            <CardDescription className="admin-panel-copy">Edit flight-style time, date, and status</CardDescription>
          </CardHeader>

          <CardContent className="admin-panel-body">
            {loading ? (
              <div className="admin-panel-empty">Loading routes...</div>
            ) : dashboard.routes.length ? (
              <div className="admin-route-grid">
                {dashboard.routes.map((route) => (
                  <div key={route.id} className="admin-route-card">
                    <div className="admin-route-card-head">
                      <strong>{route.route_name || route.routeName}</strong>
                      <span>{route.region || "-"}</span>
                    </div>

                    <div className="admin-route-fields">
                      <label>
                        <span>Date</span>
                        <Input
                          value={route.departure_date || ""}
                          onChange={(event) => handleRouteChange(route.id, "departure_date", event.target.value)}
                        />
                      </label>
                      <label>
                        <span>Time</span>
                        <Input
                          value={route.departure_time || ""}
                          onChange={(event) => handleRouteChange(route.id, "departure_time", event.target.value)}
                        />
                      </label>
                      <label>
                        <span>Status</span>
                        <Input
                          value={route.status || ""}
                          onChange={(event) => handleRouteChange(route.id, "status", event.target.value)}
                        />
                      </label>
                    </div>

                    <Button
                      className="admin-route-save"
                      onClick={() => handleSaveRoute(route)}
                      disabled={savingRouteId === route.id}
                    >
                      {savingRouteId === route.id ? "Saving..." : "Save route"}
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="admin-panel-empty">No routes found.</div>
            )}
          </CardContent>
        </Card>

        <Card className="admin-panel">
          <CardHeader className="admin-panel-head">
            <div>
              <span className="admin-panel-kicker">Activity</span>
              <CardTitle className="admin-panel-title">Admin in/out records</CardTitle>
            </div>
            <CardDescription className="admin-panel-copy">Automatically logged login and logout events</CardDescription>
          </CardHeader>

          <CardContent className="admin-panel-body">
            {loading ? (
              <div className="admin-panel-empty">Loading activity...</div>
            ) : dashboard.adminActivity.length ? (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Admin</th>
                      <th>Event</th>
                      <th>Date & time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboard.adminActivity.map((event) => (
                      <tr key={event.id}>
                        <td>{event.admin_username || event.username || "-"}</td>
                        <td>{event.action || "-"}</td>
                        <td>{event.logged_at || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="admin-panel-empty">No admin activity yet.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
