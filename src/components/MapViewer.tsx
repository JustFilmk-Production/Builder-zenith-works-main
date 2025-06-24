import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProjectStore } from "../store/projectStore";
import { NavigationButton } from "./NavigationButton";
import { ProjectMarker } from "./ProjectMarker";

export const MapViewer: React.FC = () => {
  const navigate = useNavigate();
  const {
    projects,
    selectedProject,
    setSelectedProject,
    incrementProjectViews,
    mapSettings,
    isLoading,
  } = useProjectStore();

  // Default map settings to prevent null access errors
  const defaultMapSettings = {
    backgroundImage:
      "https://saraya-al-fursan.darwaemaar.com/images/map/riyadh/map.jpg",
    theme: "dark",
    defaultZoom: 12,
    centerCoordinates: { lat: 24.7136, lng: 46.6753 },
  };

  // Use mapSettings if available, otherwise use defaults
  const currentMapSettings = mapSettings || defaultMapSettings;

  const handleProjectClick = (projectId: number) => {
    try {
      setSelectedProject(projectId);
      incrementProjectViews(projectId);
    } catch (error) {
      console.error("Error handling project click:", error);
    }
  };

  const handleAllProjectsClick = () => {
    navigate("/projects");
  };

  const selectedProjectData = projects.find((p) => p.id === selectedProject);

  // Show loading state while data is being fetched
  if (isLoading && projects.length === 0) {
    return (
      <div className="relative w-full h-full overflow-hidden bg-verse-primary-bg flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-verse-accent-blue/30 border-t-verse-accent-blue rounded-full animate-spin"></div>
          <div className="text-verse-text-primary font-verse-medium">
            Loading Map...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Navigation Button */}
      <NavigationButton
        text="All projects"
        onClick={handleAllProjectsClick}
        variant="glass"
        icon="🏢"
      />

      {/* Admin Access Button */}
      <button
        onClick={() => navigate("/admin")}
        className="
          absolute top-6 left-48 z-20
          px-verse-md py-verse-sm
          bg-gradient-to-r from-verse-accent-red to-verse-accent-orange
          text-white
          rounded-verse
          shadow-verse
          hover:shadow-verse-glow hover:scale-105
          transition-all duration-verse
          text-verse-sm font-verse-medium
          flex items-center space-x-2
        "
      >
        <span>⚙️</span>
        <span>Admin</span>
      </button>

      {/* Map Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${currentMapSettings.backgroundImage})`,
          filter: "brightness(0.9) contrast(1.1)",
        }}
      >
        {/* Enhanced overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/30"></div>
      </div>

      {/* Project Markers */}
      <div className="relative w-full h-full">
        {projects &&
          projects.length > 0 &&
          projects.map((project) => (
            <ProjectMarker
              key={project.id}
              name={project.name}
              x={project.x}
              y={project.y}
              status={project.status}
              price={project.price}
              onClick={() => handleProjectClick(project.id)}
            />
          ))}
      </div>

      {/* Enhanced Selected Project Info Panel */}
      {selectedProjectData && projects.length > 0 && (
        <div className="absolute bottom-6 left-6 right-6 max-w-lg z-20 animate-slide-up">
          <div className="bg-verse-glass-bg backdrop-blur-verse-lg border border-verse-glass-border rounded-verse-lg p-6 shadow-verse-glass">
            {/* Project Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-verse-xl font-verse-bold text-verse-text-primary mb-1">
                  {selectedProjectData.name}
                </h3>
                <div className="flex items-center space-x-4 text-verse-sm text-verse-text-secondary">
                  <span>📍 {selectedProjectData.location}</span>
                  <span>💰 {selectedProjectData.price}</span>
                </div>
              </div>
              <span
                className={`
                px-3 py-1 rounded-verse text-verse-xs font-verse-medium
                ${
                  selectedProjectData.status === "available"
                    ? "bg-verse-accent-green/20 text-verse-accent-green"
                    : selectedProjectData.status === "sold"
                      ? "bg-verse-accent-red/20 text-verse-accent-red"
                      : "bg-verse-accent-orange/20 text-verse-accent-orange"
                }
              `}
              >
                {selectedProjectData.status.replace("-", " ")}
              </span>
            </div>

            {/* Project Details */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-verse-glass-hover rounded-verse p-3">
                <div className="text-verse-xs text-verse-text-secondary mb-1">
                  Area
                </div>
                <div className="text-verse-sm font-verse-medium text-verse-text-primary">
                  {selectedProjectData.area}
                </div>
              </div>
              {selectedProjectData.bedrooms &&
                selectedProjectData.bathrooms && (
                  <div className="bg-verse-glass-hover rounded-verse p-3">
                    <div className="text-verse-xs text-verse-text-secondary mb-1">
                      Rooms
                    </div>
                    <div className="text-verse-sm font-verse-medium text-verse-text-primary">
                      {selectedProjectData.bedrooms} bed •{" "}
                      {selectedProjectData.bathrooms} bath
                    </div>
                  </div>
                )}
            </div>

            {/* Description */}
            <p className="text-verse-sm text-verse-text-secondary mb-4 leading-relaxed">
              {selectedProjectData.description}
            </p>

            {/* Features */}
            {selectedProjectData.features &&
              selectedProjectData.features.length > 0 && (
                <div className="mb-4">
                  <div className="text-verse-xs text-verse-text-secondary mb-2">
                    Features
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedProjectData.features
                      .slice(0, 3)
                      .map((feature, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-verse-glass-hover text-verse-text-primary text-verse-xs rounded-verse-sm"
                        >
                          {feature}
                        </span>
                      ))}
                    {selectedProjectData.features.length > 3 && (
                      <span className="px-2 py-1 bg-verse-glass-hover text-verse-text-secondary text-verse-xs rounded-verse-sm">
                        +{selectedProjectData.features.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                className="
                  flex-1 px-4 py-3
                  bg-gradient-to-r from-verse-accent-blue to-verse-accent-purple
                  text-white
                  rounded-verse
                  font-verse-medium text-verse-sm
                  hover:shadow-verse-purple-glow hover:scale-105
                  transition-all duration-verse
                "
              >
                View Details
              </button>
              <button
                className="
                  px-4 py-3
                  bg-verse-glass-hover
                  border border-verse-glass-border
                  text-verse-text-primary
                  rounded-verse
                  font-verse-medium text-verse-sm
                  hover:bg-verse-glass-border
                  transition-all duration-verse
                "
              >
                💬 Contact
              </button>
              <button
                onClick={() => setSelectedProject(null)}
                className="
                  px-4 py-3
                  bg-verse-glass-hover
                  border border-verse-glass-border
                  text-verse-text-secondary
                  rounded-verse
                  font-verse-medium text-verse-sm
                  hover:text-verse-text-primary
                  transition-all duration-verse
                "
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
