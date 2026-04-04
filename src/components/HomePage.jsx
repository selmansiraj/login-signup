import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import duneImage from "../assets/dune.jpg";
import beehiveImage from "../assets/Beehive.jfif";
import glacierImage from "../assets/Franz.jfif";
import hukaFallsImage from "../assets/HukaFalls.jfif";
import larnachCastleImage from "../assets/LarnachCastle.jfif";
import tekapoImage from "../assets/Lupin.jfif";
import milfordSunsetImage from "../assets/Milford.jfif";
import milfordImage from "../assets/Milfords.jfif";
import mountRuapehuImage from "../assets/MountRuapehu.jfif";
import skyTowerImage from "../assets/SkyTower.jfif";
import tePapaImage from "../assets/TePapaTongarewa.jpg";
import tePapasImage from "../assets/TePapa.jfif";
import milfordImageAlt from "../assets/Milford.jfif";
import mapImage from "../assets/map.png";
import coastalImage from "../assets/Vacations.jfif";

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
    title: "Lake Tekapo",
    navLabel: "Tekapo",
    location: "Mackenzie Basin",
    description:
      "Turquoise water, lupin blooms, and stargazing skies turn every hour here into a postcard moment.",
    image: tekapoImage
  },
  {
    title: "Dune Escape",
    navLabel: "Dunes",
    location: "Northland Coast",
    description:
      "Sunlit ridges and warm coastal light bring a softer, wilder side of the island route into view.",
    image: duneImage
  },
  {
    title: "Golden Fjords",
    navLabel: "Sunset",
    location: "Milford Evening",
    description:
      "When the late light hits the water, the whole fjord shifts into amber and deep blue in a single sweep.",
    image: milfordSunsetImage
  },
  {
    title: "Franz Josef",
    navLabel: "Glacier",
    location: "West Coast",
    description:
      "Glacier air, heli-hike trails, and icy ridgelines bring a sharper alpine energy into the hero sequence.",
    image: glacierImage
  },
  {
    title: "Island Retreat",
    navLabel: "Coast",
    location: "Bay of Islands",
    description:
      "Quiet docks, glassy coves, and open summer mornings make this the slow-luxury side of the journey.",
    image: coastalImage
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

export default function HomePage() {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % heroSlides.length);
    }, rotationDurationMs);

    return () => {
      window.clearInterval(intervalId);
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

  return (
    <main className="cinematic-hero-shell">
      <section className="cinematic-hero-scene">
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
          <header className="cinematic-hero-nav">
            <button
              type="button"
              className="cinematic-hero-brand"
              onClick={() => setActiveIndex(0)}
              aria-label="Show the first destination"
            >
              <span className="cinematic-hero-brand-mark">
                <img src={mapImage} alt="" className="cinematic-hero-brand-map" />
              </span>
              <span className="cinematic-hero-brand-text">New Zealand</span>
            </button>

            <nav className="cinematic-hero-menu" aria-label="Hero destinations">
              {heroSlides.map((slide, index) => (
                <button
                  key={slide.navLabel}
                  type="button"
                  className={`cinematic-hero-menu-item ${index === activeIndex ? "is-active" : ""}`}
                  onClick={() => setActiveIndex(index)}
                >
                  {slide.navLabel}
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
          </header>

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

      <section className="landmarks-section">
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
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="journeys-section">
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
    </main>
  );
}
