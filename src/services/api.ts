import { prisma } from "../lib/prisma";
import type {
  Project,
  User,
  MapSettings,
  ThemeSettings,
  SystemSettings,
  Activity,
  Analytics,
} from "@prisma/client";

// Projects API
export const projectsApi = {
  // Get all projects
  async getAll(): Promise<Project[]> {
    return await prisma.project.findMany({
      include: {
        creator: true,
        views: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  // Get project by ID
  async getById(id: number): Promise<Project | null> {
    return await prisma.project.findUnique({
      where: { id },
      include: {
        creator: true,
        views: true,
      },
    });
  },

  // Create new project
  async create(
    data: Omit<Project, "id" | "createdAt" | "updatedAt">,
  ): Promise<Project> {
    return await prisma.project.create({
      data,
      include: {
        creator: true,
      },
    });
  },

  // Update project
  async update(id: number, data: Partial<Project>): Promise<Project> {
    return await prisma.project.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
      include: {
        creator: true,
      },
    });
  },

  // Delete project
  async delete(id: number): Promise<void> {
    await prisma.project.delete({
      where: { id },
    });
  },

  // Track project view
  async trackView(
    projectId: number,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<void> {
    await prisma.projectView.create({
      data: {
        projectId,
        ipAddress,
        userAgent,
      },
    });
  },

  // Get project views count
  async getViewsCount(projectId: number): Promise<number> {
    return await prisma.projectView.count({
      where: { projectId },
    });
  },
};

// Users API
export const usersApi = {
  // Get all users
  async getAll(): Promise<User[]> {
    return await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  // Get user by ID
  async getById(id: number): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id },
    });
  },

  // Get user by email
  async getByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email },
    });
  },

  // Create new user
  async create(
    data: Omit<User, "id" | "createdAt" | "updatedAt">,
  ): Promise<User> {
    return await prisma.user.create({
      data,
    });
  },

  // Update user
  async update(id: number, data: Partial<User>): Promise<User> {
    return await prisma.user.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  },

  // Delete user
  async delete(id: number): Promise<void> {
    await prisma.user.delete({
      where: { id },
    });
  },

  // Update last login
  async updateLastLogin(id: number): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: {
        lastLogin: new Date(),
      },
    });
  },
};

// Map Settings API
export const mapSettingsApi = {
  // Get current map settings
  async getCurrent(): Promise<MapSettings | null> {
    return await prisma.mapSettings.findFirst({
      orderBy: {
        updatedAt: "desc",
      },
    });
  },

  // Create or update map settings
  async upsert(
    data: Omit<MapSettings, "id" | "createdAt" | "updatedAt">,
  ): Promise<MapSettings> {
    // Try to get existing settings
    const existing = await this.getCurrent();

    if (existing) {
      return await prisma.mapSettings.update({
        where: { id: existing.id },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      });
    } else {
      return await prisma.mapSettings.create({
        data,
      });
    }
  },
};

