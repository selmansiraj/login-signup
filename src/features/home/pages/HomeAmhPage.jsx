import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchTourismPlaces } from "../../../lib/adminApi";
import { clearAuthSession, getAuthToken, getStoredUser, subscribeAuthSession } from "../../../lib/authApi";
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
import mountRuapehuImage from "../../../assets/MountRuapehu.jpg";
import skyTowerImage from "../../../assets/SkyTower.jfif";
import tePapaImage from "../../../assets/TePapa.jfif";
import tePapasImage from "../../../assets/TePapa.jfif";
import milfordImageAlt from "../../../assets/Milford.jpg";
import mapImage from "../../../assets/map.png";
import vacationsImage from "../../../assets/Vacations.jpg";
import hangiImage from "../../../assets/TheHāngī.jpg";
import kumaraImage from "../../../assets/Kūmara.jpg";
import kaimoanaImage from "../../../assets/Kaimoana.jpg";
import forestFoodsImage from "../../../assets/ForestFoods.jpg";
import paImage from "../../../assets/thepa.jfif";
import maraeImage from "../../../assets/themarae.jpg";
import wharepuniImage from "../../../assets/Wharepuni.jpg";
import patakaImage from "../../../assets/Pātaka.jpg";
import harakekeImage from "../../../assets/Harakeke.jpg";
import korowaiImage from "../../../assets/TheKorowai.jfif";
import piupiuImage from "../../../assets/Piupiu.jfif";
import pakeImage from "../../../assets/Pākē.jfif";

// ─── Amharic Content ─────────────────────────────────────────────────────────

const heroSlides = [
  { title: "ሚልፎርድ ሳውንድ", navLabel: "ሚልፎርድ", location: "ፊዮርድላንድ፣ ደቡብ ደሴት", description: "ጥቁር ውሃ፣ ከፍ ያሉ ግድግዳ ያሉ ፊዮርዶች እና ዝቅተኛ ደመና ይህንን መድረሻ በኒውዚላንድ ውስጥ እጅግ ሲኒማዊ ያደርጉታል።", image: milfordImage },
  { title: "የቤተ መንግስት ቅርስ", navLabel: "ቤተ መንግስት", location: "የደቡብ እስቴት", description: "የድንጋይ ፊትለፊት፣ ግንቦች እና በአትክልት የተከበቡ ህንፃዎች መንገዱን የታሪክ እና የክብር አየር ይሰጣሉ።", image: castleImage },
  { title: "የዱር ሕይወት ውሃዎች", navLabel: "ዱር ሕይወት", location: "የባህር ዳርቻ ጥበቃ ቦታ", description: "የሚያንጸባርቁ ውሃዎች፣ ብሩህ ወፎች እና ክፍት የውሃ መስመሮች ለጉዞው ለስላሳ የተፈጥሮ ምት ያመጣሉ።", image: flamingoImage },
  { title: "ወርቃማ ፊዮርዶች", navLabel: "መጥለቂያ", location: "የሚልፎርድ ምሽት", description: "የእንግዲኛ ብርሃን በውሃው ላይ ሲወድቅ ፊዮርዱ በአንድ እልፍኝ ከወርቃማ ወደ ጥልቅ ሰማያዊ ይቀየራል።", image: milfordDuskImage },
  { title: "ፍራንዝ ጆሴፍ", navLabel: "ግላሲየር", location: "ዌስት ኮስት", description: "የበረዶ አየር፣ የሄሊ-ሃይክ መንገዶች እና ብርድ ሸንተረሮች የአልፕስ ኃይል ያለውን አየር ይዘው ይመጣሉ።", image: franzImage },
  { title: "የደሴት ማረፊያ", navLabel: "ዳርቻ", location: "ቤይ ኦፍ አይላንድስ", description: "ዝምታ ያለባቸው ዶኮች፣ ጸጥ ያሉ ባሕር ጎዳናዎች እና ክፍት የበጋ ጥዋቶች የዝምታ የቅንጦት ጉዞን ያቀርባሉ።", image: vacationsImage },
  { title: "ጭጋጋማ ጫፎች", navLabel: "ጫፎች", location: "የደቡብ ዱር", description: "ሩቅ የውሃ መስመሮች እና ጥልቅ የአልፕስ አየር ለጉዞው አስደናቂ የመጨረሻ ክፍል ያቀርባሉ።", image: milfordImageAlt }
];

const heritageStats = [
  { value: 3, suffix: "", label: "የዩኔስኮ የዓለም ቅርስ ቦታዎች" },
  { value: 200, suffix: "+", label: "በሕይወት ያሉ የኢትኒክ ባህሎች" },
  { value: 800, suffix: "", prefix: "~", label: "የሥልጣኔ ዓመታት" },
  { value: 95, suffix: "%", label: "የእንግዶች እርካታ መጠን" }
];

const landmarkCards = [
  { title: "ስካይ ታውር", location: "ኦክላንድ", eyebrow: "ዘመናዊ ምልክት", description: "የኦክላንድን ከተማ ምስል እና የሰሜን ከተማዊ ኃይል የሚያወክል ቁመታማ ምልክት ነው።", image: skyTowerImage },
  { title: "ቢሃይቭ", location: "ዌሊንግተን", eyebrow: "የመንግስት ምልክት", description: "በዋና ከተማው ልብ የተቀመጠ የኒውዚላንድ በጣም የታወቀ የመንግስት ህንፃ ነው።", image: beehiveImage },
  { title: "ቴ ፓፓ ቶንጋሬዋ", location: "ዌሊንግተን", eyebrow: "የባህል ሀብት", description: "የማኦሪ ታሪኮችን፣ ስነ-ጥበብን እና በሕይወት ያለ ቅርስን በጥልቀት የሚያቀርብ ብሔራዊ ሙዚየም።", image: tePapaImage },
  { title: "ላርናክ ካስትል", location: "ዱኔዲን", eyebrow: "ታሪካዊ እስቴት", description: "ከቪክቶሪያ ዘመን ሕንፃዎች እና አስደናቂ የደቡብ ዳርቻ እይታዎች ጋር የሚገናኝ አስደናቂ ቤተ መንግስት።", image: larnachCastleImage },
  { title: "ተራራ ሩዋፔሁ", location: "ቶንጋሪሮ", eyebrow: "እሳተ ገሞራ ጫፍ", description: "የማዕከላዊ ሰሜን ደሴቱን በበረዶ፣ በድንጋይ እና በቅዱስ መሬት የሚቀርጽ ኃያል ከፍታ።", image: mountRuapehuImage },
  { title: "ሁካ ፏፏቴ", location: "ታውፖ", eyebrow: "የተፈጥሮ ድንቅ", description: "በረዶ ሰማያዊ ውሃ የጂኦተርማል ኃይልን ወደ አንዱ የአገሪቱ ዋና ዕይታ የሚቀይር ቦታ።", image: hukaFallsImage }
];

