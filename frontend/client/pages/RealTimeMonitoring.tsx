import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import {
  Heart,
  Droplet,
  Thermometer,
  Activity,
  Clock,
  Flame,
  Bed,
  Users,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  LogOut,
} from "lucide-react";
import { getMeasurementsLastHours } from "@/lib/api/influxdb";
import type { MeasurementData } from "@/lib/api/influxdb";
import { useAuth } from "@/lib/auth";

export default function RealTimeMonitoring() {
  const [measurements, setMeasurements] = useState<MeasurementData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const fullName = user ? `${user.firstName} ${user.lastName}` : "Utilisateur";
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const loadMeasurements = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await getMeasurementsLastHours(1);
      setMeasurements(data);
      setLastUpdate(new Date());
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load measurements";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMeasurements();
    const interval = setInterval(loadMeasurements, 30000);
    return () => clearInterval(interval);
  }, []);

  const getLatestMeasurementsByDevice = () => {
    const deviceMap = new Map<string, MeasurementData>();
    for (const measurement of measurements) {
      const key = measurement.device_id;
      const existing = deviceMap.get(key);
      if (!existing || new Date(measurement._time) > new Date(existing._time)) {
        deviceMap.set(key, measurement);
      }
    }
    return Array.from(deviceMap.values());
  };

  const latestMeasurements = getLatestMeasurementsByDevice();

  const getAverageValue = (deviceId: string) => {
    const deviceMeasurements = measurements.filter(
      (m) => m.device_id === deviceId,
    );
    if (deviceMeasurements.length === 0) return 0;
    const sum = deviceMeasurements.reduce((acc, m) => acc + m._value, 0);
    return (sum / deviceMeasurements.length).toFixed(1);
  };

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      <Sidebar />

      <main className="flex-1 ml-0 lg:ml-[250px]">
        <header className="bg-white border-b border-gray-200 shadow-sm px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              Suivi en Temps Réel
            </h1>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">{fullName}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="Déconnexion"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-xs lg:text-sm hidden sm:block">Déconnexion</span>
              </button>
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-8">
          <div className="mb-6 flex justify-between items-center">
            <div>
              {lastUpdate && (
                <p className="text-sm text-gray-600">
                  Dernière mise à jour: {lastUpdate.toLocaleTimeString("fr-FR")}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={loadMeasurements}
                disabled={isLoading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
                />
                <span>Actualiser</span>
              </button>
              <button className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Historique</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <div>
                  <h3 className="font-semibold text-red-900">
                    Erreur de chargement
                  </h3>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {latestMeasurements.length === 0 && !isLoading ? (
              <div className="col-span-3 bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                <p className="text-gray-600">
                  Aucune mesure disponible pour l'instant
                </p>
              </div>
            ) : (
              latestMeasurements.slice(0, 3).map((measurement) => (
                <div
                  key={measurement.device_id}
                  className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-5"
                >
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-blue-600" />
                    <div>
                      <h3 className="font-semibold text-blue-900">
                        Appareil {measurement.device_id}
                      </h3>
                      <p className="text-sm text-blue-700">
                        Valeur: {measurement._value.toFixed(2)} - Mise à jour
                        active
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {isLoading ? (
                <>
                  <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm animate-pulse">
                    <div className="h-40 bg-gray-200 rounded-lg"></div>
                  </div>
                  <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm animate-pulse">
                    <div className="h-40 bg-gray-200 rounded-lg"></div>
                  </div>
                </>
              ) : latestMeasurements.length > 0 ? (
                latestMeasurements.slice(0, 2).map((measurement, idx) => (
                  <div
                    key={`${measurement.device_id}-${idx}`}
                    className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 ${idx === 0 ? "bg-red-100" : "bg-blue-100"} rounded-lg flex items-center justify-center`}
                        >
                          {idx === 0 ? (
                            <Heart
                              className={`w-6 h-6 ${idx === 0 ? "text-red-600" : "text-blue-600"}`}
                            />
                          ) : (
                            <Droplet className="w-5 h-5 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold text-gray-900">
                            {idx === 0 ? "Appareil" : "Appareils"}{" "}
                            {measurement.device_id}
                          </h2>
                          <p className="text-sm text-gray-600">Temps réel</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`text-3xl font-bold ${idx === 0 ? "text-red-600" : "text-blue-600"}`}
                        >
                          {measurement._value.toFixed(1)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {measurement._measurement}
                        </div>
                      </div>
                    </div>
                    <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                      <p className="text-gray-400">
                        Données disponibles -{" "}
                        {
                          measurements.filter(
                            (m) => m.device_id === measurement.device_id,
                          ).length
                        }{" "}
                        mesures
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <p className="text-center text-gray-600">
                    Aucune donnée à afficher
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Thermometer className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Température Moyenne
                    </h3>
                    <p className="text-sm text-gray-600">Dernière heure</p>
                  </div>
                </div>
                <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
                  {measurements.length > 0 ? (
                    <div className="text-center">
                      <p className="text-2xl font-bold text-orange-600">
                        {(
                          measurements.reduce((acc, m) => acc + m._value, 0) /
                          measurements.length
                        ).toFixed(1)}
                        °C
                      </p>
                      <p className="text-sm text-gray-600">
                        {measurements.length} mesures
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-400">Aucune donnée</p>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                    <Activity className="w-5 h-5 text-cyan-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Appareils Actifs
                    </h3>
                    <p className="text-sm text-gray-600">
                      Connectés maintenant
                    </p>
                  </div>
                </div>
                <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-cyan-600">
                      {latestMeasurements.length}
                    </p>
                    <p className="text-sm text-gray-600">appareils</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Résumé des Appareils
                </h3>
                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {latestMeasurements.length === 0 ? (
                    <p className="text-sm text-gray-600 text-center py-4">
                      Aucun appareil actif
                    </p>
                  ) : (
                    latestMeasurements.map((measurement) => (
                      <div
                        key={measurement.device_id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <Activity className="w-4 h-4 text-blue-600" />
                          <div>
                            <span className="text-sm font-medium text-gray-900">
                              Device {measurement.device_id}
                            </span>
                            <p className="text-xs text-gray-600">
                              {new Date(measurement._time).toLocaleTimeString(
                                "fr-FR",
                              )}
                            </p>
                          </div>
                        </div>
                        <span className="font-semibold text-gray-900">
                          {measurement._value.toFixed(2)}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function AlertTriangle({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  );
}

function CheckCircle({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  );
}
