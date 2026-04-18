import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import hukaFallsImage from "../../../assets/HukaFalls.jfif";
import larnachCastleImage from "../../../assets/LarnachCastle.jfif";
import mapImage from "../../../assets/map.png";
import milfordImage from "../../../assets/Milford.jpg";
import mountRuapehuImage from "../../../assets/MountRuapehu.jpg";
import tePapaImage from "../../../assets/TePapa.jfif";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import {
  AUTH_API_BASE_URL,
  clearAuthSession,
  fetchUserMyTickets,
  getApiErrorMessage,
  getAuthToken,
  getStoredUser,
  getUserAuthHeaders,
  updateStoredUser
} from "../../../lib/authApi";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const fullnamePattern = /^[A-Za-z][A-Za-z\s.'-]{1,49}$/;
const phonePattern = /^[0-9+]{7,20}$/;

function escapePdfText(value) {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/[^\x20-\x7E]/g, "")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

function buildPdfText({ x, y, size, text, font = "F1", color = "0 0 0" }) {
  return `${color} rg
BT
/${font} ${size} Tf
1 0 0 1 ${x} ${y} Tm
(${escapePdfText(text)}) Tj
ET`;
}

function createSimplePdf(contentStream) {
  const contentLength = contentStream.length;
  const objects = [
    "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n",
    "2 0 obj\n<< /Type /Pages /Count 1 /Kids [3 0 R] >>\nendobj\n",
    "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 5 0 R /F3 6 0 R >> >> /Contents 7 0 R >>\nendobj\n",
    "4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n",
    "5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n",
    "6 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Oblique >>\nendobj\n",
    `7 0 obj
<< /Length ${contentLength} >>
stream
${contentStream}
endstream
endobj
`
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((object) => {
    offsets.push(pdf.length);
    pdf += object;
  });

  const xrefOffset = pdf.length;
  pdf += `xref
0 8
0000000000 65535 f 
${offsets
  .slice(1)
  .map((offset) => `${String(offset).padStart(10, "0")} 00000 n `)
  .join("\n")}
trailer
<< /Size 7 /Root 1 0 R >>
startxref
${xrefOffset}
%%EOF`;

  return pdf;
}

function downloadTravelTicketPdf(ticket) {
  const content = [
    "0.03 0.03 0.03 rg",
    "0 0 595 842 re f",
    "0.95 0.94 0.92 rg",
    "24 28 547 786 re f",
    "0.11 0.11 0.12 rg",
    "24 28 165 786 re f",
    "0.65 0.29 0.15 rg",
    "189 736 360 2 re f",
    "0.14 0.14 0.16 rg",
    "40 662 131 94 re f",
    "0.14 0.14 0.16 rg",
    "40 548 131 94 re f",
    "0.14 0.14 0.16 rg",
    "40 434 131 94 re f",
    "0.14 0.14 0.16 rg",
    "40 320 131 94 re f",
    buildPdfText({ x: 40, y: 754, size: 12, text: "AOTEAROA ROUTES", font: "F2", color: "1 1 1" }),
    buildPdfText({ x: 40, y: 718, size: 26, text: "TRAVEL PASS", font: "F2", color: "1 1 1" }),
    buildPdfText({ x: 40, y: 684, size: 11, text: "Cultural route boarding pass", font: "F3", color: "0.92 0.85 0.82" }),
    buildPdfText({ x: 40, y: 624, size: 10, text: "TRAVELLER", font: "F2", color: "0.92 0.85 0.82" }),
    buildPdfText({ x: 40, y: 602, size: 16, text: ticket.traveller, font: "F2", color: "1 1 1" }),
    buildPdfText({ x: 40, y: 570, size: 10, text: "REFERENCE", font: "F2", color: "0.92 0.85 0.82" }),
    buildPdfText({ x: 40, y: 548, size: 16, text: ticket.code, font: "F2", color: "1 1 1" }),
    buildPdfText({ x: 40, y: 510, size: 10, text: "STATUS", font: "F2", color: "0.92 0.85 0.82" }),
    buildPdfText({ x: 40, y: 488, size: 16, text: ticket.status, font: "F2", color: "1 1 1" }),
    buildPdfText({ x: 40, y: 450, size: 10, text: "ROUTE", font: "F2", color: "0.92 0.85 0.82" }),
    buildPdfText({ x: 40, y: 428, size: 16, text: ticket.routeName, font: "F2", color: "1 1 1" }),
    buildPdfText({ x: 40, y: 386, size: 10, text: "ISSUED", font: "F2", color: "0.92 0.85 0.82" }),
    buildPdfText({ x: 40, y: 364, size: 16, text: ticket.issuedOn, font: "F2", color: "1 1 1" }),
    buildPdfText({ x: 205, y: 744, size: 12, text: "Selected route", font: "F2", color: "0.18 0.18 0.2" }),
    buildPdfText({ x: 205, y: 709, size: 29, text: ticket.routeName, font: "F2", color: "0.05 0.05 0.05" }),
    buildPdfText({ x: 205, y: 684, size: 11, text: ticket.routeNote, font: "F3", color: "0.28 0.28 0.3" }),
    buildPdfText({ x: 205, y: 622, size: 9, text: "Departure date", font: "F2", color: "0.22 0.22 0.24" }),
    buildPdfText({ x: 205, y: 598, size: 16, text: ticket.departureDate, font: "F2", color: "0.05 0.05 0.05" }),
    buildPdfText({ x: 352, y: 622, size: 9, text: "Departure window", font: "F2", color: "0.22 0.22 0.24" }),
    buildPdfText({ x: 352, y: 598, size: 16, text: ticket.departureWindow, font: "F2", color: "0.05 0.05 0.05" }),
    buildPdfText({ x: 205, y: 538, size: 9, text: "Boarding point", font: "F2", color: "0.22 0.22 0.24" }),
    buildPdfText({ x: 205, y: 514, size: 16, text: ticket.boardingPoint, font: "F2", color: "0.05 0.05 0.05" }),
    buildPdfText({ x: 352, y: 538, size: 9, text: "Seat", font: "F2", color: "0.22 0.22 0.24" }),
    buildPdfText({ x: 352, y: 514, size: 16, text: ticket.seat, font: "F2", color: "0.05 0.05 0.05" }),
    buildPdfText({ x: 205, y: 424, size: 9, text: "Travel class", font: "F2", color: "0.22 0.22 0.24" }),
    buildPdfText({ x: 205, y: 400, size: 16, text: ticket.travelClass, font: "F2", color: "0.05 0.05 0.05" }),
    buildPdfText({ x: 352, y: 424, size: 9, text: "Region", font: "F2", color: "0.22 0.22 0.24" }),
    buildPdfText({ x: 352, y: 400, size: 16, text: ticket.region, font: "F2", color: "0.05 0.05 0.05" }),
    buildPdfText({ x: 205, y: 270, size: 9, text: "Traveller contact", font: "F2", color: "0.22 0.22 0.24" }),
    buildPdfText({ x: 205, y: 246, size: 15, text: ticket.contact, font: "F2", color: "0.05 0.05 0.05" }),
    buildPdfText({ x: 205, y: 188, size: 10, text: "Download or present this pass for the selected route. The current dashboard confirmation is reflected in the pass state.", font: "F3", color: "0.28 0.28 0.3" })
  ].join("\n");

  const pdf = createSimplePdf(content);
  const blob = new Blob([pdf], { type: "application/pdf" });
  const fileName = `${ticket.code.toLowerCase()}-travel-ticket.pdf`;
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();

  window.setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}

function MailIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M4 6.75h16A1.25 1.25 0 0 1 21.25 8v8A1.25 1.25 0 0 1 20 17.25H4A1.25 1.25 0 0 1 2.75 16V8A1.25 1.25 0 0 1 4 6.75Zm0 1.5v.2l8 5.12 8-5.12v-.2H4Zm16 7.5V10.2l-7.33 4.69a1.25 1.25 0 0 1-1.34 0L4 10.2v5.55h16Z"
        fill="currentColor"
      />
    </svg>
  );
}

function PhoneIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M7.71 3.75h8.58A1.96 1.96 0 0 1 18.25 5.7v12.6a1.96 1.96 0 0 1-1.96 1.95H7.71a1.96 1.96 0 0 1-1.96-1.95V5.7a1.96 1.96 0 0 1 1.96-1.95Zm0 1.5a.46.46 0 0 0-.46.45v12.6c0 .24.21.45.46.45h8.58c.25 0 .46-.21.46-.45V5.7a.46.46 0 0 0-.46-.45H7.71Zm2.79 11.75h3a.75.75 0 0 1 0 1.5h-3a.75.75 0 0 1 0-1.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function PinIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M12 2.75a5.75 5.75 0 0 1 5.75 5.75c0 4.06-4.5 9.72-5.09 10.46a.84.84 0 0 1-1.32 0c-.59-.74-5.09-6.4-5.09-10.46A5.75 5.75 0 0 1 12 2.75Zm0 7.75a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
        fill="currentColor"
      />
    </svg>
  );
}

function CalendarIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M7.25 2.75a.75.75 0 0 1 .75.75V5h8V3.5a.75.75 0 0 1 1.5 0V5h.5A2.25 2.25 0 0 1 20.25 7.25v10.5A2.25 2.25 0 0 1 18 20H6a2.25 2.25 0 0 1-2.25-2.25V7.25A2.25 2.25 0 0 1 6 5h.5V3.5a.75.75 0 0 1 .75-.75Zm11.5 6.5H5.25v8.5c0 .41.34.75.75.75h12c.41 0 .75-.34.75-.75v-8.5ZM6 6.5a.75.75 0 0 0-.75.75v.5h13.5v-.5A.75.75 0 0 0 18 6.5H6Z"
        fill="currentColor"
      />
    </svg>
  );
}

function UserIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M12 3.25A4.25 4.25 0 1 1 7.75 7.5 4.25 4.25 0 0 1 12 3.25Zm0 10c3.87 0 7 2.04 7 4.56 0 .66-.53 1.19-1.19 1.19H6.19A1.19 1.19 0 0 1 5 17.81c0-2.52 3.13-4.56 7-4.56Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ShieldIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="m12 2.75 6 2.18v4.81c0 4.11-2.42 7.84-6 9.51-3.58-1.67-6-5.4-6-9.51V4.93l6-2.18Zm-1 10.9 4.4-4.39-1.06-1.06L11 11.53 9.66 10.2 8.6 11.26 11 13.65Z"
        fill="currentColor"
      />
    </svg>
  );
}

function LogoutArrowIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M13.75 4.75a.75.75 0 0 1 .75-.75h3A1.75 1.75 0 0 1 19.25 5.75v12.5A1.75 1.75 0 0 1 17.5 20h-3a.75.75 0 0 1 0-1.5h3a.25.25 0 0 0 .25-.25V5.75a.25.25 0 0 0-.25-.25h-3a.75.75 0 0 1-.75-.75Zm-1.22 3.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 1 1-1.06-1.06l1.97-1.97H5.5a.75.75 0 0 1 0-1.5h9l-1.97-1.97a.75.75 0 0 1 0-1.06Z"
        fill="currentColor"
      />
    </svg>
  );
}

function DownloadIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M11.25 4a.75.75 0 0 1 1.5 0v8.19l2.22-2.22a.75.75 0 1 1 1.06 1.06l-3.5 3.5a.75.75 0 0 1-1.06 0l-3.5-3.5a.75.75 0 1 1 1.06-1.06l2.22 2.22V4Z"
        fill="currentColor"
      />
      <path
        d="M5 15.25a.75.75 0 0 1 .75.75v1A1.25 1.25 0 0 0 7 18.25h10A1.25 1.25 0 0 0 18.25 17v-1a.75.75 0 0 1 1.5 0v1A2.75 2.75 0 0 1 17 19.75H7A2.75 2.75 0 0 1 4.25 17v-1a.75.75 0 0 1 .75-.75Z"
        fill="currentColor"
      />
    </svg>
  );
}

