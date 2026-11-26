import { Pool } from "pg"

const globalAny = globalThis as any

function getPool(): Pool {
  if (!globalAny.__imotoraPgPool) {
    const dbUrl = process.env.DATABASE_URL || ""
    const isLocal = dbUrl.includes("localhost") || dbUrl.includes("127.0.0.1")
    globalAny.__imotoraPgPool = new Pool({
      connectionString: dbUrl,
      ...(isLocal ? {} : { ssl: { rejectUnauthorized: false } }),
    })
  }
  return globalAny.__imotoraPgPool
}

let initialized = false

const SEED_ARTICLES = [
  // LATEST F1 NEWS & BLOG ARTICLES
  {
    slug: "2026-f1-regulations-active-aero-diecast-guide",
    type: "blog",
    category: "F1 News",
    title: "2026 Formula 1 Active Aero & Power Unit Era: What Changes on Track and on Scale Models",
    excerpt:
      "A closer look at F1's nimbler 2026 chassis, 50/50 hybrid power units, movable front and rear aero wings — and why 1:43 collector castings are getting even sharper.",
    content: `Formula 1 has entered one of the most dramatic technical resets in modern motorsport history. With narrower wheelbases, lighter minimum weights, and a 50/50 electrical-to-combustion power split running on 100% sustainable fuel, the cars look sharper and race closer than ever before.

What excites die-cast collectors most is the introduction of active aerodynamics on both the front and rear wings. Leading model makers like Bburago, Spark, and Mini GT are already adapting their tooling to capture the slimmer sidepods, reworked floor fences, and crisp new aero geometry.

Key highlights for fans and collectors:
• Shorter & narrower silhouette: 1:43 models sit noticeably more compact beside 2022–2025 ground-effect cars in acrylic display cases.
• Fresh factory entries & bold liveries: Metallic reds, exposed carbon weaves, and retro racing stripes are back on the grid.
• Early pre-orders matter: First-batch 1:43 Grand Prix releases historically sell out within weeks of the season opener. Reserve with iMotora's 50% deposit program to lock your grid allocation early.`,
    cover_image: "/images/col-motorsport.jpg",
    author: "Aarav Kapoor — iMotora Motorsport Desk",
    read_time: "4 min read",
    specs_json: JSON.stringify({
      Season: "2026 FIA Formula 1",
      PowerSplit: "50% ICE / 50% Electric",
      Fuel: "100% Sustainable Fuel",
      CollectorScale: "1:43 & 1:18",
    }),
    tags: "F1,2026 Regulations,Active Aero,Motorsport,1:43",
  },
  {
    slug: "ferrari-mclaren-redbull-2026-livery-collectibility",
    type: "blog",
    category: "Livery Spotlight",
    title: "Rosso Corsa vs Papaya vs Matte Navy: Ranking 2026's Most Collectible F1 Liveries",
    excerpt:
      "Why glossy metallic reds and special Monza one-off liveries consistently lead collector wishlists across India.",
    content: `Every Formula 1 season produces a handful of liveries that instantly become shelf icons. When it comes to die-cast paint finishes, metallic crimson and Lamborghini/Ferrari racing reds stand out dramatically under LED display lighting.

Special Grand Prix one-off liveries — particularly Monza heritage editions, Monaco tributes, and night-race metallic finishes in Singapore and Las Vegas — remain the fastest-appreciating models in 1:43 and 1:64 scale.

Collector Tip: Always inspect decal crispness around the nose cone and rear wing endplates, and keep special-edition models inside UV-filtered acrylic display boxes to preserve bright red and yellow pigments for decades.`,
    cover_image: "/images/hero-ferrari.jpg",
    author: "Rohan Deshmukh",
    read_time: "5 min read",
    specs_json: JSON.stringify({
      TopFinish: "Metallic Rosso Corsa",
      MostWanted: "Monza & Monaco One-Offs",
      BestDisplay: "LED Acrylic Showcase",
    }),
    tags: "F1 Liveries,Ferrari,Red Bull,McLaren,Collecting",
  },
  {
    slug: "how-to-choose-1-64-vs-1-43-vs-1-18-diecast",
    type: "blog",
    category: "Collector Guides",
    title: "1:64 vs 1:43 vs 1:18: Which Die-Cast Scale Should You Collect First?",
    excerpt:
      "Comparing space, budget, paint detail, opening parts, and display options across the three most popular automotive collector scales.",
    content: `Starting a serious die-cast collection comes down to balancing detail, display space, and budget.

1:64 Scale (~7 cm long): The king of variety and desktop garages. Brands like Hot Wheels Premium and Mini GT deliver rubber Real Riders tires and crisp tampos at ₹549–₹1,999, letting you build a 20-car diorama in a single Mini Garage Display.

1:43 Scale (~10 cm long): The official international standard for Formula 1 and endurance motorsport collectors. Every aerodynamic vane, halo bar, driver helmet, and cockpit dial is rendered with museum precision.

1:18 Scale (~25 cm long): True centerpiece art. Heavyweight Zamac metal bodies, steerable front wheels, carpeted interiors, and opening doors/hoods make 1:18 models the crown jewel of any study or showroom shelf.`,
    cover_image: "/images/originals-porsche.jpg",
    author: "iMotora Curators",
    read_time: "6 min read",
    specs_json: JSON.stringify({
      "1:64 Length": "~7.0 – 7.5 cm",
      "1:43 Length": "~10.0 – 11.5 cm",
      "1:18 Length": "~24.0 – 26.5 cm",
    }),
    tags: "Scale Guide,1:64,1:43,1:18,Beginners",
  },
  {
    slug: "monaco-monza-iconic-grand-prix-memorabilia",
    type: "blog",
    category: "Race Tech",
    title: "From Pit Wall to Display Shelf: The Engineering Behind F1 Circuits & Miniature Tracks",
    excerpt:
      "How modular 1:64 banked racing circuits recreate real slipstream battles and cornering grip right on your table.",
    content: `Collecting isn't only about static display — racing miniature circuits brings the thrill of Qualifying and Sunday Grand Prix battles home.

Modern 1:64 modular racing sets like iMotora TRACK 01 pair high-grip matte track surfaces with magnetic downforce chassis and responsive hand controllers. Setting up a sweeping Monza Parabolica or tight Monaco hairpin lets friends race wheel-to-wheel without losing collector appeal.`,
    cover_image: "/images/cat-tracks.jpg",
    author: "Vikram Nair",
    read_time: "3 min read",
    specs_json: JSON.stringify({
      TrackScale: "1:64 Modular",
      CircuitLength: "3.6m – 5.2m",
      Players: "Dual-Lane Head-to-Head",
    }),
    tags: "Racing Tracks,F1 Circuits,Slot Cars,TRACK 01",
  },

  // F1 ENCYCLOPEDIA — F1 RACERS
  {
    slug: "f1-encyclopedia-lewis-hamilton",
    type: "encyclopedia",
    category: "F1 Racers",
    title: "Lewis Hamilton (#44) — 7× Formula 1 World Champion",
    excerpt:
      "The most statistically successful driver in Formula 1 history, celebrated for relentless wet-weather mastery, 105+ Grand Prix wins, and his iconic move to Scuderia Ferrari.",
    content: `Sir Lewis Hamilton rewrote the Formula 1 record books across eras with McLaren, Mercedes-AMG Petronas, and Scuderia Ferrari. Bursting onto the grid in 2007 and claiming his first championship in 2008, Hamilton went on to dominate the Turbo-Hybrid era with six more world titles.

Why collectors prize Hamilton models:
• Number #44 helmet editions (Silverstone, Brazil, Monaco, and Ferrari Rosso debuts) are among the highest-demand 1:43 and 1:18 F1 collectibles worldwide.
• Famous chassis milestones include the 2008 McLaren MP4-23, the black-liveried 2020 Mercedes W11, and his Ferrari crimson machines.`,
    cover_image: "/images/col-motorsport.jpg",
    author: "iMotora F1 Encyclopedia",
    read_time: "Driver Profile",
    specs_json: JSON.stringify({
      Titles: "7× World Champion",
      RaceNumber: "#44",
      Teams: "McLaren • Mercedes • Ferrari",
      GPWins: "105+ Victories",
    }),
    tags: "F1 Racers,Lewis Hamilton,Ferrari,Mercedes,7x Champion",
  },
  {
    slug: "f1-encyclopedia-max-verstappen",
    type: "encyclopedia",
    category: "F1 Racers",
    title: "Max Verstappen (#1) — 4× World Champion & Ground-Effect Dominator",
    excerpt:
      "The youngest Grand Prix winner in F1 history and architect of Red Bull Racing's historic 19-win single-season campaign.",
    content: `Making his Formula 1 debut at just 17 years old, Max Verstappen became the benchmark of modern aggressive racecraft and razor-sharp tire management. Winning his maiden title in a dramatic 2021 finale, Verstappen cemented a dynasty through the ground-effect era with Oracle Red Bull Racing.

Collector Highlights:
• Signature Dutch Orange lion helmets and special Zandvoort / Las Vegas editions.
• The 2023 Red Bull RB19 (#1) holds the all-time F1 record for consecutive wins (10) and highest season win percentage.`,
    cover_image: "/images/col-motorsport.jpg",
    author: "iMotora F1 Encyclopedia",
    read_time: "Driver Profile",
    specs_json: JSON.stringify({
      Titles: "4× World Champion",
      RaceNumber: "#1 / #33",
      Team: "Oracle Red Bull Racing",
      Record: "19 Wins in One Season",
    }),
    tags: "F1 Racers,Max Verstappen,Red Bull,RB19,Champion",
  },
  {
    slug: "f1-encyclopedia-charles-leclerc",
    type: "encyclopedia",
    category: "F1 Racers",
    title: "Charles Leclerc (#16) — The Prince of Monaco & Scuderia Ferrari Star",
    excerpt:
      "Known for electrifying one-lap qualifying speed and unforgettable emotional victories at Monaco and Monza in Ferrari red.",
    content: `Born and raised in Monte Carlo, Charles Leclerc climbed through Ferrari's Driver Academy to become the beating heart of Maranello's modern F1 era. Renowned across the paddock as one of the fastest single-lap qualifiers of his generation, Leclerc delivered iconic home-soil triumph at the 2024 Monaco Grand Prix and thrilled the Tifosi with two Monza victories.

Collector Highlights:
• Ferrari Monza yellow-accented and Monaco special editions in 1:43 and 1:18 scale consistently top Indian collector charts.`,
    cover_image: "/images/hero-ferrari.jpg",
    author: "iMotora F1 Encyclopedia",
    read_time: "Driver Profile",
    specs_json: JSON.stringify({
      RaceNumber: "#16",
      Team: "Scuderia Ferrari",
      SignatureWins: "Monaco & Monza (2×)",
      Strength: "Pole Position Specialist",
    }),
    tags: "F1 Racers,Charles Leclerc,Ferrari,Monaco,Monza",
  },
  {
    slug: "f1-encyclopedia-ayrton-senna",
    type: "encyclopedia",
    category: "F1 Racers",
    title: "Ayrton Senna — 3× World Champion & Eternal Motorsport Icon",
    excerpt:
      "The legendary Brazilian master of Monaco, wet-track brilliance, and the yellow-green helmet that defined Formula 1's golden era.",
    content: `Ayrton Senna remains the spiritual benchmark for raw speed, qualifying commitment, and wet-weather artistry. Claiming three World Championships with McLaren-Honda (1988, 1990, 1991) and six victories around the tight barriers of Monaco, Senna inspired an entire generation of drivers and collectors.

Collector Highlights:
• The 1988 McLaren MP4/4 and 1985 Lotus 97T (black-and-gold) are considered essential museum pieces in any F1 die-cast showcase.`,
    cover_image: "/images/col-classics.jpg",
    author: "iMotora F1 Encyclopedia",
    read_time: "Legend Profile",
    specs_json: JSON.stringify({
      Titles: "3× World Champion",
      MonacoWins: "6 (All-Time Record)",
      IconicCars: "McLaren MP4/4 • Lotus 97T",
      Helmet: "Yellow / Green / Blue",
    }),
    tags: "F1 Racers,Ayrton Senna,McLaren,Monaco,Legend",
  },

  // F1 ENCYCLOPEDIA — F1 TEAMS
  {
    slug: "f1-encyclopedia-scuderia-ferrari",
    type: "encyclopedia",
    category: "F1 Teams",
    title: "Scuderia Ferrari — Formula 1's Most Historic & Successful Constructor",
    excerpt:
      "The only team to compete in every single Formula 1 season since 1950, boasting 16 Constructors' Championships and unmatched global Tifosi passion.",
    content: `Founded by Enzo Ferrari in Maranello, Italy, Scuderia Ferrari is synonymous with Formula 1 itself. From Alberto Ascari and Niki Lauda to Michael Schumacher, Kimi Räikkönen, Charles Leclerc, and Lewis Hamilton, the Prancing Horse has fielded motorsport's greatest icons.

Team Legacy:
• Base: Maranello, Italy (with private Fiorano test circuit next door).
• Signature Color: Rosso Corsa racing red paired with Giallo Modena yellow shields.
• Die-Cast Collectibility: Official Ferrari F1 and road-car scale models hold the broadest global collector base across 1:64, 1:43, and 1:18.`,
    cover_image: "/images/hero-ferrari.jpg",
    author: "iMotora F1 Encyclopedia",
    read_time: "Team Profile",
    specs_json: JSON.stringify({
      ConstructorsTitles: "16 (All-Time Record)",
      DriversTitles: "15",
      Headquarters: "Maranello, Italy",
      Debut: "1950 Monaco GP",
    }),
    tags: "F1 Teams,Scuderia Ferrari,Maranello,Rosso Corsa",
  },
  {
    slug: "f1-encyclopedia-oracle-red-bull-racing",
    type: "encyclopedia",
    category: "F1 Teams",
    title: "Oracle Red Bull Racing — Aerodynamic Innovation & Pit-Stop Precision",
    excerpt:
      "From bold newcomer in 2005 to a multi-era championship juggernaut powering Sebastian Vettel and Max Verstappen to world titles.",
    content: `Based in Milton Keynes, UK, Oracle Red Bull Racing transformed Formula 1 with aggressive aerodynamic concepts, sub-2-second world-record pit stops, and fearless race strategy. Across two distinct championship dynasties (2010–2013 and 2021–2024), Red Bull built some of the most dominant single-seaters ever seen.

Signature Livery: Matte dark navy blue with vibrant crimson bull graphics and bright yellow nose/airbox accents — instantly recognizable on every 1:43 shelf.`,
    cover_image: "/images/col-motorsport.jpg",
    author: "iMotora F1 Encyclopedia",
    read_time: "Team Profile",
    specs_json: JSON.stringify({
      ConstructorsTitles: "6",
      DriversTitles: "8",
      Headquarters: "Milton Keynes, UK",
      PitStopRecord: "1.82 seconds",
    }),
    tags: "F1 Teams,Red Bull Racing,Verstappen,Vettel,Milton Keynes",
  },
  {
    slug: "f1-encyclopedia-mclaren-f1-team",
    type: "encyclopedia",
    category: "F1 Teams",
    title: "McLaren Formula 1 Team — Papaya Heritage & Engineering Excellence",
    excerpt:
      "Founded by Bruce McLaren in 1963, home to Senna, Prost, Häkkinen, Hamilton, and modern Papaya championship contenders.",
    content: `Headquartered at the futuristic McLaren Technology Centre in Woking, UK, McLaren sits among Formula 1's Big Three historic titans. Known for pioneering the first carbon-fiber monocoque chassis (MP4/1 in 1981) and returning to Constructors' Championship glory in the modern era, McLaren's Papaya Orange & Anthracite Black livery is a standout in any die-cast display.`,
    cover_image: "/images/originals-porsche.jpg",
    author: "iMotora F1 Encyclopedia",
    read_time: "Team Profile",
    specs_json: JSON.stringify({
      Founded: "1963 by Bruce McLaren",
      Headquarters: "Woking, UK",
      Innovation: "First Carbon-Fiber F1 Chassis",
      SignatureColor: "Papaya Orange & Black",
    }),
    tags: "F1 Teams,McLaren,Papaya,Woking,Lando Norris",
  },

  // F1 ENCYCLOPEDIA — F1 CARS
  {
    slug: "f1-encyclopedia-ferrari-f2004",
    type: "encyclopedia",
    category: "F1 Cars",
    title: "Ferrari F2004 — The Screaming 19,000 RPM V10 Masterpiece",
    excerpt:
      "Driven by Michael Schumacher and Rubens Barrichello to 15 wins out of 18 races, the F2004 remains the ultimate icon of the V10 era.",
    content: `Widely hailed as the greatest Formula 1 car of the naturally aspirated V10 era, the Ferrari F2004 shattered lap records across the calendar — some of which stood for over a decade. Powered by the 3.0-liter Tipo 053 V10 shrieking past 19,000 RPM and weighing just 605 kg including the driver, it was pure mechanical perfection.

Why collectors hunt it: Clean red bodywork, compact wheelbases, and sculpted sidepod chimneys make 1:43 and 1:18 F2004 castings timeless centerpieces.`,
    cover_image: "/images/prod-ferrari-sf90.jpg",
    author: "iMotora F1 Encyclopedia",
    read_time: "Car Dossier",
    specs_json: JSON.stringify({
      Engine: "3.0L Naturally Aspirated V10",
      Redline: "19,000+ RPM (~900 HP)",
      SeasonRecord: "15 Wins / 18 Races",
      Drivers: "Schumacher & Barrichello",
    }),
    tags: "F1 Cars,Ferrari F2004,V10,Michael Schumacher",
  },
  {
    slug: "f1-encyclopedia-mclaren-mp4-4",
    type: "encyclopedia",
    category: "F1 Cars",
    title: "McLaren MP4/4 (1988) — The Turbo Era's Most Dominant Machine",
    excerpt:
      "Piloted by Ayrton Senna and Alain Prost to 15 victories in 16 Grands Prix with its ultra-low-line Honda V6 turbo architecture.",
    content: `Designed by Steve Nichols and Gordon Murray, the 1988 McLaren MP4/4 took the low-drag, reclined-driver philosophy to extremes. Powered by Honda's RA168E 1.5-liter twin-turbocharged V6, Senna and Prost locked out front rows all season and missed a clean 16/16 sweep only at Monza.`,
    cover_image: "/images/col-classics.jpg",
    author: "iMotora F1 Encyclopedia",
    read_time: "Car Dossier",
    specs_json: JSON.stringify({
      Engine: "1.5L Honda Twin-Turbo V6",
      SeasonRecord: "15 Wins / 16 Races (93.8%)",
      Drivers: "Senna & Prost",
      Weight: "540 kg",
    }),
    tags: "F1 Cars,McLaren MP4/4,Honda Turbo,Senna,1988",
  },
  {
    slug: "f1-encyclopedia-red-bull-rb19",
    type: "encyclopedia",
    category: "F1 Cars",
    title: "Red Bull RB19 (2023) — 21 Wins in 22 Races Ground-Effect Benchmark",
    excerpt:
      "Adrian Newey's aerodynamic tour-de-force that achieved a 95.45% win rate across an entire modern Formula 1 season.",
    content: `The Oracle Red Bull Racing RB19 mastered Formula 1's Venturi ground-effect regulations better than any machine on the grid. Combining extreme DRS straight-line efficiency with anti-dive front suspension that kept its underbody floor platform rock-stable under heavy braking, the RB19 won 21 out of 22 Grands Prix.

Scale Collector Status: Available in 1:64, 1:43, and 1:18 collector editions with authentic Pirelli soft/medium tire markings and special Miami / Las Vegas liveries.`,
    cover_image: "/images/col-motorsport.jpg",
    author: "iMotora F1 Encyclopedia",
    read_time: "Car Dossier",
    specs_json: JSON.stringify({
      Engine: "1.6L Honda RBPT V6 Hybrid",
      SeasonRecord: "21 Wins / 22 Races (95.5%)",
      Designer: "Adrian Newey & Pierre Waché",
      Drivers: "Verstappen & Pérez",
    }),
    tags: "F1 Cars,Red Bull RB19,Ground Effect,Adrian Newey",
  },
]

