import React, { useState, useRef, useCallback, useEffect } from "react";
import { useProjectStore } from "../../store/projectStore";
import AdminLayout from "../../components/admin/AdminLayout";

interface MarkerPosition {
  id: number;
  name: string;
  x: number;
  y: number;
  isDragging?: boolean;
}

const MapSettings: React.FC = () => {
  const {
    mapSettings,
    updateMapSettings,
    projects,
    updateProject,
    logActivity,
  } = useProjectStore();

  // Provide safe fallbacks for settings
  const safeMapSettings = mapSettings || {
    id: 1,
    backgroundImage:
      "https://saraya-al-fursan.darwaemaar.com/images/map/riyadh/map.jpg",
    theme: "dark",
    defaultZoom: 12,
    centerLat: 24.7136,
    centerLng: 46.6753,
    brightness: 0.8,
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
    centerCoordinates: {
      lat: 24.7136,
      lng: 46.6753,
    },
  };

  const [settings, setSettings] = useState(safeMapSettings);
  const safeProjects = projects || [];
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<number | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [gridSize, setGridSize] = useState(10);
  const [snapToGrid, setSnapToGrid] = useState(false);
  const [isEditMode, setIsEditMode] = useState(true);
  const [copiedPosition, setCopiedPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [positionHistory, setPositionHistory] = useState<MarkerPosition[][]>(
    [],
  );
  const [historyIndex, setHistoryIndex] = useState(-1);
  const mapRef = useRef<HTMLDivElement>(null);

  const [markerPositions, setMarkerPositions] = useState<MarkerPosition[]>(
    safeProjects.map((p) => ({
      id: p.id,
      name: p.name,
      x: p.x || 0,
      y: p.y || 0,
    })),
  );

  // Sync settings when mapSettings changes
  useEffect(() => {
    if (mapSettings) {
      setSettings(mapSettings);
    }
  }, [mapSettings]);

  // Sync marker positions with store projects when they change
  useEffect(() => {
    const newPositions = safeProjects.map((p) => ({
      id: p.id,
      name: p.name || "Unknown Project",
      x: p.x || 0,
      y: p.y || 0,
    }));
    setMarkerPositions(newPositions);
  }, [safeProjects]);

  const predefinedMaps = [
    {
      name: "Saraya Al Fursan",
      url: "https://saraya-al-fursan.darwaemaar.com/images/map/riyadh/map.jpg",
      description: "Detailed Riyadh development map with districts",
      preset: "riyadh",
    },
    {
      name: "Riyadh Satellite",
      url: "https://images.pexels.com/photos/14769891/pexels-photo-14769891.jpeg",
      description: "High-resolution satellite view of Riyadh",
      preset: "riyadh",
    },
    {
      name: "Dubai Aerial",
      url: "https://images.pexels.com/photos/10619954/pexels-photo-10619954.jpeg",
      description: "Modern aerial view of Dubai cityscape",
      preset: "dubai",
    },
    {
      name: "Urban Development",
      url: "https://images.pexels.com/photos/14769891/pexels-photo-14769891.jpeg",
      description: "Urban development and construction areas",
      preset: "urban",
    },
  ];

  const positionPresets = {
    riyadh: [
      { name: "King Fahd District", x: 35, y: 25 },
      { name: "Al Olaya", x: 45, y: 35 },
      { name: "Al Malqa", x: 25, y: 30 },
      { name: "Al Narjis", x: 60, y: 40 },
      { name: "Exit 5", x: 70, y: 50 },
    ],
    dubai: [
      { name: "Downtown Dubai", x: 50, y: 45 },
      { name: "Dubai Marina", x: 30, y: 55 },
      { name: "Jumeirah", x: 40, y: 60 },
      { name: "Business Bay", x: 48, y: 42 },
      { name: "DIFC", x: 46, y: 47 },
    ],
  };

  const saveToHistory = (positions: MarkerPosition[]) => {
    const newHistory = positionHistory.slice(0, historyIndex + 1);
    newHistory.push([...positions]);
    setPositionHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const snapCoordinate = (coord: number) => {
    if (!snapToGrid) return coord;
    return Math.round(coord / gridSize) * gridSize;
  };

  const handleMapClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isEditMode || !mapRef.current) return;

      const rect = mapRef.current.getBoundingClientRect();
      const x = snapCoordinate(((e.clientX - rect.left) / rect.width) * 100);
      const y = snapCoordinate(((e.clientY - rect.top) / rect.height) * 100);

      if (selectedMarker && selectedMarker > 0) {
        const newPositions = markerPositions.map((marker) =>
          marker.id === selectedMarker ? { ...marker, x, y } : marker,
        );
        saveToHistory(markerPositions);
        setMarkerPositions(newPositions);
      }
    },
    [isEditMode, selectedMarker, markerPositions, snapToGrid, gridSize],
  );

  const handleMarkerDrag = useCallback(
    (markerId: number, deltaX: number, deltaY: number) => {
      const marker = markerPositions.find((m) => m.id === markerId);
      if (!marker || !mapRef.current) return;

      const rect = mapRef.current.getBoundingClientRect();
      const percentDeltaX = (deltaX / rect.width) * 100;
      const percentDeltaY = (deltaY / rect.height) * 100;

      const newX = Math.max(
        0,
        Math.min(100, snapCoordinate(marker.x + percentDeltaX)),
      );
      const newY = Math.max(
        0,
        Math.min(100, snapCoordinate(marker.y + percentDeltaY)),
      );

      const newPositions = markerPositions.map((m) =>
        m.id === markerId ? { ...m, x: newX, y: newY } : m,
      );
      setMarkerPositions(newPositions);
    },
    [markerPositions, snapToGrid, gridSize],
  );

  const handleMarkerDragEnd = useCallback(
    (markerId: number) => {
      saveToHistory(markerPositions.filter((m) => m.id !== markerId));
    },
    [markerPositions],
  );

  const updateMarkerPosition = (markerId: number, x: number, y: number) => {
    const newPositions = markerPositions.map((marker) =>
      marker.id === markerId ? { ...marker, x, y } : marker,
    );
    saveToHistory(markerPositions);
    setMarkerPositions(newPositions);
  };

  const copyPosition = (markerId: number) => {
    const marker = markerPositions.find((m) => m.id === markerId);
    if (marker) {
      setCopiedPosition({ x: marker.x, y: marker.y });
    }
  };

  const pastePosition = (markerId: number) => {
    if (copiedPosition) {
      updateMarkerPosition(markerId, copiedPosition.x, copiedPosition.y);
    }
  };

  const applyPreset = (preset: string, index: number) => {
    const presetData = positionPresets[preset as keyof typeof positionPresets];
    if (presetData && presetData[index]) {
      const { x, y } = presetData[index];
      if (selectedMarker) {
        updateMarkerPosition(selectedMarker, x, y);
      }
    }
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setMarkerPositions([...positionHistory[historyIndex - 1]]);
    }
  };

  const redo = () => {
    if (historyIndex < positionHistory.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setMarkerPositions([...positionHistory[historyIndex + 1]]);
    }
  };

  const resetPositions = () => {
    const originalPositions = safeProjects.map((p) => ({
      id: p.id,
      name: p.name || "Unknown Project",
      x: p.x || 0,
      y: p.y || 0,
    }));
    saveToHistory(markerPositions);
    setMarkerPositions(originalPositions);
  };

  const randomizePositions = () => {
    const newPositions = markerPositions.map((marker) => ({
      ...marker,
      x: Math.floor(Math.random() * 100),
      y: Math.floor(Math.random() * 100),
    }));
    saveToHistory(markerPositions);
    setMarkerPositions(newPositions);
  };

  // Fixed Save All functionality
  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      // Update map settings
      updateMapSettings(settings);

      // Update all project positions in the store
      const promises = markerPositions.map((marker) => {
        return new Promise<void>((resolve) => {
          updateProject(marker.id, { x: marker.x, y: marker.y });
          resolve();
        });
      });

      await Promise.all(promises);

      // Log the activity
      logActivity(
        `Map settings updated with ${markerPositions.length} marker positions`,
        "Admin User",
      );

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving map settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const exportPositions = () => {
    const data = {
      mapSettings: settings,
      markerPositions,
      timestamp: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "map-positions.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const DraggableMarker: React.FC<{ marker: MarkerPosition }> = ({
    marker,
  }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const handleMouseDown = (e: React.MouseEvent) => {
      if (!isEditMode) return;
      e.stopPropagation();
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      setSelectedMarker(marker.id);
    };

    const handleMouseMove = useCallback(
      (e: MouseEvent) => {
        if (!isDragging) return;
        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;
        handleMarkerDrag(marker.id, deltaX, deltaY);
        setDragStart({ x: e.clientX, y: e.clientY });
      },
      [isDragging, dragStart, marker.id],
    );

    const handleMouseUp = useCallback(() => {
      if (isDragging) {
        setIsDragging(false);
        handleMarkerDragEnd(marker.id);
      }
    }, [isDragging, marker.id]);

    React.useEffect(() => {
      if (isDragging) {
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        return () => {
          document.removeEventListener("mousemove", handleMouseMove);
          document.removeEventListener("mouseup", handleMouseUp);
        };
      }
    }, [isDragging, handleMouseMove, handleMouseUp]);

    const isSelected = selectedMarker === marker.id;

    return (
      <div
        className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-move group"
        style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
        onMouseDown={handleMouseDown}
      >
        <div
          className={`
            w-6 h-6 rounded-full border-2 border-white shadow-verse
            transition-all duration-verse
            ${
              isSelected
                ? "bg-verse-accent-red scale-125 shadow-verse-glow"
                : "bg-verse-accent-blue hover:scale-110"
            }
            ${isDragging ? "scale-125 shadow-verse-lg" : ""}
          `}
        >
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
            <div className="bg-verse-glass-bg backdrop-blur-verse border border-verse-glass-border rounded-verse-sm px-2 py-1 text-verse-xs text-verse-text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              {marker.name}
              <div className="text-verse-text-secondary">
                ({marker.x.toFixed(1)}, {marker.y.toFixed(1)})
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Enhanced Header with Save Status */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-verse-3xl font-verse-bold text-verse-text-primary">
              🗺️ Advanced Map Settings
            </h1>
            <p className="text-verse-lg text-verse-text-secondary mt-2">
              Configure map appearance and precisely position project markers
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={undo}
              disabled={historyIndex <= 0}
              className="px-4 py-2 bg-verse-glass-bg border border-verse-glass-border rounded-verse text-verse-text-primary hover:bg-verse-glass-hover transition-colors disabled:opacity-50"
            >
              ↶ Undo
            </button>
            <button
              onClick={redo}
              disabled={historyIndex >= positionHistory.length - 1}
              className="px-4 py-2 bg-verse-glass-bg border border-verse-glass-border rounded-verse text-verse-text-primary hover:bg-verse-glass-hover transition-colors disabled:opacity-50"
            >
              ↷ Redo
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`
                px-6 py-2 rounded-verse transition-all font-verse-medium
                flex items-center space-x-2
                ${
                  saveSuccess
                    ? "bg-verse-accent-green text-white"
                    : "bg-gradient-to-r from-verse-accent-blue to-verse-accent-purple text-white hover:shadow-verse-purple-glow"
                }
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : saveSuccess ? (
                <>
                  <span>✅</span>
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <span>💾</span>
                  <span>Save All Changes</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Save Status Banner */}
        {saveSuccess && (
          <div className="bg-verse-accent-green/20 border border-verse-accent-green/30 rounded-verse p-4 animate-slide-down">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-verse-accent-green rounded-full flex items-center justify-center text-white text-sm">
                ✓
              </div>
              <div>
                <div className="text-verse-accent-green font-verse-semibold">
                  Changes Saved Successfully!
                </div>
                <div className="text-verse-accent-green/80 text-verse-sm">
                  Map settings and all marker positions have been updated.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Interactive Map Preview with Enhanced Controls */}
        <div className="bg-verse-glass-bg backdrop-blur-verse border border-verse-glass-border rounded-verse-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-verse-xl font-verse-semibold text-verse-text-primary">
              🎯 Interactive Map Editor
            </h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="editMode"
                  checked={isEditMode}
                  onChange={(e) => setIsEditMode(e.target.checked)}
                  className="w-4 h-4"
                />
                <label
                  htmlFor="editMode"
                  className="text-verse-sm text-verse-text-primary"
                >
                  Edit Mode
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="showGrid"
                  checked={showGrid}
                  onChange={(e) => setShowGrid(e.target.checked)}
                  className="w-4 h-4"
                />
                <label
                  htmlFor="showGrid"
                  className="text-verse-sm text-verse-text-primary"
                >
                  Show Grid
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="snapToGrid"
                  checked={snapToGrid}
                  onChange={(e) => setSnapToGrid(e.target.checked)}
                  className="w-4 h-4"
                />
                <label
                  htmlFor="snapToGrid"
                  className="text-verse-sm text-verse-text-primary"
                >
                  Snap to Grid
                </label>
              </div>
              <select
                value={gridSize}
                onChange={(e) => setGridSize(Number(e.target.value))}
                className="px-3 py-1 bg-verse-glass-hover border border-verse-glass-border rounded-verse text-verse-text-primary text-verse-sm"
              >
                <option value={5}>5% Grid</option>
                <option value={10}>10% Grid</option>
                <option value={20}>20% Grid</option>
                <option value={25}>25% Grid</option>
              </select>
            </div>
          </div>

          <div className="relative aspect-video w-full bg-verse-accent-bg rounded-verse overflow-hidden">
            <div
              ref={mapRef}
              className="absolute inset-0 cursor-crosshair"
              onClick={handleMapClick}
              style={{
                backgroundImage: `url(${settings.backgroundImage || safeMapSettings.backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: "brightness(0.8) contrast(1.1)",
              }}
            >
              {/* Grid Overlay */}
              {showGrid && (
                <div className="absolute inset-0 pointer-events-none">
                  <svg width="100%" height="100%" className="opacity-30">
                    <defs>
                      <pattern
                        id="grid"
                        width={`${gridSize}%`}
                        height={`${gridSize}%`}
                        patternUnits="userSpaceOnUse"
                      >
                        <path
                          d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
                          fill="none"
                          stroke="rgba(255, 255, 255, 0.5)"
                          strokeWidth="1"
                        />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>
                </div>
              )}

              {/* Coordinate Display */}
              <div className="absolute top-4 left-4 bg-verse-glass-bg backdrop-blur-verse border border-verse-glass-border rounded-verse px-3 py-2 text-verse-xs text-verse-text-primary">
                Click to position markers • Drag to move • Grid: {gridSize}% •
                {markerPositions.length} markers loaded
              </div>

              {/* Markers */}
              {markerPositions.map((marker) => (
                <DraggableMarker key={marker.id} marker={marker} />
              ))}
            </div>
          </div>

          {selectedMarker && (
            <div className="mt-4 p-4 bg-verse-glass-hover rounded-verse border border-verse-glass-border">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-verse-sm font-verse-semibold text-verse-text-primary">
                  Selected:{" "}
                  {markerPositions.find((m) => m.id === selectedMarker)?.name}
                </h4>
                <div className="flex space-x-2">
                  <button
                    onClick={() => copyPosition(selectedMarker)}
                    className="px-3 py-1 bg-verse-accent-blue/20 text-verse-accent-blue border border-verse-accent-blue/30 rounded-verse text-verse-xs hover:bg-verse-accent-blue/30 transition-colors"
                  >
                    📋 Copy
                  </button>
                  <button
                    onClick={() => pastePosition(selectedMarker)}
                    disabled={!copiedPosition}
                    className="px-3 py-1 bg-verse-accent-green/20 text-verse-accent-green border border-verse-accent-green/30 rounded-verse text-verse-xs hover:bg-verse-accent-green/30 transition-colors disabled:opacity-50"
                  >
                    📌 Paste
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-verse-xs text-verse-text-secondary mb-1">
                    X Position (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={
                      markerPositions.find((m) => m.id === selectedMarker)?.x ||
                      0
                    }
                    onChange={(e) =>
                      updateMarkerPosition(
                        selectedMarker,
                        Number(e.target.value),
                        markerPositions.find((m) => m.id === selectedMarker)
                          ?.y || 0,
                      )
                    }
                    className="w-full px-3 py-2 bg-verse-glass-bg border border-verse-glass-border rounded-verse text-verse-text-primary text-verse-sm"
                  />
                </div>
                <div>
                  <label className="block text-verse-xs text-verse-text-secondary mb-1">
                    Y Position (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={
                      markerPositions.find((m) => m.id === selectedMarker)?.y ||
                      0
                    }
                    onChange={(e) =>
                      updateMarkerPosition(
                        selectedMarker,
                        markerPositions.find((m) => m.id === selectedMarker)
                          ?.x || 0,
                        Number(e.target.value),
                      )
                    }
                    className="w-full px-3 py-2 bg-verse-glass-bg border border-verse-glass-border rounded-verse text-verse-text-primary text-verse-sm"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Rest of the component remains the same... */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Enhanced Settings Form */}
          <div className="bg-verse-glass-bg backdrop-blur-verse border border-verse-glass-border rounded-verse-lg p-6">
            <h3 className="text-verse-xl font-verse-semibold text-verse-text-primary mb-6">
              ⚙️ Map Configuration
            </h3>

            <div className="space-y-6">
              <div>
                <label className="block text-verse-sm font-verse-medium text-verse-text-primary mb-2">
                  Background Image URL
                </label>
                <input
                  type="url"
                  value={settings.backgroundImage || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      backgroundImage: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 bg-verse-glass-hover border border-verse-glass-border rounded-verse text-verse-text-primary focus:outline-none focus:ring-2 focus:ring-verse-accent-blue/50"
                />
              </div>

              <div>
                <label className="block text-verse-sm font-verse-medium text-verse-text-primary mb-2">
                  Theme
                </label>
                <select
                  value={settings.theme || "dark"}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      theme: e.target.value as "light" | "dark",
                    })
                  }
                  className="w-full px-4 py-2 bg-verse-glass-hover border border-verse-glass-border rounded-verse text-verse-text-primary focus:outline-none focus:ring-2 focus:ring-verse-accent-blue/50"
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                </select>
              </div>

              <div>
                <label className="block text-verse-sm font-verse-medium text-verse-text-primary mb-2">
                  Default Zoom Level
                </label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={settings.defaultZoom || 12}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      defaultZoom: Number(e.target.value),
                    })
                  }
                  className="w-full"
                />
                <div className="text-verse-sm text-verse-text-secondary mt-1">
                  Zoom Level: {settings.defaultZoom || 12}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-verse-sm font-verse-medium text-verse-text-primary mb-2">
                    Center Latitude
                  </label>
                  <input
                    type="number"
                    step="0.000001"
                    value={
                      settings.centerCoordinates?.lat ||
                      settings.centerLat ||
                      24.7136
                    }
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        centerCoordinates: {
                          ...settings.centerCoordinates,
                          lat: Number(e.target.value),
                        },
                        centerLat: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 bg-verse-glass-hover border border-verse-glass-border rounded-verse text-verse-text-primary focus:outline-none focus:ring-2 focus:ring-verse-accent-blue/50"
                  />
                </div>
                <div>
                  <label className="block text-verse-sm font-verse-medium text-verse-text-primary mb-2">
                    Center Longitude
                  </label>
                  <input
                    type="number"
                    step="0.000001"
                    value={
                      settings.centerCoordinates?.lng ||
                      settings.centerLng ||
                      46.6753
                    }
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        centerCoordinates: {
                          ...settings.centerCoordinates,
                          lng: Number(e.target.value),
                        },
                        centerLng: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 bg-verse-glass-hover border border-verse-glass-border rounded-verse text-verse-text-primary focus:outline-none focus:ring-2 focus:ring-verse-accent-blue/50"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Position Management Panel */}
          <div className="bg-verse-glass-bg backdrop-blur-verse border border-verse-glass-border rounded-verse-lg p-6">
            <h3 className="text-verse-xl font-verse-semibold text-verse-text-primary mb-6">
              📍 Position Management
            </h3>

            <div className="space-y-4">
              {/* Bulk Actions */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={resetPositions}
                  className="px-3 py-2 bg-verse-accent-orange/20 text-verse-accent-orange border border-verse-accent-orange/30 rounded-verse text-verse-sm hover:bg-verse-accent-orange/30 transition-colors"
                >
                  🔄 Reset All
                </button>
                <button
                  onClick={randomizePositions}
                  className="px-3 py-2 bg-verse-accent-purple/20 text-verse-accent-purple border border-verse-accent-purple/30 rounded-verse text-verse-sm hover:bg-verse-accent-purple/30 transition-colors"
                >
                  🎲 Randomize
                </button>
                <button
                  onClick={exportPositions}
                  className="px-3 py-2 bg-verse-accent-green/20 text-verse-accent-green border border-verse-accent-green/30 rounded-verse text-verse-sm hover:bg-verse-accent-green/30 transition-colors"
                >
                  📥 Export
                </button>
              </div>

              {/* All Markers List */}
              <div>
                <h4 className="text-verse-sm font-verse-semibold text-verse-text-primary mb-3">
                  🎯 All Markers ({markerPositions.length})
                </h4>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {markerPositions.map((marker) => (
                    <div
                      key={marker.id}
                      className={`p-3 rounded-verse border cursor-pointer transition-colors ${
                        selectedMarker === marker.id
                          ? "bg-verse-accent-blue/20 border-verse-accent-blue/50"
                          : "bg-verse-glass-hover border-verse-glass-border hover:bg-verse-glass-border"
                      }`}
                      onClick={() => setSelectedMarker(marker.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-verse-sm font-verse-medium text-verse-text-primary">
                            {marker.name}
                          </div>
                          <div className="text-verse-xs text-verse-text-secondary">
                            Position: ({marker.x.toFixed(1)}%,{" "}
                            {marker.y.toFixed(1)}%)
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyPosition(marker.id);
                            }}
                            className="w-6 h-6 bg-verse-accent-blue/20 text-verse-accent-blue rounded-verse-sm text-verse-xs hover:bg-verse-accent-blue/30 transition-colors"
                          >
                            📋
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              pastePosition(marker.id);
                            }}
                            disabled={!copiedPosition}
                            className="w-6 h-6 bg-verse-accent-green/20 text-verse-accent-green rounded-verse-sm text-verse-xs hover:bg-verse-accent-green/30 transition-colors disabled:opacity-50"
                          >
                            📌
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default MapSettings;
