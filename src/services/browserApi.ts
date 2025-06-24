// Browser-compatible API service that works without Prisma
// Uses HTTP requests for production and fallback data for development

import {
  defaultProjects,
  defaultMapSettings,
  defaultUsers,
  defaultAnalytics,
} from "../store/fallbackStore";

interface Project {
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
  creator?: any;
  views?: any[];
  viewCount?: number;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "manager" | "viewer";
  isActive: boolean;
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface MapSettings {
  id: number;
  backgroundImage: string;
  theme: string;
  defaultZoom: number;
  centerLat: number;
  centerLng: number;
  brightness: number;
  contrast: number;
  saturation: number;
  showLabels: boolean;
  enableAnimation: boolean;
  clusterMarkers: boolean;
  lazyLoading: boolean;
  imageCompression: boolean;
  preloadAssets: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface Activity {
  id: number;
  action: string;
  description?: string;
  userId?: number;
  projectId?: number;
  metadata?: any;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  user?: User;
  project?: Project;
}

interface Analytics {
  id: number;
  date: Date;
  totalViews: number;
  uniqueVisitors: number;
  conversionRate: number;
  avgTimeOnSite: number;
  bounceRate: number;
  popularProjects: any;
  trafficSources: any;
  createdAt: Date;
  updatedAt: Date;
}

interface SystemSettings {
  id: number;
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  phoneNumber: string;
  address: string;
  enableNotifications: boolean;
  enableAnalytics: boolean;
  enableCaching: boolean;
  maintenanceMode: boolean;
  allowGuestViewing: boolean;
  requireApproval: boolean;
  autoBackup: boolean;
  maxProjectsPerPage: number;
  backupFrequency: string;
  language: string;
  timezone: string;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

// In-memory storage for browser compatibility
class BrowserStorage {
  private static projects: Project[] = [];
  private static users: User[] = [];
  private static mapSettings: MapSettings | null = null;
  private static systemSettings: SystemSettings | null = null;
  private static activities: Activity[] = [];
  private static analytics: Analytics | null = null;
  private static initialized = false;

  static initialize() {
    if (this.initialized) return;

    // Initialize with fallback data
    this.projects = defaultProjects.map((p) => ({
      ...p,
      createdAt: new Date(p.createdAt),
      updatedAt: new Date(p.updatedAt),
      viewCount: Math.floor(Math.random() * 100),
    }));

    this.users = defaultUsers.map((u) => ({
      ...u,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    this.mapSettings = {
      id: 1,
      backgroundImage: defaultMapSettings.backgroundImage,
      theme: defaultMapSettings.theme,
      defaultZoom: defaultMapSettings.defaultZoom,
      centerLat: defaultMapSettings.centerLat,
      centerLng: defaultMapSettings.centerLng,
      brightness: 0.9,
      contrast: 1.1,
      saturation: 1.0,
      showLabels: true,
      enableAnimation: true,
      clusterMarkers: false,
      lazyLoading: true,
      imageCompression: true,
      preloadAssets: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.systemSettings = {
      id: 1,
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
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.analytics = {
      id: 1,
      date: new Date(),
      totalViews: defaultAnalytics.totalViews,
      uniqueVisitors: 856,
      conversionRate: defaultAnalytics.conversionRate,
      avgTimeOnSite: 245,
      bounceRate: 24.8,
      popularProjects: defaultAnalytics.popularProjects,
      trafficSources: {
        direct: 45,
        search: 32,
        social: 15,
        referral: 8,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.activities = defaultAnalytics.recentActivity.map(
      (activity, index) => ({
        id: index + 1,
        action: activity.action,
        description: `Activity: ${activity.action}`,
        userId: 1,
        projectId: Math.floor(Math.random() * 5) + 1,
        metadata: {},
        ipAddress: "192.168.1.1",
        userAgent: "Browser",
        createdAt: new Date(activity.timestamp),
        user: this.users[0],
        project:
          this.projects[Math.floor(Math.random() * this.projects.length)],
      }),
    );

    this.initialized = true;
    console.log("✅ Browser storage initialized with fallback data");
  }

  static getProjects(): Project[] {
    this.initialize();
    return [...this.projects];
  }

  static getProjectById(id: number): Project | null {
    this.initialize();
    return this.projects.find((p) => p.id === id) || null;
  }

  static addProject(
    projectData: Omit<Project, "id" | "createdAt" | "updatedAt">,
  ): Project {
    this.initialize();
    const newProject: Project = {
      ...projectData,
      id: Math.max(...this.projects.map((p) => p.id), 0) + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      viewCount: 0,
    };
    this.projects.push(newProject);
    this.logActivity(`Project created: ${newProject.name}`, 1, newProject.id);
    return newProject;
  }

  static updateProject(id: number, updates: Partial<Project>): Project | null {
    this.initialize();
    const index = this.projects.findIndex((p) => p.id === id);
    if (index === -1) return null;

    this.projects[index] = {
      ...this.projects[index],
      ...updates,
      updatedAt: new Date(),
    };
    this.logActivity(`Project updated: ${this.projects[index].name}`, 1, id);
    return this.projects[index];
  }

  static deleteProject(id: number): boolean {
    this.initialize();
    const project = this.projects.find((p) => p.id === id);
    if (!project) return false;

    this.projects = this.projects.filter((p) => p.id !== id);
    this.logActivity(`Project deleted: ${project.name}`, 1);
    return true;
  }

  static getUsers(): User[] {
    this.initialize();
    return [...this.users];
  }

  static addUser(userData: Omit<User, "id" | "createdAt" | "updatedAt">): User {
    this.initialize();
    const newUser: User = {
      ...userData,
      id: Math.max(...this.users.map((u) => u.id), 0) + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.push(newUser);
    this.logActivity(`User created: ${newUser.name}`, 1);
    return newUser;
  }

  static updateUser(id: number, updates: Partial<User>): User | null {
    this.initialize();
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) return null;

    this.users[index] = {
      ...this.users[index],
      ...updates,
      updatedAt: new Date(),
    };
    this.logActivity(`User updated: ${this.users[index].name}`, 1);
    return this.users[index];
  }

  static deleteUser(id: number): boolean {
    this.initialize();
    const user = this.users.find((u) => u.id === id);
    if (!user) return false;

    this.users = this.users.filter((u) => u.id !== id);
    this.logActivity(`User deleted: ${user.name}`, 1);
    return true;
  }

  static getMapSettings(): MapSettings | null {
    this.initialize();
    return this.mapSettings;
  }

  static updateMapSettings(updates: Partial<MapSettings>): MapSettings {
    this.initialize();
    if (!this.mapSettings) {
      this.mapSettings = {
        id: 1,
        backgroundImage: defaultMapSettings.backgroundImage,
        theme: defaultMapSettings.theme,
        defaultZoom: defaultMapSettings.defaultZoom,
        centerLat: defaultMapSettings.centerLat,
        centerLng: defaultMapSettings.centerLng,
        brightness: 0.9,
        contrast: 1.1,
        saturation: 1.0,
        showLabels: true,
        enableAnimation: true,
        clusterMarkers: false,
        lazyLoading: true,
        imageCompression: true,
        preloadAssets: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    this.mapSettings = {
      ...this.mapSettings,
      ...updates,
      updatedAt: new Date(),
    };
    this.logActivity("Map settings updated", 1);
    return this.mapSettings;
  }

  static getSystemSettings(): SystemSettings | null {
    this.initialize();
    return this.systemSettings;
  }

  static updateSystemSettings(
    updates: Partial<SystemSettings>,
  ): SystemSettings {
    this.initialize();
    if (!this.systemSettings) {
      this.systemSettings = {
        id: 1,
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
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    this.systemSettings = {
      ...this.systemSettings,
      ...updates,
      updatedAt: new Date(),
    };
    this.logActivity("System settings updated", 1);
    return this.systemSettings;
  }

  static getAnalytics(): Analytics | null {
    this.initialize();
    return this.analytics;
  }

  static incrementViews(): void {
    this.initialize();
    if (this.analytics) {
      this.analytics.totalViews += 1;
      this.analytics.updatedAt = new Date();
    }
  }

  static getActivities(limit: number = 10): Activity[] {
    this.initialize();
    return this.activities.slice(0, limit);
  }

  static logActivity(action: string, userId: number, projectId?: number): void {
    this.initialize();
    const activity: Activity = {
      id: this.activities.length + 1,
      action,
      description: `Activity: ${action}`,
      userId,
      projectId,
      metadata: {},
      ipAddress: "192.168.1.1",
      userAgent: navigator.userAgent,
      createdAt: new Date(),
      user: this.users.find((u) => u.id === userId),
      project: projectId
        ? this.projects.find((p) => p.id === projectId)
        : undefined,
    };
    this.activities.unshift(activity);
    if (this.activities.length > 50) {
      this.activities = this.activities.slice(0, 50);
    }
  }

  static trackProjectView(projectId: number): void {
    this.initialize();
    const project = this.projects.find((p) => p.id === projectId);
    if (project) {
      project.viewCount = (project.viewCount || 0) + 1;
    }
    this.incrementViews();
  }
}

// Browser-compatible API service
export const browserApi = {
  // Projects API
  projects: {
    async getAll(): Promise<Project[]> {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 100));
      return BrowserStorage.getProjects();
    },

    async getById(id: number): Promise<Project | null> {
      await new Promise((resolve) => setTimeout(resolve, 50));
      return BrowserStorage.getProjectById(id);
    },

    async create(
      data: Omit<Project, "id" | "createdAt" | "updatedAt">,
    ): Promise<Project> {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return BrowserStorage.addProject(data);
    },

    async update(id: number, data: Partial<Project>): Promise<Project | null> {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return BrowserStorage.updateProject(id, data);
    },

    async delete(id: number): Promise<void> {
      await new Promise((resolve) => setTimeout(resolve, 200));
      BrowserStorage.deleteProject(id);
    },

    async trackView(projectId: number): Promise<void> {
      BrowserStorage.trackProjectView(projectId);
    },

    async getViewsCount(projectId: number): Promise<number> {
      const project = BrowserStorage.getProjectById(projectId);
      return project?.viewCount || 0;
    },
  },

  // Users API
  users: {
    async getAll(): Promise<User[]> {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return BrowserStorage.getUsers();
    },

    async create(
      data: Omit<User, "id" | "createdAt" | "updatedAt">,
    ): Promise<User> {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return BrowserStorage.addUser(data);
    },

    async update(id: number, data: Partial<User>): Promise<User | null> {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return BrowserStorage.updateUser(id, data);
    },

    async delete(id: number): Promise<void> {
      await new Promise((resolve) => setTimeout(resolve, 200));
      BrowserStorage.deleteUser(id);
    },
  },

  // Map Settings API
  mapSettings: {
    async getCurrent(): Promise<MapSettings | null> {
      await new Promise((resolve) => setTimeout(resolve, 50));
      return BrowserStorage.getMapSettings();
    },

    async upsert(data: Partial<MapSettings>): Promise<MapSettings> {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return BrowserStorage.updateMapSettings(data);
    },
  },

  // System Settings API
  systemSettings: {
    async getCurrent(): Promise<SystemSettings | null> {
      await new Promise((resolve) => setTimeout(resolve, 50));
      return BrowserStorage.getSystemSettings();
    },

    async upsert(data: Partial<SystemSettings>): Promise<SystemSettings> {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return BrowserStorage.updateSystemSettings(data);
    },
  },

  // Analytics API
  analytics: {
    async getLatest(): Promise<Analytics | null> {
      await new Promise((resolve) => setTimeout(resolve, 50));
      return BrowserStorage.getAnalytics();
    },

    async incrementViews(): Promise<void> {
      BrowserStorage.incrementViews();
    },

    async getPopularProjects(): Promise<
      { projectId: number; views: number; project: Project }[]
    > {
      const projects = BrowserStorage.getProjects();
      return projects
        .map((project) => ({
          projectId: project.id,
          views: project.viewCount || 0,
          project,
        }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 5);
    },
  },

  // Activity API
  activity: {
    async log(data: {
      action: string;
      description?: string;
      userId?: number;
      projectId?: number;
      metadata?: any;
    }): Promise<void> {
      BrowserStorage.logActivity(data.action, data.userId || 1, data.projectId);
    },

    async getRecent(limit: number = 10): Promise<Activity[]> {
      await new Promise((resolve) => setTimeout(resolve, 50));
      return BrowserStorage.getActivities(limit);
    },
  },
};
