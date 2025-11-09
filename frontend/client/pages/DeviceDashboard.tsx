import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import {
  Tablet,
  CheckCircle,
  AlertTriangle,
  Users,
  Eye,
  Edit,
} from "lucide-react";
import { getDevices, Device } from "@/lib/api/devices";

export default function DeviceDashboard() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

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
      const message =
        err instanceof Error ? err.message : "Failed to load devices";
      setError(message);
    } finally {
      setIsLoading(false);
    }
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
      label: "Alertes",
      value: inactiveDevices.toString(),
      color: "bg-red-100",
      iconColor: "text-red-600",
      Icon: AlertTriangle,
    },
    {
      label: "Patients",
      value: "45",
      color: "bg-purple-100",
      iconColor: "text-purple-600",
      Icon: Users,
    },
  ];

  const displayDevices = devices.map((device) => ({
    id: `#DEV${device.id.toString().padStart(3, "0")}`,
    type: device.type,
    patient: `Patient ${device.id}`,
    status: device.status === "active" ? "Actif" : "Inactif",
    statusColor:
      device.status === "active"
        ? "bg-green-100 text-green-800"
        : "bg-red-100 text-red-800",
    lastActivity: new Date(device.last_reading).toLocaleDateString("fr-FR"),
  }));

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      <Sidebar />

      <main className="flex-1 ml-0 lg:ml-[250px]">
        <header className="bg-white border-b border-gray-200 shadow-sm px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              Tableau de bord des appareils
            </h1>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">Admin</span>
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className={`text-3xl font-bold mt-2 ${stat.iconColor}`}>
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}
                  >
                    <stat.Icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="border-b border-gray-200 px-6 py-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Liste des appareils
              </h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                <span className="text-2xl leading-none">+</span>
                <span>Ajouter appareil</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      ID Appareil
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Patient
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      État
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Dernière activité
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-8 text-center text-gray-600"
                      >
                        Chargement des appareils...
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-8 text-center text-red-600"
                      >
                        Erreur: {error}
                      </td>
                    </tr>
                  ) : displayDevices.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-8 text-center text-gray-600"
                      >
                        Aucun appareil trouvé
                      </td>
                    </tr>
                  ) : (
                    displayDevices.map((device) => (
                      <tr key={device.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {device.id}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {device.type}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {device.patient}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${device.statusColor}`}
                          >
                            {device.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {device.lastActivity}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <button className="text-blue-600 hover:text-blue-700">
                              <Eye className="w-5 h-5" />
                            </button>
                            <button className="text-gray-600 hover:text-gray-700">
                              <Edit className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Affichage de 1 à 10 sur 47 résultats
              </span>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded">
                  Précédent
                </button>
                <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded">
                  1
                </button>
                <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded">
                  2
                </button>
                <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded">
                  3
                </button>
                <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded">
                  Suivant
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