const SEED_THREADS = [
  {
    category: "Show Your Garage",
    title: "Just set up my 1:64 Ferrari & Lamborghini LED Mini Garage — rate the lighting!",
    body: "Finally moved my Ferrari SF90 Stradale and Lamborghini Huracán out of their blister packs into the iMotora 5-Car Mini Garage Display. The warm overhead LEDs make Rosso Corsa paint look unreal at night. Drop pics or descriptions of your desk setups below!",
    author_name: "Arjun Verma",
    author_badge: "Founder Collector",
    tag: "1:64 Display",
    upvotes: 24,
    pinned: true,
    replies: [
      {
        author_name: "Kabir Singhania",
        body: "That warm LED strip hits different on metallic reds! Are you stacking a second Mini Garage on top for your Porsche 911 GT3 RS pre-order?",
        upvotes: 6,
      },
      {
        author_name: "Arjun Verma",
        body: "100%! Already reserved the Porsche GT3 RS with the 50% deposit — planning a 2-tier Stuttgart vs Maranello shelf.",
        upvotes: 4,
      },
    ],
  },
  {
    category: "F1 Race Talk",
    title: "2026 F1 Active Aero Predictions — Which team nails the new regs first?",
    body: "With 50/50 hybrid power and active front + rear wings coming into play, who do you think builds the dominant chassis? Personally hoping Ferrari brings back a championship-winning red rocket so we get an iconic 1:43 World Champion model!",
    author_name: "Siddharth Rao",
    author_badge: "F1 Pit Crew",
    tag: "Formula 1",
    upvotes: 31,
    pinned: true,
    replies: [
      {
        author_name: "Meera Nair",
        body: "Power unit deployment is going to decide qualifying this season. If Ferrari nails battery harvesting on the straights, Monza is going to be electric!",
        upvotes: 9,
      },
    ],
  },
  {
    category: "Pre-Order Watch",
    title: "50% Deposit Pre-Order on the Porsche 911 GT3 RS Originals — anyone else locked in?",
    body: "Love that iMotora lets us pay 50% upfront and the remaining 50% when the batch lands in Mumbai. Much easier on the monthly collector budget when grabbing multiple 1:43 releases at once.",
    author_name: "Devansh Patel",
    author_badge: "VIP Member",
    tag: "Pre-Order",
    upvotes: 18,
    pinned: false,
    replies: [
      {
        author_name: "Riya Malhotra",
        body: "Yes! Just reserved both the Porsche 911 GT3 RS and the Formula 1 1:43 racer on 50% deposit. Hoping they add a Lamborghini Revuelto 1:43 next!",
        upvotes: 5,
      },
    ],
  },
  {
    category: "Display & DIY Tracks",
    title: "Tips for building a Monza-style high-speed oval with TRACK 01 (5.2m Pro Expansion)",
    body: "We combined two banked corners on a 6x3 ft folding table and timed laps with my nephew. Pro tip: clean the metal track rails gently with a dry microfiber cloth before a race session for instant throttle smoothness.",
    author_name: "Nikhil Joshi",
    author_badge: "Track Architect",
    tag: "TRACK 01",
    upvotes: 14,
    pinned: false,
    replies: [],
  },
  {
    category: "Buy / Trade / ISO",
    title: "[ISO Mumbai/Pune] Looking for Hot Wheels Premium Car Culture Chase or Rally Legends",
    body: "Looking to trade a sealed Subaru Impreza WRX STI 1:64 or pick up any spare Car Culture motorsport castings in mint card condition. Happy to meet at the next Mumbai die-cast collector meetup.",
    author_name: "Karan Gill",
    author_badge: "Collector",
    tag: "Trade / ISO",
    upvotes: 9,
    pinned: false,
    replies: [],
  },
]

