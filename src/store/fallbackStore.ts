// Fallback store for when database is not available
// This ensures the app works even without database connection

export interface FallbackProject {
  id: number;
  name: string;
  location: string;
  description: string;
  price: string;
  area: string;
  bedrooms?: number;
  bathrooms?: number;
  status: "available" | "sold" | "coming-soon";
  image: string;
  features: string[];
  x: number;
  y: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface FallbackMapSettings {
  backgroundImage: string;
  theme: string;
  defaultZoom: number;
  centerLat: number;
  centerLng: number;
}

// Default projects for fallback
export const defaultProjects: FallbackProject[] = [
  {
    id: 1,
    name: "Nesaj Town Riyadh",
    location: "North Riyadh",
    description: "Modern residential community with world-class amenities",
    price: "1.2M SAR",
    area: "250 sqm",
    bedrooms: 4,
    bathrooms: 3,
    status: "available",
    image:
      "https://images.pexels.com/photos/10619954/pexels-photo-10619954.jpeg",
    features: ["Swimming Pool", "Gym", "Garden", "Security"],
    x: 35,
    y: 25,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: 2,
    name: "Nesaj Town Al Narjis",
    location: "Al Narjis District",
    description: "Luxury villas in prime location with garden views",
    price: "1.5M SAR",
    area: "320 sqm",
    bedrooms: 5,
    bathrooms: 4,
    status: "coming-soon",
    image:
      "https://images.pexels.com/photos/14769891/pexels-photo-14769891.jpeg",
    features: ["Private Garden", "Parking", "Smart Home", "Lake View"],
    x: 60,
    y: 35,
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: 3,
    name: "Nesaj Al Fursan",
    location: "Al Fursan",
    description: "Contemporary apartments with smart home technology",
    price: "980K SAR",
    area: "180 sqm",
    bedrooms: 3,
    bathrooms: 2,
    status: "sold",
    image:
      "https://images.pexels.com/photos/10619954/pexels-photo-10619954.jpeg",
    features: ["Smart Home", "Gym", "Roof Garden", "24/7 Security"],
    x: 45,
    y: 55,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-25"),
  },
  {
    id: 4,
    name: "Ewan Sedra",
    location: "East Riyadh",
    description: "Premium luxury compound with exclusive amenities",
    price: "2.1M SAR",
    area: "450 sqm",
    bedrooms: 6,
    bathrooms: 5,
    status: "available",
    image:
      "https://images.pexels.com/photos/14769891/pexels-photo-14769891.jpeg",
    features: ["Golf Course", "Spa", "Private Beach", "Concierge"],
    x: 70,
    y: 45,
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
  },
  {
    id: 5,
    name: "Roya Sedra",
    location: "South Riyadh",
    description: "Family-oriented community with excellent schools nearby",
    price: "1.8M SAR",
    area: "300 sqm",
    bedrooms: 4,
    bathrooms: 3,
    status: "available",
    image:
      "https://images.pexels.com/photos/10619954/pexels-photo-10619954.jpeg",
    features: ["School", "Playground", "Community Center", "Parks"],
    x: 25,
    y: 60,
    createdAt: new Date("2024-01-28"),
    updatedAt: new Date("2024-01-28"),
  },
];

// Default map settings
export const defaultMapSettings: FallbackMapSettings = {
  backgroundImage:
    "https://saraya-al-fursan.darwaemaar.com/images/map/riyadh/map.jpg",
  theme: "dark",
  defaultZoom: 12,
  centerLat: 24.7136,
  centerLng: 46.6753,
};

// Default users
export const defaultUsers = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@verse.sa",
    role: "admin" as const,
    lastLogin: new Date(),
    isActive: true,
  },
  {
    id: 2,
    name: "Project Manager",
    email: "manager@verse.sa",
    role: "manager" as const,
    lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isActive: true,
  },
  {
    id: 3,
    name: "Sales Viewer",
    email: "sales@verse.sa",
    role: "viewer" as const,
    lastLogin: new Date(Date.now() - 6 * 60 * 60 * 1000),
    isActive: true,
  },
];

// Default analytics - matches Analytics interface
export const defaultAnalytics = {
  id: 1,
  totalProjects: 5,
  totalViews: 1247,
  uniqueVisitors: 856,
  conversionRate: 12.5,
  avgTimeOnSite: 245,
  bounceRate: 24.8,
  popularProjects: [
    { projectId: 1, views: 324 },
    { projectId: 4, views: 298 },
    { projectId: 2, views: 201 },
  ],
  trafficSources: {
    direct: 45,
    search: 32,
    social: 15,
    referral: 8,
  },
  recentActivity: [
    {
      id: 1,
      action: "Project created: Roya Sedra",
      timestamp: new Date(),
      user: "Admin User",
    },
    {
      id: 2,
      action: "User logged in",
      timestamp: new Date(),
      user: "Project Manager",
    },
    {
      id: 3,
      action: "Project updated: Nesaj Al Fursan",
      timestamp: new Date(),
      user: "Admin User",
    },
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
};
