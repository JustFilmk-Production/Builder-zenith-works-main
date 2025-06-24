import React from "react";
import { useProjectStore } from "../../store/projectStore";
import AdminLayout from "../../components/admin/AdminLayout";

const Dashboard: React.FC = () => {
  const { projects, analytics, users, isLoading } = useProjectStore();

  // Provide comprehensive fallback values when analytics is null/undefined
  const safeAnalytics = analytics || {
    totalProjects: 0,
    totalViews: 0,
    conversionRate: 0,
    popularProjects: [],
    recentActivity: [],
    uniqueVisitors: 0,
    avgTimeOnSite: 0,
    bounceRate: 0,
    trafficSources: {},
  };

  const safeUsers = users || [];
  const safeProjects = projects || [];

  // Ensure all analytics values are properly typed and have defaults
  const totalProjectsCount =
    Number(safeAnalytics.totalProjects) || safeProjects.length || 0;
  const totalViewsCount = Number(safeAnalytics.totalViews) || 0;
  const conversionRateValue = Number(safeAnalytics.conversionRate) || 0;
  const activeUsersCount = safeUsers.filter((u) => u?.isActive).length || 0;

  const stats = [
    {
      title: "Total Projects",
      value: totalProjectsCount.toString(),
      change: "+12%",
      icon: "🏢",
      gradient: "from-verse-accent-blue to-verse-accent-purple",
    },
    {
      title: "Total Views",
      value: totalViewsCount.toLocaleString(),
      change: "+24%",
      icon: "👁️",
      gradient: "from-verse-accent-green to-verse-accent-blue",
    },
    {
      title: "Conversion Rate",
      value: `${conversionRateValue.toFixed(1)}%`,
      change: "+3.2%",
      icon: "📈",
      gradient: "from-verse-accent-orange to-verse-accent-red",
    },
    {
      title: "Active Users",
      value: activeUsersCount.toString(),
      change: "+5%",
      icon: "👥",
      gradient: "from-verse-accent-purple to-verse-accent-blue",
    },
  ];

  const availableProjects = safeProjects.filter(
    (p) => p && p.status === "available",
  );
  const soldProjects = safeProjects.filter((p) => p && p.status === "sold");
  const comingSoonProjects = safeProjects.filter(
    (p) => p && p.status === "coming-soon",
  );

  // Show loading state while critical data loads
  if (isLoading && (!analytics || !projects || projects.length === 0)) {
    return (
      <AdminLayout>
        <div className="space-y-8">
          <div className="bg-verse-glass-bg backdrop-blur-verse border border-verse-glass-border rounded-verse-lg p-8">
            <div className="flex items-center justify-center space-x-4">
              <div className="w-8 h-8 border-4 border-verse-accent-blue/30 border-t-verse-accent-blue rounded-full animate-spin"></div>
              <div className="text-verse-text-primary font-verse-medium">
                Loading Dashboard...
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-verse-glass-bg backdrop-blur-verse border border-verse-glass-border rounded-verse-lg p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-verse-3xl font-verse-bold text-verse-text-primary mb-2">
                Welcome back, Admin! 👋
              </h1>
              <p className="text-verse-lg text-verse-text-secondary">
                Here's what's happening with your real estate platform today.
              </p>
            </div>
            <div className="text-6xl animate-float">🏘️</div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={stat.title}
              className="
                bg-verse-glass-bg backdrop-blur-verse
                border border-verse-glass-border
                rounded-verse-lg p-6
                hover:bg-verse-glass-hover
                transition-all duration-verse
                group cursor-pointer
                animate-scale-in
              "
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`
                  w-12 h-12 rounded-verse
                  bg-gradient-to-r ${stat.gradient}
                  flex items-center justify-center
                  text-xl
                  group-hover:scale-110 transition-transform duration-verse
                `}
                >
                  {stat.icon}
                </div>
                <span className="text-verse-accent-green text-verse-sm font-verse-medium">
                  {stat.change}
                </span>
              </div>
              <div>
                <div className="text-verse-2xl font-verse-bold text-verse-text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-verse-sm text-verse-text-secondary">
                  {stat.title}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Popular Projects */}
          <div className="bg-verse-glass-bg backdrop-blur-verse border border-verse-glass-border rounded-verse-lg p-6">
            <h3 className="text-verse-xl font-verse-semibold text-verse-text-primary mb-6">
              🔥 Popular Projects
            </h3>
            <div className="space-y-4">
              {safeAnalytics.popularProjects &&
              Array.isArray(safeAnalytics.popularProjects) &&
              safeAnalytics.popularProjects.length > 0 ? (
                safeAnalytics.popularProjects.map((project, index) => {
                  if (!project || typeof project !== "object") return null;

                  const projectData = safeProjects.find(
                    (p) => p && p.id === project.projectId,
                  );
                  if (!projectData) return null;

                  return (
                    <div
                      key={project.projectId || index}
                      className="flex items-center space-x-4 p-4 bg-verse-glass-hover rounded-verse"
                    >
                      <div
                        className={`
                      w-8 h-8 rounded-verse
                      ${
                        index === 0
                          ? "bg-gradient-to-r from-yellow-400 to-orange-500"
                          : index === 1
                            ? "bg-gradient-to-r from-gray-300 to-gray-500"
                            : "bg-gradient-to-r from-orange-400 to-red-500"
                      }
                      flex items-center justify-center
                      text-white font-verse-bold text-verse-sm
                    `}
                      >
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="text-verse-sm font-verse-medium text-verse-text-primary">
                          {projectData.name || "Unknown Project"}
                        </div>
                        <div className="text-verse-xs text-verse-text-secondary">
                          {projectData.location || "Unknown Location"}
                        </div>
                      </div>
                      <div className="text-verse-sm font-verse-medium text-verse-accent-blue">
                        {Number(project.views) || 0} views
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-verse-text-secondary">
                  <div className="text-4xl mb-2">📊</div>
                  <div className="text-verse-sm">
                    Loading popular projects...
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-verse-glass-bg backdrop-blur-verse border border-verse-glass-border rounded-verse-lg p-6">
            <h3 className="text-verse-xl font-verse-semibold text-verse-text-primary mb-6">
              📝 Recent Activity
            </h3>
            <div className="space-y-4">
              {safeAnalytics.recentActivity &&
              Array.isArray(safeAnalytics.recentActivity) &&
              safeAnalytics.recentActivity.length > 0 ? (
                safeAnalytics.recentActivity.map((activity, index) => {
                  if (!activity || typeof activity !== "object") return null;

                  return (
                    <div
                      key={activity.id || index}
                      className="flex items-start space-x-3 p-3 bg-verse-glass-hover rounded-verse"
                    >
                      <div className="w-2 h-2 bg-verse-accent-green rounded-full mt-2 animate-pulse"></div>
                      <div className="flex-1">
                        <div className="text-verse-sm text-verse-text-primary">
                          {activity.action || "Unknown Activity"}
                        </div>
                        <div className="text-verse-xs text-verse-text-secondary mt-1">
                          by{" "}
                          {activity.user?.name ||
                            activity.user ||
                            "Unknown User"}{" "}
                          •{" "}
                          {activity.timestamp || activity.createdAt
                            ? new Date(
                                activity.timestamp || activity.createdAt,
                              ).toLocaleTimeString()
                            : "Recently"}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-verse-text-secondary">
                  <div className="text-4xl mb-2">📝</div>
                  <div className="text-verse-sm">
                    Loading recent activity...
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Project Status Overview */}
        <div className="bg-verse-glass-bg backdrop-blur-verse border border-verse-glass-border rounded-verse-lg p-6">
          <h3 className="text-verse-xl font-verse-semibold text-verse-text-primary mb-6">
            📊 Project Status Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-verse-glass-hover rounded-verse">
              <div className="text-verse-2xl font-verse-bold text-verse-accent-green mb-2">
                {availableProjects.length}
              </div>
              <div className="text-verse-sm text-verse-text-secondary">
                Available Projects
              </div>
            </div>
            <div className="text-center p-4 bg-verse-glass-hover rounded-verse">
              <div className="text-verse-2xl font-verse-bold text-verse-accent-red mb-2">
                {soldProjects.length}
              </div>
              <div className="text-verse-sm text-verse-text-secondary">
                Sold Projects
              </div>
            </div>
            <div className="text-center p-4 bg-verse-glass-hover rounded-verse">
              <div className="text-verse-2xl font-verse-bold text-verse-accent-orange mb-2">
                {comingSoonProjects.length}
              </div>
              <div className="text-verse-sm text-verse-text-secondary">
                Coming Soon
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-verse-glass-bg backdrop-blur-verse border border-verse-glass-border rounded-verse-lg p-6">
          <h3 className="text-verse-xl font-verse-semibold text-verse-text-primary mb-6">
            ⚡ Quick Actions
          </h3>
          <div className="flex flex-wrap gap-4">
            {[
              { label: "Add New Project", icon: "➕", path: "/admin/projects" },
              { label: "View Analytics", icon: "📈", path: "/admin/analytics" },
              { label: "Manage Users", icon: "👥", path: "/admin/users" },
              { label: "Map Settings", icon: "🗺️", path: "/admin/map" },
            ].map((action) => (
              <button
                key={action.label}
                onClick={() => (window.location.href = action.path)}
                className="
                  flex items-center space-x-2
                  px-4 py-3
                  bg-gradient-to-r from-verse-accent-blue to-verse-accent-purple
                  text-white
                  rounded-verse
                  hover:shadow-verse-purple-glow hover:scale-105
                  transition-all duration-verse
                  text-verse-sm font-verse-medium
                "
              >
                <span>{action.icon}</span>
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
