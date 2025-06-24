import { create } from "zustand";
import { browserApi } from "../services/browserApi";
import {
  defaultProjects,
  defaultMapSettings,
  defaultUsers,
  defaultAnalytics,
} from "./fallbackStore";

// Define types that work in browser environment
export interface Project {
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
  creator?: User;
  viewCount?: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "manager" | "viewer";
  isActive: boolean;
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface MapSettings {
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

export interface Activity {
  id: number;
  action: string;
  description?: string;
  userId?: number;
  projectId?: number;
  metadata?: any;
  createdAt: Date;
  user?: User;
  project?: Project;
}

export interface Analytics {
  id: number;
  totalProjects: number;
  totalViews: number;
  uniqueVisitors: number;
  conversionRate: number;
  avgTimeOnSite: number;
  bounceRate: number;
  popularProjects: any;
  trafficSources: any;
  recentActivity?: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface SystemSettings {
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

interface ProjectStore {
  // Data
  projects: Project[];
  mapSettings: MapSettings | null;
  systemSettings: SystemSettings | null;
  users: User[];
  analytics: Analytics | null;
  recentActivity: Activity[];

  // UI State
  isLoading: boolean;
  selectedProject: number | null;
  error: string | null;

  // Project Actions
  fetchProjects: () => Promise<void>;
  addProject: (
    project: Omit<Project, "id" | "createdAt" | "updatedAt">,
  ) => Promise<void>;
  updateProject: (id: number, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: number) => Promise<void>;
  setSelectedProject: (id: number | null) => void;
  incrementProjectViews: (projectId: number) => Promise<void>;

  // Map Settings Actions
  fetchMapSettings: () => Promise<void>;
  updateMapSettings: (settings: Partial<MapSettings>) => Promise<void>;

  // System Settings Actions
  fetchSystemSettings: () => Promise<void>;
  updateSystemSettings: (settings: Partial<SystemSettings>) => Promise<void>;

  // User Actions
  fetchUsers: () => Promise<void>;
  addUser: (
    user: Omit<User, "id" | "createdAt" | "updatedAt">,
  ) => Promise<void>;
  updateUser: (id: number, updates: Partial<User>) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;

  // Activity Actions
  logActivity: (
    action: string,
    description?: string,
    metadata?: any,
  ) => Promise<void>;
  fetchRecentActivity: () => Promise<void>;

  // Analytics Actions
  fetchAnalytics: () => Promise<void>;
  incrementViews: () => Promise<void>;

  // Utility Actions
  initialize: () => Promise<void>;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  // Initial state
  projects: [],
  mapSettings: null,
  systemSettings: null,
  users: [],
  analytics: null,
  recentActivity: [],
  isLoading: false,
  selectedProject: null,
  error: null,

  // Project Actions
  fetchProjects: async () => {
    try {
      set({ isLoading: true, error: null });
      const projects = await browserApi.projects.getAll();

      // Get view counts for each project
      const projectsWithViews = await Promise.all(
        projects.map(async (project) => {
          try {
            const viewCount = await browserApi.projects.getViewsCount(
              project.id,
            );
            return { ...project, viewCount };
          } catch (error) {
            console.warn("Error fetching view count for project:", project.id);
            return { ...project, viewCount: 0 };
          }
        }),
      );

      set({ projects: projectsWithViews, isLoading: false });
    } catch (error) {
      console.error("Error fetching projects:", error);
      console.log("Using fallback projects data");

      // Use fallback data when API is not available
      const fallbackProjects = defaultProjects.map((project) => ({
        ...project,
        viewCount: Math.floor(Math.random() * 100),
      }));

      set({
        projects: fallbackProjects,
        isLoading: false,
        error: null, // Don't show error when using fallback
      });
    }
  },

  addProject: async (projectData) => {
    try {
      set({ isLoading: true, error: null });
      const newProject = await browserApi.projects.create(projectData);

      // Log activity
      await browserApi.activity.log({
        action: `Project created: ${newProject.name}`,
        projectId: newProject.id,
        userId: 1, // TODO: Get from auth context
      });

      // Refresh projects
      await get().fetchProjects();
      set({ isLoading: false });
    } catch (error) {
      console.error("Error adding project:", error);
      set({ error: "Failed to add project", isLoading: false });
    }
  },

  updateProject: async (id, updates) => {
    try {
      set({ isLoading: true, error: null });
      const updatedProject = await browserApi.projects.update(id, updates);

      if (updatedProject) {
        // Log activity
        await browserApi.activity.log({
          action: `Project updated: ${updatedProject.name}`,
          projectId: id,
          userId: 1, // TODO: Get from auth context
          metadata: updates,
        });

        // Update local state
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === id ? { ...project, ...updatedProject } : project,
          ),
          isLoading: false,
        }));
      }
    } catch (error) {
      console.error("Error updating project:", error);
      set({ error: "Failed to update project", isLoading: false });
    }
  },

