import React, { useState, useMemo } from "react";
import { useProjectStore, Project } from "../../store/projectStore";
import AdminLayout from "../../components/admin/AdminLayout";

const ProjectsAdmin: React.FC = () => {
  const { projects, addProject, updateProject, deleteProject } =
    useProjectStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priceFilter, setPriceFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedProjects, setSelectedProjects] = useState<number[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    x: 50,
    y: 50,
    status: "available" as const,
    price: "",
    description: "",
    image: "",
    features: "",
    area: "",
    bedrooms: 0,
    bathrooms: 0,
  });

  const resetForm = () => {
    setFormData({
      name: "",
      location: "",
      x: 50,
      y: 50,
      status: "available",
      price: "",
      description: "",
      image: "",
      features: "",
      area: "",
      bedrooms: 0,
      bathrooms: 0,
    });
    setEditingProject(null);
    setIsFormOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const projectData = {
      ...formData,
      features: formData.features.split(",").map((f) => f.trim()),
    };

    if (editingProject) {
      updateProject(editingProject.id, projectData);
    } else {
      addProject(projectData);
    }

    resetForm();
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      location: project.location,
      x: project.x,
      y: project.y,
      status: project.status,
      price: project.price,
      description: project.description,
      image: project.image,
      features: project.features.join(", "),
      area: project.area,
      bedrooms: project.bedrooms || 0,
      bathrooms: project.bathrooms || 0,
    });
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      deleteProject(id);
    }
  };

  const handleBulkDelete = () => {
    if (
      window.confirm(
        `Are you sure you want to delete ${selectedProjects.length} projects?`,
      )
    ) {
      selectedProjects.forEach((id) => deleteProject(id));
      setSelectedProjects([]);
      setShowBulkActions(false);
    }
  };

  const handleBulkStatusUpdate = (status: string) => {
    selectedProjects.forEach((id) =>
      updateProject(id, { status: status as any }),
    );
    setSelectedProjects([]);
    setShowBulkActions(false);
  };

  const toggleProjectSelection = (id: number) => {
    setSelectedProjects((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id],
    );
  };

  const selectAllProjects = () => {
    setSelectedProjects(filteredProjects.map((p) => p.id));
  };

  const clearSelection = () => {
    setSelectedProjects([]);
  };

  // Enhanced filtering and sorting
  const filteredProjects = useMemo(() => {
    let filtered = projects.filter((project) => {
      const matchesSearch =
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || project.status === statusFilter;

      let matchesPrice = true;
      if (priceFilter !== "all") {
        const price = parseFloat(project.price.replace(/[^0-9.]/g, ""));
        switch (priceFilter) {
          case "under1m":
            matchesPrice = price < 1000000;
            break;
          case "1m-2m":
            matchesPrice = price >= 1000000 && price < 2000000;
            break;
          case "over2m":
            matchesPrice = price >= 2000000;
            break;
        }
      }

      return matchesSearch && matchesStatus && matchesPrice;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "price":
          aValue = parseFloat(a.price.replace(/[^0-9.]/g, ""));
          bValue = parseFloat(b.price.replace(/[^0-9.]/g, ""));
          break;
        case "location":
          aValue = a.location.toLowerCase();
          bValue = b.location.toLowerCase();
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        case "created":
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [projects, searchTerm, statusFilter, priceFilter, sortBy, sortOrder]);

  const statusColors = {
    available:
      "text-verse-accent-green bg-verse-accent-green/20 border-verse-accent-green/30",
    sold: "text-verse-accent-red bg-verse-accent-red/20 border-verse-accent-red/30",
    "coming-soon":
      "text-verse-accent-orange bg-verse-accent-orange/20 border-verse-accent-orange/30",
  };

  const stats = {
    total: projects.length,
    available: projects.filter((p) => p.status === "available").length,
    sold: projects.filter((p) => p.status === "sold").length,
    comingSoon: projects.filter((p) => p.status === "coming-soon").length,
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Enhanced Header with Stats */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-verse-3xl font-verse-bold text-verse-text-primary">
              🏢 Projects Management
            </h1>
            <p className="text-verse-lg text-verse-text-secondary mt-2">
              Manage your real estate portfolio with advanced tools
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setIsFormOpen(true)}
              className="
                px-6 py-3
                bg-gradient-to-r from-verse-accent-green to-verse-accent-blue
                text-white rounded-verse
                hover:shadow-verse-green-glow hover:scale-105
                transition-all duration-verse
                flex items-center space-x-2
                font-verse-medium
              "
            >
              <span>➕</span>
              <span>Add New Project</span>
            </button>
            <button
              onClick={() => {
                /* Export function */
              }}
              className="
                px-4 py-3
                bg-verse-glass-bg hover:bg-verse-glass-hover
                border border-verse-glass-border
                text-verse-text-primary
                rounded-verse
                transition-all duration-verse
                flex items-center space-x-2
              "
            >
              <span>📥</span>
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              label: "Total Projects",
              value: stats.total,
              icon: "🏢",
              color: "blue",
            },
            {
              label: "Available",
              value: stats.available,
              icon: "✅",
              color: "green",
            },
            { label: "Sold", value: stats.sold, icon: "🏆", color: "red" },
            {
              label: "Coming Soon",
              value: stats.comingSoon,
              icon: "⏳",
              color: "orange",
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
                animate-scale-in
              "
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-2xl">{stat.icon}</div>
                <div
                  className={`text-verse-2xl font-verse-bold text-verse-accent-${stat.color}`}
                >
                  {stat.value}
                </div>
              </div>
              <div className="text-verse-sm text-verse-text-secondary">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Advanced Filters and Controls */}
        <div className="bg-verse-glass-bg backdrop-blur-verse border border-verse-glass-border rounded-verse-lg p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Search */}
            <div className="flex-1 min-w-64">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search projects by name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="
                    w-full px-4 py-2 pl-10
                    bg-verse-glass-hover
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
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-verse-glass-hover border border-verse-glass-border rounded-verse text-verse-text-primary"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="sold">Sold</option>
                <option value="coming-soon">Coming Soon</option>
              </select>

              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="px-3 py-2 bg-verse-glass-hover border border-verse-glass-border rounded-verse text-verse-text-primary"
              >
                <option value="all">All Prices</option>
                <option value="under1m">Under 1M SAR</option>
                <option value="1m-2m">1M - 2M SAR</option>
                <option value="over2m">Over 2M SAR</option>
              </select>

              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split("-");
                  setSortBy(field);
                  setSortOrder(order as "asc" | "desc");
                }}
                className="px-3 py-2 bg-verse-glass-hover border border-verse-glass-border rounded-verse text-verse-text-primary"
              >
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="price-asc">Price Low-High</option>
                <option value="price-desc">Price High-Low</option>
                <option value="created-desc">Newest First</option>
                <option value="created-asc">Oldest First</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex bg-verse-glass-hover rounded-verse border border-verse-glass-border">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-2 ${viewMode === "grid" ? "bg-verse-accent-blue text-white" : "text-verse-text-primary"} transition-all`}
                >
                  ⊞
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-2 ${viewMode === "list" ? "bg-verse-accent-blue text-white" : "text-verse-text-primary"} transition-all`}
                >
                  ☰
                </button>
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedProjects.length > 0 && (
            <div className="mt-4 p-4 bg-verse-accent-blue/10 border border-verse-accent-blue/30 rounded-verse">
              <div className="flex items-center justify-between">
                <span className="text-verse-sm text-verse-text-primary">
                  {selectedProjects.length} project(s) selected
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleBulkStatusUpdate("available")}
                    className="px-3 py-1 bg-verse-accent-green text-white rounded-verse text-verse-sm hover:bg-verse-accent-green/80"
                  >
                    Mark Available
                  </button>
                  <button
                    onClick={() => handleBulkStatusUpdate("sold")}
                    className="px-3 py-1 bg-verse-accent-red text-white rounded-verse text-verse-sm hover:bg-verse-accent-red/80"
                  >
                    Mark Sold
                  </button>
                  <button
                    onClick={handleBulkDelete}
                    className="px-3 py-1 bg-verse-accent-red text-white rounded-verse text-verse-sm hover:bg-verse-accent-red/80"
                  >
                    Delete
                  </button>
                  <button
                    onClick={clearSelection}
                    className="px-3 py-1 bg-verse-glass-hover text-verse-text-primary rounded-verse text-verse-sm border border-verse-glass-border"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Projects Display */}
        <div className="bg-verse-glass-bg backdrop-blur-verse border border-verse-glass-border rounded-verse-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-verse-xl font-verse-semibold text-verse-text-primary">
              Projects ({filteredProjects.length})
            </h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={selectAllProjects}
                className="text-verse-sm text-verse-accent-blue hover:text-verse-accent-blue/80 transition-colors"
              >
                Select All
              </button>
              <span className="text-verse-text-secondary">|</span>
              <button
                onClick={clearSelection}
                className="text-verse-sm text-verse-accent-blue hover:text-verse-accent-blue/80 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>

          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="
                    bg-verse-glass-hover
                    border border-verse-glass-border
                    rounded-verse-lg
                    overflow-hidden
                    hover:bg-verse-glass-border
                    transition-all duration-verse
                    group
                    relative
                  "
                >
                  {/* Selection checkbox */}
                  <div className="absolute top-4 left-4 z-10">
                    <input
                      type="checkbox"
                      checked={selectedProjects.includes(project.id)}
                      onChange={() => toggleProjectSelection(project.id)}
                      className="w-4 h-4 rounded border-verse-glass-border"
                    />
                  </div>

                  {/* Project image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-verse"
                    />
                    <div className="absolute top-4 right-4">
                      <span
                        className={`
                        px-2 py-1 rounded-verse-sm text-verse-xs font-verse-medium border
                        ${statusColors[project.status]}
                      `}
                      >
                        {project.status.replace("-", " ")}
                      </span>
                    </div>
                  </div>

                  {/* Project details */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-verse-lg font-verse-semibold text-verse-text-primary">
                        {project.name}
                      </h4>
                      <div className="text-verse-sm font-verse-bold text-verse-accent-green">
                        {project.price}
                      </div>
                    </div>

                    <p className="text-verse-sm text-verse-text-secondary mb-3">
                      📍 {project.location}
                    </p>

                    <p className="text-verse-sm text-verse-text-primary mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    {/* Project specs */}
                    <div className="flex items-center space-x-4 mb-4 text-verse-xs text-verse-text-secondary">
                      <span>📐 {project.area}</span>
                      {project.bedrooms && <span>🛏️ {project.bedrooms}</span>}
                      {project.bathrooms && <span>🚿 {project.bathrooms}</span>}
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(project)}
                        className="flex-1 px-3 py-2 bg-verse-accent-blue text-white rounded-verse text-verse-sm hover:bg-verse-accent-blue/80 transition-colors"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="px-3 py-2 bg-verse-accent-red text-white rounded-verse text-verse-sm hover:bg-verse-accent-red/80 transition-colors"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="space-y-3">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="
                    flex items-center justify-between
                    p-4 bg-verse-glass-hover
                    border border-verse-glass-border
                    rounded-verse
                    hover:bg-verse-glass-border
                    transition-all duration-verse
                  "
                >
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={selectedProjects.includes(project.id)}
                      onChange={() => toggleProjectSelection(project.id)}
                      className="w-4 h-4 rounded border-verse-glass-border"
                    />
                    <img
                      src={project.image}
                      alt={project.name}
                      className="w-16 h-16 object-cover rounded-verse"
                    />
                    <div>
                      <h4 className="text-verse-sm font-verse-semibold text-verse-text-primary">
                        {project.name}
                      </h4>
                      <p className="text-verse-xs text-verse-text-secondary">
                        {project.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <span
                      className={`
                      px-2 py-1 rounded-verse-sm text-verse-xs font-verse-medium border
                      ${statusColors[project.status]}
                    `}
                    >
                      {project.status.replace("-", " ")}
                    </span>
                    <span className="text-verse-sm font-verse-bold text-verse-accent-green">
                      {project.price}
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(project)}
                        className="px-3 py-1 bg-verse-accent-blue text-white rounded-verse text-verse-xs hover:bg-verse-accent-blue/80 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="px-3 py-1 bg-verse-accent-red text-white rounded-verse text-verse-xs hover:bg-verse-accent-red/80 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏢</div>
              <h3 className="text-verse-lg font-verse-semibold text-verse-text-primary mb-2">
                No projects found
              </h3>
              <p className="text-verse-text-secondary">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>

        {/* Enhanced Form Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-verse-glass-bg backdrop-blur-verse border border-verse-glass-border rounded-verse-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-verse-glass-border">
                <h3 className="text-verse-xl font-verse-semibold text-verse-text-primary">
                  {editingProject ? "Edit Project" : "Add New Project"}
                </h3>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-verse-sm font-verse-medium text-verse-text-primary mb-2">
                      Project Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-verse-glass-hover border border-verse-glass-border rounded-verse text-verse-text-primary focus:outline-none focus:ring-2 focus:ring-verse-accent-blue/50"
                    />
                  </div>

                  <div>
                    <label className="block text-verse-sm font-verse-medium text-verse-text-primary mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-verse-glass-hover border border-verse-glass-border rounded-verse text-verse-text-primary focus:outline-none focus:ring-2 focus:ring-verse-accent-blue/50"
                    />
                  </div>

                  <div>
                    <label className="block text-verse-sm font-verse-medium text-verse-text-primary mb-2">
                      Price *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      placeholder="e.g., 1.2M SAR"
                      className="w-full px-4 py-2 bg-verse-glass-hover border border-verse-glass-border rounded-verse text-verse-text-primary focus:outline-none focus:ring-2 focus:ring-verse-accent-blue/50"
                    />
                  </div>

                  <div>
                    <label className="block text-verse-sm font-verse-medium text-verse-text-primary mb-2">
                      Status *
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value as any,
                        })
                      }
                      className="w-full px-4 py-2 bg-verse-glass-hover border border-verse-glass-border rounded-verse text-verse-text-primary focus:outline-none focus:ring-2 focus:ring-verse-accent-blue/50"
                    >
                      <option value="available">Available</option>
                      <option value="sold">Sold</option>
                      <option value="coming-soon">Coming Soon</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-verse-sm font-verse-medium text-verse-text-primary mb-2">
                      Area
                    </label>
                    <input
                      type="text"
                      value={formData.area}
                      onChange={(e) =>
                        setFormData({ ...formData, area: e.target.value })
                      }
                      placeholder="e.g., 250 sqm"
                      className="w-full px-4 py-2 bg-verse-glass-hover border border-verse-glass-border rounded-verse text-verse-text-primary focus:outline-none focus:ring-2 focus:ring-verse-accent-blue/50"
                    />
                  </div>

                  <div>
                    <label className="block text-verse-sm font-verse-medium text-verse-text-primary mb-2">
                      Image URL
                    </label>
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) =>
                        setFormData({ ...formData, image: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-verse-glass-hover border border-verse-glass-border rounded-verse text-verse-text-primary focus:outline-none focus:ring-2 focus:ring-verse-accent-blue/50"
                    />
                  </div>

                  <div>
                    <label className="block text-verse-sm font-verse-medium text-verse-text-primary mb-2">
                      Bedrooms
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.bedrooms}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          bedrooms: Number(e.target.value),
                        })
                      }
                      className="w-full px-4 py-2 bg-verse-glass-hover border border-verse-glass-border rounded-verse text-verse-text-primary focus:outline-none focus:ring-2 focus:ring-verse-accent-blue/50"
                    />
                  </div>

                  <div>
                    <label className="block text-verse-sm font-verse-medium text-verse-text-primary mb-2">
                      Bathrooms
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.bathrooms}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          bathrooms: Number(e.target.value),
                        })
                      }
                      className="w-full px-4 py-2 bg-verse-glass-hover border border-verse-glass-border rounded-verse text-verse-text-primary focus:outline-none focus:ring-2 focus:ring-verse-accent-blue/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-verse-sm font-verse-medium text-verse-text-primary mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                    className="w-full px-4 py-2 bg-verse-glass-hover border border-verse-glass-border rounded-verse text-verse-text-primary focus:outline-none focus:ring-2 focus:ring-verse-accent-blue/50"
                  />
                </div>

                <div>
                  <label className="block text-verse-sm font-verse-medium text-verse-text-primary mb-2">
                    Features (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.features}
                    onChange={(e) =>
                      setFormData({ ...formData, features: e.target.value })
                    }
                    placeholder="e.g., Swimming Pool, Gym, Garden"
                    className="w-full px-4 py-2 bg-verse-glass-hover border border-verse-glass-border rounded-verse text-verse-text-primary focus:outline-none focus:ring-2 focus:ring-verse-accent-blue/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-verse-sm font-verse-medium text-verse-text-primary mb-2">
                      Map X Position (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.x}
                      onChange={(e) =>
                        setFormData({ ...formData, x: Number(e.target.value) })
                      }
                      className="w-full px-4 py-2 bg-verse-glass-hover border border-verse-glass-border rounded-verse text-verse-text-primary focus:outline-none focus:ring-2 focus:ring-verse-accent-blue/50"
                    />
                  </div>
                  <div>
                    <label className="block text-verse-sm font-verse-medium text-verse-text-primary mb-2">
                      Map Y Position (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.y}
                      onChange={(e) =>
                        setFormData({ ...formData, y: Number(e.target.value) })
                      }
                      className="w-full px-4 py-2 bg-verse-glass-hover border border-verse-glass-border rounded-verse text-verse-text-primary focus:outline-none focus:ring-2 focus:ring-verse-accent-blue/50"
                    />
                  </div>
                </div>

                <div className="flex space-x-4 pt-6 border-t border-verse-glass-border">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-verse-accent-green to-verse-accent-blue text-white rounded-verse hover:shadow-verse-green-glow transition-all duration-verse font-verse-medium"
                  >
                    {editingProject ? "Update Project" : "Create Project"}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 bg-verse-glass-hover border border-verse-glass-border text-verse-text-primary rounded-verse hover:bg-verse-glass-border transition-all duration-verse"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ProjectsAdmin;
