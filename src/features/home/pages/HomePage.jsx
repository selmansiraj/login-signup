import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import flamingoImage from "../../../assets/flamingo.jpg";
import beehiveImage from "../../../assets/Beehive.jfif";
import droneVideo from "../../../assets/drone.mp4";
import franzImage from "../../../assets/Franz.jpg";
import hukaFallsImage from "../../../assets/HukaFalls.jfif";
import larnachCastleImage from "../../../assets/LarnachCastle.jfif";
import landImage from "../../../assets/land.jfif";
import castleImage from "../../../assets/castle.jpg";
import milfordDuskImage from "../../../assets/Milford.jpg";
import milfordImage from "../../../assets/Milfords.jpg";
import mountRuapehuImage from "../../../assets/MountRuapehu.jfif";
import skyTowerImage from "../../../assets/SkyTower.jfif";
import tePapaImage from "../../../assets/TePapa.jfif";
import tePapasImage from "../../../assets/TePapa.jfif";
import milfordImageAlt from "../../../assets/Milford.jpg";
import mapImage from "../../../assets/map.png";
import vacationsImage from "../../../assets/Vacations.jpg";

const heroSlides = [
  {
    title: "Milford Sound",
    navLabel: "Milford",
    location: "Fiordland, South Island",
    description:
      "Black-water fjords, cliff walls, and low cloud make this the most cinematic arrival in New Zealand.",
    image: milfordImage
  },
  {
    title: "Castle Heritage",
    navLabel: "Castle",
    location: "Southern Estate",
    description:
      "Stone facades, towers, and garden-set architecture introduce a more stately and historic mood to the route.",
    image: castleImage
  },
  {
    title: "Wildlife Waters",
    navLabel: "Wildlife",
    location: "Coastal Sanctuary",
    description:
      "Reflective shallows, bright birdlife, and open waterlines bring a softer natural rhythm into the hero sequence.",
    image: flamingoImage
  },
  {
    title: "Golden Fjords",
    navLabel: "Sunset",
    location: "Milford Evening",
    description:
      "When the late light hits the water, the whole fjord shifts into amber and deep blue in a single sweep.",
    image: milfordDuskImage
  },
  {
    title: "Franz Josef",
    navLabel: "Glacier",
    location: "West Coast",
    description:
      "Glacier air, heli-hike trails, and icy ridgelines bring a sharper alpine energy into the hero sequence.",
    image: franzImage
  },
  {
    title: "Island Retreat",
    navLabel: "Coast",
    location: "Bay of Islands",
    description:
      "Quiet docks, glassy coves, and open summer mornings make this the slow-luxury side of the journey.",
    image: vacationsImage
  },
  {
    title: "Misty Peaks",
    navLabel: "Peaks",
    location: "Southern Wild",
    description:
      "Remote waterlines and darker alpine moods deliver the dramatic final act of the route.",
    image: milfordImageAlt
  }
];

const rotationDurationMs = 5200;
const previewCount = 4;

const landmarkCards = [
  {
    title: "Sky Tower",
    location: "Auckland",
    eyebrow: "Modern Icon",
    description:
      "A vertical landmark that frames Auckland's skyline and the urban energy of the north.",
    image: skyTowerImage
  },
  {
    title: "The Beehive",
    location: "Wellington",
    eyebrow: "Civic Landmark",
    description:
      "New Zealand's most recognizable seat of government, set at the heart of the capital's public story.",
    image: beehiveImage
  },
  {
    title: "Te Papa Tongarewa",
    location: "Wellington",
    eyebrow: "Cultural Treasure",
    description:
      "The national museum where Maori narratives, art, and living heritage are presented with depth and care.",
    image: tePapaImage
  },
  {
    title: "Larnach Castle",
    location: "Dunedin",
    eyebrow: "Historic Estate",
    description:
      "A rare New Zealand castle pairing Victorian architecture with dramatic southern coastal views.",
    image: larnachCastleImage
  },
  {
    title: "Mount Ruapehu",
    location: "Tongariro",
    eyebrow: "Volcanic Peak",
    description:
      "A commanding alpine giant whose snow, stone, and sacred landscape shape the central North Island.",
    image: mountRuapehuImage
  },
  {
    title: "Huka Falls",
    location: "Taupo",
    eyebrow: "Natural Wonder",
    description:
      "A rush of glacier-blue water that turns raw geothermal power into one of the country's defining sights.",
    image: hukaFallsImage
  }
];