const curatedJourneys = [
  {
    title: "የዋና ከተማ ታሪኮች እና የማኦሪ ስብስቦች",
    eyebrow: "ባህል / ዌሊንግተን",
    summary: "በሙዚየም ታሪኮች፣ በወደብ ጉዞዎች እና በህዝባዊ ምልክቶች የተገነባ የዋና ከተማ መንገድ።",
    tags: ["ባህል", "ሙዚየሞች"],
    duration: "4 ቀናት",
    groupSize: "4-10 እንግዶች",
    route: "ቴ ፓፓ፣ የወደብ አካባቢ፣ የመንግስት ክፍል",
    price: "NZ$940",
    image: tePapasImage,
    accentImage: beehiveImage,
    accentLabel: "የቢሃይቭ ቆሚያ",
    featured: true
  },
  {
    title: "የደቡብ ቅርስ እና የቤተ መንግስት ምሽቶች",
    eyebrow: "ቅርስ / ዱኔዲን",
    summary: "በድንጋይ የተሠሩ ክፍሎች፣ የባህር ዳርቻ መስመሮች እና የደቡብ አየር ዙሪያ የሚያዘግይ ጉዞ።",
    tags: ["ቅርስ", "ህንፃ"],
    duration: "5 ቀናት",
    groupSize: "2-8 እንግዶች",
    route: "ላርናክ ካስትል፣ ወደብ፣ የኦታጎ ዳርቻ",
    price: "NZ$1,160",
    image: larnachCastleImage
  },
  {
    title: "የእሳተ ገሞራ ታሪኮች እና የወንዝ ብርሃን",
    eyebrow: "መሬት / ማዕከላዊ ሜዳ",
    summary: "በእሳተ ገሞራ ጥላ፣ በማኦሪ የቦታ ትውስታ እና በታውፖ የውሃ ኃይል የተቀረፀ መንገድ።",
    tags: ["ቅዱስ መሬቶች", "የውሃ መንገዶች"],
    duration: "6 ቀናት",
    groupSize: "4-12 እንግዶች",
    route: "ሩዋፔሁ፣ የጂኦተርማል ሸለቆዎች፣ ሁካ ፏፏቴ",
    price: "NZ$1,320",
    image: mountRuapehuImage,
    accentImage: hukaFallsImage,
    accentLabel: "ሁካ ፏፏቴ"
  }
];

const cultureHighlights = [
  { number: "01", title: "ፖውሂሪ እና የማራኤ እንኳን ደህና መጡ", description: "በሥርዓት፣ በግንኙነት እና በክብር የሚቀበሉ ቦታዎችን ተሞክሩ።" },
  { number: "02", title: "ምግብ፣ ሥራ እና ታሪክ", description: "ምግብን፣ ቅርጽን፣ ሽመናን እና በአፍ የሚተላለፉ ታሪኮችን እንደ በሕይወት ያለ መገለጫ ይመልከቱ።" },
  { number: "03", title: "መሬት፣ ውሃ እና የአባቶች ትውስታ", description: "መሬቶችን እንደ ብቻ ዕይታ ሳይሆን በዘር ታሪክ እና በጥበቃ የተሞሉ ቦታዎች እንደሆኑ ይለማመዱ።" }
];

const traditionsCards = [
  { number: "01", category: "ምግብ / ምድር", title: "ሀንጊ", description: "በተሞቁ ድንጋዮች፣ ቅጠሎች እና አፈር ላይ ለሰዓታት የሚጠፋ የማኅበረሰብ ምግብ ነበር።", image: hangiImage },
  { number: "02", category: "ምግብ / እርሻ", title: "ኩማራ", description: "ጣፋጭ ድንች በጋራ እርሻዎች ውስጥ የሚበቅል እጅግ የተከበረ ሰብል ነበር።", image: kumaraImage },
  { number: "03", category: "ምግብ / ባህር", title: "ካይሞአና", description: "ዓሣ፣ እባብ ዓሣ፣ ፓዋ እና ሙሴል ያሉ የባህር ሀብቶች በዕለታዊ ምግብ ውስጥ አስፈላጊ ነበሩ።", image: kaimoanaImage },
  { number: "04", category: "ምግብ / ዱር", title: "የዱር ምግቦች", description: "ፒኮፒኮ፣ ፑሃ፣ ወፎች እና ሁሁ ጉርብ ከዱር የሚሰበሰቡ ምግቦች ነበሩ።", image: forestFoodsImage },
  { number: "05", category: "ማህበረሰብ / መከላከያ", title: "ፓ", description: "በመስመሮች፣ በመደበኛ እና በእንጨት አጥር የተጠናከሩ መንደሮች ነበሩ።", image: paImage },
  { number: "06", category: "ማህበረሰብ / ልብ", title: "ማራኤ", description: "እንኳን ደህና መጡ፣ ውሳኔ እና ሥነ-ሥርዓት የሚከናወኑበት የማህበረሰብ ልብ ነው።", image: maraeImage },
  { number: "07", category: "ቤት / ሙቀት", title: "ዋሬፑኒ", description: "በእንጨት እና በራውፖ የተሠሩ ዝቅተኛ ሞቃት የመኝታ ቤቶች ነበሩ።", image: wharepuniImage },
  { number: "08", category: "ቤት / ማከማቻ", title: "ፓታካ", description: "ምግብን ከአይጥ እና ከእርጥበት ለመጠበቅ ከፍ ብለው የተሰሩ ማከማቻዎች ነበሩ።", image: patakaImage },
  { number: "09", category: "ስራ / ፋይበር", title: "ሀራኬኬ", description: "የፍላክስ ፋይበር ወደ ቅርጫት፣ ገመድ እና ልብስ የሚቀየር አስፈላጊ ቁሳቁስ ነበር።", image: harakekeImage },
  { number: "10", category: "ስራ / ክብር", title: "ኮሮዋይ", description: "በላባ የተሸፈኑ መጎናጸፊያዎች ክብርን፣ ዘርን እና ስልጣንን የሚሸከሙ ውድ ቅርሶች ነበሩ።", image: korowaiImage },
  { number: "11", category: "ስራ / እንቅስቃሴ", title: "ፒዩፒዩ", description: "በእንቅስቃሴ ጊዜ የሚንቀሳቀሱ እና ድምፅ የሚያሰሙ የፍላክስ ልብሶች ናቸው።", image: piupiuImage },
  { number: "12", category: "ስራ / ዝናብ", title: "ፓኬ", description: "የዝናብን ውሃ እንደ ተሸፈነ ጣሪያ የሚያስወግዱ ከፍተኛ የፍላክስ መጎናጸፊያዎች ነበሩ።", image: pakeImage }
];

