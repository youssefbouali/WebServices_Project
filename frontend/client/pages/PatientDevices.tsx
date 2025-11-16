import { useState, useEffect } from "react";
import PatientSidebar from "@/components/PatientSidebar";
import { Tablet, CheckCircle, AlertTriangle, Eye } from "lucide-react";
import { getDevices, Device } from "@/lib/api/devices";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";

export default function PatientDevices() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewingDevice, setViewingDevice] = useState<Device | null>(null);
  const fullName = user ? `${user.firstName} ${user.lastName}` : "Utilisateur";
  const initials = user
    ? (user.firstName[0] + user.lastName[0]).toUpperCase()
    : "??";

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
      label: "Total appareils",
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
      label: "Inactifs",
      value: inactiveDevices.toString(),
      color: "bg-red-100",
      iconColor: "text-red-600",
      Icon: AlertTriangle,
    },
  ];

  const displayDevices = devices.map((device) => ({
    id: `#DEV${device.id.toString().padStart(3, "0")}`,
    type: device.type,
    name: device.name,
    status: device.status === "active" ? "Actif" : "Inactif",
    statusColor:
      device.status === "active"
        ? "bg-green-100 text-green-800"
        : "bg-red-100 text-red-800",
    lastActivity: new Date(device.last_reading).toLocaleDateString("fr-FR"),
    original: device,
  }));

  return (
    <div className="flex min-h-screen bg-[#F5F7FA]">
      <PatientSidebar />

      <main className="flex-1 ml-0 lg:ml-[250px]">
        <header className="bg-white border-b border-gray-200 shadow-sm px-4 lg:px-8 py-4 lg:py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-lg lg:text-2xl font-bold text-gray-900">
              Mes Appareils
            </h1>
            <div className="flex items-center gap-2 lg:gap-3">
              <span className="text-xs lg:text-sm text-gray-500 hidden sm:block">
                {fullName}
              </span>
              <div className="w-10 h-10 bg-[#DBEAFE] rounded-full flex items-center justify-center">
                <span className="text-[#2563EB] font-bold text-xs">
                  {initials}
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
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
                Liste de mes appareils
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
                        colSpan={6}
                        className="px-4 lg:px-6 py-8 text-center text-gray-600 text-sm"
                      >
                        Chargement des appareils...
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 lg:px-6 py-8 text-center text-red-600 text-sm"
                      >
                        Erreur: {error}
                      </td>
                    </tr>
                  ) : displayDevices.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
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

            <div className="px-4 lg:px-6 py-4 border-t border-gray-200 flex items-center justify-between text-xs lg:text-sm">
              <span className="text-gray-600">
                Affichage de 1 à {displayDevices.length} sur{" "}
                {displayDevices.length} appareils
              </span>
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
