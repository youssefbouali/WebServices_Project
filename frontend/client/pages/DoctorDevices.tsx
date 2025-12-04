import { useState, useEffect } from "react";
import DoctorSidebar from "@/components/DoctorSidebar";
import {
  Tablet,
  CheckCircle,
  AlertTriangle,
  Users,
  Eye,
  LogOut,
  Activity,
} from "lucide-react";
import { getDevices, Device } from "@/lib/api/devices";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";

export default function DoctorDevices() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewingDevice, setViewingDevice] = useState<Device | null>(null);
  const fullName = user ? `${user.firstName} ${user.lastName}` : "Utilisateur";
  const doctorTitle = user?.role === "DOCTOR" ? `Dr. ${fullName}` : fullName;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await getDevices();
      setDevices(data);
    } catch (err) {
      let message = "Failed to load devices";
      if (err instanceof Error) {
        message = err.message;
      } else if (err && typeof err === "object" && "message" in err) {
        message = String((err as any).message);
      }
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDevice = (device: Device) => {
    setViewingDevice(device);
  };

  const totalDevices = devices.length;
  const activeDevices = devices.filter((d) => d.status === "active").length;
  const inactiveDevices = devices.filter((d) => d.status === "inactive").length;

  const stats = [
    {
      label: "Total appareils (Patients)",
      value: totalDevices.toString(),
      color: "bg-blue-100",
      iconColor: "text-blue-600",
      Icon: Tablet,
    },
    {
      label: "Actifs",
      value: activeDevices.toString(),
      color: "bg-green-100",
      iconColor: "text-green-600",
      Icon: CheckCircle,
    },
    {
      label: "Alertes",
      value: inactiveDevices.toString(),
      color: "bg-red-100",
      iconColor: "text-red-600",
      Icon: AlertTriangle,
    },
    {
      label: "Patients suivi",
      value: "45",
      color: "bg-purple-100",
      iconColor: "text-purple-600",
      Icon: Users,
    },
  ];

  const displayDevices = devices.map((device) => ({
    id: `#DEV${device.id.toString().padStart(3, "0")}`,
    type: device.type,
    name: device.name,
    patient: `Patient ${device.id}`,
    status: device.status === "active" ? "Actif" : "Inactif",
    statusColor:
      device.status === "active"
        ? "bg-green-100 text-green-800"
        : "bg-red-100 text-red-800",
    lastActivity: new Date(device.last_reading).toLocaleDateString("fr-FR"),
    original: device,
  }));

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      <DoctorSidebar />

      <main className="flex-1 ml-0 lg:ml-[250px]">
        <header className="bg-white border-b border-gray-200 shadow-sm px-4 lg:px-8 py-4 lg:py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-lg lg:text-2xl font-bold text-gray-900">
              Appareils des Patients
            </h1>
            <div className="flex items-center gap-2 lg:gap-4">
              <span className="text-xs lg:text-sm text-gray-500 hidden sm:block">
                {doctorTitle}
              </span>
              <div className="w-10 h-10 bg-[#DBEAFE] rounded-full flex items-center justify-center">
                <span className="text-[#2563EB] font-bold text-xs">
                  {(user?.firstName?.[0] || "?") + (user?.lastName?.[0] || "?")}
                </span>
              </div>
              <button
                onClick={() => navigate("/monitoring")}
                className="flex items-center gap-2 px-3 py-2 bg-[#2563EB] text-white hover:bg-[#1d4ed8] rounded-lg transition-colors text-xs lg:text-sm"
                title="Monitoring"
              >
                <Activity className="w-4 h-4 lg:w-5 lg:h-5" />
                <span className="hidden sm:inline">Monitoring</span>
              </button>
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

        <div className="p-4 lg:p-6 space-y-6">
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

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="border-b border-gray-200 px-4 lg:px-6 py-4 lg:py-5">
              <h2 className="text-base lg:text-xl font-semibold text-gray-900">
                Liste des appareils des patients
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 lg:px-6 py-4 text-left text-xs lg:text-sm font-semibold text-gray-700">
                      ID Appareil
                    </th>
                    <th className="px-4 lg:px-6 py-4 text-left text-xs lg:text-sm font-semibold text-gray-700">
                      Nom
                    </th>
                    <th className="px-4 lg:px-6 py-4 text-left text-xs lg:text-sm font-semibold text-gray-700">
                      Type
                    </th>
                    <th className="px-4 lg:px-6 py-4 text-left text-xs lg:text-sm font-semibold text-gray-700">
                      Patient
                    </th>
                    <th className="px-4 lg:px-6 py-4 text-left text-xs lg:text-sm font-semibold text-gray-700">
                      État
                    </th>
                    <th className="px-4 lg:px-6 py-4 text-left text-xs lg:text-sm font-semibold text-gray-700">
                      Dernière activité
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
                        colSpan={7}
                        className="px-4 lg:px-6 py-8 text-center text-gray-600 text-sm"
                      >
                        Chargement des appareils...
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-4 lg:px-6 py-8 text-center text-red-600 text-sm"
                      >
                        Erreur: {error}
                      </td>
                    </tr>
                  ) : displayDevices.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-4 lg:px-6 py-8 text-center text-gray-600 text-sm"
                      >
                        Aucun appareil trouvé
                      </td>
                    </tr>
                  ) : (
                    displayDevices.map((device) => (
                      <tr key={device.id} className="hover:bg-gray-50">
                        <td className="px-4 lg:px-6 py-4 text-xs lg:text-sm font-medium text-gray-900">
                          {device.id}
                        </td>
                        <td className="px-4 lg:px-6 py-4 text-xs lg:text-sm text-gray-900">
                          {device.name}
                        </td>
                        <td className="px-4 lg:px-6 py-4 text-xs lg:text-sm text-gray-900">
                          {device.type}
                        </td>
                        <td className="px-4 lg:px-6 py-4 text-xs lg:text-sm text-gray-900">
                          {device.patient}
                        </td>
                        <td className="px-4 lg:px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${device.statusColor}`}
                          >
                            {device.status}
                          </span>
                        </td>
                        <td className="px-4 lg:px-6 py-4 text-xs lg:text-sm text-gray-600">
                          {device.lastActivity}
                        </td>
                        <td className="px-4 lg:px-6 py-4">
                          <button
                            onClick={() => handleViewDevice(device.original)}
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

            <div className="px-4 lg:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs lg:text-sm">
              <span className="text-gray-600">
                Affichage de 1 à {displayDevices.length} sur{" "}
                {displayDevices.length} appareils
              </span>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 text-xs lg:text-sm text-gray-600 hover:bg-gray-100 rounded">
                  Précédent
                </button>
                <button className="px-3 py-1 text-xs lg:text-sm bg-blue-600 text-white rounded">
                  1
                </button>
                <button className="px-3 py-1 text-xs lg:text-sm text-gray-600 hover:bg-gray-100 rounded">
                  Suivant
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Dialog
        open={!!viewingDevice}
        onOpenChange={() => setViewingDevice(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Détails de l'appareil</DialogTitle>
          </DialogHeader>
          {viewingDevice && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  ID Appareil
                </label>
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