const SEED_MEMBERS = [
  { full_name: "Arjun Verma", member_type: "Collector", phone: "+91 98201 11223", email: "arjun.verma@example.in", city: "Mumbai", state: "Maharashtra", interests: ["1:64 Die-Cast", "1:43 F1 & Motorsport", "LED Displays & Dioramas"] },
  { full_name: "Kabir Singhania", member_type: "Hobbyist", phone: "+91 98111 22334", email: "kabir.s@example.in", city: "New Delhi", state: "Delhi", interests: ["1:64 Die-Cast", "Racing Tracks"] },
  { full_name: "Siddharth Rao", member_type: "Collector", phone: "+91 98450 33445", email: "siddharth.rao@example.in", city: "Bengaluru", state: "Karnataka", interests: ["1:43 F1 & Motorsport", "1:18 Scale Models"] },
  { full_name: "Meera Nair", member_type: "Hobbyist", phone: "+91 98400 44556", email: "meera.nair@example.in", city: "Chennai", state: "Tamil Nadu", interests: ["1:43 F1 & Motorsport", "Vintage & Classics"] },
  { full_name: "Rajeshwari Auto Toys", member_type: "Wholesaler", phone: "+91 98220 55667", email: "sales@rajeshwariauto.in", city: "Pune", state: "Maharashtra", interests: ["1:64 Die-Cast", "Bulk / Wholesale", "Racing Tracks"] },
  { full_name: "Devansh Patel", member_type: "Retailer", phone: "+91 98250 66778", email: "devansh.patel@example.in", city: "Ahmedabad", state: "Gujarat", interests: ["1:64 Die-Cast", "Bulk / Wholesale", "LED Displays & Dioramas"] },
  { full_name: "Riya Malhotra", member_type: "Collector", phone: "+91 98180 77889", email: "riya.m@example.in", city: "Gurugram", state: "Haryana", interests: ["1:43 F1 & Motorsport", "1:18 Scale Models", "LED Displays & Dioramas"] },
  { full_name: "Nikhil Joshi", member_type: "Track Builder", phone: "+91 98230 88990", email: "nikhil.joshi@example.in", city: "Pune", state: "Maharashtra", interests: ["Racing Tracks", "LED Displays & Dioramas", "1:64 Die-Cast"] },
  { full_name: "Karan Gill", member_type: "Reseller / Trader", phone: "+91 98140 99001", email: "karan.gill@example.in", city: "Chandigarh", state: "Chandigarh", interests: ["1:64 Die-Cast", "Vintage & Classics", "Bulk / Wholesale"] },
  { full_name: "ScaleCraft Distributors", member_type: "Wholesaler", phone: "+91 98490 10112", email: "orders@scalecraft.in", city: "Hyderabad", state: "Telangana", interests: ["Bulk / Wholesale", "1:64 Die-Cast", "1:43 F1 & Motorsport"] },
  { full_name: "Ananya Chatterjee", member_type: "Hobbyist", phone: "+91 98300 12134", email: "ananya.c@example.in", city: "Kolkata", state: "West Bengal", interests: ["1:64 Die-Cast", "Vintage & Classics"] },
  { full_name: "Vikram Menon", member_type: "Collector", phone: "+91 98470 14156", email: "vikram.menon@example.in", city: "Kochi", state: "Kerala", interests: ["1:18 Scale Models", "1:43 F1 & Motorsport"] },
  { full_name: "Apex Hobby Store", member_type: "Retailer", phone: "+91 98455 16178", email: "hello@apexhobby.in", city: "Bengaluru", state: "Karnataka", interests: ["Bulk / Wholesale", "Racing Tracks", "LED Displays & Dioramas"] },
  { full_name: "Rohan Deshmukh", member_type: "Hobbyist", phone: "+91 98205 18190", email: "rohan.d@example.in", city: "Mumbai", state: "Maharashtra", interests: ["1:64 Die-Cast", "1:43 F1 & Motorsport", "Racing Tracks"] },
]

