import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  ADMIN_API_BASE_URL, clearAdminSession, deleteAdminPlace, fetchAdminDashboard,
  getAdminApiErrorMessage, getStoredAdmin, saveAdminPlace, updateAdminTicket
} from "../../../lib/adminApi";

/* ─── tiny SVG icons ─── */
const Icon = {
  grid: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h7v7H3zm11 0h7v7h-7zM3 14h7v7H3zm11 0h7v7h-7z"/></svg>,
  users: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>,
  ticket: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 10V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v4a2 2 0 0 1 0 4v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 1 0-4z"/></svg>,
  route: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 5.5a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm-7 0a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm3.5 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM7 9h3.5c2.76 0 5 2.24 5 5v.5h1.5c.83 0 1.5.67 1.5 1.5S17.83 17.5 17 17.5H16a4 4 0 0 0-4-4H7V9z"/></svg>,
  pin: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/></svg>,
  logout: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5-5-5zm-14 2H3v12a2 2 0 0 0 2 2h14v-2H5V5h12v2h2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v4z"/></svg>,
  activity: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2.05V4.07a8 8 0 0 1 0 15.86v2.02A10 10 0 0 0 12 2a10 10 0 0 0-1 .05zM11 4.07A8 8 0 0 0 4.07 11H2.05A10 10 0 0 1 11 2.05v2.02zM2.05 13h2.02A8 8 0 0 0 11 19.93v2.02A10 10 0 0 1 2.05 13zM12 8l-1 5h-1l-1-5h3zm0 7a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg>,
  home: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>,
  trash: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>,
  menu: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>,
};

