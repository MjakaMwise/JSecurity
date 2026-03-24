import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoadingScreen from "@/components/LoadingScreen";
import Index from "./pages/Index.tsx";
import Blog from "./pages/Blog.tsx";
import BlogDetail from "./pages/BlogDetail.tsx";
import Reviews from "./pages/Reviews.tsx";
import NotFound from "./pages/NotFound.tsx";

// Admin imports
import { AuthProvider } from "@/hooks/useAuth";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { LoginPage } from "./pages/admin/LoginPage";
import { MFASetupPage } from "./pages/admin/MFASetupPage";
import { MFAVerifyPage } from "./pages/admin/MFAVerifyPage";
import { AdminIndexPage } from "./pages/admin/AdminIndexPage";
import { BlogManagementPage } from "./pages/admin/BlogManagementPage";
import { ReviewsManagementPage } from "./pages/admin/ReviewsManagementPage";
import { TeamManagementPage } from "./pages/admin/TeamManagementPage";
import { ServicesManagementPage } from "./pages/admin/ServicesManagementPage";
import { AuditLogsPage } from "./pages/admin/AuditLogsPage";
import { UserManagementPage } from "./pages/admin/UserManagementPage";

const queryClient = new QueryClient();

const App = () => {
  const [loading, setLoading] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<><Navbar /><Index /><Footer /></>} />
              <Route path="/blog" element={<><Navbar /><Blog /><Footer /></>} />
              <Route path="/blog/:id" element={<><Navbar /><BlogDetail /><Footer /></>} />
              <Route path="/reviews" element={<><Navbar /><Reviews /><Footer /></>} />

              {/* Auth Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/mfa-setup" element={<MFASetupPage />} />
              <Route path="/mfa-verify" element={<MFAVerifyPage />} />

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredRole="editor">
                    <AdminLayout>
                      <AdminIndexPage />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/blog"
                element={
                  <ProtectedRoute requiredRole="editor">
                    <AdminLayout>
                      <BlogManagementPage />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/reviews"
                element={
                  <ProtectedRoute requiredRole="editor">
                    <AdminLayout>
                      <ReviewsManagementPage />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/team"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminLayout>
                      <TeamManagementPage />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/services"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminLayout>
                      <ServicesManagementPage />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/audit"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminLayout>
                      <AuditLogsPage />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute requiredRole="super_admin">
                    <AdminLayout>
                      <UserManagementPage />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