export async function ensureCommunityDb(): Promise<Pool> {
  const pool = getPool()
  if (initialized) return pool

  await pool.query(`
    CREATE TABLE IF NOT EXISTS imotora_articles (
      id SERIAL PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      type TEXT NOT NULL DEFAULT 'blog',
      category TEXT NOT NULL DEFAULT 'F1 News',
      title TEXT NOT NULL,
      excerpt TEXT NOT NULL DEFAULT '',
      content TEXT NOT NULL,
      cover_image TEXT NOT NULL DEFAULT '/images/col-motorsport.jpg',
      author TEXT NOT NULL DEFAULT 'iMotora Editorial',
      read_time TEXT NOT NULL DEFAULT '4 min read',
      specs_json JSONB NOT NULL DEFAULT '{}'::jsonb,
      tags TEXT NOT NULL DEFAULT '',
      published BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS imotora_forum_threads (
      id SERIAL PRIMARY KEY,
      category TEXT NOT NULL DEFAULT 'General',
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      author_name TEXT NOT NULL DEFAULT 'Collector',
      author_badge TEXT NOT NULL DEFAULT 'Member',
      tag TEXT NOT NULL DEFAULT '',
      upvotes INTEGER NOT NULL DEFAULT 1,
      pinned BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS imotora_forum_replies (
      id SERIAL PRIMARY KEY,
      thread_id INTEGER NOT NULL REFERENCES imotora_forum_threads(id) ON DELETE CASCADE,
      author_name TEXT NOT NULL DEFAULT 'Collector',
      body TEXT NOT NULL,
      upvotes INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS imotora_community_members (
      id SERIAL PRIMARY KEY,
      full_name TEXT NOT NULL,
      member_type TEXT NOT NULL DEFAULT 'Hobbyist',
      phone TEXT NOT NULL DEFAULT '',
      email TEXT NOT NULL UNIQUE,
      city TEXT NOT NULL DEFAULT '',
      state TEXT NOT NULL DEFAULT '',
      interests TEXT[] NOT NULL DEFAULT '{}',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `)

  // Upsert latest F1 Encyclopedia entries (Racers, Teams, Cars) + Blog stories
  for (const a of SEED_ARTICLES) {
    await pool.query(
      `INSERT INTO imotora_articles (slug, type, category, title, excerpt, content, cover_image, author, read_time, specs_json, tags)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10::jsonb,$11)
       ON CONFLICT (slug) DO NOTHING`,
      [
        a.slug,
        a.type,
        a.category,
        a.title,
        a.excerpt,
        a.content,
        a.cover_image,
        a.author,
        a.read_time,
        a.specs_json,
        a.tags,
      ]
    )
  }

  // Seed forum threads if empty
  const { rows: thrCount } = await pool.query(`SELECT COUNT(*)::int AS cnt FROM imotora_forum_threads`)
  if ((thrCount[0]?.cnt ?? 0) === 0) {
    for (const t of SEED_THREADS) {
      const ins = await pool.query(
        `INSERT INTO imotora_forum_threads (category, title, body, author_name, author_badge, tag, upvotes, pinned)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
         RETURNING id`,
        [t.category, t.title, t.body, t.author_name, t.author_badge, t.tag, t.upvotes, t.pinned]
      )
      const threadId = ins.rows[0].id
      for (const r of t.replies) {
        await pool.query(
          `INSERT INTO imotora_forum_replies (thread_id, author_name, body, upvotes)
           VALUES ($1,$2,$3,$4)`,
          [threadId, r.author_name, r.body, r.upvotes]
        )
      }
    }
  }

  // Seed community member profiles if empty
  const { rows: memCount } = await pool.query(`SELECT COUNT(*)::int AS cnt FROM imotora_community_members`)
  if ((memCount[0]?.cnt ?? 0) === 0) {
    for (const m of SEED_MEMBERS) {
      await pool.query(
        `INSERT INTO imotora_community_members (full_name, member_type, phone, email, city, state, interests)
         VALUES ($1,$2,$3,$4,$5,$6,$7)
         ON CONFLICT (email) DO NOTHING`,
        [m.full_name, m.member_type, m.phone, m.email, m.city, m.state, m.interests]
      )
    }
  }

  initialized = true
  return pool
}

