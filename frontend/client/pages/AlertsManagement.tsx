import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import {
  Bell,
  AlertTriangle,
  Clock,
  CheckCircle,
  RefreshCw,
  Search,
  Users,
} from "lucide-react";
import { getMeasurementsLastHours, MeasurementData } from "@/lib/api/influxdb";
import { getDevices, Device } from "@/lib/api/devices";

interface Alert {
  id: string;
  severity: "Critique" | "Élevée" | "Moyenne";
  severityColor: string;
  device: string;
  message: string;
  value: number;
  patient: string;
  time: string;
  status: "En attente" | "Validée";
  statusColor: string;
  deviceId: string;
}

const ALERT_THRESHOLDS: Record<
  string,
  { min: number; max: number; normal: { min: number; max: number } }
> = {
  heart_rate: { min: 40, max: 100, normal: { min: 60, max: 100 } },
  temperature: { min: 36, max: 39, normal: { min: 36.5, max: 37.5 } },
  blood_pressure: { min: 90, max: 160, normal: { min: 90, max: 120 } },
  oxygen_saturation: { min: 92, max: 100, normal: { min: 95, max: 100 } },
};

export default function AlertsManagement() {
  const [measurements, setMeasurements] = useState<MeasurementData[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [generatedAlerts, setGeneratedAlerts] = useState<Alert[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setError("");
    try {
      const [measurementsData, devicesData] = await Promise.all([
        getMeasurementsLastHours(1),
        getDevices(),
      ]);
      setMeasurements(measurementsData);
      setDevices(devicesData);
      setLastUpdate(new Date());
      generateAlerts(measurementsData, devicesData);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load data";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const generateAlerts = (
    measurements: MeasurementData[],
    devices: Device[],
  ) => {
    const alerts: Alert[] = [];
    const deviceMap = new Map(devices.map((d) => [d.id.toString(), d]));
    const seenKeys = new Set<string>();

    for (const measurement of measurements) {
      const key = `${measurement.device_id}-${measurement._measurement}`;
      if (seenKeys.has(key)) continue;
      seenKeys.add(key);

      const device = deviceMap.get(measurement.device_id);
      const value = measurement._value;

      let severity: "Critique" | "Élevée" | "Moyenne" = "Moyenne";
      let message = "";
      let shouldAlert = false;

      const thresholds = ALERT_THRESHOLDS[measurement._measurement] || {
        min: 0,
        max: 100,
        normal: { min: 25, max: 75 },
      };

      if (value < thresholds.normal.min) {
        severity = value < thresholds.min ? "Critique" : "Élevée";
        message = `Valeur faible: ${value.toFixed(2)} (seuil min: ${thresholds.normal.min})`;
        shouldAlert = true;
      } else if (value > thresholds.normal.max) {
        severity = value > thresholds.max ? "Critique" : "Élevée";
        message = `Valeur élevée: ${value.toFixed(2)} (seuil max: ${thresholds.normal.max})`;
        shouldAlert = true;
      }

      if (shouldAlert) {
        alerts.push({
          id: `${measurement.device_id}-${Date.now()}-${Math.random()}`,
          severity,
          severityColor:
            severity === "Critique"
              ? "bg-red-100 text-red-800"
              : severity === "Élevée"
                ? "bg-orange-100 text-orange-800"
                : "bg-yellow-100 text-yellow-800",
          device: device?.name || `Device ${measurement.device_id}`,
          message,
          value,
          patient: device ? `Patient avec appareil ${device.name}` : "Unknown",
          time: new Date().toLocaleTimeString("fr-FR"),
          status: "En attente",
          statusColor: "bg-orange-100 text-orange-800",
          deviceId: measurement.device_id,
        });
      }
    }

    setGeneratedAlerts(alerts);
  };

  const totalAlerts = generatedAlerts.length;
  const criticalAlerts = generatedAlerts.filter(
    (a) => a.severity === "Critique",
  ).length;
  const pendingAlerts = generatedAlerts.filter(
    (a) => a.status === "En attente",
  ).length;
  const resolvedAlerts = generatedAlerts.filter(
    (a) => a.status === "Validée",
  ).length;

  const stats = [
    {
      label: "Total Alertes",
      value: totalAlerts.toString(),
      color: "bg-blue-100",
      iconColor: "text-blue-600",
      Icon: Bell,
    },
    {
      label: "Critiques",
      value: criticalAlerts.toString(),
      color: "bg-red-100",
      iconColor: "text-red-600",
      Icon: AlertTriangle,
    },
    {
      label: "En Attente",
      value: pendingAlerts.toString(),
      color: "bg-orange-100",
      iconColor: "text-orange-600",
      Icon: Clock,
    },
    {
      label: "Résolues",
      value: resolvedAlerts.toString(),
      color: "bg-green-100",
      iconColor: "text-green-600",
      Icon: CheckCircle,
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8FBFF]">
      <Sidebar />

      <main className="flex-1 ml-0 lg:ml-[250px]">
        <header className="bg-white border-b border-gray-200 shadow-sm px-8 py-5">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">
              Gestion des Alertes des appareils médicaux
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
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Filtres et Actions
              </h2>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">
                  {lastUpdate
                    ? `Mise à jour: ${lastUpdate.toLocaleTimeString("fr-FR")}`
                    : "Chargement..."}
                </span>
                <button
                  onClick={loadData}
                  disabled={isLoading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
                  />
                  <span>Actualiser</span>
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Criticité
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>Toutes les alertes</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>Tous les statuts</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Appareil
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>Tous les appareils</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recherche
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.label}
                    </p>
                    <p className={`text-2xl font-bold mt-2 ${stat.iconColor}`}>
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}
                  >
                    <stat.Icon className={`w-5 h-5 ${stat.iconColor}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Liste des Alertes
              </h2>
              <div className="flex items-center gap-3">
                <button className="text-gray-600 hover:text-gray-900 text-sm">
                  Exporter
                </button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                  Actions groupées
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="w-8 px-6 py-4"></th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Criticité
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Appareil
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Message
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Patient
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Heure
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Statut
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
                        colSpan={8}
                        className="px-6 py-8 text-center text-gray-600"
                      >
                        Chargement des alertes...
                      </td>
                    </tr>
                  ) : generatedAlerts.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-6 py-8 text-center text-gray-600"
                      >
                        Aucune alerte actuellement
                      </td>
                    </tr>
                  ) : (
                    generatedAlerts.map((alert) => (
                      <tr key={alert.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${alert.severityColor}`}
                          >
                            {alert.severity}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {alert.device}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {alert.message}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {alert.patient}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {alert.time}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${alert.statusColor}`}
                          >
                            {alert.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button className="text-blue-600 hover:text-blue-700 text-sm">
                            Détails
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