const curatedJourneys = [
  {
    title: "Capital Stories & Maori Collections",
    eyebrow: "Culture / Wellington",
    summary:
      "An editorial route through the capital where museum storytelling, harbour walks, and civic landmarks reveal the country's living cultural voice.",
    tags: ["Culture", "Museums"],
    duration: "4 Days",
    groupSize: "4-10 Guests",
    route: "Te Papa, waterfront, civic quarter",
    price: "NZ$940",
    image: tePapasImage,
    accentImage: beehiveImage,
    accentLabel: "Beehive stop",
    featured: true
  },
  {
    title: "Southern Heritage & Castle Evenings",
    eyebrow: "Heritage / Dunedin",
    summary:
      "Slow down through stone interiors, coastal rail edges, and the dramatic southern atmosphere that surrounds New Zealand's grandest historic estate.",
    tags: ["Heritage", "Architecture"],
    duration: "5 Days",
    groupSize: "2-8 Guests",
    route: "Larnach Castle, harbour, Otago coast",
    price: "NZ$1,160",
    image: larnachCastleImage
  },
  {
    title: "Volcanic Legends & River Light",
    eyebrow: "Landscapes / Central Plateau",
    summary:
      "A more elemental journey shaped by volcanic silhouette, Maori place memory, geothermal energy, and the electric blue force of Taupo's waterlines.",
    tags: ["Sacred Landscapes", "Water Trails"],
    duration: "6 Days",
    groupSize: "4-12 Guests",
    route: "Ruapehu, geothermal valleys, Huka Falls",
    price: "NZ$1,320",
    image: mountRuapehuImage,
    accentImage: hukaFallsImage,
    accentLabel: "Huka Falls"
  }
];

const cultureHighlights = [
  {
    number: "01",
    title: "Powhiri & Marae Welcome",
    description:
      "Step into spaces of welcome shaped by protocol, connection, and respect, where every arrival carries meaning."
  },
  {
    number: "02",
    title: "Kai, Craft & Storytelling",
    description:
      "Follow food, carving, weaving, and oral tradition as living expressions of identity rather than museum pieces."
  },
  {
    number: "03",
    title: "Land, Water & Ancestral Memory",
    description:
      "Experience landscapes not just as scenery, but as places layered with whakapapa, guardianship, and story."
  }
];

const aboutFeatures = [
  {
    number: "01",
    title: "Local Cultural Insight",
    description:
      "Every route is shaped around context, story, and place so the journey feels informed rather than surface-level."
  },
  {
    number: "02",
    title: "Safe, Thoughtful Planning",
    description:
      "From regional stays to transport rhythm, we design calmer travel days so guests can stay present in the experience."
  },
  {
    number: "03",
    title: "Respectful Slow Travel",
    description:
      "We favor smaller group energy and more meaningful stops that honour local communities and the tone of each landscape."
  }
];

const pageSections = [
  { id: "hero", label: "Home" },
  { id: "landmarks", label: "Landmarks" },
  { id: "journeys", label: "Journeys" },
  { id: "culture", label: "Culture" },
  { id: "about", label: "About" }
];