const aboutFeatures = [
  { number: "01", title: "የአካባቢ ባህል እውቀት", description: "እያንዳንዱ መንገድ በታሪክ፣ በቦታ እና በአውድ የተቀረፀ ነው።" },
  { number: "02", title: "ደህንነታማ እና የተገባ እቅድ", description: "ከመጓጓዣ እስከ የቀን ምት ድረስ ለእንግዶች የተረጋጋ ጉዞ እንነዳለን።" },
  { number: "03", title: "ክብር ያለው ዘገምተኛ ጉዞ", description: "ከትልቅ ብዛት ይልቅ ትንሽ ቡድኖችን እና ትርጉም ያላቸውን ማቆሚያዎችን እንመርጣለን።" }
];

const pageSections = [
  { id: "hero", label: "መነሻ" },
  { id: "culture", label: "ባህል" },
  { id: "traditions", label: "ትውፊቶች" },
  { id: "about", label: "ስለ እኛ" }
];

const exploreSections = [
  { id: "places", label: "ቦታዎች" },
  { id: "landmarks", label: "ምልክቶች" },
  { id: "journeys", label: "ጉዞዎች" }
];

const ui = {
  brand: "ኒውዚላንድ",
  login: "ግባ",
  dashboard: "ዳሽቦርድ",
  logout: "ውጣ",
  managedPlacesKicker: "በትራቭል ዴስክ የተመረጡ",
  managedPlacesTitle: "አዲስ ቦታዎች በመንገድ ሰሌዳው ላይ በቀጥታ ተጨምረዋል",
  managedPlacesCopy: "እነዚህ መድረሻዎች ከአድሚን ዴስክ በቀጥታ በመስቀል አዳዲስ ማቆሚያዎችን፣ ሰዓቶችን እና የእይታ አየርን ወደ መነሻ ገጹ ያመጣሉ።",
  managedPlacesButton: "ቦታዎችን ያስሱ",
  managedPlaceAction: "ቦታውን ያስሱ",
  landmarksKicker: "የአውትያሮዋ ምልክቶች",
  landmarksTitle: "በኒውዚላንድ ዙሪያ ያሉ የባህል እና የተፈጥሮ ምልክቶች",
  landmarksCopy: "ከህዝባዊ እና ባህላዊ ተቋማት እስከ እሳተ ገሞራ መሬቶች እና የማይረሱ የውሃ መስመሮች ድረስ የአገሪቱን መለያ የሚገልጹ ቦታዎችን ያስሱ።",
  landmarksAction: "ያስሱ",
  journeysKicker: "የተመረጡ ጉዞዎች",
  journeysTitle: "በቅርስ፣ በመሬት እና በሕይወት ያለ ባህል ውስጥ ወደ ጥልቀት ይጉዙ",
  journeysCopy: "እነዚህ ጉዞዎች እንደ ዘገምተኛ የኒውዚላንድ መንገዶች ተዘጋጅተው ታላላቅ ቦታዎችን ከትርጉም ያለው አውድ ጋር ያጣምራሉ።",
  journeysAction: "ሁሉንም ጉዞዎች ይመልከቱ",
  journeyPriceLabel: "የሚጀምርበት ዋጋ",
  journeyPlanAction: "ይህን ጉዞ ያቅዱ",
  cultureKicker: "በሕይወት ያለ ባህል",
  cultureTitleLead: "በሕይወት ያሉ ሥሮች ውስጥ ይግቡ",
  cultureTitleAccent: " የአውትያሮዋ",
  cultureIntro: "ከፖስትካርድ ዕይታ ባሻገር፣ ኒውዚላንድ በእንኳን ደህና መጡ፣ በቋንቋ፣ በሥራ እና በመሬትና በውሃ ግንኙነት ይነገራል።",
  cultureVideoChip: "የድሮን እይታ",
  cultureImageChip: "የመሬት ታሪኮች",
  cultureCtaKicker: "ሥሮቹን ያግኙ",
  cultureCtaTitle: "ከመመልከት በላይ የሚሄድ የባህል መንገድ።",
  cultureCtaCopy: "በታሪኮች፣ በመሬቶች እና በዘር የተያያዙ ቦታዎች ውስጥ የሚያልፍ ዘገምተኛ መመሪያ ይከተሉ።",
  cultureCtaAction: "የባህል መመሪያን ይመልከቱ",
  traditionsKicker: "በሕይወት ያለ ባህል / ውርስ",
  traditionsTitleLead: "ጥንታዊ",
  traditionsTitleAccent: "ትውፊቶች",
  traditionsCopy: "የኒውዚላንድ ጥንታዊ ትውፊቶች በምግብ፣ በመጠለያ፣ በሥራ እና በሥነ-ሥርዓት ውስጥ እስከዛሬ ይኖራሉ። ሁሉንም 12 ታሪኮች ለማየት ወደ ጎን ይንቀሳቀሱ።",
  traditionsIntro: "ሙሉውን ባህላዊ ስብስብ በጎን ለጎን ያስሱ። እያንዳንዱ ካርድ አጭር እና ግልጽ ማብራሪያ ይይዛል።",
  traditionsFootnote: "የጎን ማንቀሳቀስ መዝገብ",
  aboutKicker: "ስለ እኛ",
  aboutTitleLead: "ወደ ተረጋጋ እና ተሟላ",
  aboutTitleAccent: " የኒውዚላንድ ጉዞ መግቢያዎ",
  aboutIntro: "እኛ ጉዞን ከቼክ ሊስት ባሻገር እንገነባለን። የአካባቢ አየር፣ የባህል ክብር እና የታሪክ ጥልቀትን በአንድ እንያያዝ።",
  quote: "\"ጥልቀት፣ ሙቀት እና እውነተኛ የቦታ ስሜት ያለው ጉዞ ነው።\"",
  quoteAuthor: "የእንግዳ አስተያየት",
  footerTitle: "ኒውዚላንድ",
  footerCopy: "በምልክቶች፣ በባህል እና በዘገምተኛ መንገዶች የተቀረፀ ሲኒማዊ የጉዞ መነሻ ገጽ።",
  footerSections: "ክፍሎች",
  footerExplore: "ያስሱ",
  footerContact: "አግኙን",
  footerStartPlanning: "እቅድ ያስጀምሩ",
  footerCuratedJourneys: "የተመረጡ ጉዞዎች",
  footerCultureGuide: "የባህል መመሪያ",
  footerTagline: "ለጥልቀት ያለው የጉዞ ታሪክ ንድፍ ተዘጋጅቷል።",
  footerMeta: "የኒውዚላንድ የቱሪዝም ኮንሰፕት ገጽ።",
  footerBackToTop: "ወደ ላይ ተመለስ",
  languageLabel: "ቋንቋ",
  exploreLabel: "ያስሱ"
};

