import React, { useState, useEffect } from "react";
import { useProjectStore } from "../../store/projectStore";
import AdminLayout from "../../components/admin/AdminLayout";

const Settings: React.FC = () => {
  const { systemSettings, updateSystemSettings } = useProjectStore();
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [settings, setSettings] = useState(
    systemSettings || {
      siteName: "VERSE Real Estate",
      siteDescription: "Premium real estate platform in Saudi Arabia",
      contactEmail: "contact@verse.sa",
      phoneNumber: "+966 50 123 4567",
      address: "King Fahd Road, Riyadh, Saudi Arabia",
      enableNotifications: true,
      enableAnalytics: true,
      enableCaching: true,
      maintenanceMode: false,
      allowGuestViewing: true,
      requireApproval: false,
      autoBackup: true,
      maxProjectsPerPage: 12,
      backupFrequency: "daily",
      language: "en",
      timezone: "Asia/Riyadh",
      currency: "SAR",
    },
  );

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordPolicy: "medium",
    loginAttempts: 5,
    accountLockout: true,
    emailVerification: true,
  });

  const [performanceSettings, setPerformanceSettings] = useState({
    cacheExpiry: 3600,
    imageOptimization: true,
    lazyLoading: true,
    compression: true,
    cdnEnabled: false,
    analyticsTracking: true,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    browserNotifications: false,
    smsNotifications: false,
    newUserSignup: true,
    projectUpdates: true,
    systemAlerts: true,
    maintenanceAlerts: true,
  });

  useEffect(() => {
    if (systemSettings) {
      setSettings(systemSettings);
    }
  }, [systemSettings]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await updateSystemSettings(settings);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportSettings = () => {
    const allSettings = {
      general: settings,
      security: securitySettings,
      performance: performanceSettings,
      notifications: notificationSettings,
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(allSettings, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "verse-settings-backup.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target?.result as string);
          if (importedSettings.general) setSettings(importedSettings.general);
          if (importedSettings.security)
            setSecuritySettings(importedSettings.security);
          if (importedSettings.performance)
            setPerformanceSettings(importedSettings.performance);
          if (importedSettings.notifications)
            setNotificationSettings(importedSettings.notifications);
        } catch (error) {
          alert("Invalid settings file");
        }
      };
      reader.readAsText(file);
    }
  };

  const resetToDefaults = () => {
    if (
      window.confirm(
        "Are you sure you want to reset all settings to defaults? This action cannot be undone.",
      )
    ) {
      setSettings({
        siteName: "VERSE Real Estate",
        siteDescription: "Premium real estate platform in Saudi Arabia",
        contactEmail: "contact@verse.sa",
        phoneNumber: "+966 50 123 4567",
        address: "King Fahd Road, Riyadh, Saudi Arabia",
        enableNotifications: true,
        enableAnalytics: true,
        enableCaching: true,
        maintenanceMode: false,
        allowGuestViewing: true,
        requireApproval: false,
        autoBackup: true,
        maxProjectsPerPage: 12,
        backupFrequency: "daily",
        language: "en",
        timezone: "Asia/Riyadh",
        currency: "SAR",
      });
    }
  };

  const tabs = [
    { id: "general", label: "General", icon: "⚙️" },
    { id: "security", label: "Security", icon: "🔒" },
    { id: "performance", label: "Performance", icon: "⚡" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
    { id: "backup", label: "Backup & Recovery", icon: "💾" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-verse-3xl font-verse-bold text-verse-text-primary">
              ⚙️ System Settings
            </h1>
            <p className="text-verse-lg text-verse-text-secondary mt-2">
              Configure your platform settings and preferences
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`
                px-6 py-3 rounded-verse transition-all font-verse-medium
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
                  <span>Save Changes</span>
                </>
              )}
            </button>
            <button
              onClick={handleExportSettings}
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

        {/* Save Status Banner */}
        {saveSuccess && (
          <div className="bg-verse-accent-green/20 border border-verse-accent-green/30 rounded-verse p-4 animate-slide-down">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-verse-accent-green rounded-full flex items-center justify-center text-white text-sm">
                ✓
              </div>
              <div>
                <div className="text-verse-accent-green font-verse-semibold">
                  Settings Saved Successfully!
                </div>
                <div className="text-verse-accent-green/80 text-verse-sm">
                  All system settings have been updated.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Content */}
        <div className="bg-verse-glass-bg backdrop-blur-verse border border-verse-glass-border rounded-verse-lg">
          {/* Tabs */}
          <div className="flex border-b border-verse-glass-border overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center space-x-2 px-6 py-4 transition-all duration-verse
                  ${
                    activeTab === tab.id
                      ? "bg-verse-accent-blue text-white border-b-2 border-verse-accent-blue"
                      : "text-verse-text-secondary hover:text-verse-text-primary hover:bg-verse-glass-hover"
                  }
                `}
              >
                <span>{tab.icon}</span>
                <span className="font-verse-medium whitespace-nowrap">
                  {tab.label}
                </span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {/* General Settings */}
            {activeTab === "general" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-verse-xl font-verse-semibold text-verse-text-primary mb-6">
                    🏢 Site Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-verse-sm font-verse-medium text-verse-text-primary mb-2">
                        Site Name
                      </label>
                      <input
                        type="text"
                        value={settings.siteName || ""}
                        onChange={(e) =>
                          setSettings({ ...settings, siteName: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-verse-glass-hover border border-verse-glass-border rounded-verse text-verse-text-primary focus:outline-none focus:ring-2 focus:ring-verse-accent-blue/50"
                      />
                    </div>
                    <div>
                      <label className="block text-verse-sm font-verse-medium text-verse-text-primary mb-2">
                        Contact Email
                      </label>
                      <input
                        type="email"
                        value={settings.contactEmail || ""}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            contactEmail: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 bg-verse-glass-hover border border-verse-glass-border rounded-verse text-verse-text-primary focus:outline-none focus:ring-2 focus:ring-verse-accent-blue/50"
                      />
                    </div>
                    <div>
                      <label className="block text-verse-sm font-verse-medium text-verse-text-primary mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={settings.phoneNumber || ""}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            phoneNumber: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 bg-verse-glass-hover border border-verse-glass-border rounded-verse text-verse-text-primary focus:outline-none focus:ring-2 focus:ring-verse-accent-blue/50"
                      />
                    </div>
                    <div>
                      <label className="block text-verse-sm font-verse-medium text-verse-text-primary mb-2">
                        Language
                      </label>
                      <select
                        value={settings.language || "en"}
                        onChange={(e) =>
                          setSettings({ ...settings, language: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-verse-glass-hover border border-verse-glass-border rounded-verse text-verse-text-primary focus:outline-none focus:ring-2 focus:ring-verse-accent-blue/50"
                      >
                        <option value="en">English</option>
                        <option value="ar">Arabic</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-6">
                    <label className="block text-verse-sm font-verse-medium text-verse-text-primary mb-2">
                      Site Description
                    </label>
                    <textarea
                      value={settings.siteDescription || ""}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          siteDescription: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full px-4 py-2 bg-verse-glass-hover border border-verse-glass-border rounded-verse text-verse-text-primary focus:outline-none focus:ring-2 focus:ring-verse-accent-blue/50"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-verse-xl font-verse-semibold text-verse-text-primary mb-6">
                    🌍 Regional Settings
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-verse-sm font-verse-medium text-verse-text-primary mb-2">
                        Timezone
                      </label>
                      <select
                        value={settings.timezone || "Asia/Riyadh"}
                        onChange={(e) =>
                          setSettings({ ...settings, timezone: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-verse-glass-hover border border-verse-glass-border rounded-verse text-verse-text-primary focus:outline-none focus:ring-2 focus:ring-verse-accent-blue/50"
                      >
                        <option value="Asia/Riyadh">Asia/Riyadh</option>
                        <option value="Asia/Dubai">Asia/Dubai</option>
                        <option value="UTC">UTC</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-verse-sm font-verse-medium text-verse-text-primary mb-2">
                        Currency
                      </label>
                      <select
                        value={settings.currency || "SAR"}
                        onChange={(e) =>
                          setSettings({ ...settings, currency: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-verse-glass-hover border border-verse-glass-border rounded-verse text-verse-text-primary focus:outline-none focus:ring-2 focus:ring-verse-accent-blue/50"
                      >
                        <option value="SAR">SAR - Saudi Riyal</option>
                        <option value="AED">AED - UAE Dirham</option>
                        <option value="USD">USD - US Dollar</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-verse-sm font-verse-medium text-verse-text-primary mb-2">
                        Max Projects Per Page
                      </label>
                      <input
                        type="number"
                        min="6"
                        max="50"
                        value={settings.maxProjectsPerPage || 12}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            maxProjectsPerPage: Number(e.target.value),
                          })
                        }
                        className="w-full px-4 py-2 bg-verse-glass-hover border border-verse-glass-border rounded-verse text-verse-text-primary focus:outline-none focus:ring-2 focus:ring-verse-accent-blue/50"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-verse-xl font-verse-semibold text-verse-text-primary mb-6">
                    🎛️ Feature Toggles
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      {
                        key: "enableAnalytics",
                        label: "Analytics Tracking",
                        description: "Enable detailed analytics and tracking",
                      },
                      {
                        key: "enableCaching",
                        label: "System Caching",
                        description: "Improve performance with caching",
                      },
                      {
                        key: "allowGuestViewing",
                        label: "Guest Viewing",
                        description: "Allow guests to view projects",
                      },
                      {
                        key: "requireApproval",
                        label: "Require Approval",
                        description: "New projects need admin approval",
                      },
                      {
                        key: "maintenanceMode",
                        label: "Maintenance Mode",
                        description: "Put site in maintenance mode",
                      },
                      {
                        key: "autoBackup",
                        label: "Auto Backup",
                        description: "Automatic daily backups",
                      },
                    ].map((toggle) => (
                      <div
                        key={toggle.key}
                        className="flex items-center justify-between p-4 bg-verse-glass-hover rounded-verse border border-verse-glass-border"
                      >
                        <div>
                          <div className="text-verse-sm font-verse-medium text-verse-text-primary">
                            {toggle.label}
                          </div>
                          <div className="text-verse-xs text-verse-text-secondary">
                            {toggle.description}
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={
                              settings[
                                toggle.key as keyof typeof settings
                              ] as boolean
                            }
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                [toggle.key]: e.target.checked,
                              })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-verse-glass-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-verse-accent-blue"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === "security" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-verse-xl font-verse-semibold text-verse-text-primary mb-6">
                    🔐 Authentication & Access
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center justify-between p-4 bg-verse-glass-hover rounded-verse border border-verse-glass-border">
                      <div>
                        <div className="text-verse-sm font-verse-medium text-verse-text-primary">
                          Two-Factor Authentication
                        </div>
                        <div className="text-verse-xs text-verse-text-secondary">
                          Add extra security layer
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={securitySettings.twoFactorAuth}
                          onChange={(e) =>
                            setSecuritySettings({
                              ...securitySettings,
                              twoFactorAuth: e.target.checked,
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-verse-glass-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-verse-accent-blue"></div>
                      </label>
                    </div>

                    <div>
                      <label className="block text-verse-sm font-verse-medium text-verse-text-primary mb-2">
                        Session Timeout (minutes)
                      </label>
                      <input
                        type="number"
                        min="5"
                        max="1440"
                        value={securitySettings.sessionTimeout}
                        onChange={(e) =>
                          setSecuritySettings({
                            ...securitySettings,
                            sessionTimeout: Number(e.target.value),
                          })
                        }
                        className="w-full px-4 py-2 bg-verse-glass-hover border border-verse-glass-border rounded-verse text-verse-text-primary focus:outline-none focus:ring-2 focus:ring-verse-accent-blue/50"
                      />
                    </div>

                    <div>
                      <label className="block text-verse-sm font-verse-medium text-verse-text-primary mb-2">
                        Password Policy
                      </label>
                      <select
                        value={securitySettings.passwordPolicy}
                        onChange={(e) =>
                          setSecuritySettings({
                            ...securitySettings,
                            passwordPolicy: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 bg-verse-glass-hover border border-verse-glass-border rounded-verse text-verse-text-primary focus:outline-none focus:ring-2 focus:ring-verse-accent-blue/50"
                      >
                        <option value="low">Low - 6+ characters</option>
                        <option value="medium">
                          Medium - 8+ chars, mixed case
                        </option>
                        <option value="high">High - 12+ chars, symbols</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-verse-sm font-verse-medium text-verse-text-primary mb-2">
                        Max Login Attempts
                      </label>
                      <input
                        type="number"
                        min="3"
                        max="10"
                        value={securitySettings.loginAttempts}
                        onChange={(e) =>
                          setSecuritySettings({
                            ...securitySettings,
                            loginAttempts: Number(e.target.value),
                          })
                        }
                        className="w-full px-4 py-2 bg-verse-glass-hover border border-verse-glass-border rounded-verse text-verse-text-primary focus:outline-none focus:ring-2 focus:ring-verse-accent-blue/50"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-verse-xl font-verse-semibold text-verse-text-primary mb-6">
                    🛡️ Security Features
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      {
                        key: "accountLockout",
                        label: "Account Lockout",
                        description: "Lock accounts after failed attempts",
                      },
                      {
                        key: "emailVerification",
                        label: "Email Verification",
                        description:
                          "Require email verification for new accounts",
                      },
                    ].map((toggle) => (
                      <div
                        key={toggle.key}
                        className="flex items-center justify-between p-4 bg-verse-glass-hover rounded-verse border border-verse-glass-border"
                      >
                        <div>
                          <div className="text-verse-sm font-verse-medium text-verse-text-primary">
                            {toggle.label}
                          </div>
                          <div className="text-verse-xs text-verse-text-secondary">
                            {toggle.description}
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={
                              securitySettings[
                                toggle.key as keyof typeof securitySettings
                              ] as boolean
                            }
                            onChange={(e) =>
                              setSecuritySettings({
                                ...securitySettings,
                                [toggle.key]: e.target.checked,
                              })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-verse-glass-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-verse-accent-blue"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Performance Settings */}
            {activeTab === "performance" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-verse-xl font-verse-semibold text-verse-text-primary mb-6">
                    ⚡ Performance Optimization
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-verse-sm font-verse-medium text-verse-text-primary mb-2">
                        Cache Expiry (seconds)
                      </label>
                      <input
                        type="number"
                        min="300"
                        max="86400"
                        value={performanceSettings.cacheExpiry}
                        onChange={(e) =>
                          setPerformanceSettings({
                            ...performanceSettings,
                            cacheExpiry: Number(e.target.value),
                          })
                        }
                        className="w-full px-4 py-2 bg-verse-glass-hover border border-verse-glass-border rounded-verse text-verse-text-primary focus:outline-none focus:ring-2 focus:ring-verse-accent-blue/50"
                      />
                    </div>

                    {[
                      {
                        key: "imageOptimization",
                        label: "Image Optimization",
                        description: "Automatically optimize images",
                      },
                      {
                        key: "lazyLoading",
                        label: "Lazy Loading",
                        description: "Load content as needed",
                      },
                      {
                        key: "compression",
                        label: "Data Compression",
                        description: "Compress responses for faster loading",
                      },
                      {
                        key: "cdnEnabled",
                        label: "CDN Enabled",
                        description: "Use content delivery network",
                      },
                      {
                        key: "analyticsTracking",
                        label: "Analytics Tracking",
                        description: "Track performance metrics",
                      },
                    ].map((toggle) => (
                      <div
                        key={toggle.key}
                        className="flex items-center justify-between p-4 bg-verse-glass-hover rounded-verse border border-verse-glass-border"
                      >
                        <div>
                          <div className="text-verse-sm font-verse-medium text-verse-text-primary">
                            {toggle.label}
                          </div>
                          <div className="text-verse-xs text-verse-text-secondary">
                            {toggle.description}
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={
                              performanceSettings[
                                toggle.key as keyof typeof performanceSettings
                              ] as boolean
                            }
                            onChange={(e) =>
                              setPerformanceSettings({
                                ...performanceSettings,
                                [toggle.key]: e.target.checked,
                              })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-verse-glass-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-verse-accent-blue"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === "notifications" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-verse-xl font-verse-semibold text-verse-text-primary mb-6">
                    🔔 Notification Preferences
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      {
                        key: "emailNotifications",
                        label: "Email Notifications",
                        description: "Receive notifications via email",
                      },
                      {
                        key: "browserNotifications",
                        label: "Browser Notifications",
                        description: "Show browser push notifications",
                      },
                      {
                        key: "smsNotifications",
                        label: "SMS Notifications",
                        description: "Receive SMS for critical alerts",
                      },
                      {
                        key: "newUserSignup",
                        label: "New User Signups",
                        description: "Notify when new users register",
                      },
                      {
                        key: "projectUpdates",
                        label: "Project Updates",
                        description: "Notify on project changes",
                      },
                      {
                        key: "systemAlerts",
                        label: "System Alerts",
                        description: "Critical system notifications",
                      },
                      {
                        key: "maintenanceAlerts",
                        label: "Maintenance Alerts",
                        description: "Scheduled maintenance notifications",
                      },
                    ].map((toggle) => (
                      <div
                        key={toggle.key}
                        className="flex items-center justify-between p-4 bg-verse-glass-hover rounded-verse border border-verse-glass-border"
                      >
                        <div>
                          <div className="text-verse-sm font-verse-medium text-verse-text-primary">
                            {toggle.label}
                          </div>
                          <div className="text-verse-xs text-verse-text-secondary">
                            {toggle.description}
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={
                              notificationSettings[
                                toggle.key as keyof typeof notificationSettings
                              ] as boolean
                            }
                            onChange={(e) =>
                              setNotificationSettings({
                                ...notificationSettings,
                                [toggle.key]: e.target.checked,
                              })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-verse-glass-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-verse-accent-blue"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Backup & Recovery */}
            {activeTab === "backup" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-verse-xl font-verse-semibold text-verse-text-primary mb-6">
                    💾 Backup Configuration
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-verse-sm font-verse-medium text-verse-text-primary mb-2">
                        Backup Frequency
                      </label>
                      <select
                        value={settings.backupFrequency || "daily"}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            backupFrequency: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 bg-verse-glass-hover border border-verse-glass-border rounded-verse text-verse-text-primary focus:outline-none focus:ring-2 focus:ring-verse-accent-blue/50"
                      >
                        <option value="hourly">Hourly</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-verse-glass-hover rounded-verse border border-verse-glass-border">
                      <div>
                        <div className="text-verse-sm font-verse-medium text-verse-text-primary">
                          Auto Backup
                        </div>
                        <div className="text-verse-xs text-verse-text-secondary">
                          Automatically backup system data
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.autoBackup || false}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              autoBackup: e.target.checked,
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-verse-glass-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-verse-accent-blue"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-verse-xl font-verse-semibold text-verse-text-primary mb-6">
                    📤 Import/Export Settings
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <button
                      onClick={handleExportSettings}
                      className="p-6 bg-verse-accent-blue/20 border border-verse-accent-blue/30 rounded-verse text-verse-accent-blue hover:bg-verse-accent-blue/30 transition-all duration-verse"
                    >
                      <div className="text-2xl mb-2">📥</div>
                      <div className="font-verse-semibold">Export Settings</div>
                      <div className="text-verse-xs mt-1">
                        Download configuration backup
                      </div>
                    </button>

                    <label className="p-6 bg-verse-accent-green/20 border border-verse-accent-green/30 rounded-verse text-verse-accent-green hover:bg-verse-accent-green/30 transition-all duration-verse cursor-pointer">
                      <div className="text-2xl mb-2">📤</div>
                      <div className="font-verse-semibold">Import Settings</div>
                      <div className="text-verse-xs mt-1">
                        Restore from backup file
                      </div>
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImportSettings}
                        className="hidden"
                      />
                    </label>

                    <button
                      onClick={resetToDefaults}
                      className="p-6 bg-verse-accent-orange/20 border border-verse-accent-orange/30 rounded-verse text-verse-accent-orange hover:bg-verse-accent-orange/30 transition-all duration-verse"
                    >
                      <div className="text-2xl mb-2">🔄</div>
                      <div className="font-verse-semibold">Reset Defaults</div>
                      <div className="text-verse-xs mt-1">
                        Restore factory settings
                      </div>
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-verse-xl font-verse-semibold text-verse-text-primary mb-6">
                    📊 System Status
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      {
                        label: "Database Status",
                        value: "Connected",
                        status: "success",
                        icon: "🗄️",
                      },
                      {
                        label: "Last Backup",
                        value: new Date().toLocaleDateString(),
                        status: "success",
                        icon: "💾",
                      },
                      {
                        label: "System Load",
                        value: "Low",
                        status: "success",
                        icon: "⚡",
                      },
                      {
                        label: "Storage Used",
                        value: "45% of 100GB",
                        status: "warning",
                        icon: "💽",
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="p-4 bg-verse-glass-hover rounded-verse border border-verse-glass-border"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-lg">{item.icon}</div>
                          <div
                            className={`w-2 h-2 rounded-full ${
                              item.status === "success"
                                ? "bg-verse-accent-green"
                                : item.status === "warning"
                                  ? "bg-verse-accent-orange"
                                  : "bg-verse-accent-red"
                            }`}
                          ></div>
                        </div>
                        <div className="text-verse-xs text-verse-text-secondary mb-1">
                          {item.label}
                        </div>
                        <div className="text-verse-sm font-verse-medium text-verse-text-primary">
                          {item.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Settings;
