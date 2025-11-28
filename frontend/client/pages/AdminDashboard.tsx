import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "@/components/AdminSidebar";
import { useAuth } from "@/lib/auth";
import {
  Users,
  Tablet,
  Calendar,
  AlertTriangle,
  Eye,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { listProfiles, Profile } from "@/lib/api/profiles";
import { getDevices, Device } from "@/lib/api/devices";
import { getPatientAppointments, Appointment } from "@/lib/api/appointments";
import { getProfileById } from "@/lib/api/profiles";
import ProfilesDashboard from "./ProfilesDashboard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewingUser, setViewingUser] = useState<Profile | null>(null);
  const [viewingDevice, setViewingDevice] = useState<Device | null>(null);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const [showProfilesManagement, setShowProfilesManagement] = useState(false);

  const fullName = user ? `${user.firstName} ${user.lastName}` : "Utilisateur";
  const initials = user
    ? (user.firstName[0] + user.lastName[0]).toUpperCase()
    : "??";

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setIsLoading(true);
    setError("");
    try {
      const [profilesData, devicesData] = await Promise.all([
        listProfiles(),
        getDevices(),
      ]);

      setProfiles(profilesData);
      setDevices(devicesData);

      // Load all appointments
      const allAppointments: any[] = [];
      for (const profile of profilesData) {
        try {
          const patientAppointments = await getPatientAppointments(
            parseInt(profile.id),
          );
          for (const appt of patientAppointments) {
            const patient = profilesData.find(
              (p) => parseInt(p.id) === appt.patientId,
            );
            const doctor = profilesData.find(
              (p) => parseInt(p.id) === appt.doctorId,
            );

            const dateObj = new Date(appt.dateRdv);
            const date = dateObj.toLocaleDateString("fr-FR", {
              year: "numeric",
              month: "short",
              day: "numeric",
            });
            const time = dateObj.toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
            });

            allAppointments.push({
              ...appt,
              patientName: patient
                ? `${patient.firstName} ${patient.lastName}`
                : "Unknown",
              doctorName: doctor
                ? `${doctor.firstName} ${doctor.lastName}`
                : "Unknown",
              date,
              time,
            });
          }
        } catch (_) {
          // Ignore errors for individual appointments
        }
      }

      setAppointments(allAppointments);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load data";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const patientCount = profiles.filter((p) => p.role === "PATIENT").length;
  const doctorCount = profiles.filter((p) => p.role === "DOCTOR").length;
  const adminCount = profiles.filter((p) => p.role === "ADMIN").length;

  const stats = [
    {
      label: "Total Patients",
      value: patientCount.toString(),
      color: "bg-blue-100",
      iconColor: "text-blue-600",
      Icon: Users,
    },
    {
      label: "Total Docteurs",
      value: doctorCount.toString(),
      color: "bg-green-100",
      iconColor: "text-green-600",
      Icon: Users,
    },
    {
      label: "Total Appareils",
      value: devices.length.toString(),
      color: "bg-purple-100",
      iconColor: "text-purple-600",
      Icon: Tablet,
    },
    {
      label: "Total Rendez-vous",
      value: appointments.length.toString(),
      color: "bg-orange-100",
      iconColor: "text-orange-600",
      Icon: Calendar,
    },
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case "DOCTOR":
        return "bg-[#1D4ED8] text-white";
      case "PATIENT":
        return "bg-[#2563EB] text-white";
      case "ADMIN":
        return "bg-[#7C3AED] text-white";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "DOCTOR":
        return "Docteur";
      case "PATIENT":
        return "Patient";
      case "ADMIN":
        return "Admin";
      default:
        return role;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmé":
        return "bg-[#D1FAE5] text-[#10B981]";
      case "en attente":
        return "bg-[#FEF3C7] text-[#F59E0B]";
      case "annulé":
        return "bg-[#FEE2E2] text-[#EF4444]";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "confirmé":
        return "Confirmé";
      case "en attente":
        return "En attente";
      case "annulé":
        return "Annulé";
      default:
        return status;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F5F7FA]">
      <AdminSidebar />

      <main className="flex-1 ml-0 lg:ml-[250px]">
        <header className="bg-white border-b border-gray-200 shadow-sm px-4 lg:px-8 py-4 lg:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-lg lg:text-2xl font-bold text-gray-900">
                {showProfilesManagement
                  ? "Gestion des Profils"
                  : "Tableau de Bord Administrateur"}
              </h1>
              {!showProfilesManagement && (
                <button
                  onClick={() => setShowProfilesManagement(true)}
                  className="text-sm px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Gérer les Profils
                </button>
              )}
              {showProfilesManagement && (
                <button
                  onClick={() => setShowProfilesManagement(false)}
                  className="text-sm px-3 py-1 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Retour au Tableau de Bord
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 lg:gap-4">
              <span className="text-xs lg:text-sm text-gray-500 hidden sm:block">
                {fullName}
              </span>
              <div className="w-10 h-10 bg-[#E9D5FF] rounded-full flex items-center justify-center">
                <span className="text-[#7C3AED] font-bold text-xs">
                  {initials}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="Déconnexion"
              >
                <LogOut className="w-4 h-4 lg:w-5 lg:h-5" />
                <span className="text-xs lg:text-sm hidden sm:block">
                  Déconnexion
                </span>
              </button>
            </div>
          </div>
        </header>

        {showProfilesManagement ? (
          <ProfilesDashboard />
        ) : (
          <div className="p-4 lg:p-6 space-y-6">
            {error && (
              <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded">
                Erreur: {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs lg:text-sm text-gray-600">
                        {stat.label}
                      </p>
                      <p
                        className={`text-2xl lg:text-3xl font-bold mt-2 ${stat.iconColor}`}
                      >
                        {stat.value}
                      </p>
                    </div>
                    <div
                      className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}
                    >
                      <stat.Icon
                        className={`w-5 h-5 lg:w-6 lg:h-6 ${stat.iconColor}`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="border-b border-gray-200 px-4 lg:px-6 py-4 lg:py-5">
                <h2 className="text-base lg:text-xl font-semibold text-gray-900">
                  Tous les Utilisateurs
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 lg:px-6 py-4 text-left text-xs lg:text-sm font-semibold text-gray-700">
                        Nom
                      </th>
                      <th className="px-4 lg:px-6 py-4 text-left text-xs lg:text-sm font-semibold text-gray-700">
                        Email
                      </th>
                      <th className="px-4 lg:px-6 py-4 text-left text-xs lg:text-sm font-semibold text-gray-700">
                        Rôle
                      </th>
                      <th className="px-4 lg:px-6 py-4 text-left text-xs lg:text-sm font-semibold text-gray-700">
                        Statut
                      </th>
                      <th className="px-4 lg:px-6 py-4 text-left text-xs lg:text-sm font-semibold text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {isLoading ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-4 lg:px-6 py-8 text-center text-gray-600 text-sm"
                        >
                          Chargement des utilisateurs...
                        </td>
                      </tr>
                    ) : profiles.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-4 lg:px-6 py-8 text-center text-gray-600 text-sm"
                        >
                          Aucun utilisateur trouvé
                        </td>
                      </tr>
                    ) : (
                      profiles.map((profile) => (
                        <tr key={profile.id} className="hover:bg-gray-50">
                          <td className="px-4 lg:px-6 py-4 text-xs lg:text-sm font-medium text-gray-900">
                            {profile.firstName} {profile.lastName}
                          </td>
                          <td className="px-4 lg:px-6 py-4 text-xs lg:text-sm text-gray-600">
                            {profile.email}
                          </td>
                          <td className="px-4 lg:px-6 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(
                                profile.role,
                              )}`}
                            >
                              {getRoleLabel(profile.role)}
                            </span>
                          </td>
                          <td className="px-4 lg:px-6 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                profile.isActive
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {profile.isActive ? "Actif" : "Inactif"}
                            </span>
                          </td>
                          <td className="px-4 lg:px-6 py-4">
                            <button
                              onClick={() => setViewingUser(profile)}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <Eye className="w-4 h-4 lg:w-5 lg:h-5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="px-4 lg:px-6 py-4 border-t border-gray-200 flex items-center justify-between text-xs lg:text-sm">
                <span className="text-gray-600">
                  Affichage de 1 à {profiles.length} sur {profiles.length}{" "}
                  utilisateurs
                </span>
              </div>
            </div>

            {/* Devices Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="border-b border-gray-200 px-4 lg:px-6 py-4 lg:py-5">
                <h2 className="text-base lg:text-xl font-semibold text-gray-900">
                  Tous les Appareils
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 lg:px-6 py-4 text-left text-xs lg:text-sm font-semibold text-gray-700">
                        ID
                      </th>
                      <th className="px-4 lg:px-6 py-4 text-left text-xs lg:text-sm font-semibold text-gray-700">
                        Nom
                      </th>
                      <th className="px-4 lg:px-6 py-4 text-left text-xs lg:text-sm font-semibold text-gray-700">
                        Type
                      </th>
                      <th className="px-4 lg:px-6 py-4 text-left text-xs lg:text-sm font-semibold text-gray-700">
                        État
                      </th>
                      <th className="px-4 lg:px-6 py-4 text-left text-xs lg:text-sm font-semibold text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {isLoading ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-4 lg:px-6 py-8 text-center text-gray-600 text-sm"
                        >
                          Chargement des appareils...
                        </td>
                      </tr>
                    ) : devices.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-4 lg:px-6 py-8 text-center text-gray-600 text-sm"
                        >
                          Aucun appareil trouvé
                        </td>
                      </tr>
                    ) : (
                      devices.map((device) => (
                        <tr key={device.id} className="hover:bg-gray-50">
                          <td className="px-4 lg:px-6 py-4 text-xs lg:text-sm font-medium text-gray-900">
                            #{device.id}
                          </td>
                          <td className="px-4 lg:px-6 py-4 text-xs lg:text-sm text-gray-900">
                            {device.name}
                          </td>
                          <td className="px-4 lg:px-6 py-4 text-xs lg:text-sm text-gray-900">
                            {device.type}
                          </td>
                          <td className="px-4 lg:px-6 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                device.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {device.status === "active" ? "Actif" : "Inactif"}
                            </span>
                          </td>
                          <td className="px-4 lg:px-6 py-4">
                            <button
                              onClick={() => setViewingDevice(device)}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <Eye className="w-4 h-4 lg:w-5 lg:h-5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="px-4 lg:px-6 py-4 border-t border-gray-200 flex items-center justify-between text-xs lg:text-sm">
                <span className="text-gray-600">
                  Affichage de 1 à {devices.length} sur {devices.length}{" "}
                  appareils
                </span>
              </div>
            </div>

            {/* Appointments Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="border-b border-gray-200 px-4 lg:px-6 py-4 lg:py-5">
                <h2 className="text-base lg:text-xl font-semibold text-gray-900">
                  Tous les Rendez-vous
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 lg:px-6 py-4 text-left text-xs lg:text-sm font-semibold text-gray-700">
                        Date & Heure
                      </th>
                      <th className="px-4 lg:px-6 py-4 text-left text-xs lg:text-sm font-semibold text-gray-700">
                        Patient
                      </th>
                      <th className="px-4 lg:px-6 py-4 text-left text-xs lg:text-sm font-semibold text-gray-700">
                        Docteur
                      </th>
                      <th className="px-4 lg:px-6 py-4 text-left text-xs lg:text-sm font-semibold text-gray-700">
                        Statut
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {isLoading ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-4 lg:px-6 py-8 text-center text-gray-600 text-sm"
                        >
                          Chargement des rendez-vous...
                        </td>
                      </tr>
                    ) : appointments.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-4 lg:px-6 py-8 text-center text-gray-600 text-sm"
                        >
                          Aucun rendez-vous trouvé
                        </td>
                      </tr>
                    ) : (
                      appointments.map((appointment) => (
                        <tr
                          key={appointment.rdvId}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-4 lg:px-6 py-4 text-xs lg:text-sm text-gray-900">
                            {appointment.date} à {appointment.time}
                          </td>
                          <td className="px-4 lg:px-6 py-4 text-xs lg:text-sm text-gray-900">
                            {appointment.patientName}
                          </td>
                          <td className="px-4 lg:px-6 py-4 text-xs lg:text-sm text-gray-900">
                            {appointment.doctorName}
                          </td>
                          <td className="px-4 lg:px-6 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                appointment.statut,
                              )}`}
                            >
                              {getStatusLabel(appointment.statut)}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="px-4 lg:px-6 py-4 border-t border-gray-200 flex items-center justify-between text-xs lg:text-sm">
                <span className="text-gray-600">
                  Affichage de 1 à {appointments.length} sur{" "}
                  {appointments.length} rendez-vous
                </span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* User Detail Dialog */}
      <Dialog open={!!viewingUser} onOpenChange={() => setViewingUser(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Détails de l'Utilisateur</DialogTitle>
          </DialogHeader>
          {viewingUser && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Nom</label>
                <p className="mt-1 text-gray-900">
                  {viewingUser.firstName} {viewingUser.lastName}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <p className="mt-1 text-gray-900">{viewingUser.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Téléphone
                </label>
                <p className="mt-1 text-gray-900">{viewingUser.phone}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Rôle
                </label>
                <p className="mt-1">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(viewingUser.role)}`}
                  >
                    {getRoleLabel(viewingUser.role)}
                  </span>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Statut
                </label>
                <p className="mt-1">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      viewingUser.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {viewingUser.isActive ? "Actif" : "Inactif"}
                  </span>
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Device Detail Dialog */}
      <Dialog
        open={!!viewingDevice}
        onOpenChange={() => setViewingDevice(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Détails de l'Appareil</DialogTitle>
          </DialogHeader>
          {viewingDevice && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">ID</label>
                <p className="mt-1 text-gray-900">#{viewingDevice.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Nom</label>
                <p className="mt-1 text-gray-900">{viewingDevice.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Type
                </label>
                <p className="mt-1 text-gray-900">{viewingDevice.type}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  État
                </label>
                <p className="mt-1">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      viewingDevice.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {viewingDevice.status === "active" ? "Actif" : "Inactif"}
                  </span>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Dernière valeur
                </label>
                <p className="mt-1 text-gray-900">{viewingDevice.last_value}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Dernière lecture
                </label>
                <p className="mt-1 text-gray-900">
                  {new Date(viewingDevice.last_reading).toLocaleString("fr-FR")}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
