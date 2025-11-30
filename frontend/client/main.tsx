import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/AuthProvider";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthenticatedRoute } from "./components/AuthenticatedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import DeviceDashboard from "./pages/DeviceDashboard";
import DevicesRedirect from "./components/DevicesRedirect";
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
import PatientAppointments from "./pages/PatientAppointments";
import PatientAlerts from "./pages/PatientAlerts";
import PatientTreatmentTracking from "./pages/PatientTreatmentTracking";
import DoctorPatients from "./pages/DoctorPatients";
import DoctorAppointments from "./pages/DoctorAppointments";
import DoctorAlerts from "./pages/DoctorAlerts";
import DoctorTreatmentTracking from "./pages/DoctorTreatmentTracking";
import PatientProfile from "./pages/PatientProfile";
import PatientDevices from "./pages/PatientDevices";
import DoctorDevices from "./pages/DoctorDevices";
import PatientAppointmentForm from "./pages/PatientAppointmentForm";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const Root = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter
          future={{
            v7_relativeSplatPath: true,
            v7_startTransition: true,
          }}
        >
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route
              path="/login"
              element={
                <AuthenticatedRoute>
                  <Login />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/register"
              element={
                <AuthenticatedRoute>
                  <Register />
                </AuthenticatedRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route path="/devices" element={<DevicesRedirect />} />

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
              path="/admin-dashboard"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/roles-management"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <RolesManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profiles"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <ProfilesDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profiles/detail"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <ProfileDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profiles/edit"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <ProfileEdit />
                </ProtectedRoute>
              }
            />

            <Route
              path="/doctor-dashboard"
              element={
                <ProtectedRoute allowedRoles={["DOCTOR"]}>
                  <DoctorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/mes-patients"
              element={
                <ProtectedRoute allowedRoles={["DOCTOR"]}>
                  <DoctorPatients />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/rendez-vous"
              element={
                <ProtectedRoute allowedRoles={["DOCTOR"]}>
                  <DoctorAppointments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/appointments"
              element={
                <ProtectedRoute allowedRoles={["DOCTOR"]}>
                  <DoctorAppointments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/alertes"
              element={
                <ProtectedRoute allowedRoles={["DOCTOR"]}>
                  <DoctorAlerts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/suivi-traitements"
              element={
                <ProtectedRoute allowedRoles={["DOCTOR"]}>
                  <DoctorTreatmentTracking />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/devices"
              element={
                <ProtectedRoute allowedRoles={["DOCTOR"]}>
                  <DoctorDevices />
                </ProtectedRoute>
              }
            />

            <Route
              path="/patient-dashboard"
              element={
                <ProtectedRoute allowedRoles={["PATIENT"]}>
                  <PatientDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/profil"
              element={
                <ProtectedRoute allowedRoles={["PATIENT"]}>
                  <PatientProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/rendez-vous"
              element={
                <ProtectedRoute allowedRoles={["PATIENT"]}>
                  <PatientAppointments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/appointments"
              element={
                <ProtectedRoute allowedRoles={["PATIENT"]}>
                  <PatientAppointments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/appointments/new"
              element={
                <ProtectedRoute allowedRoles={["PATIENT"]}>
                  <PatientAppointmentForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/alertes"
              element={
                <ProtectedRoute allowedRoles={["PATIENT"]}>
                  <PatientAlerts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/suivi-traitements"
              element={
                <ProtectedRoute allowedRoles={["PATIENT"]}>
                  <PatientTreatmentTracking />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/devices"
              element={
                <ProtectedRoute allowedRoles={["PATIENT"]}>
                  <PatientDevices />
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