  deleteProject: async (id) => {
    try {
      set({ isLoading: true, error: null });
      const project = get().projects.find((p) => p.id === id);

      await browserApi.projects.delete(id);

      // Log activity
      await browserApi.activity.log({
        action: `Project deleted: ${project?.name}`,
        userId: 1, // TODO: Get from auth context
        metadata: { deletedProject: project },
      });

      // Update local state
      set((state) => ({
        projects: state.projects.filter((project) => project.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error deleting project:", error);
      set({ error: "Failed to delete project", isLoading: false });
    }
  },

  setSelectedProject: (id) => {
    set({ selectedProject: id });
  },

  incrementProjectViews: async (projectId) => {
    try {
      await browserApi.projects.trackView(projectId);
      await browserApi.analytics.incrementViews();

      // Update view count in local state
      set((state) => ({
        projects: state.projects.map((project) =>
          project.id === projectId
            ? { ...project, viewCount: (project.viewCount || 0) + 1 }
            : project,
        ),
      }));
    } catch (error) {
      console.error("Error tracking project view:", error);
    }
  },

  // Map Settings Actions
  fetchMapSettings: async () => {
    try {
      const settings = await browserApi.mapSettings.getCurrent();
      set({ mapSettings: settings });
    } catch (error) {
      console.error("Error fetching map settings:", error);
      console.log("Using fallback map settings");

      // Use fallback map settings when API is not available
      const fallbackSettings = {
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

      set({ mapSettings: fallbackSettings });
    }
  },

  updateMapSettings: async (settings) => {
    try {
      set({ isLoading: true, error: null });
      const updatedSettings = await browserApi.mapSettings.upsert(settings);

      // Log activity
      await browserApi.activity.log({
        action: "Map settings updated",
        userId: 1, // TODO: Get from auth context
        metadata: settings,
      });

      set({ mapSettings: updatedSettings, isLoading: false });
    } catch (error) {
      console.error("Error updating map settings:", error);
      set({ error: "Failed to update map settings", isLoading: false });
    }
  },

  // System Settings Actions
  fetchSystemSettings: async () => {
    try {
      const settings = await browserApi.systemSettings.getCurrent();
      set({ systemSettings: settings });
    } catch (error) {
      console.error("Error fetching system settings:", error);
      console.log("Using fallback system settings");

      // Use fallback system settings
      const fallbackSettings = {
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

      set({ systemSettings: fallbackSettings });
    }
  },

  updateSystemSettings: async (settings) => {
    try {
      set({ isLoading: true, error: null });
      const updatedSettings = await browserApi.systemSettings.upsert(settings);

      // Log activity
      await browserApi.activity.log({
        action: "System settings updated",
        userId: 1, // TODO: Get from auth context
        metadata: settings,
      });

      set({ systemSettings: updatedSettings, isLoading: false });
    } catch (error) {
      console.error("Error updating system settings:", error);
      set({ error: "Failed to update system settings", isLoading: false });
    }
  },

  // User Actions
  fetchUsers: async () => {
    try {
      const users = await browserApi.users.getAll();
      set({ users });
    } catch (error) {
      console.error("Error fetching users:", error);
      console.log("Using fallback users");

      // Use fallback users
      const fallbackUsers = defaultUsers.map((u) => ({
        ...u,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      set({ users: fallbackUsers });
    }
  },

  addUser: async (userData) => {
    try {
      set({ isLoading: true, error: null });
      const newUser = await browserApi.users.create(userData);

      // Log activity
      await browserApi.activity.log({
        action: `User created: ${newUser.name}`,
        userId: 1, // TODO: Get from auth context
        metadata: { newUserId: newUser.id },
      });

      set((state) => ({
        users: [...state.users, newUser],
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error adding user:", error);
      set({ error: "Failed to add user", isLoading: false });
    }
  },

  updateUser: async (id, updates) => {
    try {
      set({ isLoading: true, error: null });
      const updatedUser = await browserApi.users.update(id, updates);

      if (updatedUser) {
        // Log activity
        await browserApi.activity.log({
          action: `User updated: ${updatedUser.name}`,
          userId: 1, // TODO: Get from auth context
          metadata: updates,
        });

        set((state) => ({
          users: state.users.map((user) =>
            user.id === id ? updatedUser : user,
          ),
          isLoading: false,
        }));
      }
    } catch (error) {
      console.error("Error updating user:", error);
      set({ error: "Failed to update user", isLoading: false });
    }
  },

  deleteUser: async (id) => {
    try {
      set({ isLoading: true, error: null });
      const user = get().users.find((u) => u.id === id);

      await browserApi.users.delete(id);

      // Log activity
      await browserApi.activity.log({
        action: `User deleted: ${user?.name}`,
        userId: 1, // TODO: Get from auth context
        metadata: { deletedUser: user },
      });

      set((state) => ({
        users: state.users.filter((user) => user.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error deleting user:", error);
      set({ error: "Failed to delete user", isLoading: false });
    }
  },

  // Activity Actions
  logActivity: async (action, description, metadata) => {
    try {
      await browserApi.activity.log({
        action,
        description,
        userId: 1, // TODO: Get from auth context
        metadata,
      });

      // Refresh recent activity
      await get().fetchRecentActivity();
    } catch (error) {
      console.error("Error logging activity:", error);
    }
  },

  fetchRecentActivity: async () => {
    try {
      const activities = await browserApi.activity.getRecent(10);
      set({ recentActivity: activities });
    } catch (error) {
      console.error("Error fetching recent activity:", error);
      console.log("Using fallback activity");

      // Use fallback activity
      const fallbackActivity = defaultAnalytics.recentActivity.map(
        (activity, index) => ({
          id: index + 1,
          action: activity.action,
          description: `Activity: ${activity.action}`,
          userId: 1,
          projectId: Math.floor(Math.random() * 5) + 1,
          createdAt: new Date(activity.timestamp),
          user: defaultUsers[0],
        }),
      );

      set({ recentActivity: fallbackActivity });
    }
  },

  // Analytics Actions
  fetchAnalytics: async () => {
    try {
      const analytics = await browserApi.analytics.getLatest();
      set({ analytics });
    } catch (error) {
      console.error("Error fetching analytics:", error);
      console.log("Using fallback analytics");

      // Use fallback analytics - ensure all fields are present
      const fallbackAnalytics = {
        id: 1,
        totalProjects: defaultAnalytics.totalProjects,
        totalViews: defaultAnalytics.totalViews,
        uniqueVisitors: defaultAnalytics.uniqueVisitors,
        conversionRate: defaultAnalytics.conversionRate,
        avgTimeOnSite: defaultAnalytics.avgTimeOnSite,
        bounceRate: defaultAnalytics.bounceRate,
        popularProjects: defaultAnalytics.popularProjects,
        trafficSources: defaultAnalytics.trafficSources,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      set({ analytics: fallbackAnalytics });
    }
  },

  incrementViews: async () => {
    try {
      await browserApi.analytics.incrementViews();
      await get().fetchAnalytics();
    } catch (error) {
      console.error("Error incrementing views:", error);
    }
  },

  // Initialize all data
  initialize: async () => {
    set({ isLoading: true, error: null });

    try {
      // Load critical data first
      await get().fetchProjects();
      await get().fetchMapSettings();

      // Load remaining data (non-blocking if they fail)
      try {
        await Promise.allSettled([
          get().fetchSystemSettings(),
          get().fetchUsers(),
          get().fetchAnalytics(),
          get().fetchRecentActivity(),
        ]);
      } catch (error) {
        console.warn("Some non-critical data failed to load:", error);
      }

      set({ isLoading: false });
      console.log(
        "✅ App initialized successfully with browser-compatible API",
      );
    } catch (error) {
      console.error("Error initializing app:", error);

      // Even if API fails, we should still show the app with fallback data
      set({
        isLoading: false,
        error: null, // Don't show error when fallback works
      });
    }
  },

  // Utility Actions
  setError: (error) => set({ error }),
  setLoading: (loading) => set({ isLoading: loading }),
}));
