import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useProjectStore } from "./store/projectStore";
import Index from "./pages/Index";
import Projects from "./pages/Projects";
import Dashboard from "./pages/admin/Dashboard";
import ProjectsAdmin from "./pages/admin/ProjectsAdmin";
import MapSettings from "./pages/admin/MapSettings";
import UsersAdmin from "./pages/admin/UsersAdmin";
import Analytics from "./pages/admin/Analytics";
import Settings from "./pages/admin/Settings";
import DesignSystem from "./pages/admin/DesignSystem";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const initialize = useProjectStore((state) => state.initialize);
  const isLoading = useProjectStore((state) => state.isLoading);
  const error = useProjectStore((state) => state.error);

  // Initialize database connection and load data on app start
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Show error message if database connection fails
  if (error && error.includes("Failed to initialize")) {
    return (
      <div className="min-h-screen bg-verse-primary-bg flex items-center justify-center font-verse">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-verse-2xl font-verse-bold text-verse-text-primary mb-4">
            Database Connection Error
          </h1>
          <p className="text-verse-text-secondary mb-6 max-w-md">
            Unable to connect to the database. Please check your database
            configuration and try again.
          </p>
          <div className="bg-verse-glass-bg border border-verse-glass-border rounded-verse p-4 text-left text-verse-sm text-verse-text-secondary">
            <strong>Quick Setup:</strong>
            <br />
            1. Install PostgreSQL
            <br />
            2. Create database: <code>verse_db</code>
            <br />
            3. Update <code>.env</code> with your DATABASE_URL
            <br />
            4. Run: <code>npm run db:init</code>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-3 bg-gradient-to-r from-verse-accent-blue to-verse-accent-purple text-white rounded-verse hover:shadow-verse-purple-glow transition-all"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/projects" element={<Projects />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/projects" element={<ProjectsAdmin />} />
            <Route path="/admin/map" element={<MapSettings />} />
            <Route path="/admin/users" element={<UsersAdmin />} />
            <Route path="/admin/analytics" element={<Analytics />} />
            <Route path="/admin/settings" element={<Settings />} />
            <Route path="/admin/design" element={<DesignSystem />} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
