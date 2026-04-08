export interface Plan {
  id: string;
  tier: string;
  price: number;
  duration: string;
  originalPrice?: number;
}

export interface Product {
  id: string; // The specific string ID we use (mapped to productId in Mongo)
  category: string;
  name: string;
  description: string;
  badge: string | null;
  icon: string;
  iconBg: string;
  iconColor: string;
  plans: Plan[];
}

export interface CategoryData {
  id?: string;
  name: string;
  icon: string;
  order: number;
}

export interface BadgeData {
  id?: string;
  name: string;
  colorClass: string;
}

// ── Initial Seed Data (Only pushed to MongoDB if empty) ──────────────
export const INITIAL_CATEGORIES: CategoryData[] = [
  { name: "Streaming", icon: "Tv2", order: 1 },
  { name: "AI Tools", icon: "Bot", order: 2 },
  { name: "VPNs", icon: "Globe", order: 3 },
  { name: "Bundles", icon: "Layers", order: 4 },
  { name: "Gaming", icon: "Gamepad2", order: 5 },
];

export const INITIAL_BADGES: BadgeData[] = [
  { name: "BEST SELLER", colorClass: "badge-green" },
  { name: "NEW", colorClass: "badge-blue" },
  { name: "DEAL", colorClass: "badge-green" },
  { name: "PREMIUM", colorClass: "badge-purple" },
  { name: "HIGH DEMAND", colorClass: "badge-red" },
  { name: "OFFER", colorClass: "badge-yellow" },
  { name: "FAN FAVORITE", colorClass: "badge-orange" },
  { name: "SAVE 30%", colorClass: "badge-green" },
  { name: "CREATIVE", colorClass: "badge-purple" },
  { name: "CAREER", colorClass: "badge-blue" },
  { name: "HOT", colorClass: "badge-red" },
];