function RouteCard({ title, eyebrow, copy, image, location, windowLabel, onSelect, isActive }) {
  return (
    <button
      type="button"
      className={`portfolio-route-card ${isActive ? "is-active" : ""}`}
      style={{ backgroundImage: `url(${image})` }}
      onClick={onSelect}
    >
      <div className="portfolio-route-card-glow" />
      <div className="portfolio-route-card-scan" />
      <div className="portfolio-route-card-overlay" />
      <div className="portfolio-route-card-content">
        <span className="portfolio-route-card-index">{title.slice(0, 2).toUpperCase()}</span>
        <span className="portfolio-route-card-eyebrow">{eyebrow}</span>
        <h3 className="portfolio-route-card-title">{title}</h3>
        <p className="portfolio-route-card-copy">{copy}</p>
        <div className="portfolio-route-card-meta">
          <span>{location}</span>
          <span>{windowLabel}</span>
        </div>
      </div>
    </button>
  );
}

function DetailItem({ icon, label, value }) {
  return (
    <div className="portfolio-detail-item">
      <div className="portfolio-detail-icon">{icon}</div>
      <div className="portfolio-detail-copy">
        <span className="portfolio-detail-label">{label}</span>
        <strong className="portfolio-detail-value">{value || "-"}</strong>
      </div>
    </div>
  );
}

function MiniStat({ label, value, accent = false }) {
  return (
    <div className={`portfolio-mini-stat ${accent ? "is-accent" : ""}`}>
      <span className="portfolio-mini-stat-label">{label}</span>
      <strong className="portfolio-mini-stat-value">{value}</strong>
    </div>
  );
}

