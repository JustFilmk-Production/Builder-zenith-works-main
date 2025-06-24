import React, { useState, useEffect } from "react";
import { LoadingOverlay } from "../components/LoadingOverlay";
import { MapViewer } from "../components/MapViewer";

const Index: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentRegion, setCurrentRegion] = useState("riyadh");
  const [currentLang, setCurrentLang] = useState("en");

  useEffect(() => {
    // Simulate loading time for realistic experience
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const regions = [
    { value: "riyadh", label: "Riyadh", flag: "🇸🇦" },
    { value: "jeddah", label: "Jeddah", flag: "🇸🇦" },
    { value: "dammam", label: "Dammam", flag: "🇸🇦" },
    { value: "mecca", label: "Mecca", flag: "🇸🇦" },
    { value: "medina", label: "Medina", flag: "🇸🇦" },
  ];

  return (
    <div className="relative w-full h-screen bg-verse-primary-bg overflow-hidden font-verse">
      {/* Loading Overlay */}
      <LoadingOverlay isVisible={isLoading} />

      {/* Main Map Container */}
      <div className="w-full h-full">
        <MapViewer />
      </div>

      {/* Enhanced Brand/Logo Area - Top Right */}
      <div className="absolute top-6 right-6 z-20">
        <div className="bg-verse-glass-bg backdrop-blur-verse border border-verse-glass-border rounded-verse-lg p-4 shadow-verse-glass">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-verse-accent-blue to-verse-accent-purple rounded-verse flex items-center justify-center text-white font-verse-bold text-verse-lg">
              V
            </div>
            <div>
              <h1 className="text-verse-text-primary font-verse-bold text-verse-lg tracking-wide">
                VERSE
              </h1>
              <p className="text-verse-text-secondary text-verse-xs">
                Real Estate Platform
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced State/Region Selector - Bottom Right */}
      <div className="absolute bottom-6 right-6 z-20">
        <div className="bg-verse-glass-bg backdrop-blur-verse border border-verse-glass-border rounded-verse-lg p-4 shadow-verse-glass">
          <div className="text-verse-xs text-verse-text-secondary mb-2">
            Select Region
          </div>
          <select
            value={currentRegion}
            onChange={(e) => setCurrentRegion(e.target.value)}
            className="
              bg-transparent
              text-verse-text-primary
              text-verse-sm
              font-verse-medium
              border-none
              outline-none
              cursor-pointer
              appearance-none
              pr-8
            "
          >
            {regions.map((region) => (
              <option
                key={region.value}
                value={region.value}
                className="bg-verse-secondary-bg text-verse-text-primary"
              >
                {region.flag} {region.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Enhanced Language Toggle - Top Left Corner */}
      <div className="absolute top-6 left-80 z-20">
        <div className="bg-verse-glass-bg backdrop-blur-verse border border-verse-glass-border rounded-verse p-2 shadow-verse-glass">
          <div className="flex space-x-1">
            <button
              onClick={() => setCurrentLang("en")}
              className={`
                px-3 py-2
                rounded-verse-sm
                text-verse-xs font-verse-medium
                transition-all duration-verse
                ${
                  currentLang === "en"
                    ? "bg-gradient-to-r from-verse-accent-blue to-verse-accent-purple text-white shadow-verse-glow"
                    : "text-verse-text-secondary hover:text-verse-text-primary hover:bg-verse-glass-hover"
                }
              `}
            >
              EN
            </button>
            <button
              onClick={() => setCurrentLang("ar")}
              className={`
                px-3 py-2
                rounded-verse-sm
                text-verse-xs font-verse-medium
                transition-all duration-verse
                ${
                  currentLang === "ar"
                    ? "bg-gradient-to-r from-verse-accent-blue to-verse-accent-purple text-white shadow-verse-glow"
                    : "text-verse-text-secondary hover:text-verse-text-primary hover:bg-verse-glass-hover"
                }
              `}
            >
              AR
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats Panel - Bottom Left */}
      <div className="absolute bottom-6 left-6 z-20 max-w-xs">
        <div className="bg-verse-glass-bg backdrop-blur-verse border border-verse-glass-border rounded-verse-lg p-4 shadow-verse-glass">
          <div className="text-verse-sm font-verse-semibold text-verse-text-primary mb-3">
            📊 Live Stats
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-verse-xs text-verse-text-secondary">
                Active Projects
              </span>
              <span className="text-verse-xs font-verse-medium text-verse-accent-green">
                12
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-verse-xs text-verse-text-secondary">
                Total Views
              </span>
              <span className="text-verse-xs font-verse-medium text-verse-accent-blue">
                1.2K
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-verse-xs text-verse-text-secondary">
                Avg. Price
              </span>
              <span className="text-verse-xs font-verse-medium text-verse-accent-orange">
                1.5M SAR
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button for Quick Contact */}
      <button
        className="
        absolute right-6 top-1/2 transform -translate-y-1/2 z-20
        w-14 h-14
        bg-gradient-to-r from-verse-accent-green to-verse-accent-blue
        text-white
        rounded-full
        shadow-verse-lg
        hover:shadow-verse-glow hover:scale-110
        transition-all duration-verse
        flex items-center justify-center
        text-verse-lg
        animate-float
      "
      >
        💬
      </button>

      {/* Theme indicator for URL compatibility */}
      <div
        className="hidden"
        data-theme="light"
        data-lang={currentLang}
        data-state={currentRegion}
      ></div>
    </div>
  );
};

export default Index;
