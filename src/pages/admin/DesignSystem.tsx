import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";

interface ThemeSettings {
  // Colors
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  // Typography
  typography: {
    fontFamily: string;
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      "2xl": string;
      "3xl": string;
    };
    fontWeight: {
      light: number;
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
    };
    lineHeight: {
      tight: number;
      normal: number;
      relaxed: number;
    };
  };
  // Spacing
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    "2xl": string;
  };
  // Border Radius
  borderRadius: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  // Shadows
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  // Animations
  animations: {
    duration: {
      fast: string;
      normal: string;
      slow: string;
    };
    easing: {
      linear: string;
      easeIn: string;
      easeOut: string;
      easeInOut: string;
    };
  };
  // Components
  components: {
    button: {
      borderRadius: string;
      padding: string;
      fontSize: string;
      fontWeight: number;
      transition: string;
    };
    card: {
      backgroundColor: string;
      borderRadius: string;
      padding: string;
      shadow: string;
      border: string;
    };
    input: {
      borderRadius: string;
      padding: string;
      fontSize: string;
      border: string;
      backgroundColor: string;
    };
  };
}

const DesignSystem: React.FC = () => {
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>({
    colors: {
      primary: "#3b82f6",
      secondary: "#8b5cf6",
      accent: "#10b981",
      background: "#0a0a0a",
      surface: "rgba(255, 255, 255, 0.1)",
      text: "#ffffff",
      textSecondary: "#a0a0a0",
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
      info: "#3b82f6",
    },
    typography: {
      fontFamily: "Inter, system-ui, sans-serif",
      fontSize: {
        xs: "11px",
        sm: "13px",
        base: "15px",
        lg: "17px",
        xl: "20px",
        "2xl": "24px",
        "3xl": "32px",
      },
      fontWeight: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },
      lineHeight: {
        tight: 1.2,
        normal: 1.5,
        relaxed: 1.8,
      },
    },
    spacing: {
      xs: "4px",
      sm: "8px",
      md: "16px",
      lg: "24px",
      xl: "32px",
      "2xl": "48px",
    },
    borderRadius: {
      none: "0px",
      sm: "4px",
      md: "8px",
      lg: "12px",
      xl: "16px",
      full: "9999px",
    },
    shadows: {
      sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
      md: "0 4px 6px rgba(0, 0, 0, 0.1)",
      lg: "0 10px 15px rgba(0, 0, 0, 0.1)",
      xl: "0 20px 25px rgba(0, 0, 0, 0.15)",
    },
    animations: {
      duration: {
        fast: "0.15s",
        normal: "0.3s",
        slow: "0.5s",
      },
      easing: {
        linear: "linear",
        easeIn: "ease-in",
        easeOut: "ease-out",
        easeInOut: "ease-in-out",
      },
    },
    components: {
      button: {
        borderRadius: "12px",
        padding: "12px 24px",
        fontSize: "14px",
        fontWeight: 500,
        transition: "all 0.2s ease",
      },
      card: {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderRadius: "16px",
        padding: "24px",
        shadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
      },
      input: {
        borderRadius: "8px",
        padding: "12px 16px",
        fontSize: "14px",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        backgroundColor: "rgba(255, 255, 255, 0.05)",
      },
    },
  });

  const [activeTab, setActiveTab] = useState("colors");
  const [previewMode, setPreviewMode] = useState("buttons");
  const [isApplying, setIsApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);

  // Generate CSS variables from theme settings
  const generateCSSVariables = () => {
    const cssVars: Record<string, string> = {};

    // Colors
    Object.entries(themeSettings.colors).forEach(([key, value]) => {
      cssVars[`--color-${key}`] = value;
    });

    // Typography
    cssVars["--font-family"] = themeSettings.typography.fontFamily;
    Object.entries(themeSettings.typography.fontSize).forEach(
      ([key, value]) => {
        cssVars[`--font-size-${key}`] = value;
      },
    );

    // Spacing
    Object.entries(themeSettings.spacing).forEach(([key, value]) => {
      cssVars[`--spacing-${key}`] = value;
    });

    // Border Radius
    Object.entries(themeSettings.borderRadius).forEach(([key, value]) => {
      cssVars[`--radius-${key}`] = value;
    });

    return cssVars;
  };

  // Apply theme to document
  const applyTheme = async () => {
    setIsApplying(true);
    setApplySuccess(false);

    try {
      const cssVars = generateCSSVariables();

      Object.entries(cssVars).forEach(([property, value]) => {
        document.documentElement.style.setProperty(property, value);
      });

      // Save to localStorage
      localStorage.setItem("verse-theme", JSON.stringify(themeSettings));

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setApplySuccess(true);
      setTimeout(() => setApplySuccess(false), 3000);
    } catch (error) {
      console.error("Error applying theme:", error);
    } finally {
      setIsApplying(false);
    }
  };

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("verse-theme");
    if (savedTheme) {
      try {
        setThemeSettings(JSON.parse(savedTheme));
      } catch (error) {
        console.error("Error loading saved theme:", error);
      }
    }
  }, []);

  const tabs = [
    { id: "colors", label: "🎨 Colors", icon: "🎨" },
    { id: "typography", label: "📝 Typography", icon: "📝" },
    { id: "spacing", label: "📏 Spacing", icon: "📏" },
    { id: "borders", label: "🔲 Borders", icon: "🔲" },
    { id: "shadows", label: "🌟 Shadows", icon: "🌟" },
    { id: "animations", label: "⚡ Animations", icon: "⚡" },
    { id: "components", label: "🧩 Components", icon: "🧩" },
  ];

  const previewModes = [
    { id: "buttons", label: "Buttons" },
    { id: "cards", label: "Cards" },
    { id: "forms", label: "Forms" },
    { id: "navigation", label: "Navigation" },
    { id: "typography", label: "Typography" },
  ];

  const colorPresets = [
    {
      name: "Blue Ocean",
      colors: {
        primary: "#0ea5e9",
        secondary: "#3b82f6",
        accent: "#06b6d4",
        background: "#0c1926",
        surface: "rgba(14, 165, 233, 0.1)",
      },
    },
    {
      name: "Purple Galaxy",
      colors: {
        primary: "#8b5cf6",
        secondary: "#a855f7",
        accent: "#ec4899",
        background: "#1e1b4b",
        surface: "rgba(139, 92, 246, 0.1)",
      },
    },
    {
      name: "Green Forest",
      colors: {
        primary: "#10b981",
        secondary: "#059669",
        accent: "#34d399",
        background: "#064e3b",
        surface: "rgba(16, 185, 129, 0.1)",
      },
    },
    {
      name: "Orange Sunset",
      colors: {
        primary: "#f59e0b",
        secondary: "#d97706",
        accent: "#fbbf24",
        background: "#451a03",
        surface: "rgba(245, 158, 11, 0.1)",
      },
    },
    {
      name: "Dark Minimal",
      colors: {
        primary: "#ffffff",
        secondary: "#6b7280",
        accent: "#f3f4f6",
        background: "#111827",
        surface: "rgba(255, 255, 255, 0.05)",
      },
    },
  ];

  const updateTheme = (section: string, key: string, value: any) => {
    setThemeSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof ThemeSettings],
        [key]: value,
      },
    }));
  };

  const updateNestedTheme = (
    section: string,
    subsection: string,
    key: string,
    value: any,
  ) => {
    setThemeSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof ThemeSettings],
        [subsection]: {
          ...(prev[section as keyof ThemeSettings] as any)[subsection],
          [key]: value,
        },
      },
    }));
  };

  const renderColorControls = () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-verse-lg font-verse-semibold text-verse-text-primary mb-4">
          Color Palette
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(themeSettings.colors).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <label className="block text-verse-sm font-verse-medium text-verse-text-primary capitalize">
                {key.replace(/([A-Z])/g, " $1").trim()}
              </label>
              <div className="flex space-x-2">
                <input
                  type="color"
                  value={value}
                  onChange={(e) => updateTheme("colors", key, e.target.value)}
                  className="w-12 h-10 rounded-verse border border-verse-glass-border"
                />
                <input
                  type="text"
                  value={value}
                  onChange={(e) => updateTheme("colors", key, e.target.value)}
                  className="flex-1 px-3 py-2 bg-verse-glass-hover border border-verse-glass-border rounded-verse text-verse-text-primary text-verse-sm"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-verse-lg font-verse-semibold text-verse-text-primary mb-4">
          Color Presets
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {colorPresets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => {
                setThemeSettings((prev) => ({
                  ...prev,
                  colors: { ...prev.colors, ...preset.colors },
                }));
              }}
              className="p-4 bg-verse-glass-hover border border-verse-glass-border rounded-verse hover:bg-verse-glass-border transition-colors text-left"
            >
              <div className="flex items-center space-x-3 mb-2">
                <div className="flex space-x-1">
                  {Object.values(preset.colors)
                    .slice(0, 3)
                    .map((color, i) => (
                      <div
                        key={i}
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                </div>
                <span className="text-verse-sm font-verse-medium text-verse-text-primary">
                  {preset.name}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTypographyControls = () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-verse-lg font-verse-semibold text-verse-text-primary mb-4">
          Font Family
        </h4>
        <select
          value={themeSettings.typography.fontFamily}
          onChange={(e) =>
            updateTheme("typography", "fontFamily", e.target.value)
          }
          className="w-full px-4 py-2 bg-verse-glass-hover border border-verse-glass-border rounded-verse text-verse-text-primary"
        >
          <option value="Inter, system-ui, sans-serif">Inter</option>
          <option value="Roboto, system-ui, sans-serif">Roboto</option>
          <option value="Poppins, system-ui, sans-serif">Poppins</option>
          <option value="Montserrat, system-ui, sans-serif">Montserrat</option>
          <option value="Open Sans, system-ui, sans-serif">Open Sans</option>
          <option value="Lato, system-ui, sans-serif">Lato</option>
          <option value="Playfair Display, serif">Playfair Display</option>
          <option value="Source Code Pro, monospace">Source Code Pro</option>
        </select>
      </div>

      <div>
        <h4 className="text-verse-lg font-verse-semibold text-verse-text-primary mb-4">
          Font Sizes
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(themeSettings.typography.fontSize).map(
            ([key, value]) => (
              <div key={key} className="space-y-2">
                <label className="block text-verse-sm font-verse-medium text-verse-text-primary">
                  {key.toUpperCase()}
                </label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) =>
                    updateNestedTheme(
                      "typography",
                      "fontSize",
                      key,
                      e.target.value,
                    )
                  }
                  className="w-full px-3 py-2 bg-verse-glass-hover border border-verse-glass-border rounded-verse text-verse-text-primary text-verse-sm"
                />
              </div>
            ),
          )}
        </div>
      </div>

      <div>
        <h4 className="text-verse-lg font-verse-semibold text-verse-text-primary mb-4">
          Font Weights
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(themeSettings.typography.fontWeight).map(
            ([key, value]) => (
              <div key={key} className="space-y-2">
                <label className="block text-verse-sm font-verse-medium text-verse-text-primary capitalize">
                  {key}
                </label>
                <input
                  type="range"
                  min="100"
                  max="900"
                  step="100"
                  value={value}
                  onChange={(e) =>
                    updateNestedTheme(
                      "typography",
                      "fontWeight",
                      key,
                      Number(e.target.value),
                    )
                  }
                  className="w-full"
                />
                <div className="text-verse-xs text-verse-text-secondary">
                  {value}
                </div>
              </div>
            ),
          )}
        </div>
      </div>

      <div>
        <h4 className="text-verse-lg font-verse-semibold text-verse-text-primary mb-4">
          Line Heights
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(themeSettings.typography.lineHeight).map(
            ([key, value]) => (
              <div key={key} className="space-y-2">
                <label className="block text-verse-sm font-verse-medium text-verse-text-primary capitalize">
                  {key}
                </label>
                <input
                  type="number"
                  min="1"
                  max="3"
                  step="0.1"
                  value={value}
                  onChange={(e) =>
                    updateNestedTheme(
                      "typography",
                      "lineHeight",
                      key,
                      Number(e.target.value),
                    )
                  }
                  className="w-full px-3 py-2 bg-verse-glass-hover border border-verse-glass-border rounded-verse text-verse-text-primary text-verse-sm"
                />
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );

  const renderSpacingControls = () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-verse-lg font-verse-semibold text-verse-text-primary mb-4">
          Spacing Scale
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(themeSettings.spacing).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <label className="block text-verse-sm font-verse-medium text-verse-text-primary">
                {key.toUpperCase()}
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={value}
                  onChange={(e) => updateTheme("spacing", key, e.target.value)}
                  className="flex-1 px-3 py-2 bg-verse-glass-hover border border-verse-glass-border rounded-verse text-verse-text-primary text-verse-sm"
                />
                <div
                  className="w-8 h-8 bg-verse-accent-blue rounded-verse-sm"
                  style={{ width: value, height: value }}
                  title={`Visual representation: ${value}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBorderControls = () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-verse-lg font-verse-semibold text-verse-text-primary mb-4">
          Border Radius Scale
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(themeSettings.borderRadius).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <label className="block text-verse-sm font-verse-medium text-verse-text-primary">
                {key.toUpperCase()}
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={value}
                  onChange={(e) =>
                    updateTheme("borderRadius", key, e.target.value)
                  }
                  className="flex-1 px-3 py-2 bg-verse-glass-hover border border-verse-glass-border rounded-verse text-verse-text-primary text-verse-sm"
                />
                <div
                  className="w-8 h-8 bg-verse-accent-blue"
                  style={{ borderRadius: value }}
                  title={`Visual representation: ${value}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderShadowControls = () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-verse-lg font-verse-semibold text-verse-text-primary mb-4">
          Shadow Presets
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(themeSettings.shadows).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <label className="block text-verse-sm font-verse-medium text-verse-text-primary">
                {key.toUpperCase()}
              </label>
              <div className="space-y-2">
                <input
                  type="text"
                  value={value}
                  onChange={(e) => updateTheme("shadows", key, e.target.value)}
                  className="w-full px-3 py-2 bg-verse-glass-hover border border-verse-glass-border rounded-verse text-verse-text-primary text-verse-sm"
                />
                <div
                  className="w-full h-12 bg-verse-glass-bg rounded-verse"
                  style={{ boxShadow: value }}
                  title={`Shadow preview: ${value}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAnimationControls = () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-verse-lg font-verse-semibold text-verse-text-primary mb-4">
          Animation Durations
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(themeSettings.animations.duration).map(
            ([key, value]) => (
              <div key={key} className="space-y-2">
                <label className="block text-verse-sm font-verse-medium text-verse-text-primary capitalize">
                  {key}
                </label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) =>
                    updateNestedTheme(
                      "animations",
                      "duration",
                      key,
                      e.target.value,
                    )
                  }
                  className="w-full px-3 py-2 bg-verse-glass-hover border border-verse-glass-border rounded-verse text-verse-text-primary text-verse-sm"
                />
              </div>
            ),
          )}
        </div>
      </div>

      <div>
        <h4 className="text-verse-lg font-verse-semibold text-verse-text-primary mb-4">
          Animation Easing
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(themeSettings.animations.easing).map(
            ([key, value]) => (
              <div key={key} className="space-y-2">
                <label className="block text-verse-sm font-verse-medium text-verse-text-primary capitalize">
                  {key.replace(/([A-Z])/g, " $1")}
                </label>
                <select
                  value={value}
                  onChange={(e) =>
                    updateNestedTheme(
                      "animations",
                      "easing",
                      key,
                      e.target.value,
                    )
                  }
                  className="w-full px-3 py-2 bg-verse-glass-hover border border-verse-glass-border rounded-verse text-verse-text-primary text-verse-sm"
                >
                  <option value="linear">Linear</option>
                  <option value="ease">Ease</option>
                  <option value="ease-in">Ease In</option>
                  <option value="ease-out">Ease Out</option>
                  <option value="ease-in-out">Ease In Out</option>
                  <option value="cubic-bezier(0.4, 0, 0.2, 1)">
                    Custom Cubic
                  </option>
                </select>
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );

  const renderComponentControls = () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-verse-lg font-verse-semibold text-verse-text-primary mb-4">
          Button Component
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(themeSettings.components.button).map(
            ([key, value]) => (
              <div key={key} className="space-y-2">
                <label className="block text-verse-sm font-verse-medium text-verse-text-primary capitalize">
                  {key.replace(/([A-Z])/g, " $1")}
                </label>
                <input
                  type={key === "fontWeight" ? "number" : "text"}
                  value={value}
                  onChange={(e) =>
                    updateNestedTheme(
                      "components",
                      "button",
                      key,
                      key === "fontWeight"
                        ? Number(e.target.value)
                        : e.target.value,
                    )
                  }
                  className="w-full px-3 py-2 bg-verse-glass-hover border border-verse-glass-border rounded-verse text-verse-text-primary text-verse-sm"
                />
              </div>
            ),
          )}
        </div>
      </div>

      <div>
        <h4 className="text-verse-lg font-verse-semibold text-verse-text-primary mb-4">
          Card Component
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(themeSettings.components.card).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <label className="block text-verse-sm font-verse-medium text-verse-text-primary capitalize">
                {key.replace(/([A-Z])/g, " $1")}
              </label>
              <input
                type="text"
                value={value}
                onChange={(e) =>
                  updateNestedTheme("components", "card", key, e.target.value)
                }
                className="w-full px-3 py-2 bg-verse-glass-hover border border-verse-glass-border rounded-verse text-verse-text-primary text-verse-sm"
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-verse-lg font-verse-semibold text-verse-text-primary mb-4">
          Input Component
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(themeSettings.components.input).map(
            ([key, value]) => (
              <div key={key} className="space-y-2">
                <label className="block text-verse-sm font-verse-medium text-verse-text-primary capitalize">
                  {key.replace(/([A-Z])/g, " $1")}
                </label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) =>
                    updateNestedTheme(
                      "components",
                      "input",
                      key,
                      e.target.value,
                    )
                  }
                  className="w-full px-3 py-2 bg-verse-glass-hover border border-verse-glass-border rounded-verse text-verse-text-primary text-verse-sm"
                />
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );

  const renderPreview = () => {
    const cssVars = generateCSSVariables();
    const style = Object.entries(cssVars).reduce((acc, [key, value]) => {
      acc[key as any] = value;
      return acc;
    }, {} as React.CSSProperties);

    switch (previewMode) {
      case "buttons":
        return (
          <div style={style} className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <button
                className="transition-all hover:scale-105"
                style={{
                  backgroundColor: themeSettings.colors.primary,
                  color: "white",
                  borderRadius: themeSettings.components.button.borderRadius,
                  padding: themeSettings.components.button.padding,
                  fontSize: themeSettings.components.button.fontSize,
                  fontWeight: themeSettings.components.button.fontWeight,
                  transition: themeSettings.components.button.transition,
                }}
              >
                Primary Button
              </button>
              <button
                className="transition-all hover:scale-105"
                style={{
                  backgroundColor: themeSettings.colors.secondary,
                  color: "white",
                  borderRadius: themeSettings.components.button.borderRadius,
                  padding: themeSettings.components.button.padding,
                  fontSize: themeSettings.components.button.fontSize,
                  fontWeight: themeSettings.components.button.fontWeight,
                  transition: themeSettings.components.button.transition,
                }}
              >
                Secondary Button
              </button>
              <button
                className="border transition-all hover:scale-105"
                style={{
                  backgroundColor: "transparent",
                  color: themeSettings.colors.primary,
                  borderColor: themeSettings.colors.primary,
                  borderRadius: themeSettings.components.button.borderRadius,
                  padding: themeSettings.components.button.padding,
                  fontSize: themeSettings.components.button.fontSize,
                  fontWeight: themeSettings.components.button.fontWeight,
                  transition: themeSettings.components.button.transition,
                }}
              >
                Outline Button
              </button>
            </div>
          </div>
        );
      case "cards":
        return (
          <div style={style} className="space-y-4">
            <div
              style={{
                backgroundColor: themeSettings.components.card.backgroundColor,
                borderRadius: themeSettings.components.card.borderRadius,
                padding: themeSettings.components.card.padding,
                boxShadow: themeSettings.components.card.shadow,
                border: themeSettings.components.card.border,
              }}
            >
              <h3
                style={{
                  color: themeSettings.colors.text,
                  fontSize: themeSettings.typography.fontSize.lg,
                  fontWeight: themeSettings.typography.fontWeight.semibold,
                  marginBottom: themeSettings.spacing.sm,
                }}
              >
                Card Title
              </h3>
              <p
                style={{
                  color: themeSettings.colors.textSecondary,
                  fontSize: themeSettings.typography.fontSize.sm,
                  lineHeight: themeSettings.typography.lineHeight.normal,
                }}
              >
                This is a preview of how cards will look with your current theme
                settings. The spacing, colors, and typography all reflect your
                customizations.
              </p>
            </div>
          </div>
        );
      case "forms":
        return (
          <div style={style} className="space-y-4">
            <div className="space-y-2">
              <label
                style={{
                  color: themeSettings.colors.text,
                  fontSize: themeSettings.typography.fontSize.sm,
                  fontWeight: themeSettings.typography.fontWeight.medium,
                }}
              >
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                style={{
                  width: "100%",
                  backgroundColor:
                    themeSettings.components.input.backgroundColor,
                  border: themeSettings.components.input.border,
                  borderRadius: themeSettings.components.input.borderRadius,
                  padding: themeSettings.components.input.padding,
                  fontSize: themeSettings.components.input.fontSize,
                  color: themeSettings.colors.text,
                }}
              />
            </div>
            <div className="space-y-2">
              <label
                style={{
                  color: themeSettings.colors.text,
                  fontSize: themeSettings.typography.fontSize.sm,
                  fontWeight: themeSettings.typography.fontWeight.medium,
                }}
              >
                Message
              </label>
              <textarea
                placeholder="Enter your message"
                rows={3}
                style={{
                  width: "100%",
                  backgroundColor:
                    themeSettings.components.input.backgroundColor,
                  border: themeSettings.components.input.border,
                  borderRadius: themeSettings.components.input.borderRadius,
                  padding: themeSettings.components.input.padding,
                  fontSize: themeSettings.components.input.fontSize,
                  color: themeSettings.colors.text,
                  resize: "none",
                }}
              />
            </div>
          </div>
        );
      case "typography":
        return (
          <div style={style} className="space-y-4">
            <h1
              style={{
                color: themeSettings.colors.text,
                fontSize: themeSettings.typography.fontSize["3xl"],
                fontWeight: themeSettings.typography.fontWeight.bold,
                lineHeight: themeSettings.typography.lineHeight.tight,
                fontFamily: themeSettings.typography.fontFamily,
              }}
            >
              Heading 1
            </h1>
            <h2
              style={{
                color: themeSettings.colors.text,
                fontSize: themeSettings.typography.fontSize["2xl"],
                fontWeight: themeSettings.typography.fontWeight.semibold,
                lineHeight: themeSettings.typography.lineHeight.tight,
                fontFamily: themeSettings.typography.fontFamily,
              }}
            >
              Heading 2
            </h2>
            <p
              style={{
                color: themeSettings.colors.textSecondary,
                fontSize: themeSettings.typography.fontSize.base,
                fontWeight: themeSettings.typography.fontWeight.normal,
                lineHeight: themeSettings.typography.lineHeight.normal,
                fontFamily: themeSettings.typography.fontFamily,
              }}
            >
              This is body text that shows how your typography settings look in
              practice. The font family, size, weight, and line height all
              contribute to the overall reading experience.
            </p>
          </div>
        );
      default:
        return <div>Preview mode not implemented</div>;
    }
  };

  const exportTheme = () => {
    const data = {
      themeSettings,
      timestamp: new Date().toISOString(),
      version: "1.0.0",
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "verse-theme.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetTheme = () => {
    if (
      window.confirm(
        "Are you sure you want to reset all theme settings to default?",
      )
    ) {
      localStorage.removeItem("verse-theme");
      window.location.reload();
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-verse-3xl font-verse-bold text-verse-text-primary">
              🎨 Design System & Theme Customizer
            </h1>
            <p className="text-verse-lg text-verse-text-secondary mt-2">
              Customize every aspect of your website's appearance
            </p>
          </div>
          <button
            onClick={applyTheme}
            disabled={isApplying}
            className={`
              px-6 py-3 rounded-verse transition-all font-verse-medium
              flex items-center space-x-2
              ${
                applySuccess
                  ? "bg-verse-accent-green text-white"
                  : "bg-gradient-to-r from-verse-accent-blue to-verse-accent-purple text-white hover:shadow-verse-purple-glow"
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            {isApplying ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Applying...</span>
              </>
            ) : applySuccess ? (
              <>
                <span>✅</span>
                <span>Applied!</span>
              </>
            ) : (
              <>
                <span>✨</span>
                <span>Apply Theme</span>
              </>
            )}
          </button>
        </div>

        {/* Apply Success Banner */}
        {applySuccess && (
          <div className="bg-verse-accent-green/20 border border-verse-accent-green/30 rounded-verse p-4 animate-slide-down">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-verse-accent-green rounded-full flex items-center justify-center text-white text-sm">
                ✓
              </div>
              <div>
                <div className="text-verse-accent-green font-verse-semibold">
                  Theme Applied Successfully!
                </div>
                <div className="text-verse-accent-green/80 text-verse-sm">
                  Your custom theme has been applied across the entire website.
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="bg-verse-glass-bg backdrop-blur-verse border border-verse-glass-border rounded-verse-lg p-2">
              <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-verse text-verse-sm font-verse-medium transition-all ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-verse-accent-blue to-verse-accent-purple text-white"
                        : "text-verse-text-secondary hover:text-verse-text-primary hover:bg-verse-glass-hover"
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label.split(" ").slice(1).join(" ")}
                  </button>
                ))}
              </div>
            </div>

            {/* Control Panel */}
            <div className="bg-verse-glass-bg backdrop-blur-verse border border-verse-glass-border rounded-verse-lg p-6">
              {activeTab === "colors" && renderColorControls()}
              {activeTab === "typography" && renderTypographyControls()}
              {activeTab === "spacing" && renderSpacingControls()}
              {activeTab === "borders" && renderBorderControls()}
              {activeTab === "shadows" && renderShadowControls()}
              {activeTab === "animations" && renderAnimationControls()}
              {activeTab === "components" && renderComponentControls()}
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-6">
            {/* Preview Mode Selector */}
            <div className="bg-verse-glass-bg backdrop-blur-verse border border-verse-glass-border rounded-verse-lg p-4">
              <h4 className="text-verse-sm font-verse-semibold text-verse-text-primary mb-3">
                Preview Mode
              </h4>
              <div className="space-y-2">
                {previewModes.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setPreviewMode(mode.id)}
                    className={`w-full px-3 py-2 rounded-verse text-verse-sm transition-colors text-left ${
                      previewMode === mode.id
                        ? "bg-verse-accent-blue/20 text-verse-accent-blue"
                        : "hover:bg-verse-glass-hover text-verse-text-secondary"
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="bg-verse-glass-bg backdrop-blur-verse border border-verse-glass-border rounded-verse-lg p-6">
              <h4 className="text-verse-sm font-verse-semibold text-verse-text-primary mb-4">
                Live Preview
              </h4>
              {renderPreview()}
            </div>

            {/* Quick Actions */}
            <div className="bg-verse-glass-bg backdrop-blur-verse border border-verse-glass-border rounded-verse-lg p-4">
              <h4 className="text-verse-sm font-verse-semibold text-verse-text-primary mb-3">
                Quick Actions
              </h4>
              <div className="space-y-2">
                <button
                  onClick={exportTheme}
                  className="w-full px-3 py-2 bg-verse-glass-hover hover:bg-verse-glass-border border border-verse-glass-border rounded-verse text-verse-text-primary text-verse-sm transition-colors"
                >
                  📤 Export Theme
                </button>
                <button className="w-full px-3 py-2 bg-verse-glass-hover hover:bg-verse-glass-border border border-verse-glass-border rounded-verse text-verse-text-primary text-verse-sm transition-colors">
                  📥 Import Theme
                </button>
                <button
                  onClick={resetTheme}
                  className="w-full px-3 py-2 bg-verse-accent-red/20 hover:bg-verse-accent-red/30 border border-verse-accent-red/30 rounded-verse text-verse-accent-red text-verse-sm transition-colors"
                >
                  🔄 Reset to Default
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DesignSystem;
