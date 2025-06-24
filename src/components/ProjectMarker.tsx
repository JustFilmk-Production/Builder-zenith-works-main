import React, { useState } from "react";

interface ProjectMarkerProps {
  name: string;
  x: number;
  y: number;
  status?: "available" | "sold" | "coming-soon";
  price?: string;
  onClick?: () => void;
}

export const ProjectMarker: React.FC<ProjectMarkerProps> = ({
  name,
  x,
  y,
  status = "available",
  price,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getStatusColor = () => {
    switch (status) {
      case "available":
        return "bg-verse-accent-green shadow-verse-glow";
      case "sold":
        return "bg-verse-accent-red";
      case "coming-soon":
        return "bg-verse-accent-orange";
      default:
        return "bg-verse-accent-blue";
    }
  };

  const getStatusDot = () => {
    switch (status) {
      case "available":
        return "bg-verse-accent-green animate-pulse-glow";
      case "sold":
        return "bg-verse-accent-red";
      case "coming-soon":
        return "bg-verse-accent-orange animate-pulse";
      default:
        return "bg-verse-accent-blue";
    }
  };

  return (
    <div
      className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer group"
      style={{ left: `${x}%`, top: `${y}%` }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative flex flex-col items-center">
        {/* Modern marker pin with glassmorphism */}
        <div
          className={`
            w-10 h-10 
            bg-verse-glass-bg backdrop-blur-verse
            border-2 border-verse-glass-border
            rounded-full 
            shadow-verse-glass
            transition-all duration-verse
            group-hover:scale-125 group-hover:shadow-verse-lg
            flex items-center justify-center
            relative overflow-hidden
            ${isHovered ? "animate-float" : ""}
          `}
        >
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-verse-accent-blue/20 to-verse-accent-purple/20 rounded-full"></div>

          {/* Status indicator dot */}
          <div className={`w-4 h-4 rounded-full z-10 ${getStatusDot()}`}></div>

          {/* Pulse ring for available properties */}
          {status === "available" && (
            <div className="absolute inset-0 rounded-full bg-verse-accent-green/30 animate-ping"></div>
          )}
        </div>

        {/* Enhanced project label with glassmorphism */}
        <div
          className={`
            mt-3 px-4 py-2
            bg-verse-glass-bg backdrop-blur-verse
            border border-verse-glass-border
            text-verse-text-primary
            text-verse-xs font-verse-medium
            rounded-verse
            shadow-verse-glass
            transition-all duration-verse
            group-hover:bg-verse-glass-hover
            whitespace-nowrap
            max-w-[140px]
            overflow-hidden
            text-ellipsis
            ${isHovered ? "scale-105 animate-slide-up" : ""}
          `}
        >
          <div className="font-verse-semibold">{name}</div>
          {price && (
            <div className="text-verse-accent-green text-verse-xs mt-1">
              {price}
            </div>
          )}
          <div
            className={`text-verse-xs mt-1 capitalize ${
              status === "available"
                ? "text-verse-accent-green"
                : status === "sold"
                  ? "text-verse-accent-red"
                  : "text-verse-accent-orange"
            }`}
          >
            {status.replace("-", " ")}
          </div>
        </div>

        {/* Hover tooltip with more info */}
        {isHovered && (
          <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 animate-fade-in">
            <div className="bg-verse-glass-bg backdrop-blur-verse border border-verse-glass-border rounded-verse px-3 py-2 text-verse-xs text-verse-text-primary whitespace-nowrap shadow-verse-lg">
              Click to view details
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
