import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import castleImage from "../../../assets/castle.jpg";
import franzImage from "../../../assets/Franz.jpg";
import mapImage from "../../../assets/map.png";
import milfordImage from "../../../assets/Milford.jpg";
import vacationsImage from "../../../assets/Vacations.jpg";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";

const authScenes = [
  {
    title: "Milford Dawn Route",
    region: "Fiordland",
    caption: "Misty fjords, still waterlines, and a quieter kind of arrival.",
    image: milfordImage
  },
  {
    title: "Franz Josef Air Trail",
    region: "West Coast",
    caption: "Glacier light and alpine air set the tone for a sharper journey.",
    image: franzImage
  },
  {
    title: "Bay Of Islands Stay",
    region: "Northland",
    caption: "Dock mornings, island coves, and a slower luxury pace.",
    image: vacationsImage
  },
  {
    title: "Castle Heritage Circuit",
    region: "Southern Estate",
    caption: "Historic stonework and stay experiences with more story built in.",
    image: castleImage
  }
];

function PlaneIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path
        d="M56 10 8 28l17 6 6 17 25-41Z"
        fill="currentColor"
        opacity="0.92"
      />
      <path
        d="m25 34 31-24-25 41-6-17Z"
        fill="currentColor"
        opacity="0.62"
      />
    </svg>
  );
}

function TicketIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 7.5A1.5 1.5 0 0 1 5.5 6h13A1.5 1.5 0 0 1 20 7.5V10a2 2 0 1 0 0 4v2.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 16.5V14a2 2 0 1 0 0-4V7.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path d="M9 7.5v9" stroke="currentColor" strokeWidth="1.4" strokeDasharray="1.6 1.6" />
      <path d="M11.5 10.5h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M11.5 13.5h2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function BoardingIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 17h12M8 7.5h8m-7 4h6m-7.5 8 2-13h5l2 13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function AuthTravelLayout({
  title,
  subtitle,
  children,
  footer,
  sideKicker,
  sideTitle,
  sideCopy,
  topRightAction
}) {
  const navigate = useNavigate();
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveSceneIndex((currentIndex) => (currentIndex + 1) % authScenes.length);
    }, 5200);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const activeScene = authScenes[activeSceneIndex];

  const sceneIndicators = useMemo(
    () =>
      authScenes.map((scene, index) => ({
        ...scene,
        isActive: index === activeSceneIndex
      })),
    [activeSceneIndex]
  );

  return (
    <div className="travel-auth-shell">
      <div className="travel-auth-background" aria-hidden="true">
        <div className="travel-auth-aurora aurora-a" />
        <div className="travel-auth-aurora aurora-b" />
        <div className="travel-auth-aurora aurora-c" />
        <div className="travel-auth-scanline" />
        {authScenes.map((scene, index) => (
          <div
            key={scene.title}
            className={`travel-auth-slide ${index === activeSceneIndex ? "is-active" : ""}`}
            style={{ backgroundImage: `url(${scene.image})` }}
          />
        ))}
        <div className="travel-auth-slide-overlay" />
        <div className="travel-auth-slide-grain" />

        <div className="travel-auth-plane">
          <PlaneIcon />
        </div>

        <Card className="travel-auth-ticket travel-auth-ticket-primary">
          <CardContent className="travel-auth-ticket-content">
            <span className="travel-auth-ticket-label">Boarding pass</span>
            <strong className="travel-auth-ticket-title">{activeScene.region}</strong>
            <span className="travel-auth-ticket-copy">Gate open for scenic arrivals</span>
          </CardContent>
        </Card>

        <Card className="travel-auth-ticket travel-auth-ticket-secondary">
          <CardContent className="travel-auth-ticket-content">
            <span className="travel-auth-ticket-icon">
              <TicketIcon />
            </span>
            <div className="travel-auth-ticket-stack">
              <span className="travel-auth-ticket-label">Route code</span>
              <strong className="travel-auth-ticket-title">NZ 2026</strong>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="travel-auth-viewport">
        <Card className="travel-auth-layout-card">
          <div className="travel-auth-grid">
            <div className="travel-auth-form-zone">
              <CardHeader className="travel-auth-header">
                <div className="travel-auth-topbar">
                  <button
                    type="button"
                    className="travel-auth-brand"
                    onClick={() => navigate("/")}
                  >
                    <span className="travel-auth-brand-mark">
                      <img src={mapImage} alt="" className="travel-auth-brand-map" />
                    </span>
                    <span className="travel-auth-brand-copy">
                      <strong>New Zealand Routes</strong>
                      <span>Touring access portal</span>
                    </span>
                  </button>

                  <div className="travel-auth-topbar-actions">
                    <Button
                      variant="ghost"
                      className="travel-auth-home-button travel-auth-places-button"
                      onClick={() => window.location.assign("/#places")}
                    >
                      ✦ Places
                    </Button>
                    <Button variant="ghost" className="travel-auth-home-button" onClick={() => navigate("/")}>
                      Explore home
                    </Button>

                    {topRightAction ? topRightAction : null}
                  </div>
                </div>

                <div className="travel-auth-heading-block">
                  <CardTitle className="travel-auth-heading">
                    {title}
                  </CardTitle>
                  <CardDescription className="travel-auth-heading-copy">
                    {subtitle}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="travel-auth-body">
                {children}
                {footer ? <div className="travel-auth-footer">{footer}</div> : null}
              </CardContent>
            </div>

            <div className="travel-auth-side-zone">
              <Card className="travel-auth-showcase-card">
                <div
                  className="travel-auth-showcase-image"
                  style={{ backgroundImage: `url(${activeScene.image})` }}
                >
                  <div className="travel-auth-showcase-shade" />
                  <div className="travel-auth-showcase-content">
                    <div className="travel-auth-showcase-badges">
                      <Badge className="travel-auth-badge-dark">Live destination</Badge>
                      <Badge className="travel-auth-badge-dark travel-auth-badge-dark-muted">
                        <span className="travel-auth-badge-icon">
                          <BoardingIcon />
                        </span>
                        Scenic entry
                      </Badge>
                    </div>

                  <div className="travel-auth-showcase-copy">
                      <span className="travel-auth-side-kicker">{sideKicker || activeScene.region}</span>
                      <h3 className="travel-auth-side-title">
                        {sideTitle || activeScene.title}
                      </h3>
                      <p className="travel-auth-side-copy">
                        {sideCopy || activeScene.caption}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="travel-auth-scene-footer">
                <div className="travel-auth-scene-copy">
                  <span className="travel-auth-scene-label">
                    Changing scene
                  </span>
                  <p className="travel-auth-scene-description">{activeScene.caption}</p>
                </div>

                <div className="travel-auth-scene-dots">
                  {sceneIndicators.map((scene) => (
                    <button
                      key={scene.title}
                      type="button"
                      className={`travel-auth-dot ${scene.isActive ? "is-active" : ""}`}
                      onClick={() => setActiveSceneIndex(authScenes.findIndex((item) => item.title === scene.title))}
                      aria-label={`Show ${scene.title}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