export default function HomePage() {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeSection, setActiveSection] = useState("hero");
  const [isNavPinned, setIsNavPinned] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % heroSlides.length);
    }, rotationDurationMs);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsNavPinned(window.scrollY > 18);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const sectionElements = pageSections
      .map((section) => document.getElementById(section.id))
      .filter(Boolean);

    if (!sectionElements.length) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((entryA, entryB) => entryB.intersectionRatio - entryA.intersectionRatio)[0];

        if (visibleEntry?.target?.id) {
          setActiveSection(visibleEntry.target.id);
        }
      },
      {
        rootMargin: "-22% 0px -48% 0px",
        threshold: [0.2, 0.35, 0.55, 0.75]
      }
    );

    sectionElements.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
    };
  }, []);

  const activeSlide = heroSlides[activeIndex];

  const previewSlides = useMemo(
    () =>
      Array.from({ length: previewCount }, (_, offset) => {
        const index = (activeIndex + offset + 1) % heroSlides.length;

        return {
          ...heroSlides[index],
          index,
          slot: offset
        };
      }),
    [activeIndex]
  );

  const handleSectionNavigation = (sectionId) => {
    const section = document.getElementById(sectionId);

    if (!section) {
      return;
    }

    setActiveSection(sectionId);
    setIsMenuOpen(false);
    const navOffset = window.innerWidth <= 900 ? 124 : 108;
    const targetTop = section.getBoundingClientRect().top + window.scrollY - navOffset;

    window.scrollTo({
      top: Math.max(targetTop, 0),
      behavior: "smooth"
    });
  };

  return (
    <main className="cinematic-hero-shell">
      <header className={`cinematic-hero-nav ${isNavPinned ? "is-pinned" : ""}`}>
        <button
          type="button"
          className="cinematic-hero-brand"
          onClick={() => {
            setActiveIndex(0);
            setIsMenuOpen(false);
            handleSectionNavigation("hero");
          }}
          aria-label="Return to the top of the page"
        >
          <span className="cinematic-hero-brand-mark">
            <img src={mapImage} alt="" className="cinematic-hero-brand-map" />
          </span>
          <span className="cinematic-hero-brand-text">New Zealand</span>
          </button>

        <div className="cinematic-hero-nav-desktop">
          <nav className="cinematic-hero-menu" aria-label="Page sections">
            {pageSections.map((section) => (
              <button
                key={section.id}
                type="button"
                className={`cinematic-hero-menu-item ${activeSection === section.id ? "is-active" : ""}`}
                onClick={() => handleSectionNavigation(section.id)}
              >
                {section.label}
              </button>
            ))}
          </nav>

          <button
            type="button"
            className="cinematic-hero-login"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>

        <button
          type="button"
          className={`cinematic-hero-menu-toggle ${isMenuOpen ? "is-open" : ""}`}
          onClick={() => setIsMenuOpen((current) => !current)}
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMenuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      <div className={`cinematic-hero-drawer-backdrop ${isMenuOpen ? "is-open" : ""}`} onClick={() => setIsMenuOpen(false)} />
      <aside className={`cinematic-hero-drawer ${isMenuOpen ? "is-open" : ""}`} aria-label="Mobile navigation">
        <button
          type="button"
          className="cinematic-hero-drawer-close"
          onClick={() => setIsMenuOpen(false)}
          aria-label="Close navigation menu"
        >
          <span />
          <span />
        </button>

        <nav className="cinematic-hero-drawer-menu">
          {pageSections.map((section) => (
            <button
              key={section.id}
              type="button"
              className={`cinematic-hero-drawer-link ${activeSection === section.id ? "is-active" : ""}`}
              onClick={() => handleSectionNavigation(section.id)}
            >
              {section.label}
            </button>
          ))}
        </nav>

        <button type="button" className="cinematic-hero-drawer-login" onClick={() => navigate("/login")}>
          Login
        </button>
      </aside>

      <section id="hero" className="cinematic-hero-scene">
        <div className="cinematic-hero-background-stack">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.title}
              className={`cinematic-hero-background ${index === activeIndex ? "is-active" : ""}`}
              style={{ backgroundImage: `url(${slide.image})` }}
            />
          ))}
        </div>

        <div className="cinematic-hero-overlay" />

        <div className="cinematic-hero-frame">
          <div className="cinematic-hero-body">
            <section className="cinematic-hero-main">
              <span className="cinematic-hero-location">{activeSlide.location}</span>
              <h1 className="cinematic-hero-title">{activeSlide.title}</h1>
              <p className="cinematic-hero-description">{activeSlide.description}</p>

              <div className="cinematic-hero-counter">
                <span className="cinematic-hero-counter-current">
                  {String(activeIndex + 1).padStart(2, "0")}
                </span>
                <span className="cinematic-hero-counter-line" />
                <span className="cinematic-hero-counter-total">
                  {String(heroSlides.length).padStart(2, "0")}
                </span>
              </div>
            </section>

            <aside className="cinematic-hero-preview-rail" aria-label="Upcoming destinations">
              {previewSlides.map((slide) => (
                <button
                  key={slide.title}
                  type="button"
                  className={`cinematic-hero-preview-card cinematic-hero-preview-slot-${slide.slot}`}
                  style={{ backgroundImage: `url(${slide.image})` }}
                  onClick={() => setActiveIndex(slide.index)}
                  aria-label={`Show ${slide.title}`}
                >
                  <span className="cinematic-hero-preview-shade" />
                  <span className="cinematic-hero-preview-number">
                    {String(slide.index + 1).padStart(2, "0")}
                  </span>
                  <span className="cinematic-hero-preview-copy">
                    <span className="cinematic-hero-preview-label">{slide.navLabel}</span>
                    <strong className="cinematic-hero-preview-title">{slide.title}</strong>
                  </span>
                </button>
              ))}
            </aside>
          </div>
        </div>
      </section>

      <section id="landmarks" className="landmarks-section">
        <div className="landmarks-section-head">
          <span className="landmarks-kicker">Landmarks Of Aotearoa</span>
          <h2 className="landmarks-title">Cultural icons and natural legends across New Zealand</h2>
          <p className="landmarks-copy">
            Explore a curated collection of places that shape the country&apos;s identity, from civic and
            cultural institutions to volcanic landscapes and unforgettable waterlines.
          </p>
        </div>

        <div className="landmarks-grid">
          {landmarkCards.map((card) => (
            <article
              key={card.title}
              className="landmarks-card"
              style={{ backgroundImage: `url(${card.image})` }}
            >
              <div className="landmarks-card-overlay" />
              <div className="landmarks-card-content">
                <span className="landmarks-card-eyebrow">{card.eyebrow}</span>
                <h3 className="landmarks-card-title">{card.title}</h3>
                <span className="landmarks-card-location">{card.location}</span>
                <p className="landmarks-card-copy">{card.description}</p>
                <button
                  type="button"
                  className="landmarks-card-action"
                  onClick={() => navigate("/login")}
                >
                  Explore
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="journeys" className="journeys-section">
        <div className="journeys-shell">
          <div className="journeys-head">
            <div className="journeys-head-copy">
              <span className="journeys-kicker">Curated Journeys</span>
              <h2 className="journeys-title">Travel deeper through heritage, landscape, and living culture</h2>
              <p className="journeys-copy">
                Designed as slower New Zealand routes, these journeys pair landmark places with more
                meaningful context, bringing together architecture, Maori storytelling, and dramatic terrain.
              </p>
            </div>

            <button
              type="button"
              className="journeys-link"
              onClick={() => navigate("/login")}
            >
              View All Journeys
            </button>
          </div>

          <div className="journeys-grid">
            {curatedJourneys
              .filter((journey) => journey.featured)
              .map((journey) => (
                <article key={journey.title} className="journey-card journey-card-featured">
                  <div
                    className="journey-card-media"
                    style={{ backgroundImage: `url(${journey.image})` }}
                  >
                    <div className="journey-card-shade" />
                    <div className="journey-card-pattern" />
                    <div className="journey-card-tags">
                      {journey.tags.map((tag) => (
                        <span key={tag} className="journey-tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                    {journey.accentImage ? (
                      <div
                        className="journey-card-accent-photo"
                        style={{ backgroundImage: `url(${journey.accentImage})` }}
                      >
                        <span>{journey.accentLabel}</span>
                      </div>
                    ) : null}
                  </div>

                  <div className="journey-card-body">
                    <span className="journey-card-eyebrow">{journey.eyebrow}</span>
                    <h3 className="journey-card-title">{journey.title}</h3>
                    <p className="journey-card-summary">{journey.summary}</p>

                    <div className="journey-card-metrics">
                      <div className="journey-metric">
                        <span className="journey-metric-dot" />
                        <span>{journey.duration}</span>
                      </div>
                      <div className="journey-metric">
                        <span className="journey-metric-dot" />
                        <span>{journey.groupSize}</span>
                      </div>
                      <div className="journey-metric">
                        <span className="journey-metric-dot" />
                        <span>{journey.route}</span>
                      </div>
                    </div>

                    <div className="journey-card-footer">
                      <div className="journey-card-price">
                        <span className="journey-price-label">Starting from</span>
                        <strong className="journey-price-value">{journey.price}</strong>
                      </div>

                      <button
                        type="button"
                        className="journey-card-action"
                        onClick={() => navigate("/login")}
                      >
                        Plan This Route
                      </button>
                    </div>
                  </div>
                </article>
              ))}

            <div className="journeys-stack">
              {curatedJourneys
                .filter((journey) => !journey.featured)
                .map((journey) => (
                  <article key={journey.title} className="journey-card">
                    <div
                      className="journey-card-media"
                      style={{ backgroundImage: `url(${journey.image})` }}
                    >
                      <div className="journey-card-shade" />
                      <div className="journey-card-pattern" />
                      <div className="journey-card-tags">
                        {journey.tags.map((tag) => (
                          <span key={tag} className="journey-tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                      {journey.accentImage ? (
                        <div
                          className="journey-card-accent-photo"
                          style={{ backgroundImage: `url(${journey.accentImage})` }}
                        >
                          <span>{journey.accentLabel}</span>
                        </div>
                      ) : null}
                    </div>

                    <div className="journey-card-body">
                      <span className="journey-card-eyebrow">{journey.eyebrow}</span>
                      <h3 className="journey-card-title">{journey.title}</h3>
                      <p className="journey-card-summary">{journey.summary}</p>

                      <div className="journey-card-metrics">
                        <div className="journey-metric">
                          <span className="journey-metric-dot" />
                          <span>{journey.duration}</span>
                        </div>
                        <div className="journey-metric">
                          <span className="journey-metric-dot" />
                          <span>{journey.groupSize}</span>
                        </div>
                        <div className="journey-metric">
                          <span className="journey-metric-dot" />
                          <span>{journey.route}</span>
                        </div>
                      </div>

                      <div className="journey-card-footer">
                        <div className="journey-card-price">
                          <span className="journey-price-label">Starting from</span>
                          <strong className="journey-price-value">{journey.price}</strong>
                        </div>

                        <button
                          type="button"
                          className="journey-card-action"
                          onClick={() => navigate("/login")}
                        >
                          Plan This Route
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
            </div>
          </div>
        </div>
      </section>

      <section id="culture" className="culture-section">
        <div className="culture-shell">
          <div className="culture-copy">
            <span className="culture-kicker">Living Culture</span>
            <h2 className="culture-title">
              Immerse in the living roots of
              <span> Aotearoa</span>
            </h2>
            <p className="culture-intro">
              Beyond the postcard view, New Zealand is carried through welcome, language, craft, and a
              deep relationship with land and water. This section brings that cultural atmosphere forward
              with stronger motion and a more cinematic editorial rhythm.
            </p>

            <div className="culture-points">
              {cultureHighlights.map((item, index) => (
                <article
                  key={item.number}
                  className="culture-point"
                  style={{ animationDelay: `${index * 120}ms` }}
                >
                  <span className="culture-point-number">{item.number}</span>
                  <div className="culture-point-copy">
                    <h3 className="culture-point-title">{item.title}</h3>
                    <p className="culture-point-description">{item.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="culture-media-grid">
            <article className="culture-video-card">
              <div className="culture-video-frame">
                <video
                  className="culture-video"
                  src={droneVideo}
                  autoPlay
                  muted
                  loop
                  playsInline
                />
                <div className="culture-video-overlay" />
                <span className="culture-media-chip">Drone view</span>
              </div>
            </article>

            <article className="culture-image-card">
              <div
                className="culture-image-frame"
                style={{ backgroundImage: `url(${landImage})` }}
              >
                <div className="culture-image-overlay" />
                <span className="culture-media-chip">Land stories</span>
              </div>
            </article>

            <article className="culture-cta-card">
              <span className="culture-cta-kicker">Discover The Roots</span>
              <h3 className="culture-cta-title">A cultural route that moves beyond sightseeing.</h3>
              <p className="culture-cta-copy">
                Follow a slower guide through stories, landscapes, and places of belonging across the islands.
              </p>
              <button
                type="button"
                className="culture-cta-action"
                onClick={() => navigate("/login")}
              >
                View Culture Guide
              </button>
            </article>
          </div>
        </div>
      </section>

      <section id="about" className="about-section">
        <div className="about-shell">
          <div className="about-visual">
            <div
              className="about-visual-frame"
              style={{ backgroundImage: `url(${beehiveImage})` }}
            >
              <div className="about-visual-overlay" />
              <div className="about-quote-card">
                <div className="about-quote-rating" aria-hidden="true">
                  <span className="about-quote-dot" />
                  <span className="about-quote-dot" />
                  <span className="about-quote-dot" />
                  <span className="about-quote-dot" />
                  <span className="about-quote-dot" />
                </div>
                <p className="about-quote-text">"A journey shaped with depth, warmth, and a real sense of place."</p>
                <span className="about-quote-author">Guest reflection</span>
              </div>
            </div>
          </div>

          <div className="about-copy">
            <span className="about-kicker">About Us</span>
            <h2 className="about-title">
              Your gateway to a more
              <span> grounded New Zealand journey</span>
            </h2>
            <p className="about-intro">
              We build travel experiences that move beyond checklists. Our approach brings together local
              atmosphere, cultural respect, slower pacing, and stronger storytelling so each route feels
              memorable for the right reasons.
            </p>

            <div className="about-features">
              {aboutFeatures.map((feature) => (
                <article key={feature.number} className="about-feature-card">
                  <span className="about-feature-number">{feature.number}</span>
                  <h3 className="about-feature-title">{feature.title}</h3>
                  <p className="about-feature-description">{feature.description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="site-footer-grid">
          <button
            type="button"
            className="site-footer-brand"
            onClick={() => handleSectionNavigation("hero")}
          >
            <div className="site-footer-logo" bgcolor="#fff">
              <img src={mapImage} alt="" className="site-footer-map" />
            </div>
            <div>
              <h3 className="site-footer-title">New Zealand</h3>
              <p className="site-footer-copy">
                A cinematic travel landing page shaped around landmarks, culture, and slower routes through
                Aotearoa.
              </p>
            </div>
          </button>

          <div className="site-footer-column">
            <span className="site-footer-heading">Sections</span>
            {pageSections.map((section) => (
              <button
                key={section.id}
                type="button"
                className="site-footer-link"
                onClick={() => handleSectionNavigation(section.id)}
              >
                {section.label}
              </button>
            ))}
          </div>

          <div className="site-footer-column">
            <span className="site-footer-heading">Explore</span>
            <button type="button" className="site-footer-link" onClick={() => navigate("/login")}>
              Start planning
            </button>
            <button type="button" className="site-footer-link" onClick={() => handleSectionNavigation("journeys")}>
              Curated journeys
            </button>
            <button type="button" className="site-footer-link" onClick={() => handleSectionNavigation("culture")}>
              Culture guide
            </button>
          </div>

          <div className="site-footer-column">
            <span className="site-footer-heading">Contact</span>
            <span className="site-footer-meta">hello@newzealandjourneys.com</span>
            <span className="site-footer-meta">Auckland / Wellington / Queenstown</span>
            <button type="button" className="site-footer-action" onClick={() => navigate("/login")}>
              Login
            </button>
          </div>
        </div>

        <div className="site-footer-bottom">
          <span>Designed for immersive travel storytelling.</span>
          <div className="site-footer-bottom-actions">
            <span>New Zealand tourism concept page.</span>
            <button
              type="button"
              className="site-footer-backtop"
              onClick={() => handleSectionNavigation("hero")}
            >
              Back to top
            </button>
          </div>
        </div>
      </footer>
    </main>
  );
}