/* ─── Donut Chart ─── */
function DonutChart({ confirmed, total }) {
  const r = 38; const cx = 50; const cy = 50;
  const circ = 2 * Math.PI * r;
  const pct = total > 0 ? confirmed / total : 0;
  const dash = pct * circ;
  return (
    <svg viewBox="0 0 100 100" style={{ width: "100%", maxWidth: 160 }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#10243d" strokeWidth="14"/>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#60a5fa" strokeWidth="14"
        strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={circ * 0.25}
        strokeLinecap="round" style={{ transition: "stroke-dasharray 1s ease" }}/>
      <text x="50" y="46" textAnchor="middle" fill="#60a5fa" fontSize="14" fontWeight="700">{Math.round(pct * 100)}%</text>
      <text x="50" y="60" textAnchor="middle" fill="#93c5fd" fontSize="7">confirmed</text>
    </svg>
  );
}

/* ─── Bar Chart SVG ─── */
function BarChart({ items }) {
  if (!items.length) return <p style={{ color: "#93c5fd", fontSize: 13 }}>No data yet</p>;
  const max = Math.max(...items.map(i => i.value), 1);
  const W = 280; const H = 100; const barW = Math.min(32, (W / items.length) - 8);
  return (
    <svg viewBox={`0 0 ${W} ${H + 24}`} width="100%" style={{ overflow: "visible" }}>
      {items.map((item, i) => {
        const x = (W / items.length) * i + (W / items.length - barW) / 2;
        const bh = Math.max((item.value / max) * H, 4);
        const y = H - bh;
        return (
          <g key={item.label}>
            <rect x={x} y={y} width={barW} height={bh} rx="4"
              fill="url(#barGrad)" style={{ filter: "drop-shadow(0 0 6px #60a5fa55)" }}/>
            <text x={x + barW / 2} y={H + 14} textAnchor="middle" fill="#93c5fd" fontSize="8">
              {item.label.length > 8 ? item.label.slice(0, 8) : item.label}
            </text>
            <text x={x + barW / 2} y={y - 4} textAnchor="middle" fill="#60a5fa" fontSize="9" fontWeight="700">
              {item.value}
            </text>
          </g>
        );
      })}
      <defs>
        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7dd3fc"/>
          <stop offset="100%" stopColor="#2563eb"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ─── Line Chart SVG ─── */
function LineChart({ data, label }) {
  if (!data || data.length < 2) return <p style={{ color: "#93c5fd", fontSize: 13 }}>No data yet</p>;
  const W = 280; const H = 80;
  const max = Math.max(...data.map(d => d.v), 1);
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - (d.v / max) * H;
    return `${x},${y}`;
  }).join(" ");
  const areaBase = `${W},${H} 0,${H}`;
  return (
    <svg viewBox={`0 0 ${W} ${H + 20}`} width="100%" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="lineArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="#60a5fa" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <polygon points={`0,${H - (data[0].v / max) * H} ${pts} ${areaBase}`} fill="url(#lineArea)"/>
      <polyline points={pts} fill="none" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        style={{ filter: "drop-shadow(0 0 4px #60a5fa)" }}/>
      {data.map((d, i) => {
        const x = (i / (data.length - 1)) * W;
        const y = H - (d.v / max) * H;
        return <circle key={i} cx={x} cy={y} r="3.5" fill="#05070c" stroke="#60a5fa" strokeWidth="2"/>;
      })}
      {data.map((d, i) => {
        const x = (i / (data.length - 1)) * W;
        return <text key={i} x={x} y={H + 14} textAnchor="middle" fill="#93c5fd" fontSize="7">{d.l}</text>;
      })}
    </svg>
  );
}

/* ─── Stat Card ─── */
function StatCard({ icon, label, value, hint, accent }) {
  return (
    <div className="adm-stat">
      <div className="adm-stat-icon" style={{ color: accent || "#60a5fa" }}>{icon}</div>
      <div className="adm-stat-body">
        <span className="adm-stat-label">{label}</span>
        <strong className="adm-stat-value">{value}</strong>
        <span className="adm-stat-hint">{hint}</span>
      </div>
    </div>
  );
}

/* ─── Sidebar button ─── */
function SideBtn({ active, icon, label, onClick }) {
  return (
    <button className={`adm-side-btn${active ? " active" : ""}`} onClick={onClick} type="button">
      <span className="adm-side-btn-ico">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

/* ─── Status pill ─── */
function Pill({ status }) {
  const s = String(status || "").toLowerCase();
  const color = s.includes("confirm") || s.includes("ready") ? "#60a5fa"
    : s.includes("cancel") ? "#ff4d6d"
    : s.includes("progress") || s.includes("hold") || s.includes("pending") ? "#f0b429"
    : "#93c5fd";
  return (
    <span style={{ background: color + "22", color, border: `1px solid ${color}44`,
      borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" }}>
      {status || "pending"}
    </span>
  );
}

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════ */
export default function AdminDashboard() {
  const [admin] = useState(() => getStoredAdmin());
  const [dashboard, setDashboard] = useState({ users: [], tickets: [], routes: [], adminActivity: [], places: [] });
  const [loading, setLoading] = useState(true);
  const [savingRouteId, setSavingRouteId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [isSavingPlace, setIsSavingPlace] = useState(false);
  const [placeForm, setPlaceForm] = useState({ title: "", region: "", travel_day: "", travel_time: "", image_file: null, icon: "", description: "" });
  const [navOpen, setNavOpen] = useState(false);
  const [deletingPlaceId, setDeletingPlaceId] = useState(null);
  const [ticketActionId, setTicketActionId] = useState(null);

  useEffect(() => {
    const onResize = () => {
      if (typeof window !== "undefined" && window.innerWidth > 720) setNavOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!admin) { window.location.assign("/admin-login"); return; }
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const res = await fetchAdminDashboard();
        if (!alive) return;
        setDashboard({
          users: res.data?.users || [],
          tickets: res.data?.tickets || [],
          routes: res.data?.routes || [],
          adminActivity: res.data?.adminActivity || [],
          places: res.data?.places || []
        });
      } catch (e) {
        if (alive) setErrorMessage(getAdminApiErrorMessage(e, "Dashboard failed to load."));
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [admin]);

  const stats = useMemo(() => {
    const confirmed = dashboard.tickets.filter(t => String(t.status || "").toLowerCase().includes("confirm")).length;
    return { users: dashboard.users.length, tickets: dashboard.tickets.length, confirmed, routes: dashboard.routes.length, places: dashboard.places.length };
  }, [dashboard]);

  const regionChart = useMemo(() => {
    const m = dashboard.routes.reduce((a, r) => { const k = r.region || "Unknown"; a[k] = (a[k] || 0) + 1; return a; }, {});
    return Object.entries(m).slice(0, 6).map(([label, value]) => ({ label, value }));
  }, [dashboard.routes]);

  const ticketChart = useMemo(() => {
    const m = dashboard.tickets.reduce((a, t) => { const k = String(t.status || "Pending"); a[k] = (a[k] || 0) + 1; return a; }, {});
    return Object.entries(m).slice(0, 5).map(([label, value]) => ({ label, value }));
  }, [dashboard.tickets]);

  const userLineData = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (6 - i));
      return { key: d.toISOString().slice(0, 10), l: d.toLocaleDateString("en", { weekday: "short" }) };
    });
    const counts = days.map(day => ({
      l: day.l,
      v: dashboard.users.filter(u => (u.created_at || u.createdAt || "").startsWith(day.key)).length
    }));
    return counts;
  }, [dashboard.users]);

  const handleLogout = async () => {
    try { await axios.post(`${ADMIN_API_BASE_URL}/admin_logout.php`, { adminId: admin?.id || null }, { headers: { "Content-Type": "application/json" } }); } catch {}
    clearAdminSession(); window.location.assign("/admin-login");
  };

  const handleRouteChange = (id, field, val) => setDashboard(p => ({ ...p, routes: p.routes.map(r => String(r.id) === String(id) ? { ...r, [field]: val } : r) }));

  const handleSaveRoute = async (route) => {
    try {
      setSavingRouteId(route.id); setErrorMessage(""); setSuccessMessage("");
      const res = await axios.post(`${ADMIN_API_BASE_URL}/admin_route_update.php`, route, { headers: { "Content-Type": "application/json" } });
      if (!res.data?.route) { setErrorMessage(res.data?.error || "Unable to save route."); return; }
      setDashboard(p => ({ ...p, routes: p.routes.map(r => String(r.id) === String(res.data.route.id) ? res.data.route : r) }));
      setSuccessMessage("Route updated successfully.");
    } catch (e) { setErrorMessage(getAdminApiErrorMessage(e, "Unable to save route.")); }
    finally { setSavingRouteId(null); }
  };

  const handlePlaceField = (e) => {
    const { name, value, files } = e.target;
    setPlaceForm(p => ({ ...p, [name]: name === "image_file" ? files?.[0] || null : value }));
  };

  const handleSavePlace = async (e) => {
    e.preventDefault();
    if (!placeForm.title.trim() || !placeForm.region.trim() || !placeForm.image_file) {
      setErrorMessage("Fill in all place fields."); return;
    }
    const fd = new FormData();
    Object.entries(placeForm).forEach(([k, v]) => { if (v) fd.append(k, v); });
    try {
      setIsSavingPlace(true); setErrorMessage(""); setSuccessMessage("");
      const res = await saveAdminPlace(fd);
      if (!res.data?.success) { setErrorMessage(res.data?.error || "Unable to save place."); return; }
      setDashboard(p => ({ ...p, places: [res.data.place, ...p.places] }));
      setPlaceForm({ title: "", region: "", travel_day: "", travel_time: "", image_file: null, icon: "", description: "" });
      setSuccessMessage("Place published!");
    } catch (e) { setErrorMessage(getAdminApiErrorMessage(e, "Unable to save place.")); }
    finally { setIsSavingPlace(false); }
  };

  const goTab = (tab) => () => {
    setActiveTab(tab);
    setNavOpen(false);
  };

  const getPlaceOwnerId = (p) => Number(p.created_by_admin_id ?? p.createdByAdminId ?? 0);

  const canDeletePlace = (p) => {
    const oid = getPlaceOwnerId(p);
    return !oid || oid === Number(admin?.id ?? 0);
  };

  const handleTicketDecision = async (ticketId, status) => {
    try {
      setTicketActionId(ticketId);
      setErrorMessage("");
      setSuccessMessage("");
      const res = await updateAdminTicket(ticketId, status);
      if (!res.data?.success || !res.data?.ticket) {
        setErrorMessage(res.data?.error || "Unable to update ticket.");
        return;
      }
      setDashboard(d => ({
        ...d,
        tickets: d.tickets.map(x => String(x.id) === String(ticketId) ? { ...x, ...res.data.ticket } : x)
      }));
      setSuccessMessage(status === "Confirmed" ? "Booking approved." : "Booking cancelled.");
    } catch (e) {
      setErrorMessage(getAdminApiErrorMessage(e, "Unable to update ticket."));
    } finally {
      setTicketActionId(null);
    }
  };

  const handleDeletePlace = async (p) => {
    if (!canDeletePlace(p)) return;
    const ok = window.confirm(`Delete “${p.title}”? It will disappear from the homepage.`);
    if (!ok) return;
    try {
      setDeletingPlaceId(p.id);
      setErrorMessage("");
      setSuccessMessage("");
      const res = await deleteAdminPlace(p.id);
      if (!res.data?.success) {
        setErrorMessage(res.data?.error || "Unable to delete place.");
        return;
      }
      setDashboard(d => ({ ...d, places: d.places.filter(x => String(x.id) !== String(p.id)) }));
      setSuccessMessage("Place removed.");
    } catch (e) {
      setErrorMessage(getAdminApiErrorMessage(e, "Unable to delete place."));
    } finally {
      setDeletingPlaceId(null);
    }
  };

  return (
    <div className={`adm-shell${navOpen ? " adm-shell--nav-open" : ""}`}>
      <style>{`
        :root { --bg:#05070c; --surf:#0b1220; --surf2:#0f1728; --border:#1d3557; --acc:#60a5fa; --acc2:#38bdf8; --text:#eff6ff; --muted:#93c5fd; --danger:#ff4d6d; --warn:#f0b429; }
        *{box-sizing:border-box;margin:0;padding:0}
        .adm-shell{display:flex;min-height:100vh;background:var(--bg);color:var(--text);font-family:'Inter',system-ui,sans-serif;position:relative;overflow-x:hidden;overflow-y:auto;-webkit-overflow-scrolling:touch}
        .adm-shell--nav-open{overflow:hidden;touch-action:none}
        /* BG animation */
        .adm-shell::before{content:'';position:fixed;inset:0;background:radial-gradient(ellipse 80% 60% at 20% 20%,#1d4ed855 0%,transparent 60%),radial-gradient(ellipse 60% 80% at 80% 80%,#60a5fa11 0%,transparent 55%),radial-gradient(ellipse 50% 50% at 50% 50%,#0f172a33 0%,transparent 70%);animation:bgPulse 8s ease-in-out infinite alternate;z-index:0}
        @keyframes bgPulse{0%{opacity:.7}100%{opacity:1}}
        .adm-shell::after{content:'';position:fixed;inset:0;background-image:linear-gradient(var(--border) 1px,transparent 1px),linear-gradient(90deg,var(--border) 1px,transparent 1px);background-size:50px 50px;opacity:.18;z-index:0;pointer-events:none}
        .adm-orb{position:fixed;border-radius:50%;filter:blur(80px);pointer-events:none;z-index:0;animation:orbFloat 12s ease-in-out infinite alternate}
        .adm-orb-a{width:500px;height:500px;background:radial-gradient(circle,#60a5fa22,transparent 70%);top:-150px;left:-150px}
        .adm-orb-b{width:400px;height:400px;background:radial-gradient(circle,#38bdf822,transparent 70%);bottom:-100px;right:-100px;animation-delay:-4s}
        .adm-orb-c{width:300px;height:300px;background:radial-gradient(circle,#60a5fa14,transparent 70%);top:40%;left:50%;animation-delay:-8s}
        @keyframes orbFloat{0%{transform:translate(0,0) scale(1)}100%{transform:translate(30px,20px) scale(1.1)}}
        /* SIDEBAR */
        .adm-sidebar{position:fixed;top:0;left:0;width:240px;height:100vh;background:linear-gradient(180deg,#08111e,#05070c);border-right:1px solid var(--border);display:flex;flex-direction:column;z-index:10;padding:0}
        .adm-sidebar-brand{padding:24px 20px 20px;border-bottom:1px solid var(--border)}
        .adm-sidebar-logo{display:flex;align-items:center;gap:10px}
        .adm-sidebar-logo-dot{width:32px;height:32px;border-radius:8px;background:var(--acc);display:grid;place-items:center;color:var(--bg);font-weight:900;font-size:14px;box-shadow:0 0 20px #60a5fa55}
        .adm-sidebar-logoname{font-size:15px;font-weight:700;color:var(--text);letter-spacing:.5px}
        .adm-sidebar-logosub{font-size:10px;color:var(--muted);margin-top:1px}
        .adm-sidebar-nav{flex:1;padding:16px 12px;display:flex;flex-direction:column;gap:4px}
        .adm-side-btn{display:flex;align-items:center;gap:10px;padding:10px 12px;border:none;background:transparent;color:var(--muted);border-radius:10px;cursor:pointer;font-size:13px;font-weight:500;width:100%;text-align:left;transition:all .2s}
        .adm-side-btn:hover{background:var(--surf);color:var(--text)}
        .adm-side-btn.active{background:linear-gradient(135deg,#10233f,#0b1630);color:var(--acc);border:1px solid #60a5fa22;box-shadow:0 0 12px #60a5fa11}
        .adm-side-btn-ico{width:20px;height:20px;display:flex;align-items:center;justify-content:center}
        .adm-side-btn-ico svg{width:18px;height:18px}
        .adm-sidebar-admin{padding:16px;border-top:1px solid var(--border)}
        .adm-admin-info{display:flex;align-items:center;gap:10px;margin-bottom:12px}
        .adm-admin-avatar{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,var(--acc),var(--acc2));display:grid;place-items:center;color:var(--bg);font-weight:700;font-size:14px;flex-shrink:0;box-shadow:0 0 12px #60a5fa44}
        .adm-admin-name{font-size:13px;font-weight:600;color:var(--text)}
        .adm-admin-role{font-size:10px;color:var(--muted)}
        .adm-logout-btn{display:flex;align-items:center;gap:8px;width:100%;padding:9px 12px;background:#1a0a0e;border:1px solid #ff4d6d33;color:#ff4d6d;border-radius:10px;cursor:pointer;font-size:13px;font-weight:500;transition:all .2s}
        .adm-logout-btn:hover{background:#ff4d6d22;border-color:#ff4d6d66}
        .adm-logout-btn svg{width:16px;height:16px}
        /* MAIN */
        .adm-sidebar-backdrop{display:none}
        .adm-menu-toggle{display:none;align-items:center;justify-content:center;gap:8px;flex-shrink:0;width:44px;height:44px;padding:0;border:1px solid var(--border);border-radius:12px;background:linear-gradient(135deg,var(--surf),var(--surf2));color:var(--acc);cursor:pointer;transition:background .2s,border-color .2s;z-index:1}
        .adm-menu-toggle:hover{border-color:#60a5fa44;background:#0b1220}
        .adm-menu-toggle svg{width:22px;height:22px}
        .adm-topbar{display:flex;align-items:flex-start;gap:14px;margin-bottom:20px}
        .adm-header-wrap{flex:1;min-width:0}
        .adm-main{margin-left:240px;flex:1;padding:28px 32px;position:relative;z-index:1;min-height:100vh;min-width:0;width:100%}
        .adm-header{margin-bottom:0}
        .adm-header-kicker{font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:var(--muted)}
        .adm-header-title{font-size:clamp(1.15rem,4vw,1.625rem);font-weight:800;color:var(--text);margin-top:4px;line-height:1.2;background:linear-gradient(135deg,#fff,var(--acc));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
        .adm-feedback{padding:12px 16px;border-radius:10px;font-size:13px;margin-bottom:16px}
        .adm-feedback.err{background:#ff4d6d18;border:1px solid #ff4d6d44;color:#ff4d6d}
        .adm-feedback.ok{background:#60a5fa18;border:1px solid #60a5fa44;color:var(--acc)}
        /* STATS */
        .adm-stats{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,152px),1fr));gap:12px;margin-bottom:24px}
        @media(min-width:480px){.adm-stats{gap:16px;margin-bottom:28px;grid-template-columns:repeat(auto-fill,minmax(168px,1fr))}}
        .adm-stat{background:linear-gradient(135deg,var(--surf),var(--surf2));border:1px solid var(--border);border-radius:16px;padding:20px;display:flex;align-items:center;gap:16px;transition:all .3s;position:relative;overflow:hidden}
        .adm-stat::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--acc),transparent)}
        .adm-stat:hover{border-color:#60a5fa44;transform:translateY(-2px);box-shadow:0 8px 30px #60a5fa14}
        .adm-stat-icon{width:44px;height:44px;border-radius:12px;background:#60a5fa15;display:grid;place-items:center;flex-shrink:0;box-shadow:0 0 16px #60a5fa22}
        .adm-stat-icon svg{width:22px;height:22px}
        .adm-stat-label{font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:1px;display:block}
        .adm-stat-value{font-size:28px;font-weight:800;color:var(--text);display:block;line-height:1.1}
        .adm-stat-hint{font-size:11px;color:var(--muted);display:block;margin-top:2px}
        /* PANELS */
        .adm-panel{background:linear-gradient(135deg,var(--surf),var(--surf2));border:1px solid var(--border);border-radius:16px;overflow:hidden;margin-bottom:20px}
        .adm-panel-head{padding:20px 24px 0;border-bottom:1px solid var(--border);padding-bottom:16px;margin-bottom:0}
        .adm-panel-kicker{font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--muted)}
        .adm-panel-title{font-size:16px;font-weight:700;color:var(--text);margin-top:4px}
        .adm-panel-desc{font-size:12px;color:var(--muted);margin-top:4px}
        .adm-panel-body{padding:20px 24px}
        /* GRID layouts */
        .adm-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px;min-width:0}
        .adm-grid-3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;min-width:0}
        .adm-chart-row{display:flex;flex-wrap:wrap;align-items:center;gap:20px;min-width:0}
        .adm-chart-row .adm-donut-wrap{flex-shrink:0}
        .adm-chart-legend{flex:1;min-width:140px}
        /* TABLE */
        .adm-table-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch;max-width:100%}
        .adm-table{width:100%;border-collapse:collapse;font-size:13px}
        .adm-table th{text-align:left;padding:10px 14px;font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--muted);border-bottom:1px solid var(--border)}
        .adm-table td{padding:12px 14px;border-bottom:1px solid #0d200d;color:var(--text);vertical-align:middle}
        .adm-table tbody tr:hover{background:#60a5fa0a}
        .adm-table tbody tr:last-child td{border-bottom:none}
        /* ROUTES editor */
        .adm-route-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,240px),1fr));gap:14px}
        .adm-route-card{background:#0b1220;border:1px solid var(--border);border-radius:12px;padding:16px}
        .adm-route-card h4{font-size:13px;font-weight:700;color:var(--text);margin-bottom:4px}
        .adm-route-card p{font-size:11px;color:var(--muted);margin-bottom:12px}
        .adm-route-fields{display:grid;gap:8px;margin-bottom:12px}
        .adm-route-field label{font-size:10px;color:var(--muted);display:block;margin-bottom:4px;font-weight:600;letter-spacing:1px;text-transform:uppercase}
        .adm-route-field input{width:100%;background:#050a05;border:1px solid var(--border);border-radius:8px;padding:8px 10px;color:var(--text);font-size:12px;outline:none;transition:border .2s}
        .adm-route-field input:focus{border-color:var(--acc)}
        .adm-save-btn{background:linear-gradient(135deg,var(--acc),var(--acc2));color:#050a05;border:none;border-radius:8px;padding:9px 16px;font-size:12px;font-weight:700;cursor:pointer;width:100%;transition:all .2s}
        .adm-save-btn:hover{opacity:.9;box-shadow:0 4px 16px #60a5fa44}
        .adm-save-btn:disabled{opacity:.5;cursor:not-allowed}
        /* PLACES form */
        .adm-place-form-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-bottom:16px}
        .adm-place-label{display:flex;flex-direction:column;gap:4px}
        .adm-place-label span{font-size:10px;color:var(--muted);font-weight:700;text-transform:uppercase;letter-spacing:1px}
        .adm-place-label input{background:#050a05;border:1px solid var(--border);border-radius:8px;padding:9px 12px;color:var(--text);font-size:13px;outline:none;transition:border .2s}
        .adm-place-label input:focus{border-color:var(--acc)}
        .adm-place-span{grid-column:1/-1}
        .adm-place-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px}
        .adm-place-card{background:#0b1220;border:1px solid var(--border);border-radius:12px;overflow:hidden}
        .adm-place-card-img{height:100px;background:#10243d center/cover;display:flex;align-items:flex-start;padding:8px;position:relative}
        .adm-place-card-icon{background:#60a5fa22;border:1px solid #60a5fa44;border-radius:6px;padding:3px 8px;font-size:12px;color:var(--acc)}
        .adm-place-card-body{padding:12px;display:flex;flex-direction:column;gap:6px;min-height:0}
        .adm-place-card-body strong{font-size:13px;color:var(--text);display:block}
        .adm-place-card-body span{font-size:11px;color:var(--muted)}
        .adm-place-card-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:auto;padding-top:8px}
        .adm-place-delete{display:inline-flex;align-items:center;gap:6px;padding:8px 12px;border-radius:8px;border:1px solid #ff4d6d44;background:#1a0a0e;color:var(--danger);font-size:11px;font-weight:700;cursor:pointer;transition:background .2s,border-color .2s}
        .adm-place-delete:hover{background:#ff4d6d22;border-color:#ff4d6d66}
        .adm-place-delete:disabled{opacity:.5;cursor:not-allowed}
        .adm-place-delete svg{width:14px;height:14px}
        /* STATUS pipeline */
        .adm-pipeline{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
        .adm-pipe-card{background:#0b1220;border:1px solid var(--border);border-radius:12px;padding:16px;text-align:center;position:relative;overflow:hidden}
        .adm-pipe-card::before{content:'';position:absolute;bottom:0;left:0;right:0;height:3px}
        .adm-pipe-card.intake::before{background:var(--muted)}
        .adm-pipe-card.review::before{background:var(--warn)}
        .adm-pipe-card.scheduled::before{background:#6ea8fe}
        .adm-pipe-card.published::before{background:var(--acc)}
        .adm-pipe-label{font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:var(--muted);font-weight:700}
        .adm-pipe-value{font-size:32px;font-weight:800;color:var(--text);display:block;margin:8px 0 4px}
        .adm-pipe-copy{font-size:11px;color:var(--muted);line-height:1.4}
        /* activity pulse */
        .adm-pulse-dot{width:8px;height:8px;border-radius:50%;background:var(--acc);display:inline-block;margin-right:8px;box-shadow:0 0 6px var(--acc);animation:pulse 2s ease-in-out infinite}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.8)}}
        .adm-empty{color:var(--muted);font-size:13px;padding:24px;text-align:center}
        @media(max-width:1100px) and (min-width:721px){
          .adm-sidebar{width:72px}
          .adm-sidebar-brand{padding:18px 10px 14px}
          .adm-sidebar-logo{justify-content:center}
          .adm-sidebar-logo>div:last-child{display:none}
          .adm-sidebar-nav{padding:12px 8px}
          .adm-side-btn{justify-content:center;padding:12px 10px;min-height:44px}
          .adm-side-btn>span:last-child{display:none}
          .adm-side-btn-ico{width:22px;height:22px}
          .adm-admin-info{justify-content:center;margin-bottom:10px}
          .adm-admin-info>div:last-child{display:none}
          .adm-logout-text{display:none}
          .adm-logout-btn{justify-content:center;padding:10px;min-height:44px}
          .adm-main{margin-left:72px;padding:22px 18px 28px}
        }
        @media(max-width:720px){
          .adm-sidebar-backdrop{display:block;position:fixed;inset:0;background:rgba(5,10,20,.72);z-index:9;opacity:0;pointer-events:none;transition:opacity .22s ease;backdrop-filter:blur(4px)}
          .adm-shell--nav-open .adm-sidebar-backdrop{opacity:1;pointer-events:auto}
          .adm-menu-toggle{display:inline-flex}
          .adm-sidebar{width:min(300px,calc(100vw - 48px));transform:translateX(-100%);transition:transform .28s cubic-bezier(.4,0,.2,1);box-shadow:none;border-right:1px solid var(--border);pointer-events:none;z-index:10}
          .adm-sidebar.adm-sidebar--open{transform:translateX(0);box-shadow:16px 0 48px rgba(0,0,0,.5);pointer-events:auto}
          .adm-main{margin-left:0;padding:16px 14px 28px;width:100%}
          .adm-sidebar-logoname,.adm-sidebar-logosub,.adm-side-btn>span:last-child,.adm-admin-name,.adm-admin-role{display:block}
          .adm-side-btn{justify-content:flex-start}
          .adm-sidebar-logo{justify-content:flex-start}
          .adm-admin-info{justify-content:flex-start}
          .adm-logout-text{display:inline}
          .adm-panel-head,.adm-panel-body{padding-left:16px;padding-right:16px}
          .adm-stat{padding:16px}
          .adm-stat-value{font-size:24px}
        }
        @media(max-width:1100px){
          .adm-grid-2,.adm-pipeline{grid-template-columns:1fr}
          .adm-grid-3{grid-template-columns:1fr}
          .adm-place-form-grid{grid-template-columns:1fr}
        }
        @media(max-width:480px){
          .adm-stat{flex-direction:column;align-items:flex-start;text-align:left}
          .adm-stat-icon{align-self:flex-start}
        }
      `}</style>

      {/* Animated orbs */}
      <div className="adm-orb adm-orb-a" />
      <div className="adm-orb adm-orb-b" />
      <div className="adm-orb adm-orb-c" />

      <div className="adm-sidebar-backdrop" aria-hidden="true" onClick={() => setNavOpen(false)} />

      {/* ── SIDEBAR ── */}
      <aside className={`adm-sidebar${navOpen ? " adm-sidebar--open" : ""}`}>
        <div className="adm-sidebar-brand">
          <div className="adm-sidebar-logo">
            <div className="adm-sidebar-logo-dot">A</div>
            <div>
              <div className="adm-sidebar-logoname">AdminDesk</div>
              <div className="adm-sidebar-logosub">Travel Manager</div>
            </div>
          </div>
        </div>

        <nav className="adm-sidebar-nav">
          <SideBtn active={activeTab === "overview"} icon={Icon.grid} label="Overview" onClick={goTab("overview")} />
          <SideBtn active={activeTab === "travel"} icon={Icon.route} label="Travel Schedule" onClick={goTab("travel")} />
          <SideBtn active={activeTab === "accounts"} icon={Icon.users} label="Account Reports" onClick={goTab("accounts")} />
          <SideBtn active={activeTab === "places"} icon={Icon.pin} label="Manage Places" onClick={goTab("places")} />
        </nav>

        <div className="adm-sidebar-admin">
          <div className="adm-admin-info">
            <div className="adm-admin-avatar">{(admin?.username || "A").charAt(0).toUpperCase()}</div>
            <div>
              <div className="adm-admin-name">{admin?.username || "Admin"}</div>
              <div className="adm-admin-role">Super Admin</div>
            </div>
          </div>
          <button className="adm-logout-btn" onClick={handleLogout} type="button">
            {Icon.logout}<span className="adm-logout-text"> Log out</span>
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="adm-main">
        <div className="adm-topbar">
          <button
            type="button"
            className="adm-menu-toggle"
            aria-label={navOpen ? "Close menu" : "Open menu"}
            aria-expanded={navOpen}
            onClick={() => setNavOpen(o => !o)}
          >
            {Icon.menu}
          </button>
          <header className="adm-header adm-header-wrap">
            <div className="adm-header-kicker">
              <span className="adm-pulse-dot" />
              {activeTab === "overview" ? "system overview" : activeTab === "travel" ? "travel schedule" : activeTab === "accounts" ? "account reports" : "manage places"}
            </div>
            <h1 className="adm-header-title">
              {activeTab === "overview" ? "Dashboard Overview" : activeTab === "travel" ? "Live Route Operations" : activeTab === "accounts" ? "Traveller & Admin Records" : "Published Destinations"}
            </h1>
          </header>
        </div>

        {errorMessage && <div className="adm-feedback err">{errorMessage}</div>}
        {successMessage && <div className="adm-feedback ok">{successMessage}</div>}

        {/* STAT CARDS */}
        <div className="adm-stats">
          <StatCard icon={Icon.users} label="Registered Users" value={stats.users} hint="All traveller accounts" />
          <StatCard icon={Icon.ticket} label="Ticket Reports" value={stats.tickets} hint="Confirmed or saved passes" />
          <StatCard icon={Icon.activity} label="Confirmed" value={stats.confirmed} hint="Tickets marked ready" accent="#38bdf8" />
          <StatCard icon={Icon.route} label="Routes" value={stats.routes} hint="Editable travel timings" />
          <StatCard icon={Icon.pin} label="Places" value={stats.places} hint="Homepage destinations" />
        </div>

        {/* ══ OVERVIEW TAB ══ */}
        {activeTab === "overview" && (
          <>
            {/* Pipeline */}
            <div className="adm-panel" style={{ marginBottom: 20 }}>
              <div className="adm-panel-head">
                <div className="adm-panel-kicker">Processing System</div>
                <div className="adm-panel-title">Journey Operations Pipeline</div>
                <div className="adm-panel-desc">Track how traveller data moves from intake to live publishing.</div>
              </div>
              <div className="adm-panel-body">
                <div className="adm-pipeline">
                  {[
                    { label: "Intake", value: stats.users, copy: "Traveller records in system.", cls: "intake" },
                    { label: "Review", value: stats.routes, copy: "Routes pending or in review.", cls: "review" },
                    { label: "Scheduled", value: stats.tickets, copy: "Tickets in active handling.", cls: "scheduled" },
                    { label: "Published", value: stats.places, copy: "Live destinations on homepage.", cls: "published" }
                  ].map(p => (
                    <div key={p.label} className={`adm-pipe-card ${p.cls}`}>
                      <div className="adm-pipe-label">{p.label}</div>
                      <strong className="adm-pipe-value">{p.value}</strong>
                      <p className="adm-pipe-copy">{p.copy}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Charts row */}
            <div className="adm-grid-2">
              <div className="adm-panel">
                <div className="adm-panel-head">
                  <div className="adm-panel-kicker">Analytics</div>
                  <div className="adm-panel-title">Routes by Region</div>
                </div>
                <div className="adm-panel-body">
                  <BarChart items={regionChart} />
                </div>
              </div>
              <div className="adm-panel">
                <div className="adm-panel-head">
                  <div className="adm-panel-kicker">Analytics</div>
                  <div className="adm-panel-title">Ticket Status Mix</div>
                </div>
                <div className="adm-panel-body adm-chart-row">
                  <div className="adm-donut-wrap">
                    <DonutChart confirmed={stats.confirmed} total={stats.tickets} />
                  </div>
                  <div className="adm-chart-legend">
                    {ticketChart.map(item => (
                      <div key={item.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 12 }}>
                        <span style={{ color: "var(--muted)" }}>{item.label}</span>
                        <strong style={{ color: "var(--acc)" }}>{item.value}</strong>
                      </div>
                    ))}
                    {!ticketChart.length && <p style={{ color: "var(--muted)", fontSize: 13 }}>No ticket data yet</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* User registration line chart */}
            <div className="adm-panel">
              <div className="adm-panel-head">
                <div className="adm-panel-kicker">Growth</div>
                <div className="adm-panel-title">New User Registrations — Last 7 Days</div>
              </div>
              <div className="adm-panel-body">
                <LineChart data={userLineData} />
              </div>
            </div>
          </>
        )}

        {/* ══ TRAVEL TAB ══ */}
        {activeTab === "travel" && (
          <>
            {/* Route Pulse */}
            <div className="adm-panel" style={{ marginBottom: 20 }}>
              <div className="adm-panel-head">
                <div className="adm-panel-kicker">Route Pulse</div>
                <div className="adm-panel-title">Departure Board</div>
              </div>
              <div className="adm-panel-body">
                {!dashboard.routes.length
                  ? <div className="adm-empty">No routes yet.</div>
                  : <div className="adm-grid-3">
                    {dashboard.routes.slice(0, 3).map(r => (
                      <div key={r.id} style={{ background: "#0b1220", border: "1px solid var(--border)", borderRadius: 12, padding: 16 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                          <strong style={{ fontSize: 13 }}>{r.route_name || r.routeName}</strong>
                          <Pill status={r.status} />
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: 8, fontSize: 12, color: "var(--muted)" }}>
                          <div><div>Departure</div><strong style={{ color: "var(--text)" }}>{r.departure_date || "TBC"}</strong></div>
                          <div><div>Time</div><strong style={{ color: "var(--text)" }}>{r.departure_time || "TBC"}</strong></div>
                        </div>
                      </div>
                    ))}
                  </div>
                }
              </div>
            </div>

            {/* Route Editor */}
            <div className="adm-panel">
              <div className="adm-panel-head">
                <div className="adm-panel-kicker">Route Editor</div>
                <div className="adm-panel-title">Adjust Route Timings</div>
                <div className="adm-panel-desc">Edit date, time, and status — then save.</div>
              </div>
              <div className="adm-panel-body">
                {loading ? <div className="adm-empty">Loading routes…</div>
                  : !dashboard.routes.length ? <div className="adm-empty">No routes found.</div>
                  : <div className="adm-route-grid">
                    {dashboard.routes.map(route => (
                      <div key={route.id} className="adm-route-card">
                        <h4>{route.route_name || route.routeName || "Route"}</h4>
                        <p>{route.region || "No region"}</p>
                        <div className="adm-route-fields">
                          {[["departure_date", "Date"], ["departure_time", "Time"], ["status", "Status"]].map(([field, lbl]) => (
                            <div key={field} className="adm-route-field">
                              <label>{lbl}</label>
                              <input value={route[field] || ""} onChange={e => handleRouteChange(route.id, field, e.target.value)} />
                            </div>
                          ))}
                        </div>
                        <button className="adm-save-btn" disabled={savingRouteId === route.id} onClick={() => handleSaveRoute(route)}>
                          {savingRouteId === route.id ? "Saving…" : "Save Route"}
                        </button>
                      </div>
                    ))}
                  </div>
                }
              </div>
            </div>
          </>
        )}

        {/* ══ ACCOUNTS TAB ══ */}
        {activeTab === "accounts" && (
          <>
            <div className="adm-grid-2">
              {/* Users */}
              <div className="adm-panel">
                <div className="adm-panel-head">
                  <div className="adm-panel-kicker">Users</div>
                  <div className="adm-panel-title">Traveller Accounts</div>
                </div>
                <div className="adm-panel-body">
                  {loading ? <div className="adm-empty">Loading users…</div>
                    : !dashboard.users.length ? <div className="adm-empty">No users found.</div>
                    : <div className="adm-table-wrap"><table className="adm-table">
                      <thead><tr><th>Name</th><th>Username</th><th>Email</th><th>Location</th></tr></thead>
                      <tbody>
                        {dashboard.users.map(u => (
                          <tr key={u.id}>
                            <td>{u.fullname || "—"}</td>
                            <td style={{ color: "var(--acc)" }}>@{u.username || "—"}</td>
                            <td>{u.email || "—"}</td>
                            <td>{u.location || "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table></div>
                  }
                </div>
              </div>

              {/* Tickets */}
              <div className="adm-panel">
                <div className="adm-panel-head">
                  <div className="adm-panel-kicker">Tickets</div>
                  <div className="adm-panel-title">Ticket Reports</div>
                </div>
                <div className="adm-panel-body">
                  {loading ? <div className="adm-empty">Loading tickets…</div>
                    : !dashboard.tickets.length ? <div className="adm-empty">No tickets yet.</div>
                    : <div className="adm-table-wrap"><table className="adm-table">
                      <thead><tr><th>Traveller</th><th>Route</th><th>Status</th><th>Issued</th><th>Actions</th></tr></thead>
                      <tbody>
                        {dashboard.tickets.map(t => {
                          const pend = String(t.status || "").toLowerCase() === "pending";
                          return (
                          <tr key={t.id}>
                            <td>{t.traveller || "—"}</td>
                            <td>{t.route_name || t.routeName || "—"}</td>
                            <td><Pill status={t.status} /></td>
                            <td style={{ color: "var(--muted)", fontSize: 11 }}>{t.created_at || t.issued_on || "—"}</td>
                            <td style={{ whiteSpace: "nowrap" }}>
                              {pend ? (
                                <>
                                  <button type="button" className="adm-save-btn" style={{ display: "inline-block", width: "auto", marginRight: 8, padding: "6px 12px" }} disabled={ticketActionId === t.id} onClick={() => handleTicketDecision(t.id, "Confirmed")}>
                                    {ticketActionId === t.id ? "…" : "Approve"}
                                  </button>
                                  <button type="button" style={{ display: "inline-block", padding: "6px 12px", borderRadius: 8, border: "1px solid #ff4d6d55", background: "#1a0a0e", color: "#ff4d6d", fontSize: 12, fontWeight: 700, cursor: "pointer" }} disabled={ticketActionId === t.id} onClick={() => handleTicketDecision(t.id, "Cancelled")}>
                                    Cancel
                                  </button>
                                </>
                              ) : (
                                <span style={{ color: "var(--muted)", fontSize: 12 }}>—</span>
                              )}
                            </td>
                          </tr>
                          );
                        })}
                      </tbody>
                    </table></div>
                  }
                </div>
              </div>
            </div>

            {/* Admin Activity */}
            <div className="adm-panel">
              <div className="adm-panel-head">
                <div className="adm-panel-kicker">Activity</div>
                <div className="adm-panel-title">Admin Login / Logout Records</div>
              </div>
              <div className="adm-panel-body">
                {loading ? <div className="adm-empty">Loading activity…</div>
                  : !dashboard.adminActivity.length ? <div className="adm-empty">No activity yet.</div>
                  : <div className="adm-table-wrap"><table className="adm-table">
                    <thead><tr><th>Admin</th><th>Event</th><th>Date &amp; Time</th></tr></thead>
                    <tbody>
                      {dashboard.adminActivity.map(ev => (
                        <tr key={ev.id}>
                          <td style={{ color: "var(--acc)" }}>{ev.admin_username || ev.username || "—"}</td>
                          <td>{ev.action || "—"}</td>
                          <td style={{ color: "var(--muted)", fontSize: 11 }}>{ev.logged_at || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table></div>
                }
              </div>
            </div>
          </>
        )}

        {/* ══ PLACES TAB ══ */}
        {activeTab === "places" && (
          <>
            {/* Add place form */}
            <div className="adm-panel" style={{ marginBottom: 20 }}>
              <div className="adm-panel-head">
                <div className="adm-panel-kicker">Publish Board</div>
                <div className="adm-panel-title">Add a New Homepage Destination</div>
                <div className="adm-panel-desc">Fill in all fields to push a new destination card to the homepage.</div>
              </div>
              <div className="adm-panel-body">
                <form onSubmit={handleSavePlace}>
                  <div className="adm-place-form-grid">
                    {[["title","Place Title"],["region","Region"],["travel_day","Travel Day"],["travel_time","Travel Time"],["icon","Icon emoji"]].map(([name, lbl]) => (
                      <label key={name} className="adm-place-label">
                        <span>{lbl}</span>
                        <input name={name} value={placeForm[name]} onChange={handlePlaceField} placeholder={lbl} />
                      </label>
                    ))}
                    <label className="adm-place-label">
                      <span>Image</span>
                      <input name="image_file" type="file" accept="image/*" onChange={handlePlaceField} style={{ color: "var(--muted)" }} />
                    </label>
                    <label className="adm-place-label adm-place-span">
                      <span>Description</span>
                      <input name="description" value={placeForm.description} onChange={handlePlaceField} placeholder="Short cultural description…" />
                    </label>
                  </div>
                  <button className="adm-save-btn" disabled={isSavingPlace} style={{ maxWidth: 220 }}>
                    {isSavingPlace ? "Publishing…" : "Publish Place"}
                  </button>
                </form>
              </div>
            </div>

            {/* Places list */}
            <div className="adm-panel">
              <div className="adm-panel-head">
                <div className="adm-panel-kicker">Published Places</div>
                <div className="adm-panel-title">Homepage Destinations ({stats.places})</div>
              </div>
              <div className="adm-panel-body">
                {loading ? <div className="adm-empty">Loading places…</div>
                  : !dashboard.places.length ? <div className="adm-empty">No places published yet.</div>
                  : <div className="adm-place-grid">
                    {dashboard.places.map(p => (
                      <div key={p.id} className="adm-place-card">
                        <div className="adm-place-card-img" style={{ backgroundImage: `url(${p.image_url || p.imageUrl})` }}>
                          <span className="adm-place-card-icon">{p.icon || "✦"}</span>
                        </div>
                        <div className="adm-place-card-body">
                          <strong>{p.title}</strong>
                          <span>{p.region}</span>
                          <p style={{ fontSize: 11, color: "var(--muted)", lineHeight: 1.4 }}>{p.description}</p>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, fontSize: 10, color: "var(--acc)" }}>
                            <span>{p.travel_day || p.travelDay}</span>
                            <span>{p.travel_time || p.travelTime}</span>
                          </div>
                          {canDeletePlace(p) && (
                            <div className="adm-place-card-actions">
                              <button
                                type="button"
                                className="adm-place-delete"
                                disabled={deletingPlaceId === p.id}
                                onClick={() => handleDeletePlace(p)}
                              >
                                {Icon.trash}
                                {deletingPlaceId === p.id ? "Removing…" : "Delete"}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                }
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