// Theme Settings API
export const themeSettingsApi = {
  // Get active theme
  async getActive(): Promise<ThemeSettings | null> {
    return await prisma.themeSettings.findFirst({
      where: { isActive: true },
    });
  },

  // Get all themes
  async getAll(): Promise<ThemeSettings[]> {
    return await prisma.themeSettings.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  // Create new theme
  async create(
    data: Omit<ThemeSettings, "id" | "createdAt" | "updatedAt">,
  ): Promise<ThemeSettings> {
    return await prisma.themeSettings.create({
      data,
    });
  },

  // Update theme
  async update(
    id: number,
    data: Partial<ThemeSettings>,
  ): Promise<ThemeSettings> {
    return await prisma.themeSettings.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  },

  // Set active theme
  async setActive(id: number): Promise<void> {
    // Deactivate all themes
    await prisma.themeSettings.updateMany({
      data: { isActive: false },
    });

    // Activate the selected theme
    await prisma.themeSettings.update({
      where: { id },
      data: { isActive: true },
    });
  },

  // Delete theme
  async delete(id: number): Promise<void> {
    await prisma.themeSettings.delete({
      where: { id },
    });
  },
};

// System Settings API
export const systemSettingsApi = {
  // Get current system settings
  async getCurrent(): Promise<SystemSettings | null> {
    return await prisma.systemSettings.findFirst({
      orderBy: {
        updatedAt: "desc",
      },
    });
  },

  // Create or update system settings
  async upsert(
    data: Omit<SystemSettings, "id" | "createdAt" | "updatedAt">,
  ): Promise<SystemSettings> {
    const existing = await this.getCurrent();

    if (existing) {
      return await prisma.systemSettings.update({
        where: { id: existing.id },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      });
    } else {
      return await prisma.systemSettings.create({
        data,
      });
    }
  },
};

// Activity API
export const activityApi = {
  // Log new activity
  async log(data: {
    action: string;
    description?: string;
    userId?: number;
    projectId?: number;
    metadata?: any;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<Activity> {
    return await prisma.activity.create({
      data,
    });
  },

  // Get recent activities
  async getRecent(limit: number = 10): Promise<Activity[]> {
    return await prisma.activity.findMany({
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: true,
        project: true,
      },
    });
  },

  // Get activities by user
  async getByUser(userId: number, limit: number = 50): Promise<Activity[]> {
    return await prisma.activity.findMany({
      where: { userId },
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        project: true,
      },
    });
  },

  // Get activities by project
  async getByProject(projectId: number): Promise<Activity[]> {
    return await prisma.activity.findMany({
      where: { projectId },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: true,
      },
    });
  },
};

// Analytics API
export const analyticsApi = {
  // Get analytics for date range
  async getByDateRange(startDate: Date, endDate: Date): Promise<Analytics[]> {
    return await prisma.analytics.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        date: "asc",
      },
    });
  },

  // Get latest analytics
  async getLatest(): Promise<Analytics | null> {
    return await prisma.analytics.findFirst({
      orderBy: {
        date: "desc",
      },
    });
  },

  // Update or create analytics for today
  async updateToday(data: Partial<Analytics>): Promise<Analytics> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return await prisma.analytics.upsert({
      where: { date: today },
      update: {
        ...data,
        updatedAt: new Date(),
      },
      create: {
        date: today,
        ...data,
      },
    });
  },

  // Increment page views
  async incrementViews(): Promise<void> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await prisma.analytics.upsert({
      where: { date: today },
      update: {
        totalViews: {
          increment: 1,
        },
        updatedAt: new Date(),
      },
      create: {
        date: today,
        totalViews: 1,
      },
    });
  },

  // Get popular projects
  async getPopularProjects(
    limit: number = 5,
  ): Promise<{ projectId: number; views: number; project: Project }[]> {
    const result = await prisma.projectView.groupBy({
      by: ["projectId"],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: "desc",
        },
      },
      take: limit,
    });

    // Get project details
    const projectsWithViews = await Promise.all(
      result.map(async (item) => {
        const project = await prisma.project.findUnique({
          where: { id: item.projectId },
        });
        return {
          projectId: item.projectId,
          views: item._count.id,
          project: project!,
        };
      }),
    );

    return projectsWithViews;
  },
};