export async function getCommunityStatsFromDb() {
  const pool = await ensureCommunityDb()

  const [memberTotals, forumTotals, byCategoryRes, byInterestRes, byStateRes, forumByCatRes] =
    await Promise.all([
      pool.query(`
        SELECT
          COUNT(*)::int AS total_members,
          COUNT(DISTINCT NULLIF(TRIM(state), ''))::int AS states_count,
          COUNT(DISTINCT NULLIF(TRIM(city), ''))::int AS cities_count
        FROM imotora_community_members
      `),
      pool.query(`
        SELECT
          (SELECT COUNT(*)::int FROM imotora_forum_threads) AS total_threads,
          (SELECT COUNT(*)::int FROM imotora_forum_replies) AS total_replies,
          (SELECT COALESCE(SUM(upvotes), 0)::int FROM imotora_forum_threads) AS total_upvotes
      `),
      pool.query(`
        SELECT member_type AS label, COUNT(*)::int AS count
        FROM imotora_community_members
        GROUP BY member_type
        ORDER BY count DESC, member_type ASC
      `),
      pool.query(`
        SELECT interest AS label, COUNT(*)::int AS count
        FROM imotora_community_members, UNNEST(interests) AS interest
        GROUP BY interest
        ORDER BY count DESC, interest ASC
      `),
      pool.query(`
        SELECT state AS label, COUNT(*)::int AS count
        FROM imotora_community_members
        WHERE TRIM(state) <> ''
        GROUP BY state
        ORDER BY count DESC, state ASC
        LIMIT 8
      `),
      pool.query(`
        SELECT t.category AS label,
               COUNT(DISTINCT t.id)::int AS threads,
               COUNT(r.id)::int AS replies
        FROM imotora_forum_threads t
        LEFT JOIN imotora_forum_replies r ON r.thread_id = t.id
        GROUP BY t.category
        ORDER BY threads DESC, t.category ASC
      `),
    ])

  return {
    activity: {
      totalMembers: memberTotals.rows[0]?.total_members ?? 0,
      statesCount: memberTotals.rows[0]?.states_count ?? 0,
      citiesCount: memberTotals.rows[0]?.cities_count ?? 0,
      totalThreads: forumTotals.rows[0]?.total_threads ?? 0,
      totalReplies: forumTotals.rows[0]?.total_replies ?? 0,
      totalUpvotes: forumTotals.rows[0]?.total_upvotes ?? 0,
    },
    byCategory: byCategoryRes.rows as { label: string; count: number }[],
    byInterest: byInterestRes.rows as { label: string; count: number }[],
    byState: byStateRes.rows as { label: string; count: number }[],
    forumByCategory: forumByCatRes.rows as {
      label: string
      threads: number
      replies: number
    }[],
  }
}

