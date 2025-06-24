import React, { useState } from "react";
import { useProjectStore } from "../../store/projectStore";
import AdminLayout from "../../components/admin/AdminLayout";

const Analytics: React.FC = () => {
  const { analytics, projects } = useProjectStore();
  const [timeRange, setTimeRange] = useState("30d");

  // Provide safe fallbacks for analytics data
  const safeAnalytics = analytics || {
    conversionRate: 0,
    totalViews: 0,
    popularProjects: [],
    recentActivity: [],
  };
  const safeProjects = projects || [];

  const timeRanges = [
    { value: "7d", label: "Last 7 days" },
    { value: "30d", label: "Last 30 days" },
    { value: "90d", label: "Last 3 months" },
    { value: "1y", label: "Last year" },
  ];

  // Mock chart data - in real app this would come from API
  const chartData = {
    views: [
      { date: "Jan", views: 120 },
      { date: "Feb", views: 180 },
      { date: "Mar", views: 250 },
      { date: "Apr", views: 290 },
      { date: "May", views: 340 },
      { date: "Jun", views: 380 },
    ],
    conversions: [
      { month: "Jan", leads: 45, sales: 12 },
      { month: "Feb", leads: 67, sales: 18 },
      { month: "Mar", leads: 89, sales: 24 },
      { month: "Apr", leads: 95, sales: 28 },
      { month: "May", leads: 112, sales: 35 },
      { month: "Jun", leads: 134, sales: 42 },
    ],
  };

  const kpis = [
    {
      title: "Total Revenue",
      value: "125.6M SAR",
      change: "+18.5%",
      trend: "up",
      icon: "💰",
      gradient: "from-verse-accent-green to-verse-accent-blue",
    },
    {
      title: "Conversion Rate",
      value: `${safeAnalytics.conversionRate || 0}%`,
      change: "+2.3%",
      trend: "up",
      icon: "📈",
      gradient: "from-verse-accent-blue to-verse-accent-purple",
    },
    {
      title: "Avg. Time on Site",
      value: "4m 32s",
      change: "+12%",
      trend: "up",
      icon: "⏱️",
      gradient: "from-verse-accent-orange to-verse-accent-red",
    },
    {
      title: "Bounce Rate",
      value: "24.8%",
      change: "-5.2%",
      trend: "down",
      icon: "📉",
      gradient: "from-verse-accent-purple to-verse-accent-blue",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-verse-3xl font-verse-bold text-verse-text-primary">
              📈 Analytics Dashboard
            </h1>
            <p className="text-verse-lg text-verse-text-secondary mt-2">
              Track performance and user engagement
            </p>
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="
              px-4 py-2
              bg-verse-glass-bg
              border border-verse-glass-border
              rounded-verse
              text-verse-text-primary
              focus:outline-none focus:ring-2 focus:ring-verse-accent-blue/50
            "
          >
            {timeRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi, index) => (
            <div
              key={kpi.title}
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
                  bg-gradient-to-r ${kpi.gradient}
                  flex items-center justify-center
                  text-xl
                  group-hover:scale-110 transition-transform duration-verse
                `}
                >
                  {kpi.icon}
                </div>
                <span
                  className={`
                  text-verse-sm font-verse-medium
                  ${
                    kpi.trend === "up"
                      ? "text-verse-accent-green"
                      : "text-verse-accent-red"
                  }
                `}
                >
                  {kpi.change}
                </span>
              </div>
              <div>
                <div className="text-verse-2xl font-verse-bold text-verse-text-primary mb-1">
                  {kpi.value}
                </div>
                <div className="text-verse-sm text-verse-text-secondary">
                  {kpi.title}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Views Chart */}
          <div className="bg-verse-glass-bg backdrop-blur-verse border border-verse-glass-border rounded-verse-lg p-6">
            <h3 className="text-verse-xl font-verse-semibold text-verse-text-primary mb-6">
              📊 Page Views Trend
            </h3>
            <div className="h-64 flex items-end justify-between space-x-2">
              {chartData.views.map((data, index) => (
                <div
                  key={data.date}
                  className="flex-1 flex flex-col items-center"
                >
                  <div
                    className="w-full bg-gradient-to-t from-verse-accent-blue to-verse-accent-purple rounded-t-verse hover:opacity-80 transition-opacity duration-verse"
                    style={{ height: `${(data.views / 400) * 100}%` }}
                  ></div>
                  <div className="text-verse-xs text-verse-text-secondary mt-2">
                    {data.date}
                  </div>
                  <div className="text-verse-xs font-verse-medium text-verse-text-primary">
                    {data.views}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Conversions Chart */}
          <div className="bg-verse-glass-bg backdrop-blur-verse border border-verse-glass-border rounded-verse-lg p-6">
            <h3 className="text-verse-xl font-verse-semibold text-verse-text-primary mb-6">
              🎯 Leads vs Sales
            </h3>
            <div className="h-64 flex items-end justify-between space-x-2">
              {chartData.conversions.map((data, index) => (
                <div
                  key={data.month}
                  className="flex-1 flex flex-col items-center space-y-1"
                >
                  <div className="w-full flex space-x-1">
                    <div
                      className="flex-1 bg-gradient-to-t from-verse-accent-green to-verse-accent-blue rounded-t-verse"
                      style={{ height: `${(data.leads / 150) * 200}px` }}
                    ></div>
                    <div
                      className="flex-1 bg-gradient-to-t from-verse-accent-orange to-verse-accent-red rounded-t-verse"
                      style={{ height: `${(data.sales / 50) * 200}px` }}
                    ></div>
                  </div>
                  <div className="text-verse-xs text-verse-text-secondary">
                    {data.month}
                  </div>
                  <div className="text-verse-xs text-verse-text-primary">
                    {data.leads}L/{data.sales}S
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center space-x-6 mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gradient-to-r from-verse-accent-green to-verse-accent-blue rounded"></div>
                <span className="text-verse-xs text-verse-text-secondary">
                  Leads
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gradient-to-r from-verse-accent-orange to-verse-accent-red rounded"></div>
                <span className="text-verse-xs text-verse-text-secondary">
                  Sales
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Projects & Traffic Sources */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Performing Projects */}
          <div className="bg-verse-glass-bg backdrop-blur-verse border border-verse-glass-border rounded-verse-lg p-6">
            <h3 className="text-verse-xl font-verse-semibold text-verse-text-primary mb-6">
              🏆 Top Performing Projects
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

                  const totalViews = safeAnalytics.totalViews || 1;
                  const projectViews = Number(project.views) || 0;
                  const percentage = (projectViews / totalViews) * 100;

                  return (
                    <div key={project.projectId || index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`
                            w-8 h-8 rounded-verse flex items-center justify-center text-white text-verse-xs font-verse-bold
                            ${
                              index === 0
                                ? "bg-gradient-to-r from-yellow-400 to-orange-500"
                                : index === 1
                                  ? "bg-gradient-to-r from-gray-300 to-gray-500"
                                  : "bg-gradient-to-r from-orange-400 to-red-500"
                            }
                          `}
                          >
                            {index + 1}
                          </div>
                          <div>
                            <div className="text-verse-sm font-verse-medium text-verse-text-primary">
                              {projectData.name || "Unknown Project"}
                            </div>
                            <div className="text-verse-xs text-verse-text-secondary">
                              {projectData.location || "Unknown Location"}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-verse-sm font-verse-medium text-verse-text-primary">
                            {projectViews}
                          </div>
                          <div className="text-verse-xs text-verse-text-secondary">
                            {percentage.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                      <div className="w-full bg-verse-glass-hover rounded-full h-2">
                        <div
                          className="h-2 bg-gradient-to-r from-verse-accent-blue to-verse-accent-purple rounded-full transition-all duration-verse"
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-verse-text-secondary">
                  <div className="text-4xl mb-2">📊</div>
                  <div className="text-verse-sm">
                    No popular projects data available
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Traffic Sources */}
          <div className="bg-verse-glass-bg backdrop-blur-verse border border-verse-glass-border rounded-verse-lg p-6">
            <h3 className="text-verse-xl font-verse-semibold text-verse-text-primary mb-6">
              🌐 Traffic Sources
            </h3>
            <div className="space-y-4">
              {[
                {
                  source: "Direct",
                  visits: 45,
                  icon: "🔗",
                  color: "verse-accent-green",
                },
                {
                  source: "Google Search",
                  visits: 32,
                  icon: "🔍",
                  color: "verse-accent-blue",
                },
                {
                  source: "Social Media",
                  visits: 15,
                  icon: "📱",
                  color: "verse-accent-purple",
                },
                {
                  source: "Referrals",
                  visits: 8,
                  icon: "🤝",
                  color: "verse-accent-orange",
                },
              ].map((source) => (
                <div
                  key={source.source}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-verse-lg">{source.icon}</div>
                    <div>
                      <div className="text-verse-sm font-verse-medium text-verse-text-primary">
                        {source.source}
                      </div>
                      <div className="text-verse-xs text-verse-text-secondary">
                        {source.visits}% of traffic
                      </div>
                    </div>
                  </div>
                  <div className="w-20 bg-verse-glass-hover rounded-full h-2">
                    <div
                      className={`h-2 bg-${source.color} rounded-full`}
                      style={{ width: `${source.visits}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-verse-glass-bg backdrop-blur-verse border border-verse-glass-border rounded-verse-lg p-6">
          <h3 className="text-verse-xl font-verse-semibold text-verse-text-primary mb-6">
            📝 Recent Activity Log
          </h3>
          <div className="space-y-3">
            {safeAnalytics.recentActivity &&
            Array.isArray(safeAnalytics.recentActivity) &&
            safeAnalytics.recentActivity.length > 0 ? (
              safeAnalytics.recentActivity.map((activity, index) => {
                if (!activity || typeof activity !== "object") return null;

                const timestamp =
                  activity.timestamp || activity.createdAt || new Date();
                const activityDate = new Date(timestamp);

                return (
                  <div
                    key={activity.id || index}
                    className="flex items-center space-x-3 p-3 bg-verse-glass-hover rounded-verse hover:bg-verse-glass-border transition-colors duration-verse"
                  >
                    <div className="w-2 h-2 bg-verse-accent-green rounded-full animate-pulse"></div>
                    <div className="flex-1">
                      <div className="text-verse-sm text-verse-text-primary">
                        {activity.action || "Unknown Activity"}
                      </div>
                      <div className="text-verse-xs text-verse-text-secondary">
                        by{" "}
                        {activity.user?.name || activity.user || "Unknown User"}{" "}
                        • {activityDate.toLocaleDateString()} at{" "}
                        {activityDate.toLocaleTimeString()}
                      </div>
                    </div>
                    <div className="text-verse-xs text-verse-text-muted">
                      {Math.floor(
                        (Date.now() - activityDate.getTime()) / (1000 * 60),
                      )}
                      m ago
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-verse-text-secondary">
                <div className="text-4xl mb-2">📝</div>
                <div className="text-verse-sm">
                  No recent activity data available
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Export Actions */}
        <div className="bg-verse-glass-bg backdrop-blur-verse border border-verse-glass-border rounded-verse-lg p-6">
          <h3 className="text-verse-xl font-verse-semibold text-verse-text-primary mb-6">
            📊 Export & Reports
          </h3>
          <div className="flex flex-wrap gap-4">
            {[
              { label: "Export Analytics CSV", icon: "📄" },
              { label: "Generate PDF Report", icon: "📋" },
              { label: "Email Monthly Report", icon: "📧" },
              { label: "Schedule Auto-Reports", icon: "⏰" },
            ].map((action) => (
              <button
                key={action.label}
                className="
                  flex items-center space-x-2
                  px-4 py-3
                  bg-verse-glass-hover
                  border border-verse-glass-border
                  text-verse-text-primary
                  rounded-verse
                  hover:bg-verse-glass-border hover:scale-105
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

export default Analytics;