// Note: Products price i choose BDT ....
export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "netflix",
    category: "Streaming",
    name: "Netflix",
    description: "Premium 4K",
    badge: "BEST SELLER",
    icon: "Tv2",
    iconBg: "#E50914",
    iconColor: "#ffffff",
    plans: [
      { id: "n-1", tier: "1 Mobile", price: 150, duration: "1 Month" },
      { id: "n-2", tier: "1 Screen (HD)", price: 299, duration: "1 Month" },
      { id: "n-3", tier: "1 Screen (4K)", price: 399, duration: "1 Month", originalPrice: 450 },
      { id: "n-4", tier: "4 Screens (4K)", price: 1200, duration: "1 Month" },
    ],
  },
  {
    id: "prime",
    category: "Streaming",
    name: "Amazon Prime",
    description: "Video + Shipping",
    badge: "NEW",
    icon: "ShoppingBag",
    iconBg: "#00A8E1",
    iconColor: "#ffffff",
    plans: [
      { id: "p-1", tier: "1 Screen", price: 150, duration: "1 Month" },
      { id: "p-2", tier: "Private Account", price: 450, duration: "6 Months", originalPrice: 600 },
    ],
  },
  {
    id: "youtube-prem",
    category: "Streaming",
    name: "YouTube",
    description: "Premium Ad-Free",
    badge: null,
    icon: "PlayCircle",
    iconBg: "#FF0000",
    iconColor: "#ffffff",
    plans: [
      { id: "y-1", tier: "Individual", price: 250, duration: "1 Month" },
      { id: "y-2", tier: "Family", price: 400, duration: "1 Month" },
    ],
  },
  {
    id: "crunchyroll",
    category: "Streaming",
    name: "Crunchyroll",
    description: "Anime Streaming",
    badge: "FAN FAVORITE",
    icon: "Film",
    iconBg: "#F47521",
    iconColor: "#ffffff",
    plans: [
      { id: "c-1", tier: "Mega Fan", price: 250, duration: "1 Month", originalPrice: 350 },
    ],
  },
  {
    id: "chatgpt",
    category: "AI Tools",
    name: "ChatGPT Plus",
    description: "GPT-4 & DALL-E",
    badge: "HIGH DEMAND",
    icon: "Bot",
    iconBg: "#10A37F",
    iconColor: "#ffffff",
    plans: [
      { id: "gpt-1", tier: "Shared Account", price: 399, duration: "1 Month" },
      { id: "gpt-2", tier: "Private Account", price: 2500, duration: "1 Month" },
    ],
  },
  {
    id: "gemini",
    category: "AI Tools",
    name: "Google Gemini",
    description: "Advanced AI",
    badge: "OFFER",
    icon: "Sparkles",
    iconBg: "#4285F4",
    iconColor: "#ffffff",
    plans: [
      { id: "gem-1", tier: "Private (1 Month)", price: 599, duration: "1 Month", originalPrice: 800 },
    ],
  },
  {
    id: "canvas-pro",
    category: "AI Tools",
    name: "Canva Pro",
    description: "Design Premium",
    badge: "CREATIVE",
    icon: "Palette",
    iconBg: "#00C4CC",
    iconColor: "#ffffff",
    plans: [
      { id: "canva-1", tier: "Pro Edu", price: 150, duration: "1 Year", originalPrice: 500 },
      { id: "canva-2", tier: "Pro Lifetime", price: 500, duration: "Lifetime", originalPrice: 1500 },
    ],
  },
  {
    id: "linkedin",
    category: "AI Tools",
    name: "LinkedIn Premium",
    description: "Business Premium",
    badge: "CAREER",
    icon: "Briefcase",
    iconBg: "#0A66C2",
    iconColor: "#ffffff",
    plans: [
      { id: "lin-1", tier: "Career (6 Months)", price: 1200, duration: "6 Months", originalPrice: 2000 },
      { id: "lin-2", tier: "Business (1 Year)", price: 2500, duration: "1 Year", originalPrice: 4000 },
    ],
  },
  {
    id: "nordvpn",
    category: "VPNs",
    name: "NordVPN",
    description: "Secure Browsing",
    badge: "DEAL",
    icon: "ShieldCheck",
    iconBg: "#4687FF",
    iconColor: "#ffffff",
    plans: [
      { id: "nv-1", tier: "1 Year", price: 800, duration: "1 Year", originalPrice: 1500 },
    ],
  },
  {
    id: "mega-bundle",
    category: "Bundles",
    name: "Mega Bundle",
    description: "Netflix + Prime",
    badge: "SAVE 30%",
    icon: "Layers",
    iconBg: "#F59E0B",
    iconColor: "#000000",
    plans: [
      { id: "mb-1m", tier: "1 Month", price: 650, duration: "1 Month", originalPrice: 950 },
    ],
  },
  {
    id: "pubg-uc",
    category: "Gaming",
    name: "PUBG Mobile UC",
    description: "Global Topup",
    badge: "BEST SELLER",
    icon: "Zap",
    iconBg: "#F59E0B",
    iconColor: "#ffffff",
    plans: [
      { id: "uc-60", tier: "60 UC", price: 1, duration: "One Time", originalPrice: 2 },
      { id: "uc-325", tier: "325 UC", price: 5, duration: "One Time", originalPrice: 7 },
      { id: "uc-660", tier: "660 UC", price: 10, duration: "One Time", originalPrice: 12 },
    ],
  },
  {
    id: "freefire-dia",
    category: "Gaming",
    name: "Free Fire Diamonds",
    description: "Direct Topup",
    badge: "HOT",
    icon: "Star",
    iconBg: "#EF4444",
    iconColor: "#ffffff",
    plans: [
      { id: "ffd-100", tier: "100 Diamonds", price: 1, duration: "One Time", originalPrice: 2 },
      { id: "ffd-520", tier: "520 Diamonds", price: 5, duration: "One Time", originalPrice: 7 },
      { id: "ffd-1060", tier: "1060 Diamonds", price: 10, duration: "One Time", originalPrice: 13 },
    ],
  },
  {
    id: "disney-plus",
    category: "Streaming",
    name: "Disney+",
    description: "Movies & Shows",
    badge: "NEW",
    icon: "Film",
    iconBg: "#006e99",
    iconColor: "#ffffff",
    plans: [
      { id: "dp-1", tier: "1 Screen (HD)", price: 200, duration: "1 Month" },
      { id: "dp-2", tier: "4 Screens (4K)", price: 600, duration: "1 Month", originalPrice: 800 },
    ],
  },
  {
    id: "spotify-prem",
    category: "Streaming",
    name: "Spotify Premium",
    description: "Ad-Free Music",
    badge: "BEST SELLER",
    icon: "Headphones",
    iconBg: "#1DB954",
    iconColor: "#ffffff",
    plans: [
      { id: "spot-1", tier: "Individual", price: 150, duration: "1 Month" },
      { id: "spot-2", tier: "Duo", price: 250, duration: "1 Month" },
      { id: "spot-3", tier: "Family", price: 300, duration: "1 Month", originalPrice: 400 },
    ],
  },
  {
    id: "expressvpn",
    category: "VPNs",
    name: "ExpressVPN",
    description: "Fast & Secure",
    badge: "PREMIUM",
    icon: "Shield",
    iconBg: "#DA251D",
    iconColor: "#ffffff",
    plans: [
      { id: "ev-1", tier: "1 Month", price: 400, duration: "1 Month" },
      { id: "ev-12", tier: "1 Year", price: 3000, duration: "1 Year", originalPrice: 4800 },
    ],
  },
  {
    id: "midjourney",
    category: "AI Tools",
    name: "Midjourney",
    description: "AI Image",
    badge: "CREATIVE",
    icon: "Palette",
    iconBg: "#111827",
    iconColor: "#ffffff",
    plans: [
      { id: "mj-1", tier: "Basic", price: 800, duration: "1 Month" },
      { id: "mj-2", tier: "Standard", price: 2000, duration: "1 Month" },
    ],
  },
  {
    id: "genshin-crystals",
    category: "Gaming",
    name: "Genshin Impact",
    description: "Genesis Crystals",
    badge: "HOT",
    icon: "Zap",
    iconBg: "#3B82F6",
    iconColor: "#ffffff",
    plans: [
      { id: "gi-60", tier: "60 Genesis Crystals", price: 1, duration: "One Time" },
      { id: "gi-300", tier: "300+30 Genesis Crystals", price: 5, duration: "One Time" },
      { id: "gi-980", tier: "980+110 Genesis Crystals", price: 15, duration: "One Time", originalPrice: 18 },
    ],
  },
];
