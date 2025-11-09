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

export default function AlertsManagement() {
  const stats = [
    {
      label: "Total Alertes",
      value: "47",
      color: "bg-blue-100",
      iconColor: "text-blue-600",
      Icon: Bell,
    },
    {
      label: "Critiques",
      value: "8",
      color: "bg-red-100",
      iconColor: "text-red-600",
      Icon: AlertTriangle,
    },
    {
      label: "En Attente",
      value: "23",
      color: "bg-orange-100",
      iconColor: "text-orange-600",
      Icon: Clock,
    },
    {
      label: "Résolues",
      value: "16",
      color: "bg-green-100",
      iconColor: "text-green-600",
      Icon: CheckCircle,
    },
  ];

  const alerts = [
    {
      severity: "Critique",
      severityColor: "bg-red-100 text-red-800",
      device: "Moniteur Cardiaque MC-401",
      message: "Rythme cardiaque anormale détecté",
      patient: "Marie Dupont - Ch.205",
      time: "14:32",
      status: "En attente",
      statusColor: "bg-orange-100 text-orange-800",
    },
    {
      severity: "Élevée",
      severityColor: "bg-orange-100 text-orange-800",
      device: "Respirateur VR-302",
      message: "Pression d'oxygène faible",
      patient: "Jean Martin - Ch.103",
      time: "14:28",
      status: "En attente",
      statusColor: "bg-orange-100 text-orange-800",
    },
    {
      severity: "Moyenne",
      severityColor: "bg-yellow-100 text-yellow-800",
      device: "Perfusion PF-201",
      message: "Débit modifié automatiquement",
      patient: "Sophie Bernard - Ch.301",
      time: "14:15",
      status: "Validée",
      statusColor: "bg-green-100 text-green-800",
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
                  Dernière mise à jour: il y a 2 min
                </span>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  <span>Actualiser</span>
                </button>
              </div>
            </div>

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
                  {alerts.map((alert, index) => (
                    <tr key={index} className="hover:bg-gray-50">
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
                          Voir détails
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
