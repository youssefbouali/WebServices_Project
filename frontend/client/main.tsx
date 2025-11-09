import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/AuthProvider";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import DeviceDashboard from "./pages/DeviceDashboard";
import AlertsManagement from "./pages/AlertsManagement";
import RealTimeMonitoring from "./pages/RealTimeMonitoring";
import DeviceRegistration from "./pages/DeviceRegistration";
import AppointmentManagement from "./pages/AppointmentManagement";
import AppointmentForm from "./pages/AppointmentForm";
import ProfilesDashboard from "./pages/ProfilesDashboard";
import ProfileDetail from "./pages/ProfileDetail";
import ProfileEdit from "./pages/ProfileEdit";
import TreatmentForm from "./pages/TreatmentForm";
import TreatmentTracking from "./pages/TreatmentTracking";
import TreatmentAlerts from "./pages/TreatmentAlerts";
import RolesManagement from "./pages/RolesManagement";
import DoctorDashboard from "./pages/DoctorDashboard";
import PatientDashboard from "./pages/PatientDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const Root = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/devices"
              element={
                <ProtectedRoute>
                  <DeviceDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/alerts"
              element={
                <ProtectedRoute>
                  <AlertsManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/monitoring"
              element={
                <ProtectedRoute>
                  <RealTimeMonitoring />
                </ProtectedRoute>
              }
            />
            <Route
              path="/device-registration"
              element={
                <ProtectedRoute>
                  <DeviceRegistration />
                </ProtectedRoute>
              }
            />
            <Route
              path="/appointments"
              element={
                <ProtectedRoute>
                  <AppointmentManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/appointments/new"
              element={
                <ProtectedRoute>
                  <AppointmentForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profiles"
              element={
                <ProtectedRoute>
                  <ProfilesDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profiles/detail"
              element={
                <ProtectedRoute>
                  <ProfileDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profiles/edit"
              element={
                <ProtectedRoute>
                  <ProfileEdit />
                </ProtectedRoute>
              }
            />
            <Route
              path="/treatment-form"
              element={
                <ProtectedRoute>
                  <TreatmentForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/treatment-tracking"
              element={
                <ProtectedRoute>
                  <TreatmentTracking />
                </ProtectedRoute>
              }
            />
            <Route
              path="/treatment-alerts"
              element={
                <ProtectedRoute>
                  <TreatmentAlerts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/roles-management"
              element={
                <ProtectedRoute>
                  <RolesManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor-dashboard"
              element={
                <ProtectedRoute>
                  <DoctorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient-dashboard"
              element={
                <ProtectedRoute>
                  <PatientDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<Root />);
