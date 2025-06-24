import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useProjectStore } from "../store/projectStore";
import { NavigationButton } from "../components/NavigationButton";

const Projects: React.FC = () => {
  const navigate = useNavigate();
  const { projects, setSelectedProject } = useProjectStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  const filteredAndSortedProjects = useMemo(() => {
    let filtered = projects.filter((project) => {
      const matchesSearch = project.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || project.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "price":
          return (
            parseFloat(a.price.replace(/[^\d.]/g, "")) -
            parseFloat(b.price.replace(/[^\d.]/g, ""))
          );
        case "location":
          return a.location.localeCompare(b.location);
        case "newest":
          return b.createdAt.getTime() - a.createdAt.getTime();
        default:
          return a.name.localeCompare(b.name);
      }
    });
  }, [projects, searchTerm, statusFilter, sortBy]);

  const statusColors = {
    available: "text-verse-accent-green bg-verse-accent-green/20",
    sold: "text-verse-accent-red bg-verse-accent-red/20",
    "coming-soon": "text-verse-accent-orange bg-verse-accent-orange/20",
  };

  const handleProjectClick = (projectId: number) => {
    setSelectedProject(projectId);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-verse-primary-bg font-verse">
      {/* Navigation */}
      <NavigationButton
        text="← Back to Map"
        onClick={() => navigate("/")}
        variant="glass"
        icon="🗺️"
      />

      {/* Header */}
      <div className="pt-20 pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-verse-3xl font-verse-bold text-verse-text-primary mb-4">
              🏢 All Projects
            </h1>
            <p className="text-verse-lg text-verse-text-secondary max-w-2xl mx-auto">
              Discover premium real estate developments across Saudi Arabia.
              From luxury villas to modern apartments, find your perfect home.
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              {
                label: "Total Projects",
                value: projects.length,
                icon: "🏢",
                gradient: "from-verse-accent-blue to-verse-accent-purple",
              },
              {
                label: "Available",
                value: projects.filter((p) => p.status === "available").length,
                icon: "✅",
                gradient: "from-verse-accent-green to-verse-accent-blue",
              },
              {
                label: "Coming Soon",
                value: projects.filter((p) => p.status === "coming-soon")
                  .length,
                icon: "🚧",
                gradient: "from-verse-accent-orange to-verse-accent-red",
              },
              {
                label: "Sold Out",
                value: projects.filter((p) => p.status === "sold").length,
                icon: "🔴",
                gradient: "from-verse-accent-red to-verse-accent-purple",
              },
            ].map((stat, index) => (
              <div
                key={stat.label}
                className="
                  bg-verse-glass-bg backdrop-blur-verse
                  border border-verse-glass-border
                  rounded-verse-lg p-6
                  hover:bg-verse-glass-hover
                  transition-all duration-verse
                  group animate-scale-in
                "
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-between mb-3">
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
                </div>
                <div>
                  <div className="text-verse-2xl font-verse-bold text-verse-text-primary mb-1">
                    {stat.value}
                  </div>
                  <div className="text-verse-sm text-verse-text-secondary">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="px-6 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-verse-glass-bg backdrop-blur-verse border border-verse-glass-border rounded-verse-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <input
                  type="text"
                  placeholder="Search projects by name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="
                    w-full px-4 py-3
                    bg-verse-glass-hover
                    border border-verse-glass-border
                    rounded-verse
                    text-verse-text-primary
                    placeholder-verse-text-muted
                    focus:outline-none focus:ring-2 focus:ring-verse-accent-blue/50
                  "
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="
                  px-4 py-3
                  bg-verse-glass-hover
                  border border-verse-glass-border
                  rounded-verse
                  text-verse-text-primary
                  focus:outline-none focus:ring-2 focus:ring-verse-accent-blue/50
                "
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="coming-soon">Coming Soon</option>
                <option value="sold">Sold Out</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="
                  px-4 py-3
                  bg-verse-glass-hover
                  border border-verse-glass-border
                  rounded-verse
                  text-verse-text-primary
                  focus:outline-none focus:ring-2 focus:ring-verse-accent-blue/50
                "
              >
                <option value="name">Sort by Name</option>
                <option value="price">Sort by Price</option>
                <option value="location">Sort by Location</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          {filteredAndSortedProjects.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-verse-xl font-verse-semibold text-verse-text-primary mb-2">
                No projects found
              </h3>
              <p className="text-verse-text-secondary">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredAndSortedProjects.map((project, index) => (
                <div
                  key={project.id}
                  className="
                    bg-verse-glass-bg backdrop-blur-verse
                    border border-verse-glass-border
                    rounded-verse-lg overflow-hidden
                    hover:bg-verse-glass-hover hover:scale-105
                    transition-all duration-verse
                    cursor-pointer
                    group animate-scale-in
                  "
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => handleProjectClick(project.id)}
                >
                  <div className="aspect-[4/3] bg-verse-accent-bg overflow-hidden relative">
                    <img
                      src={project.image}
                      alt={project.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-verse"
                    />
                    <div className="absolute top-4 right-4">
                      <span
                        className={`
                        px-3 py-1 rounded-verse text-verse-xs font-verse-medium
                        backdrop-blur-verse border border-white/20
                        ${statusColors[project.status]}
                      `}
                      >
                        {project.status.replace("-", " ")}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="bg-verse-glass-bg backdrop-blur-verse border border-verse-glass-border rounded-verse px-3 py-2">
                        <div className="text-verse-accent-green font-verse-bold text-verse-lg">
                          {project.price}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="mb-3">
                      <h3 className="text-verse-lg font-verse-bold text-verse-text-primary mb-1 line-clamp-1">
                        {project.name}
                      </h3>
                      <div className="text-verse-sm text-verse-text-secondary">
                        📍 {project.location}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4 text-verse-sm">
                      <div className="text-verse-text-secondary">
                        📐 {project.area}
                      </div>
                      {project.bedrooms && project.bathrooms && (
                        <div className="text-verse-text-secondary">
                          🛏️ {project.bedrooms} • 🚿 {project.bathrooms}
                        </div>
                      )}
                    </div>

                    <p className="text-verse-sm text-verse-text-muted mb-4 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>

                    {/* Features */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {project.features.slice(0, 2).map((feature, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-verse-glass-hover text-verse-text-primary text-verse-xs rounded-verse-sm"
                          >
                            {feature}
                          </span>
                        ))}
                        {project.features.length > 2 && (
                          <span className="px-2 py-1 bg-verse-glass-hover text-verse-text-secondary text-verse-xs rounded-verse-sm">
                            +{project.features.length - 2}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProjectClick(project.id);
                        }}
                        className="
                          flex-1 px-4 py-2
                          bg-gradient-to-r from-verse-accent-blue to-verse-accent-purple
                          text-white
                          rounded-verse
                          hover:shadow-verse-purple-glow
                          transition-all duration-verse
                          text-verse-sm font-verse-medium
                        "
                      >
                        View on Map
                      </button>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="
                          px-4 py-2
                          bg-verse-glass-hover
                          border border-verse-glass-border
                          text-verse-text-primary
                          rounded-verse
                          hover:bg-verse-glass-border
                          transition-all duration-verse
                          text-verse-sm font-verse-medium
                        "
                      >
                        💬
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-verse-accent-blue to-verse-accent-purple rounded-verse-lg p-8 text-center text-white">
            <h2 className="text-verse-2xl font-verse-bold mb-4">
              Can't find what you're looking for?
            </h2>
            <p className="text-verse-lg mb-6 opacity-90">
              Our team of experts can help you find the perfect property that
              matches your needs and budget.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-6 py-3 bg-white text-verse-accent-blue rounded-verse font-verse-medium hover:bg-opacity-90 transition-colors">
                Contact Our Team
              </button>
              <button className="px-6 py-3 border-2 border-white text-white rounded-verse font-verse-medium hover:bg-white hover:text-verse-accent-blue transition-colors">
                Schedule a Visit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;