export default function Dashboard() {
  const initialUser = getStoredUser() || {};
  const [user, setUser] = useState(initialUser);
  const [isEditing, setIsEditing] = useState(false);
  const [isTicketEditing, setIsTicketEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const [myTickets, setMyTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [navOpen, setNavOpen] = useState(false);
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

  const firstName = useMemo(() => {
    const source = user?.fullname || user?.username || "traveller";
    return source.trim().split(/\s+/)[0] || "traveller";
  }, [user]);

  const completionPercent = useMemo(() => {
    const tracked = [user?.fullname, user?.email, user?.phone, user?.location, user?.birthdate];
    const completeCount = tracked.filter((item) => typeof item === "string" && item.trim()).length;
    return Math.round((completeCount / tracked.length) * 100);
  }, [user]);

  const clearanceLabel = completionPercent === 100 ? "Route Ready" : completionPercent >= 60 ? "Pending Details" : "Needs Attention";

  const refreshTickets = useCallback(async () => {
    const token = getAuthToken();
    if (!token) {
      setMyTickets([]);
      setLoadingTickets(false);
      return;
    }
    try {
      setLoadingTickets(true);
      const res = await fetchUserMyTickets();
      setMyTickets(res.data?.tickets || []);
    } catch {
      setMyTickets([]);
    } finally {
      setLoadingTickets(false);
    }
  }, []);

  const sortedTickets = useMemo(() => {
    return [...myTickets].sort((left, right) => {
      const leftId = Number(left?.id || 0);
      const rightId = Number(right?.id || 0);

      if (leftId !== rightId) {
        return rightId - leftId;
      }

      const leftTime = new Date(left?.created_at || left?.issued_on || 0).getTime();
      const rightTime = new Date(right?.created_at || right?.issued_on || 0).getTime();
      return rightTime - leftTime;
    });
  }, [myTickets]);

  useEffect(() => {
    refreshTickets();
  }, [refreshTickets]);

  const readinessCopy =
    completionPercent === 100
      ? "Your portfolio is complete and ready for planning, booking, and cultural route curation."
      : "Complete the remaining details so your traveller portfolio feels ready for every route and cultural stop.";

  const explorerLevel =
    completionPercent === 100
      ? "Level 3 Navigator"
      : completionPercent >= 60
        ? "Level 2 Explorer"
        : "Level 1 Arrival";

  const routeCode = useMemo(() => {
    const safeUsername = (user?.username || "guest")
      .replace(/[^a-z0-9]/gi, "")
      .toUpperCase()
      .slice(0, 6) || "GUEST";
    return `NZ-${safeUsername}-${String(completionPercent).padStart(2, "0")}`;
  }, [completionPercent, user]);

  const routeCards = [
    {
      title: "Te Papa Stories",
      eyebrow: "Museum route",
      copy: "A calm Wellington route shaped by galleries, harbour air, and living taonga.",
      image: tePapaImage,
      location: "Wellington",
      travelClass: "Heritage",
      departureDate: "14 Apr 2026",
      departureWindow: "08:40",
      boardingPoint: "Harbour Gate 03",
      seat: "A12",
      shortCode: "TP",
      routeNote: "Museum collections, waterfront pacing, and a slower cultural arrival."
    },
    {
      title: "Milford Waterlines",
      eyebrow: "Scenic route",
      copy: "Fjord light, water sound, and a quieter rhythm built around dramatic southern scale.",
      image: milfordImage,
      location: "Fiordland",
      travelClass: "Scenic",
      departureDate: "18 Apr 2026",
      departureWindow: "10:15",
      boardingPoint: "Sound Dock 02",
      seat: "C04",
      shortCode: "MW",
      routeNote: "A high-clarity scenic pass focused on water, cliffs, and stillness."
    },
    {
      title: "Southern Heritage",
      eyebrow: "Estate route",
      copy: "Stone architecture, southern coastlines, and old rooms that hold stories quietly.",
      image: larnachCastleImage,
      location: "Dunedin",
      travelClass: "Signature",
      departureDate: "22 Apr 2026",
      departureWindow: "13:30",
      boardingPoint: "Heritage Walk 01",
      seat: "B09",
      shortCode: "SH",
      routeNote: "Castle grounds, harbour weather, and a more intimate heritage track."
    }
  ];

  const selectedRoute = routeCards[selectedRouteIndex] || routeCards[0];
  const issuedOn = useMemo(
    () =>
      new Intl.DateTimeFormat("en-NZ", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }).format(new Date()),
    []
  );

  const currentPassCode = `${routeCode}-${selectedRoute.shortCode}`;

  const ticketRowMatch = useMemo(
    () => sortedTickets.find((t) => String(t.route_code) === String(currentPassCode)) || null,
    [sortedTickets, currentPassCode]
  );

  const bookingStatusRaw = ticketRowMatch?.status ? String(ticketRowMatch.status) : "";
  const bookingNorm = bookingStatusRaw.toLowerCase();
  const isApproved = bookingNorm.includes("confirm");
  const isCancelled = bookingNorm.includes("cancel");
  const isPendingThisRoute = Boolean(ticketRowMatch) && bookingNorm === "pending";

  const ticketStatusPercent = isCancelled ? 12 : isApproved ? 100 : ticketRowMatch ? 48 : 28;
  const ticketStatusLabel = isCancelled
    ? "Cancelled"
    : isApproved
      ? "Approved"
      : ticketRowMatch
        ? "Pending approval"
        : "Not submitted";
  const ticketStatusCopy = isCancelled
    ? "This booking was cancelled by an administrator."
    : isApproved
      ? "Your route is confirmed — you can download your travel pass."
      : ticketRowMatch
        ? "An administrator will approve or cancel this request."
        : "Choose a route and submit a booking request from the Routes tab.";

  const ticketData = useMemo(
    () => ({
      traveller: user?.fullname || user?.username || "Guest Traveller",
      routeName: selectedRoute.title,
      routeNote: selectedRoute.routeNote,
      region: selectedRoute.location,
      departureDate: selectedRoute.departureDate,
      departureWindow: selectedRoute.departureWindow,
      boardingPoint: selectedRoute.boardingPoint,
      seat: selectedRoute.seat,
      travelClass: selectedRoute.travelClass,
      status: isCancelled ? "Cancelled" : isApproved ? "Confirmed" : ticketRowMatch ? "Pending" : "—",
      statusPercent: ticketStatusPercent,
      statusCopy: ticketStatusCopy,
      code: currentPassCode,
      issuedOn,
      contact: user?.email || "No email saved"
    }),
    [issuedOn, selectedRoute, ticketStatusCopy, ticketStatusPercent, user, currentPassCode, isCancelled, isApproved, ticketRowMatch]
  );

  const handleStartEdit = () => {
    setErrorMessage("");
    setSuccessMessage("");
    setIsTicketEditing(false);
    syncFormWithUser(user);
    setIsEditing(true);
    setActiveTab("account");
  };

  const handleCancelEdit = () => {
    syncFormWithUser(user);
    setErrorMessage("");
    setSuccessMessage("");
    setIsEditing(false);
  };

  const handleSelectRoute = (index) => {
    setSelectedRouteIndex(index);
    setIsEditing(false);
    setIsTicketEditing(true);
    setActiveTab("routes");
  };

  const handleOpenTicketEditor = () => {
    setErrorMessage("");
    setSuccessMessage("");
    setIsEditing(false);
    setIsTicketEditing(true);
    setActiveTab("routes");
  };

  const handleConfirmTicket = async () => {
    try {
      setErrorMessage("");
      setSuccessMessage("");

      const bookingPayload = {
        ...ticketData,
        status: "Pending"
      };

      const response = await axios.post(
        `${AUTH_API_BASE_URL}/ticket_report.php`,
        bookingPayload,
        {
          headers: {
            "Content-Type": "application/json",
            ...getUserAuthHeaders()
          }
        }
      );

      if (!response.data?.success) {
        setErrorMessage(response.data?.error || response.data?.message || "Booking request failed.");
        return;
      }

      await refreshTickets();
      setIsTicketEditing(false);
      setSuccessMessage(response.data?.message || "Booking submitted — pending admin approval.");
      setActiveTab("bookings");
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "Booking request failed."));
    }
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

  const handleDownloadTicket = () => {
    if (!isApproved) {
      setErrorMessage("Your pass can be downloaded after an administrator approves this booking.");
      return;
    }
    downloadTravelTicketPdf(ticketData);
  };

  const goTab = (tab) => () => {
    setActiveTab(tab);
    setNavOpen(false);
  };

  return (
    <div className={`udb-shell portfolio-dashboard-shell${navOpen ? " udb-shell--nav-open" : ""}`}>
      <style>{`
        .udb-shell.portfolio-dashboard-shell{
          --portfolio-bg:#0a0705;--portfolio-surface:rgba(22,16,12,.94);--portfolio-surface-soft:rgba(201,160,102,.06);
          --portfolio-border:rgba(201,160,102,.22);--portfolio-text:#f4ebe3;--portfolio-muted:rgba(244,235,227,.72);
          --portfolio-subtle:rgba(244,235,227,.48);--portfolio-accent:#c9a066;--portfolio-accent-soft:rgba(201,160,102,.2);
          display:flex;min-height:100vh;position:relative;overflow-x:hidden;
        }
        .udb-shell--nav-open{overflow:hidden;touch-action:none}
        .portfolio-dashboard-navlink.is-active{color:var(--portfolio-accent)!important}
        .udb-sidebar-backdrop{display:none}
        .udb-menu-btn{display:none;align-items:center;justify-content:center;width:44px;height:44px;border-radius:12px;border:1px solid var(--portfolio-border);background:var(--portfolio-surface);color:var(--portfolio-accent);cursor:pointer;flex-shrink:0}
        .udb-sidebar{width:232px;flex-shrink:0;background:linear-gradient(180deg,#120d0a,#0a0705);border-right:1px solid var(--portfolio-border);display:flex;flex-direction:column;padding:0;z-index:12}
        .udb-side-brand{padding:22px 18px;border-bottom:1px solid var(--portfolio-border)}
        .udb-side-brand strong{display:block;font-size:14px;letter-spacing:.04em;color:var(--portfolio-text)}
        .udb-side-brand span{display:block;font-size:11px;color:var(--portfolio-muted);margin-top:4px}
        .udb-side-nav{flex:1;padding:14px 10px;display:flex;flex-direction:column;gap:4px}
        .udb-side-btn{display:flex;align-items:center;gap:10px;width:100%;padding:11px 12px;border-radius:10px;border:none;background:transparent;color:var(--portfolio-muted);font-size:13px;font-weight:500;cursor:pointer;text-align:left;transition:background .2s,color .2s}
        .udb-side-btn:hover{background:var(--portfolio-surface-soft);color:var(--portfolio-text)}
        .udb-side-btn.is-active{background:linear-gradient(135deg,rgba(201,160,102,.18),rgba(90,55,30,.35));color:var(--portfolio-accent);border:1px solid rgba(201,160,102,.25)}
        .udb-side-foot{padding:14px;border-top:1px solid var(--portfolio-border)}
        .udb-side-logout{width:100%;padding:10px 12px;border-radius:10px;border:1px solid rgba(220,80,80,.35);background:rgba(40,12,10,.5);color:#f0a8a8;font-size:13px;cursor:pointer}
        .udb-body{flex:1;min-width:0;position:relative;display:flex;flex-direction:column}
        .udb-inner.portfolio-dashboard-inner{margin-left:auto;margin-right:auto;width:100%;max-width:min(1380px,calc(100% - 20px));padding-left:12px;padding-right:12px}
        .portfolio-status-badge.is-cancelled{background:rgba(220,80,80,.15);color:#f0a8a8;border-color:rgba(220,80,80,.35)}
        @media(max-width:1020px){.udb-sidebar{width:72px}.udb-side-brand span,.udb-side-btn span:last-child{display:none}.udb-side-btn{justify-content:center;padding:12px 8px}}
        @media(max-width:720px){
          .udb-sidebar-backdrop{display:block;position:fixed;inset:0;background:rgba(5,4,3,.72);z-index:9;opacity:0;pointer-events:none;transition:opacity .2s}
          .udb-shell--nav-open .udb-sidebar-backdrop{opacity:1;pointer-events:auto}
          .udb-menu-btn{display:inline-flex}
          .udb-sidebar{position:fixed;left:0;top:0;height:100%;width:min(280px,88vw);transform:translateX(-100%);transition:transform .28s ease;pointer-events:none}
          .udb-sidebar.is-open{transform:translateX(0);pointer-events:auto;box-shadow:16px 0 40px rgba(0,0,0,.5)}
        }
      `}</style>

      <div className="udb-sidebar-backdrop" aria-hidden="true" onClick={() => setNavOpen(false)} />

      <aside className={`udb-sidebar${navOpen ? " is-open" : ""}`}>
        <div className="udb-side-brand">
          <strong>NZ Routes</strong>
          <span>Traveller console</span>
        </div>
        <nav className="udb-side-nav" aria-label="Dashboard">
          <button type="button" className={`udb-side-btn${activeTab === "overview" ? " is-active" : ""}`} onClick={goTab("overview")}>
            <span>◆</span><span>Overview</span>
          </button>
          <button type="button" className={`udb-side-btn${activeTab === "bookings" ? " is-active" : ""}`} onClick={goTab("bookings")}>
            <span>▤</span><span>My bookings</span>
          </button>
          <button type="button" className={`udb-side-btn${activeTab === "routes" ? " is-active" : ""}`} onClick={goTab("routes")}>
            <span>◇</span><span>Routes &amp; pass</span>
          </button>
          <button type="button" className={`udb-side-btn${activeTab === "account" ? " is-active" : ""}`} onClick={goTab("account")}>
            <span>◎</span><span>Account</span>
          </button>
        </nav>
        <div className="udb-side-foot">
          <button type="button" className="udb-side-logout" onClick={logout}>
            Log out
          </button>
        </div>
      </aside>

      <div className="udb-body">
        <div className="portfolio-dashboard-background" aria-hidden="true">
          <div className="portfolio-dashboard-gridlines" />
          <div className="portfolio-dashboard-orb orb-a" />
          <div className="portfolio-dashboard-orb orb-b" />
          <div className="portfolio-dashboard-orb orb-c" />
        </div>

        <div className="portfolio-dashboard-inner udb-inner">
        <header className="portfolio-dashboard-topbar">
          <button type="button" className="udb-menu-btn" aria-label="Menu" onClick={() => setNavOpen((v) => !v)}>☰</button>
          <button
            type="button"
            className="portfolio-dashboard-brand"
            onClick={() => window.location.assign("/")}
          >
            <span className="portfolio-dashboard-brand-mark">
              <img src={mapImage} alt="" className="portfolio-dashboard-brand-map" />
            </span>
            <span className="portfolio-dashboard-brand-copy">
              <strong>New Zealand Routes</strong>
              <span>Travel ticket dashboard</span>
            </span>
          </button>

          <div className="portfolio-dashboard-section-indicator" aria-live="polite">
            <span className="portfolio-dashboard-section-kicker">Workspace</span>
            <strong className="portfolio-dashboard-section-name">
              {activeTab === "overview"
                ? "Overview"
                : activeTab === "bookings"
                  ? "My bookings"
                  : activeTab === "routes"
                    ? "Routes & pass"
                    : "Account"}
            </strong>
          </div>

          <div className="portfolio-dashboard-actions-top">
            <Button
              variant="soft"
              className="portfolio-dashboard-top-action"
              onClick={() => window.location.assign("/#places")}
            >
              ✦ Places
            </Button>
            <Badge className="portfolio-dashboard-level">
              <ShieldIcon className="portfolio-dashboard-badge-icon" />
              {explorerLevel}
            </Badge>
            <Button variant="soft" className="portfolio-dashboard-top-action" onClick={logout}>
              <LogoutArrowIcon className="portfolio-dashboard-inline-icon" />
              Log out
            </Button>
          </div>
        </header>

        {(errorMessage || successMessage) ? (
          <div className="portfolio-dashboard-feedback-stack">
            {errorMessage ? <div className="portfolio-dashboard-feedback is-error">{errorMessage}</div> : null}
            {successMessage ? <div className="portfolio-dashboard-feedback is-success">{successMessage}</div> : null}
          </div>
        ) : null}

        {activeTab === "overview" && (
        <section id="dashboard-overview" className="portfolio-dashboard-hero">
          <div className="portfolio-dashboard-main">
            <div className="portfolio-dashboard-intro">
              <span className="portfolio-dashboard-kicker">Passenger Portfolio</span>
              <h1 className="portfolio-dashboard-title">
                Welcome back,
                <span>{firstName}</span>
              </h1>
              <p className="portfolio-dashboard-copy">
                Submit route bookings for admin approval. Downloads unlock once a request is confirmed.
              </p>
            </div>

            <Card className="portfolio-status-card">
              <CardHeader className="portfolio-status-head">
                <div>
                  <span className="portfolio-panel-kicker">Current status</span>
                  <CardTitle className="portfolio-status-title">Traveller portfolio in motion</CardTitle>
                  <CardDescription className="portfolio-status-copy">{readinessCopy}</CardDescription>
                </div>

                <Badge className={`portfolio-status-badge ${completionPercent === 100 ? "is-ready" : "is-pending"}`}>
                  {clearanceLabel}
                </Badge>
              </CardHeader>

              <CardContent className="portfolio-status-body">
                <div className="portfolio-progress-track">
                  <span className="portfolio-progress-fill" style={{ width: `${completionPercent}%` }} />
                </div>

                <div className="portfolio-mini-stat-grid">
                  <MiniStat label="Profile score" value={`${completionPercent}%`} accent />
                  <MiniStat label="Contact" value={user?.email ? "Email ready" : "Add email"} />
                  <MiniStat label="Home base" value={user?.location || "Choose a location"} />
                </div>

                <div className="portfolio-current-ticket">
                  <div className="portfolio-current-ticket-head">
                    <div>
                      <span className="portfolio-panel-kicker">Selected route</span>
                      <strong>{ticketData.routeName}</strong>
                    </div>
                    <Badge
                      className={`portfolio-status-badge ${
                        isCancelled ? "is-cancelled" : isApproved ? "is-ready" : "is-pending"
                      }`}
                    >
                      {ticketStatusLabel}
                    </Badge>
                  </div>

                  <div className="portfolio-progress-track portfolio-ticket-progress-track">
                    <span className="portfolio-progress-fill" style={{ width: `${ticketStatusPercent}%` }} />
                  </div>

                  <div className="portfolio-current-ticket-copy">{ticketStatusCopy}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
        )}

        {activeTab === "bookings" && (
        <section className="portfolio-dashboard-hero" aria-labelledby="udb-bookings-title">
          <div className="portfolio-dashboard-main" style={{ maxWidth: 920 }}>
            <div className="portfolio-section-head" style={{ marginBottom: 20 }}>
              <div>
                <span className="portfolio-panel-kicker">Bookings</span>
                <h2 id="udb-bookings-title" className="portfolio-section-title">Your ticket requests</h2>
              </div>
              <Button variant="soft" className="portfolio-dashboard-top-action" type="button" onClick={() => refreshTickets()}>
                Refresh
              </Button>
            </div>
            {loadingTickets ? (
              <p className="portfolio-dashboard-copy">Loading bookings…</p>
            ) : !myTickets.length ? (
              <p className="portfolio-dashboard-copy">No bookings yet. Use Routes &amp; pass to submit a request.</p>
            ) : (
              <div className="portfolio-dashboard-feedback-stack" style={{ gap: 0 }}>
                <div style={{ overflowX: "auto", borderRadius: 12, border: "1px solid var(--portfolio-border)" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <thead>
                      <tr style={{ textAlign: "left", color: "var(--portfolio-muted)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        <th style={{ padding: "12px 14px", borderBottom: "1px solid var(--portfolio-border)" }}>Route</th>
                        <th style={{ padding: "12px 14px", borderBottom: "1px solid var(--portfolio-border)" }}>Code</th>
                        <th style={{ padding: "12px 14px", borderBottom: "1px solid var(--portfolio-border)" }}>Class</th>
                        <th style={{ padding: "12px 14px", borderBottom: "1px solid var(--portfolio-border)" }}>Status</th>
                        <th style={{ padding: "12px 14px", borderBottom: "1px solid var(--portfolio-border)" }}>Issued</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedTickets.map((row) => (
                        <tr key={row.id} style={{ color: "var(--portfolio-text)" }}>
                          <td style={{ padding: "12px 14px", borderBottom: "1px solid rgba(255,255,255,.06)" }}>{row.route_name}</td>
                          <td style={{ padding: "12px 14px", borderBottom: "1px solid rgba(255,255,255,.06)", color: "var(--portfolio-accent)" }}>{row.route_code}</td>
                          <td style={{ padding: "12px 14px", borderBottom: "1px solid rgba(255,255,255,.06)" }}>{row.travel_class}</td>
                          <td style={{ padding: "12px 14px", borderBottom: "1px solid rgba(255,255,255,.06)" }}>{row.status}</td>
                          <td style={{ padding: "12px 14px", borderBottom: "1px solid rgba(255,255,255,.06)", fontSize: 12, color: "var(--portfolio-muted)" }}>{row.issued_on}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </section>
        )}

        {activeTab === "routes" && (
        <section id="dashboard-routes" className="portfolio-dashboard-hero">
          <div className="portfolio-dashboard-main">
            <section className="portfolio-routes-section">
              <div
                className="portfolio-route-stage"
                style={{ backgroundImage: `url(${selectedRoute.image})` }}
              >
                <div className="portfolio-route-stage-overlay" />
                <div className="portfolio-route-stage-content">
                  <div className="portfolio-route-stage-copy">
                    <div className="portfolio-ticket-chip-row">
                      <span className="portfolio-ticket-chip">Live route board</span>
                      <span className="portfolio-ticket-chip">{selectedRoute.travelClass}</span>
                      <span className="portfolio-ticket-chip portfolio-ticket-chip--accent">{selectedRoute.location}</span>
                    </div>

                    <span className="portfolio-panel-kicker">Featured journey</span>
                    <h2 className="portfolio-route-stage-title">{selectedRoute.title}</h2>
                    <p className="portfolio-route-stage-text">{selectedRoute.copy}</p>

                    <div className="portfolio-route-stage-actions">
                      <Button className="portfolio-route-stage-action" onClick={handleOpenTicketEditor}>
                        Edit ticket
                      </Button>
                      <Button
                        variant="soft"
                        className="portfolio-route-stage-action"
                        onClick={handleDownloadTicket}
                        disabled={!isApproved}
                      >
                        <DownloadIcon className="portfolio-dashboard-inline-icon" />
                        Download PDF
                      </Button>
                    </div>
                  </div>

                  <div className="portfolio-route-stage-grid">
                    <div className="portfolio-route-stage-stat">
                      <span>Departure</span>
                      <strong>{selectedRoute.departureDate}</strong>
                    </div>
                    <div className="portfolio-route-stage-stat">
                      <span>Window</span>
                      <strong>{selectedRoute.departureWindow}</strong>
                    </div>
                    <div className="portfolio-route-stage-stat">
                      <span>Boarding</span>
                      <strong>{selectedRoute.boardingPoint}</strong>
                    </div>
                    <div className="portfolio-route-stage-stat">
                      <span>Seat</span>
                      <strong>{selectedRoute.seat}</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="portfolio-section-head">
                <div>
                  <span className="portfolio-panel-kicker">Curated routes</span>
                  <h2 className="portfolio-section-title">Select a route for your ticket</h2>
                </div>
                <Button
                  variant="ghost"
                  className="portfolio-section-button"
                  onClick={handleDownloadTicket}
                  disabled={!isApproved}
                >
                  <DownloadIcon className="portfolio-dashboard-inline-icon" />
                  Download PDF
                </Button>
              </div>

              <div className="portfolio-route-grid">
                {routeCards.map((route, index) => (
                  <RouteCard
                    key={route.title}
                    {...route}
                    windowLabel={route.departureWindow}
                    isActive={index === selectedRouteIndex}
                    onSelect={() => handleSelectRoute(index)}
                  />
                ))}
              </div>
            </section>
          </div>

          <aside className="portfolio-dashboard-side">
            <Card
              id="dashboard-passport"
              className="portfolio-passport-card"
              style={{ backgroundImage: `url(${mountRuapehuImage})` }}
            >
              <div className="portfolio-passport-aura aura-one" />
              <div className="portfolio-passport-aura aura-two" />
              <div className="portfolio-passport-grid-glow" />
              <div className="portfolio-passport-overlay" />
              <div className="portfolio-passport-map">
                <img src={mapImage} alt="" />
              </div>

              <div className="portfolio-passport-header">
                <span className="portfolio-panel-kicker">Travel ticket</span>
                <Badge className="portfolio-passport-badge">{explorerLevel}</Badge>
              </div>

              <div className="portfolio-passport-main">
                <div className="portfolio-ticket-chip-row">
                  <span className="portfolio-ticket-chip">Selected route</span>
                  <span className="portfolio-ticket-chip">{ticketData.travelClass}</span>
                  <span className="portfolio-ticket-chip portfolio-ticket-chip--accent">{ticketStatusLabel}</span>
                </div>

                <h2 className="portfolio-passport-title">{ticketData.routeName}</h2>
                <p className="portfolio-passport-subtitle">{ticketData.routeNote}</p>

                <div className="portfolio-passport-storyline">
                  <span className="portfolio-passport-storyline-dot" />
                  <p>
                    A cinematic route pass with live approval tracking, export-ready details, and a cleaner travel rhythm.
                  </p>
                </div>

                <div className="portfolio-ticket-meta">
                  <div className="portfolio-ticket-meta-block">
                    <span className="portfolio-passport-label">Traveller</span>
                    <strong className="portfolio-passport-value">{ticketData.traveller}</strong>
                  </div>
                  <div className="portfolio-ticket-meta-block">
                    <span className="portfolio-passport-label">Route code</span>
                    <strong className="portfolio-passport-value">{ticketData.code}</strong>
                  </div>
                </div>

                <div className="portfolio-passport-grid">
                  <div>
                    <span className="portfolio-passport-label">Departure</span>
                    <strong className="portfolio-passport-value">{ticketData.departureDate}</strong>
                  </div>
                  <div>
                    <span className="portfolio-passport-label">Window</span>
                    <strong className="portfolio-passport-value">{ticketData.departureWindow}</strong>
                  </div>
                  <div>
                    <span className="portfolio-passport-label">Boarding</span>
                    <strong className="portfolio-passport-value">{ticketData.boardingPoint}</strong>
                  </div>
                  <div>
                    <span className="portfolio-passport-label">Seat</span>
                    <strong className="portfolio-passport-value">{ticketData.seat}</strong>
                  </div>
                  <div>
                    <span className="portfolio-passport-label">Region</span>
                    <strong className="portfolio-passport-value">{ticketData.region}</strong>
                  </div>
                </div>

                {isTicketEditing ? (
                  <div className="portfolio-ticket-editor-panel">
                    <div className="portfolio-ticket-editor-head">
                      <span className="portfolio-panel-kicker">Ticket editor</span>
                      <h3>Choose the route you want on the pass.</h3>
                    </div>

                    <div className="portfolio-ticket-editor-grid">
                      {routeCards.map((route, index) => (
                        <button
                          type="button"
                          key={route.shortCode}
                          className={`portfolio-ticket-editor-option ${index === selectedRouteIndex ? "is-active" : ""}`}
                          onClick={() => handleSelectRoute(index)}
                        >
                          <strong>{route.title}</strong>
                          <span>{route.location}</span>
                        </button>
                      ))}
                    </div>

                    <div className="portfolio-ticket-editor-actions">
                      <Button className="portfolio-ticket-editor-action" onClick={handleConfirmTicket}>
                        Submit booking
                      </Button>
                      <Button variant="soft" className="portfolio-ticket-editor-action" onClick={() => setIsTicketEditing(false)}>
                        Keep editing later
                      </Button>
                    </div>
                  </div>
                ) : null}

                <div className="portfolio-ticket-footer-note">
                  Requested {ticketData.issuedOn}. PDF download unlocks after admin approval.
                </div>
              </div>

              <div className="portfolio-passport-footer">
                <Button
                  className="portfolio-passport-action"
                  onClick={handleConfirmTicket}
                  disabled={isApproved || isPendingThisRoute}
                >
                  {isApproved ? "Approved" : isPendingThisRoute ? "Pending approval" : isCancelled ? "Submit new booking" : "Submit booking"}
                </Button>
                <Button className="portfolio-passport-action" onClick={handleDownloadTicket} disabled={!isApproved}>
                  <DownloadIcon className="portfolio-dashboard-inline-icon" />
                  Download ticket
                </Button>
                <Button
                  variant="soft"
                  className="portfolio-passport-action portfolio-passport-action--soft"
                  onClick={handleOpenTicketEditor}
                >
                  Edit ticket
                </Button>
              </div>
            </Card>

            <Card className="portfolio-side-note">
              <CardContent className="portfolio-side-note-content">
                <span className="portfolio-panel-kicker">Route rhythm</span>
                <h3 className="portfolio-side-note-title">The current board keeps the travel story simple, clear, and export-ready.</h3>
                <div className="portfolio-side-note-thumbs">
                  <div className="portfolio-side-thumb" style={{ backgroundImage: `url(${hukaFallsImage})` }} />
                  <div className="portfolio-side-thumb" style={{ backgroundImage: `url(${tePapaImage})` }} />
                </div>
              </CardContent>
            </Card>
          </aside>
        </section>
        )}

        {activeTab === "account" && (
        <section id="dashboard-account" className="portfolio-account-section">
          <Card className="portfolio-account-card">
            <CardHeader className="portfolio-account-head">
              <div>
                <span className="portfolio-panel-kicker">Account details</span>
                <CardTitle className="portfolio-account-title">Profile essentials</CardTitle>
              </div>
              <Badge className="portfolio-account-badge">Ready for updates</Badge>
            </CardHeader>

            <CardContent className="portfolio-account-body">
              <div className="portfolio-detail-grid">
                <DetailItem icon={<MailIcon className="portfolio-detail-svg" />} label="Email" value={user?.email} />
                <DetailItem icon={<PhoneIcon className="portfolio-detail-svg" />} label="Phone" value={user?.phone} />
                <DetailItem icon={<PinIcon className="portfolio-detail-svg" />} label="Location" value={user?.location} />
                <DetailItem icon={<CalendarIcon className="portfolio-detail-svg" />} label="Birth date" value={user?.birthdate} />
                <DetailItem icon={<UserIcon className="portfolio-detail-svg" />} label="Username" value={`@${user?.username || "account"}`} />
                <DetailItem icon={<ShieldIcon className="portfolio-detail-svg" />} label="Explorer tier" value={explorerLevel} />
              </div>
            </CardContent>
          </Card>

          <Card className={`portfolio-editor-card ${isEditing ? "is-editing" : ""}`}>
            <CardHeader className="portfolio-account-head">
              <div>
                <span className="portfolio-panel-kicker">{isEditing ? "Profile editor" : "Next step"}</span>
                <CardTitle className="portfolio-account-title">
                  {isEditing ? "Refine your traveller record" : "Keep your portfolio current"}
                </CardTitle>
              </div>
              <Badge className="portfolio-account-badge">{isEditing ? "Editing live" : "Profile actions"}</Badge>
            </CardHeader>

            <CardContent className="portfolio-editor-body">
              {isEditing ? (
                <form onSubmit={handleSave} className="portfolio-editor-form">
                  <div className="portfolio-editor-grid">
                    <div className="portfolio-editor-field">
                      <label htmlFor="dashboard-fullname" className="portfolio-editor-label">Full Name</label>
                      <Input id="dashboard-fullname" name="fullname" value={form.fullname} onChange={handleChange} />
                    </div>
                    <div className="portfolio-editor-field">
                      <label htmlFor="dashboard-username" className="portfolio-editor-label">Username</label>
                      <Input id="dashboard-username" name="username" value={form.username} disabled />
                    </div>
                    <div className="portfolio-editor-field">
                      <label htmlFor="dashboard-email" className="portfolio-editor-label">Email</label>
                      <Input id="dashboard-email" name="email" type="email" value={form.email} onChange={handleChange} />
                    </div>
                    <div className="portfolio-editor-field">
                      <label htmlFor="dashboard-phone" className="portfolio-editor-label">Phone</label>
                      <Input id="dashboard-phone" name="phone" value={form.phone} onChange={handleChange} />
                    </div>
                    <div className="portfolio-editor-field">
                      <label htmlFor="dashboard-location" className="portfolio-editor-label">Location</label>
                      <Input id="dashboard-location" name="location" value={form.location} onChange={handleChange} />
                    </div>
                    <div className="portfolio-editor-field">
                      <label htmlFor="dashboard-birthdate" className="portfolio-editor-label">Birth Date</label>
                      <Input id="dashboard-birthdate" name="birthdate" type="date" value={form.birthdate} onChange={handleChange} />
                    </div>
                  </div>

                  <div className="portfolio-editor-actions">
                    <Button type="submit" className="portfolio-editor-action" disabled={isSaving}>
                      {isSaving ? "Saving..." : "Save changes"}
                    </Button>
                    <Button type="button" variant="soft" className="portfolio-editor-action" onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="portfolio-editor-summary">
                  <p className="portfolio-editor-copy">
                    Keep your contact, location, and travel basics current so every selected route exports with cleaner details.
                  </p>

                  <div className="portfolio-editor-stops">
                    <div className="portfolio-editor-stop">
                      <span className="portfolio-editor-stop-label">Museum route</span>
                      <strong>Te Papa and harbour district</strong>
                    </div>
                    <div className="portfolio-editor-stop">
                      <span className="portfolio-editor-stop-label">Natural route</span>
                      <strong>Milford and Huka Falls</strong>
                    </div>
                  </div>

                  <div className="portfolio-editor-actions">
                    <Button className="portfolio-editor-action" onClick={handleStartEdit}>
                      Edit profile
                    </Button>
                    <Button variant="soft" className="portfolio-editor-action" onClick={logout}>
                      <LogoutArrowIcon className="portfolio-dashboard-inline-icon" />
                      Log out
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
        )}
      </div>
      </div>
    </div>
  );
}
