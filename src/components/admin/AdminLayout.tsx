import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useProjectStore } from "../../store/projectStore";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { projects, users, analytics, recentActivity } = useProjectStore();

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Generate dynamic notifications
  useEffect(() => {
    const newNotifications = [
      {
        id: 1,
        type: "success",
        title: "New Project Added",
        message: "A new project has been successfully added to the system",
        time: new Date(Date.now() - 5 * 60 * 1000),
        icon: "🏢",
        read: false,
      },
      {
        id: 2,
        type: "warning",
        title: "Map Settings Updated",
        message: "Map background and markers have been updated",
        time: new Date(Date.now() - 15 * 60 * 1000),
        icon: "🗺️",
        read: false,
      },
      {
        id: 3,
        type: "info",
        title: "System Backup",
        message: "Automatic backup completed successfully",
        time: new Date(Date.now() - 30 * 60 * 1000),
        icon: "💾",
        read: true,
      },
    ];
    setNotifications(newNotifications);
  }, []);

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "📊",
      path: "/admin",
      gradient: "from-verse-accent-blue to-verse-accent-purple",
      description: "Overview & KPIs",
      badge: null,
    },
    {
      id: "projects",
      label: "Projects",
      icon: "🏢",
      path: "/admin/projects",
      gradient: "from-verse-accent-green to-verse-accent-blue",
      description: "Manage Properties",
      badge: projects?.length || 0,
    },
    {
      id: "map",
      label: "Map Settings",
      icon: "🗺️",
      path: "/admin/map",
      gradient: "from-verse-accent-orange to-verse-accent-red",
      description: "Configure Map",
      badge: null,
    },
    {
      id: "users",
      label: "Users",
      icon: "👥",
      path: "/admin/users",
      gradient: "from-verse-accent-purple to-verse-accent-blue",
      description: "User Management",
      badge: users?.filter((u) => u.isActive).length || 0,
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: "📈",
      path: "/admin/analytics",
      gradient: "from-verse-accent-red to-verse-accent-orange",
      description: "Performance Data",
      badge: analytics?.totalViews ? "new" : null,
    },
    {
      id: "design",
      label: "Design System",
      icon: "🎨",
      path: "/admin/design",
      gradient: "from-verse-accent-purple to-verse-accent-red",
      description: "UI Customization",
      badge: null,
    },
    {
      id: "settings",
      label: "Settings",
      icon: "⚙️",
      path: "/admin/settings",
      gradient: "from-verse-text-secondary to-verse-accent-blue",
      description: "System Config",
      badge: null,
    },
  ];

  const isActiveRoute = (path: string) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(path);
  };

  const unreadNotifications = notifications.filter((n) => !n.read).length;

  const quickActions = [
    {
      label: "Add Project",
      icon: "➕",
      action: () => navigate("/admin/projects"),
      color: "verse-accent-green",
    },
    {
      label: "View Analytics",
      icon: "📊",
      action: () => navigate("/admin/analytics"),
      color: "verse-accent-blue",
    },
    {
      label: "Export Data",
      icon: "📥",
      action: () => console.log("Export data"),
      color: "verse-accent-purple",
    },
  ];

  return (
    <div className="min-h-screen bg-verse-primary-bg font-verse flex">
      {/* Sidebar */}
      <div
        className={`
          ${isSidebarCollapsed ? "w-20" : "w-80"}
          bg-verse-glass-bg backdrop-blur-verse-lg
          border-r border-verse-glass-border
          transition-all duration-verse-slow
          flex-shrink-0
          relative
          flex flex-col
        `}
      >
        {/* Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-verse-glass-border">
          {!isSidebarCollapsed && (
            <div>
              <h1 className="text-verse-xl font-verse-bold text-verse-text-primary">
                VERSE
              </h1>
              <p className="text-verse-xs text-verse-text-secondary">
                Admin Control Center
              </p>
            </div>
          )}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="
              w-10 h-10
              bg-verse-glass-bg
              hover:bg-verse-glass-hover
              border border-verse-glass-border
              rounded-verse-sm
              flex items-center justify-center
              text-verse-text-primary
              transition-all duration-verse
              hover:scale-105
            "
          >
            {isSidebarCollapsed ? "→" : "←"}
          </button>
        </div>

        {/* Quick Stats */}
        {!isSidebarCollapsed && (
          <div className="px-4 py-4 border-b border-verse-glass-border">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-verse-glass-hover rounded-verse p-3 text-center">
                <div className="text-verse-lg font-verse-bold text-verse-accent-green">
                  {projects?.length || 0}
                </div>
                <div className="text-verse-xs text-verse-text-secondary">
                  Projects
                </div>
              </div>
              <div className="bg-verse-glass-hover rounded-verse p-3 text-center">
                <div className="text-verse-lg font-verse-bold text-verse-accent-blue">
                  {users?.filter((u) => u.isActive).length || 0}
                </div>
                <div className="text-verse-xs text-verse-text-secondary">
                  Active Users
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 mt-4 px-4 overflow-y-auto">
          <div className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`
                  w-full flex items-center justify-between
                  px-4 py-3 rounded-verse
                  text-left transition-all duration-verse
                  group relative overflow-hidden
                  ${
                    isActiveRoute(item.path)
                      ? "bg-gradient-to-r " +
                        item.gradient +
                        " text-white shadow-verse-glow"
                      : "text-verse-text-secondary hover:text-verse-text-primary hover:bg-verse-glass-hover"
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-verse-lg flex-shrink-0">
                    {item.icon}
                  </span>
                  {!isSidebarCollapsed && (
                    <div>
                      <div className="font-verse-medium">{item.label}</div>
                      <div
                        className={`text-verse-xs ${
                          isActiveRoute(item.path)
                            ? "text-white/70"
                            : "text-verse-text-secondary"
                        }`}
                      >
                        {item.description}
                      </div>
                    </div>
                  )}
                </div>

                {/* Badge/Counter */}
                {!isSidebarCollapsed && item.badge && (
                  <div
                    className={`
                    px-2 py-1 rounded-full text-verse-xs font-verse-medium
                    ${
                      isActiveRoute(item.path)
                        ? "bg-white/20 text-white"
                        : "bg-verse-accent-blue/20 text-verse-accent-blue"
                    }
                  `}
                  >
                    {item.badge}
                  </div>
                )}

                {/* Active indicator */}
                {isActiveRoute(item.path) && (
                  <div className="absolute right-2 w-2 h-2 bg-white rounded-full animate-pulse-glow"></div>
                )}
              </button>
            ))}
          </div>

          {/* Quick Actions */}
          {!isSidebarCollapsed && (
            <div className="mt-8 pt-4 border-t border-verse-glass-border">
              <h4 className="text-verse-xs font-verse-semibold text-verse-text-secondary mb-3 uppercase tracking-wide">
                Quick Actions
              </h4>
              <div className="space-y-2">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    className={`
                      w-full flex items-center space-x-3 p-3 rounded-verse
                      bg-${action.color}/10 hover:bg-${action.color}/20
                      border border-${action.color}/20
                      text-${action.color} transition-all duration-verse
                      hover:scale-105
                    `}
                  >
                    <span>{action.icon}</span>
                    <span className="text-verse-sm font-verse-medium">
                      {action.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </nav>

        {/* Bottom section */}
        {!isSidebarCollapsed && (
          <div className="p-4 border-t border-verse-glass-border">
            <div className="bg-verse-glass-bg border border-verse-glass-border rounded-verse p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="text-verse-xs text-verse-text-secondary">
                  System Status
                </div>
                <div className="text-verse-xs text-verse-text-secondary">
                  {currentTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-verse-accent-green rounded-full animate-pulse"></div>
                <span className="text-verse-xs text-verse-text-primary">
                  All systems operational
                </span>
              </div>
              <div className="mt-2 text-verse-xs text-verse-text-secondary">
                Last backup: {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Enhanced Top bar */}
        <div className="h-20 bg-verse-glass-bg backdrop-blur-verse border-b border-verse-glass-border flex items-center justify-between px-8">
          <div>
            <h2 className="text-verse-xl font-verse-semibold text-verse-text-primary">
              {menuItems.find((item) => isActiveRoute(item.path))?.label ||
                "Dashboard"}
            </h2>
            <p className="text-verse-sm text-verse-text-secondary">
              {menuItems.find((item) => isActiveRoute(item.path))
                ?.description || "Manage your real estate platform"}
            </p>
          </div>

          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="
                  w-64 px-4 py-2 pl-10
                  bg-verse-glass-bg
                  border border-verse-glass-border
                  rounded-verse
                  text-verse-text-primary
                  placeholder-verse-text-secondary
                  focus:outline-none focus:ring-2 focus:ring-verse-accent-blue/50
                "
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-verse-text-secondary">
                🔍
              </div>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="
                  relative w-10 h-10
                  bg-verse-glass-bg hover:bg-verse-glass-hover
                  border border-verse-glass-border
                  rounded-verse
                  flex items-center justify-center
                  text-verse-text-primary
                  transition-all duration-verse
                "
              >
                🔔
                {unreadNotifications > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-verse-accent-red rounded-full flex items-center justify-center text-white text-verse-xs font-verse-bold">
                    {unreadNotifications}
                  </div>
                )}
              </button>

              {/* Notifications dropdown */}
              {showNotifications && (
                <div className="absolute right-0 top-12 w-96 bg-verse-glass-bg backdrop-blur-verse border border-verse-glass-border rounded-verse shadow-verse-lg z-50">
                  <div className="p-4 border-b border-verse-glass-border">
                    <h3 className="text-verse-sm font-verse-semibold text-verse-text-primary">
                      Notifications ({unreadNotifications} new)
                    </h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-verse-glass-border hover:bg-verse-glass-hover transition-colors ${
                          !notification.read ? "bg-verse-accent-blue/5" : ""
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="text-verse-lg">
                            {notification.icon}
                          </div>
                          <div className="flex-1">
                            <div className="text-verse-sm font-verse-medium text-verse-text-primary">
                              {notification.title}
                            </div>
                            <div className="text-verse-xs text-verse-text-secondary mt-1">
                              {notification.message}
                            </div>
                            <div className="text-verse-xs text-verse-text-muted mt-1">
                              {notification.time.toLocaleTimeString()}
                            </div>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-verse-accent-blue rounded-full"></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4">
                    <button className="w-full text-center text-verse-sm text-verse-accent-blue hover:text-verse-accent-blue/80 transition-colors">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick actions */}
            <button
              onClick={() => navigate("/")}
              className="
                px-4 py-2
                bg-verse-glass-bg hover:bg-verse-glass-hover
                border border-verse-glass-border
                rounded-verse
                text-verse-text-primary text-verse-sm
                transition-all duration-verse
                hover:scale-105
              "
            >
              🌐 View Site
            </button>

            {/* Profile */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-verse-accent-blue to-verse-accent-purple rounded-full flex items-center justify-center text-white font-verse-semibold">
                A
              </div>
              <div>
                <div className="text-verse-sm font-verse-medium text-verse-text-primary">
                  Admin User
                </div>
                <div className="text-verse-xs text-verse-text-secondary">
                  Super Administrator
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content area with scroll */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">{children}</div>
        </div>
      </div>

      {/* Click outside to close notifications */}
      {showNotifications && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowNotifications(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