const rotationDurationMs = 5200;
const previewCount = 4;

function getUserDisplayName(user) {
  if (!user) return "";
  const raw = (user.fullname || user.username || user.email || "").trim();
  return raw || "መለያዎ";
}

function getUserInitials(user) {
  if (!user) return "?";
  const source = (user.fullname || user.username || user.email || "?").trim();
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  return source.slice(0, 2).toUpperCase() || "?";
}

export default function HomeAmhPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const traditionsRailRef = useRef(null);
  const statsSectionRef = useRef(null);
  const accountWrapRef = useRef(null);
  const exploreRef = useRef(null);

  const [exploreOpen, setExploreOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeSection, setActiveSection] = useState("hero");
  const [isNavPinned, setIsNavPinned] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authUser, setAuthUser] = useState(() => getStoredUser());
  const [hasAuthToken, setHasAuthToken] = useState(() => Boolean(getAuthToken()));
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const [animatedStats, setAnimatedStats] = useState(() => heritageStats.map(() => 0));
  const [managedPlaces, setManagedPlaces] = useState([]);
  const isExploreActive = ["places", "landmarks", "journeys"].includes(activeSection);

  // Close explore dropdown on outside click
  useEffect(() => {
    if (!exploreOpen) return undefined;
    const onDown = (e) => {
      if (exploreRef.current && !exploreRef.current.contains(e.target)) setExploreOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [exploreOpen]);

  useEffect(() => {
    let active = true;
    const loadPlaces = async () => {
      try {
        const response = await fetchTourismPlaces();
        if (!active) return;
        setManagedPlaces(response.data?.places || []);
      } catch {
        if (active) setManagedPlaces([]);
      }
    };
    loadPlaces();
    return () => { active = false; };
  }, []);

  const refreshAuthUser = useCallback(() => {
    setAuthUser(getStoredUser());
    setHasAuthToken(Boolean(getAuthToken()));
  }, []);

  useLayoutEffect(() => { refreshAuthUser(); }, [location.pathname, location.key, refreshAuthUser]);

  useEffect(() => {
    const unsub = subscribeAuthSession(refreshAuthUser);
    return unsub;
  }, [refreshAuthUser]);

  useEffect(() => {
    const onAuthEvent = () => refreshAuthUser();
    window.addEventListener("auth-session-changed", onAuthEvent);
    return () => window.removeEventListener("auth-session-changed", onAuthEvent);
  }, [refreshAuthUser]);

  useEffect(() => {
    const onStorage = (event) => {
      if (["auth_user", "token", "user", "jwt", "access_token", null].includes(event.key)) refreshAuthUser();
    };
    const onVisibility = () => { if (document.visibilityState === "visible") refreshAuthUser(); };
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", refreshAuthUser);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", refreshAuthUser);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [refreshAuthUser]);

  useEffect(() => {
    if (!accountMenuOpen) return undefined;
    const onPointerDown = (event) => {
      if (accountWrapRef.current && !accountWrapRef.current.contains(event.target)) setAccountMenuOpen(false);
    };
    const onKeyDown = (event) => { if (event.key === "Escape") setAccountMenuOpen(false); };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [accountMenuOpen]);

  useEffect(() => {
    if (isMenuOpen) setAccountMenuOpen(false);
  }, [isMenuOpen]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % heroSlides.length);
    }, rotationDurationMs);
    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const hash = window.location.hash.replace("#", "").trim();
    if (!hash) return undefined;
    const timer = window.setTimeout(() => {
      const section = document.getElementById(hash);
      if (section) {
        const navOffset = window.innerWidth <= 900 ? 124 : 108;
        const targetTop = section.getBoundingClientRect().top + window.scrollY - navOffset;
        window.scrollTo({ top: Math.max(targetTop, 0), behavior: "smooth" });
        setActiveSection(hash);
      }
    }, 140);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsNavPinned(window.scrollY > 18);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const allSections = [...pageSections, ...exploreSections];
    const sectionElements = allSections.map((s) => document.getElementById(s.id)).filter(Boolean);
    if (!sectionElements.length) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visibleEntry?.target?.id) setActiveSection(visibleEntry.target.id);
      },
      { rootMargin: "-22% 0px -48% 0px", threshold: [0.2, 0.35, 0.55, 0.75] }
    );
    sectionElements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const element = statsSectionRef.current;
    if (!element) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry?.isIntersecting) setStatsVisible(true); },
      { threshold: 0.45 }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!statsVisible) return undefined;
    const durationMs = 1400;
    const startTime = performance.now();
    const updateCounts = (currentTime) => {
      const progress = Math.min((currentTime - startTime) / durationMs, 1);
      setAnimatedStats(heritageStats.map((item) => Math.round(item.value * (1 - Math.pow(1 - progress, 3)))));
      if (progress < 1) window.requestAnimationFrame(updateCounts);
    };
    const frame = window.requestAnimationFrame(updateCounts);
    return () => window.cancelAnimationFrame(frame);
  }, [statsVisible]);

  const activeSlide = heroSlides[activeIndex];

  const scrollTraditions = useCallback((direction) => {
    const rail = traditionsRailRef.current;
    if (!rail) return;
    rail.scrollBy({ left: direction * Math.round(rail.clientWidth * 0.72), behavior: "smooth" });
  }, []);

  const previewSlides = useMemo(
    () => Array.from({ length: previewCount }, (_, offset) => {
      const index = (activeIndex + offset + 1) % heroSlides.length;
      return { ...heroSlides[index], index, slot: offset };
    }),
    [activeIndex]
  );

  const handleLogout = useCallback(() => {
    clearAuthSession();
    refreshAuthUser();
    setAccountMenuOpen(false);
    setIsMenuOpen(false);
    navigate("/");
  }, [navigate, refreshAuthUser]);

  const handleSectionNavigation = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (!section) return;
    setActiveSection(sectionId);
    setIsMenuOpen(false);
    setAccountMenuOpen(false);
    const navOffset = window.innerWidth <= 900 ? 124 : 108;
    const targetTop = section.getBoundingClientRect().top + window.scrollY - navOffset;
    window.scrollTo({ top: Math.max(targetTop, 0), behavior: "smooth" });
  };

  const profileForNav = useMemo(() => {
    if (authUser) return authUser;
    if (hasAuthToken) return { fullname: "መለያዎ", email: "" };
    return null;
  }, [authUser, hasAuthToken]);

  const isSignedIn = Boolean(profileForNav);
  const displayName = useMemo(() => getUserDisplayName(profileForNav), [profileForNav]);
  const initials = useMemo(() => getUserInitials(profileForNav), [profileForNav]);
  const accountEmail = (authUser?.email || "").trim();

  return (
    <main className="cinematic-hero-shell">
      {/* ─── NAV ─── */}
      <header className={`cinematic-hero-nav ${isNavPinned ? "is-pinned" : ""}`}>
        <button
          type="button"
          className="cinematic-hero-brand"
          onClick={() => { setActiveIndex(0); setIsMenuOpen(false); handleSectionNavigation("hero"); }}
          aria-label="ወደ ገጹ ላይ ተመለስ"
        >
          <span className="cinematic-hero-brand-mark">
            <img src={mapImage} alt="" className="cinematic-hero-brand-map" />
          </span>
          <span className="cinematic-hero-brand-text">{ui.brand}</span>
        </button>

        {/* Desktop nav */}
        <div className="cinematic-hero-nav-desktop">
          <nav className="cinematic-hero-menu" aria-label="የገጽ ክፍሎች">
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

            {/* Explore dropdown */}
            <div className="cinematic-hero-explore-wrap" ref={exploreRef}>
              <button
                type="button"
                className={`cinematic-hero-menu-item cinematic-hero-explore-trigger ${isExploreActive ? "is-active" : ""}`}
                onClick={() => setExploreOpen((o) => !o)}
                aria-expanded={exploreOpen}
                aria-haspopup="true"
              >
                {ui.exploreLabel}
                <span className="cinematic-hero-explore-chevron" aria-hidden="true">{exploreOpen ? "▴" : "▾"}</span>
              </button>
              {exploreOpen && (
                <div className="cinematic-hero-explore-dropdown" role="menu">
                  {exploreSections.map((section) => (
                    <button
                      key={section.id}
                      type="button"
                      role="menuitem"
                      className={`cinematic-hero-explore-item ${activeSection === section.id ? "is-active" : ""}`}
                      onClick={() => { setExploreOpen(false); handleSectionNavigation(section.id); }}
                    >
                      {section.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Language select — Amharic active, English navigates to / */}
          <div className="cinematic-hero-language-select-wrap" aria-label={ui.languageLabel}>
            <span className="cinematic-hero-language-globe" aria-hidden="true">🌐</span>
            <select
              className="cinematic-hero-language-select"
              value="amh"
              onChange={(e) => { if (e.target.value === "eng") navigate("/"); }}
              aria-label={ui.languageLabel}
            >
              <option value="eng">English</option>
              <option value="amh">አማርኛ</option>
            </select>
            <span className="cinematic-hero-language-chevron" aria-hidden="true">▾</span>
          </div>

          {isSignedIn ? (
            <div className="cinematic-hero-account-wrap" ref={accountWrapRef}>
              <button
                type="button"
                className="cinematic-hero-account-trigger"
                onClick={() => setAccountMenuOpen((open) => !open)}
                aria-expanded={accountMenuOpen}
                aria-haspopup="true"
                aria-label={`የ ${displayName} ሂሳብ ምናሌ`}
              >
                <span className="cinematic-hero-account-avatar" aria-hidden="true">{initials}</span>
                <span className="cinematic-hero-account-name">{displayName}</span>
                <span className="cinematic-hero-account-chevron" aria-hidden="true">▾</span>
              </button>
              {accountMenuOpen && (
                <div className="cinematic-hero-account-dropdown" role="menu">
                  <button type="button" className="cinematic-hero-account-item" role="menuitem"
                    onClick={() => { setAccountMenuOpen(false); navigate("/dashboard"); }}>
                    {ui.dashboard}
                  </button>
                  <button type="button" className="cinematic-hero-account-item" role="menuitem" onClick={handleLogout}>
                    {ui.logout}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button type="button" className="cinematic-hero-login" onClick={() => navigate("/login")}>
              {ui.login}
            </button>
          )}
        </div>

        {/* Hamburger */}
        <button
          type="button"
          className={`cinematic-hero-menu-toggle ${isMenuOpen ? "is-open" : ""}`}
          onClick={() => setIsMenuOpen((current) => !current)}
          aria-label={isMenuOpen ? "ምናሌ ዝጋ" : "ምናሌ ክፈት"}
          aria-expanded={isMenuOpen}
        >
          <span /><span /><span />
        </button>
      </header>

      {/* ─── Mobile drawer ─── */}
      <div className={`cinematic-hero-drawer-backdrop ${isMenuOpen ? "is-open" : ""}`} onClick={() => setIsMenuOpen(false)} />
      <aside className={`cinematic-hero-drawer ${isMenuOpen ? "is-open" : ""}`} aria-label="የሞቢል ምናሌ">
        <button type="button" className="cinematic-hero-drawer-close" onClick={() => setIsMenuOpen(false)} aria-label="ምናሌ ዝጋ">
          <span /><span />
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
          <div className="cinematic-hero-drawer-explore-group">
            <span className="cinematic-hero-drawer-explore-group-label">{ui.exploreLabel}</span>
            {exploreSections.map((section) => (
              <button
                key={section.id}
                type="button"
                className={`cinematic-hero-drawer-link cinematic-hero-drawer-link--sub ${activeSection === section.id ? "is-active" : ""}`}
                onClick={() => handleSectionNavigation(section.id)}
              >
                {section.label}
              </button>
            ))}
          </div>
        </nav>

        <div className="cinematic-hero-drawer-language">
          <span className="cinematic-hero-drawer-language-label">{ui.languageLabel}</span>
          <div className="cinematic-hero-language-select-wrap cinematic-hero-language-select-wrap--drawer">
            <span className="cinematic-hero-language-globe" aria-hidden="true">🌐</span>
            <select
              className="cinematic-hero-language-select"
              value="amh"
              onChange={(e) => { if (e.target.value === "eng") { setIsMenuOpen(false); navigate("/"); } }}
              aria-label={ui.languageLabel}
            >
              <option value="eng">English</option>
              <option value="amh">አማርኛ</option>
            </select>
            <span className="cinematic-hero-language-chevron" aria-hidden="true">▾</span>
          </div>
        </div>

        {isSignedIn ? (
          <div className="cinematic-hero-drawer-account">
            <div className="cinematic-hero-drawer-user">
              <span className="cinematic-hero-account-avatar" aria-hidden="true">{initials}</span>
              <div className="cinematic-hero-drawer-user-text">
                <span className="cinematic-hero-drawer-user-name">{displayName}</span>
                {accountEmail && <span className="cinematic-hero-drawer-user-email">{accountEmail}</span>}
              </div>
            </div>
            <button type="button" className="cinematic-hero-drawer-link"
              onClick={() => { setIsMenuOpen(false); navigate("/dashboard"); }}>
              {ui.dashboard}
            </button>
            <button type="button" className="cinematic-hero-drawer-link" onClick={handleLogout}>
              {ui.logout}
            </button>
          </div>
        ) : (
          <button type="button" className="cinematic-hero-drawer-login" onClick={() => navigate("/login")}>
            {ui.login}
          </button>
        )}
      </aside>

      {/* ─── Hero ─── */}
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
                <span className="cinematic-hero-counter-current">{String(activeIndex + 1).padStart(2, "0")}</span>
                <span className="cinematic-hero-counter-line" />
                <span className="cinematic-hero-counter-total">{String(heroSlides.length).padStart(2, "0")}</span>
              </div>
            </section>
            <aside className="cinematic-hero-preview-rail" aria-label="ቀጣይ መድረሻዎች">
              {previewSlides.map((slide) => (
                <button
                  key={slide.title}
                  type="button"
                  className={`cinematic-hero-preview-card cinematic-hero-preview-slot-${slide.slot}`}
                  style={{ backgroundImage: `url(${slide.image})` }}
                  onClick={() => setActiveIndex(slide.index)}
                  aria-label={`${slide.title} አሳይ`}
                >
                  <span className="cinematic-hero-preview-shade" />
                  <span className="cinematic-hero-preview-number">{String(slide.index + 1).padStart(2, "0")}</span>
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

      {/* ─── Stats ─── */}
      <section ref={statsSectionRef} className="heritage-stats-section" aria-label="የቅርስ ስታቲስቲክስ">
        <div className="heritage-stats-atmosphere" aria-hidden="true">
          <span className="heritage-stats-orb heritage-stats-orb-one" />
          <span className="heritage-stats-orb heritage-stats-orb-two" />
          <span className="heritage-stats-orb heritage-stats-orb-three" />
          <span className="heritage-stats-drift heritage-stats-drift-one" />
          <span className="heritage-stats-drift heritage-stats-drift-two" />
        </div>
        <div className="heritage-stats-shell">
          {heritageStats.map((stat, index) => (
            <article key={stat.label} className="heritage-stat-card">
              <strong className="heritage-stat-value">
                {stat.prefix ?? ""}{animatedStats[index]}{stat.suffix ?? ""}
              </strong>
              <span className="heritage-stat-label">{stat.label}</span>
            </article>
          ))}
        </div>
      </section>

      {/* ─── Managed Places ─── */}
      {managedPlaces.length ? (
        <section id="places" className="managed-places-section">
          <div className="managed-places-shell">
            <div className="managed-places-head">
              <div>
                <span className="managed-places-kicker">{ui.managedPlacesKicker}</span>
                <h2 className="managed-places-title">{ui.managedPlacesTitle}</h2>
                <p className="managed-places-copy">{ui.managedPlacesCopy}</p>
              </div>
              <button type="button" className="managed-places-link" onClick={() => navigate("/login")}>
                {ui.managedPlacesButton}
              </button>
            </div>
            <div className="managed-places-grid">
              {managedPlaces.map((place) => (
                <article key={place.id} className="managed-place-card">
                  <div className="managed-place-media" style={{ backgroundImage: `url(${place.image_url || place.imageUrl})` }}>
                    <div className="managed-place-overlay" />
                    <span className="managed-place-icon">{place.icon || "✦"}</span>
                    <div className="managed-place-time">
                      <span>{place.travel_day || place.travelDay}</span>
                      <strong>{place.travel_time || place.travelTime}</strong>
                    </div>
                  </div>
                  <div className="managed-place-body">
                    <span className="managed-place-region">{place.region}</span>
                    <h3 className="managed-place-title-text">{place.title}</h3>
                    <p className="managed-place-description">{place.description}</p>
                    <button type="button" className="managed-place-action" onClick={() => navigate("/login")}>
                      {ui.managedPlaceAction}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ─── Landmarks ─── */}
      <section id="landmarks" className="landmarks-section">
        <div className="landmarks-section-head">
          <span className="landmarks-kicker">{ui.landmarksKicker}</span>
          <h2 className="landmarks-title">{ui.landmarksTitle}</h2>
          <p className="landmarks-copy">{ui.landmarksCopy}</p>
        </div>
        <div className="landmarks-grid">
          {landmarkCards.map((card) => (
            <article key={card.title} className="landmarks-card" style={{ backgroundImage: `url(${card.image})` }}>
              <div className="landmarks-card-overlay" />
              <div className="landmarks-card-content">
                <span className="landmarks-card-eyebrow">{card.eyebrow}</span>
                <h3 className="landmarks-card-title">{card.title}</h3>
                <span className="landmarks-card-location">{card.location}</span>
                <p className="landmarks-card-copy">{card.description}</p>
                <button type="button" className="landmarks-card-action" onClick={() => navigate("/login")}>
                  {ui.landmarksAction}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ─── Journeys ─── */}
      <section id="journeys" className="journeys-section">
        <div className="journeys-shell">
          <div className="journeys-head">
            <div className="journeys-head-copy">
              <span className="journeys-kicker">{ui.journeysKicker}</span>
              <h2 className="journeys-title">{ui.journeysTitle}</h2>
              <p className="journeys-copy">{ui.journeysCopy}</p>
            </div>
            <button type="button" className="journeys-link" onClick={() => navigate("/login")}>
              {ui.journeysAction}
            </button>
          </div>

          <div className="journeys-grid">
            {curatedJourneys.filter((j) => j.featured).map((journey) => (
              <article key={journey.title} className="journey-card journey-card-featured">
                <div className="journey-card-media" style={{ backgroundImage: `url(${journey.image})` }}>
                  <div className="journey-card-shade" />
                  <div className="journey-card-pattern" />
                  <div className="journey-card-tags">
                    {journey.tags.map((tag) => <span key={tag} className="journey-tag">{tag}</span>)}
                  </div>
                  {journey.accentImage && (
                    <div className="journey-card-accent-photo" style={{ backgroundImage: `url(${journey.accentImage})` }}>
                      <span>{journey.accentLabel}</span>
                    </div>
                  )}
                </div>
                <div className="journey-card-body">
                  <span className="journey-card-eyebrow">{journey.eyebrow}</span>
                  <h3 className="journey-card-title">{journey.title}</h3>
                  <p className="journey-card-summary">{journey.summary}</p>
                  <div className="journey-card-metrics">
                    <div className="journey-metric"><span className="journey-metric-dot" /><span>{journey.duration}</span></div>
                    <div className="journey-metric"><span className="journey-metric-dot" /><span>{journey.groupSize}</span></div>
                    <div className="journey-metric"><span className="journey-metric-dot" /><span>{journey.route}</span></div>
                  </div>
                  <div className="journey-card-footer">
                    <div className="journey-card-price">
                      <span className="journey-price-label">{ui.journeyPriceLabel}</span>
                      <strong className="journey-price-value">{journey.price}</strong>
                    </div>
                    <button type="button" className="journey-card-action" onClick={() => navigate("/login")}>
                      {ui.journeyPlanAction}
                    </button>
                  </div>
                </div>
              </article>
            ))}

            <div className="journeys-stack">
              {curatedJourneys.filter((j) => !j.featured).map((journey) => (
                <article key={journey.title} className="journey-card">
                  <div className="journey-card-media" style={{ backgroundImage: `url(${journey.image})` }}>
                    <div className="journey-card-shade" />
                    <div className="journey-card-pattern" />
                    <div className="journey-card-tags">
                      {journey.tags.map((tag) => <span key={tag} className="journey-tag">{tag}</span>)}
                    </div>
                    {journey.accentImage && (
                      <div className="journey-card-accent-photo" style={{ backgroundImage: `url(${journey.accentImage})` }}>
                        <span>{journey.accentLabel}</span>
                      </div>
                    )}
                  </div>
                  <div className="journey-card-body">
                    <span className="journey-card-eyebrow">{journey.eyebrow}</span>
                    <h3 className="journey-card-title">{journey.title}</h3>
                    <p className="journey-card-summary">{journey.summary}</p>
                    <div className="journey-card-metrics">
                      <div className="journey-metric"><span className="journey-metric-dot" /><span>{journey.duration}</span></div>
                      <div className="journey-metric"><span className="journey-metric-dot" /><span>{journey.groupSize}</span></div>
                      <div className="journey-metric"><span className="journey-metric-dot" /><span>{journey.route}</span></div>
                    </div>
                    <div className="journey-card-footer">
                      <div className="journey-card-price">
                        <span className="journey-price-label">{ui.journeyPriceLabel}</span>
                        <strong className="journey-price-value">{journey.price}</strong>
                      </div>
                      <button type="button" className="journey-card-action" onClick={() => navigate("/login")}>
                        {ui.journeyPlanAction}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Culture ─── */}
      <section id="culture" className="culture-section">
        <div className="culture-shell">
          <div className="culture-copy">
            <span className="culture-kicker">{ui.cultureKicker}</span>
            <h2 className="culture-title">
              {ui.cultureTitleLead}<span>{ui.cultureTitleAccent}</span>
            </h2>
            <p className="culture-intro">{ui.cultureIntro}</p>
            <div className="culture-points">
              {cultureHighlights.map((item, index) => (
                <article key={item.number} className="culture-point" style={{ animationDelay: `${index * 120}ms` }}>
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
                <video className="culture-video" src={droneVideo} autoPlay muted loop playsInline />
                <div className="culture-video-overlay" />
                <span className="culture-media-chip">{ui.cultureVideoChip}</span>
              </div>
            </article>
            <article className="culture-image-card">
              <div className="culture-image-frame" style={{ backgroundImage: `url(${landImage})` }}>
                <div className="culture-image-overlay" />
                <span className="culture-media-chip">{ui.cultureImageChip}</span>
              </div>
            </article>
            <article className="culture-cta-card">
              <span className="culture-cta-kicker">{ui.cultureCtaKicker}</span>
              <h3 className="culture-cta-title">{ui.cultureCtaTitle}</h3>
              <p className="culture-cta-copy">{ui.cultureCtaCopy}</p>
              <button type="button" className="culture-cta-action" onClick={() => navigate("/login")}>
                {ui.cultureCtaAction}
              </button>
            </article>
          </div>
        </div>
      </section>

      {/* ─── Traditions ─── */}
      <section id="traditions" className="traditions-section">
        <div className="traditions-shell">
          <div className="traditions-head">
            <span className="traditions-kicker">{ui.traditionsKicker}</span>
            <div className="traditions-head-row">
              <div>
                <h2 className="traditions-title">
                  {ui.traditionsTitleLead} <span>{ui.traditionsTitleAccent}</span>
                </h2>
                <p className="traditions-copy">{ui.traditionsCopy}</p>
              </div>
              <div className="traditions-head-side">
                <p className="traditions-intro">{ui.traditionsIntro}</p>
                <div className="traditions-controls">
                  <button type="button" className="traditions-control" onClick={() => scrollTraditions(-1)} aria-label="ወደ ግራ ተሸብሸብ">←</button>
                  <button type="button" className="traditions-control traditions-control-active" onClick={() => scrollTraditions(1)} aria-label="ወደ ቀኝ ተሸብሸብ">→</button>
                </div>
              </div>
            </div>
          </div>

          <div className="traditions-rail" ref={traditionsRailRef}>
            {traditionsCards.map((card) => (
              <article key={card.number} className="traditions-card" style={{ backgroundImage: `url(${card.image})` }}>
                <div className="traditions-card-shade" />
                <div className="traditions-card-pattern" />
                <div className="traditions-card-glow" />
                <span className="traditions-card-number">{card.number}</span>
                <div className="traditions-card-body">
                  <div className="traditions-card-rule" />
                  <span className="traditions-card-category">{card.category}</span>
                  <h3 className="traditions-card-title">{card.title}</h3>
                  <p className="traditions-card-description">{card.description}</p>
                  <div className="traditions-card-footer">
                    <span className="traditions-card-footnote">{ui.traditionsFootnote}</span>
                    <span className="traditions-card-dot" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── About ─── */}
      <section id="about" className="about-section">
        <div className="about-shell">
          <div className="about-visual">
            <div className="about-visual-frame" style={{ backgroundImage: `url(${beehiveImage})` }}>
              <div className="about-visual-overlay" />
              <div className="about-quote-card">
                <div className="about-quote-rating" aria-hidden="true">
                  <span className="about-quote-dot" /><span className="about-quote-dot" /><span className="about-quote-dot" /><span className="about-quote-dot" /><span className="about-quote-dot" />
                </div>
                <p className="about-quote-text">{ui.quote}</p>
                <span className="about-quote-author">{ui.quoteAuthor}</span>
              </div>
            </div>
          </div>

          <div className="about-copy">
            <span className="about-kicker">{ui.aboutKicker}</span>
            <h2 className="about-title">
              {ui.aboutTitleLead}<span>{ui.aboutTitleAccent}</span>
            </h2>
            <p className="about-intro">{ui.aboutIntro}</p>
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

      {/* ─── Footer ─── */}
      <footer className="site-footer">
        <div className="site-footer-grid">
          <button type="button" className="site-footer-brand" onClick={() => handleSectionNavigation("hero")}>
            <div className="site-footer-logo" bgcolor="#fff">
              <img src={mapImage} alt="" className="site-footer-map" />
            </div>
            <div>
              <h3 className="site-footer-title">{ui.footerTitle}</h3>
              <p className="site-footer-copy">{ui.footerCopy}</p>
            </div>
          </button>

          <div className="site-footer-column">
            <span className="site-footer-heading">{ui.footerSections}</span>
            {[...pageSections, ...exploreSections].map((section) => (
              <button key={section.id} type="button" className="site-footer-link"
                onClick={() => handleSectionNavigation(section.id)}>
                {section.label}
              </button>
            ))}
          </div>

          <div className="site-footer-column">
            <span className="site-footer-heading">{ui.footerExplore}</span>
            <button type="button" className="site-footer-link" onClick={() => navigate("/login")}>{ui.footerStartPlanning}</button>
            <button type="button" className="site-footer-link" onClick={() => handleSectionNavigation("journeys")}>{ui.footerCuratedJourneys}</button>
            <button type="button" className="site-footer-link" onClick={() => handleSectionNavigation("culture")}>{ui.footerCultureGuide}</button>
          </div>

          <div className="site-footer-column">
            <span className="site-footer-heading">{ui.footerContact}</span>
            <span className="site-footer-meta">hello@newzealandjourneys.com</span>
            <span className="site-footer-meta">Auckland / Wellington / Queenstown</span>
            <button type="button" className="site-footer-action" onClick={() => navigate("/login")}>{ui.login}</button>
          </div>
        </div>

        <div className="site-footer-bottom">
          <span>{ui.footerTagline}</span>
          <div className="site-footer-bottom-actions">
            <span>{ui.footerMeta}</span>
            <button type="button" className="site-footer-backtop" onClick={() => handleSectionNavigation("hero")}>
              {ui.footerBackToTop}
            </button>
          </div>
        </div>
      </footer>
    </main>
  );
}