// Helper function to initialize default data
export const seedDatabase = async () => {
  try {
    // Create default admin user
    const adminUser = await prisma.user.upsert({
      where: { email: "admin@verse.sa" },
      update: {},
      create: {
        name: "Admin User",
        email: "admin@verse.sa",
        role: "ADMIN",
        isActive: true,
      },
    });

    // Create default map settings
    await mapSettingsApi.upsert({
      backgroundImage:
        "https://saraya-al-fursan.darwaemaar.com/images/map/riyadh/map.jpg",
      theme: "dark",
      defaultZoom: 12,
      centerLat: 24.7136,
      centerLng: 46.6753,
      brightness: 0.9,
      contrast: 1.1,
      saturation: 1.0,
      showLabels: true,
      enableAnimation: true,
      clusterMarkers: false,
      lazyLoading: true,
      imageCompression: true,
      preloadAssets: false,
    });

    // Create default system settings
    await systemSettingsApi.upsert({
      siteName: "VERSE Real Estate",
      siteDescription: "Premium real estate platform in Saudi Arabia",
      contactEmail: "contact@verse.sa",
      phoneNumber: "+966 50 123 4567",
      address: "King Fahd Road, Riyadh, Saudi Arabia",
      enableNotifications: true,
      enableAnalytics: true,
      enableCaching: true,
      maintenanceMode: false,
      allowGuestViewing: true,
      requireApproval: false,
      autoBackup: true,
      maxProjectsPerPage: 12,
      backupFrequency: "daily",
      language: "en",
      timezone: "Asia/Riyadh",
      currency: "SAR",
    });

    // Create sample projects
    const sampleProjects = [
      {
        name: "Nesaj Town Riyadh",
        location: "North Riyadh",
        description: "Modern residential community with world-class amenities",
        price: "1.2M SAR",
        area: "250 sqm",
        bedrooms: 4,
        bathrooms: 3,
        status: "AVAILABLE" as const,
        image:
          "https://images.pexels.com/photos/10619954/pexels-photo-10619954.jpeg",
        features: ["Swimming Pool", "Gym", "Garden", "Security"],
        x: 35,
        y: 25,
        createdBy: adminUser.id,
      },
      {
        name: "Nesaj Town Al Narjis",
        location: "Al Narjis District",
        description: "Luxury villas in prime location with garden views",
        price: "1.5M SAR",
        area: "320 sqm",
        bedrooms: 5,
        bathrooms: 4,
        status: "COMING_SOON" as const,
        image:
          "https://images.pexels.com/photos/14769891/pexels-photo-14769891.jpeg",
        features: ["Private Garden", "Parking", "Smart Home", "Lake View"],
        x: 60,
        y: 35,
        createdBy: adminUser.id,
      },
      {
        name: "Nesaj Al Fursan",
        location: "Al Fursan",
        description: "Contemporary apartments with smart home technology",
        price: "980K SAR",
        area: "180 sqm",
        bedrooms: 3,
        bathrooms: 2,
        status: "SOLD" as const,
        image:
          "https://images.pexels.com/photos/10619954/pexels-photo-10619954.jpeg",
        features: ["Smart Home", "Gym", "Roof Garden", "24/7 Security"],
        x: 45,
        y: 55,
        createdBy: adminUser.id,
      },
      {
        name: "Ewan Sedra",
        location: "East Riyadh",
        description: "Premium luxury compound with exclusive amenities",
        price: "2.1M SAR",
        area: "450 sqm",
        bedrooms: 6,
        bathrooms: 5,
        status: "AVAILABLE" as const,
        image:
          "https://images.pexels.com/photos/14769891/pexels-photo-14769891.jpeg",
        features: ["Golf Course", "Spa", "Private Beach", "Concierge"],
        x: 70,
        y: 45,
        createdBy: adminUser.id,
      },
      {
        name: "Roya Sedra",
        location: "South Riyadh",
        description: "Family-oriented community with excellent schools nearby",
        price: "1.8M SAR",
        area: "300 sqm",
        bedrooms: 4,
        bathrooms: 3,
        status: "AVAILABLE" as const,
        image:
          "https://images.pexels.com/photos/10619954/pexels-photo-10619954.jpeg",
        features: ["School", "Playground", "Community Center", "Parks"],
        x: 25,
        y: 60,
        createdBy: adminUser.id,
      },
    ];

    for (const projectData of sampleProjects) {
      await prisma.project.upsert({
        where: {
          name: projectData.name,
        },
        update: {},
        create: projectData,
      });
    }

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
};
