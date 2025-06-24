import React from "react";

interface LoadingOverlayProps {
  isVisible: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible,
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-verse-loading-overlay backdrop-blur-verse">
      <div className="flex flex-col items-center justify-center space-y-6 animate-scale-in">
        {/* Modern spinner with gradient */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-transparent rounded-full animate-spin-smooth">
            <div className="absolute inset-0 border-4 border-transparent border-t-verse-accent-blue border-r-verse-accent-purple rounded-full"></div>
          </div>
          <div
            className="absolute inset-2 border-4 border-transparent border-t-verse-accent-green border-r-verse-accent-orange rounded-full animate-spin-smooth"
            style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
          ></div>
        </div>

        {/* Modern loading text with glassmorphism container */}
        <div className="bg-verse-glass-bg backdrop-blur-verse border border-verse-glass-border rounded-verse-lg px-6 py-3">
          <div className="text-verse-text-primary text-verse-lg font-verse-medium text-center">
            Loading Verse
          </div>
          <div className="text-verse-text-secondary text-verse-sm text-center mt-1">
            Preparing your real estate experience
          </div>
        </div>

        {/* Loading dots animation */}
        <div className="flex space-x-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-verse-accent-blue rounded-full animate-pulse-glow"
              style={{ animationDelay: `${i * 0.2}s` }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};
