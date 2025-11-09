import Sidebar from "@/components/Sidebar";
import {
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  Bell,
  Droplet,
  Activity,
  Smile,
} from "lucide-react";

type Alert = {
  id: string;
  title: string;
  description: string;
  type: "critical" | "warning" | "info";
  bgColor: string;
  borderColor: string;
  textColor: string;
  descColor: string;
  badgeText?: string;
  badgeBg?: string;
  badgeTextColor?: string;
};

type HealthTip = {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  bgColor: string;
  borderColor: string;
  iconBg: string;
  textColor: string;
};

export default function PatientDashboard() {
  const alerts: Alert[] = [
    {
      id: "1",
      title: "Anomalie cardiaque détectée",
      description: "Rythme cardiaque irrégulier - 09:30",
      type: "critical",
      bgColor: "bg-[#FEF2F2]",
      borderColor: "border-[#FECACA]",
      textColor: "text-[#991B1B]",
      descColor: "text-[#7F1D1D]",
    },
    {
      id: "2",
      title: "Rappel médicament manqué",
      description: "Prise de midi non effectuée - 14:05",
      type: "warning",
      bgColor: "bg-[#FEFCE8]",
      borderColor: "border-[#FEF08A]",
      textColor: "text-[#92400E]",
      descColor: "text-[#78350F]",
      badgeText: "Attention",
      badgeBg: "bg-[#FEF3C7]",
      badgeTextColor: "text-[#92400E]",
    },
    {
      id: "3",
      title: "Rendez-vous confirmé",
      description: "Demain à 14:00 avec Dr. Sara",
      type: "info",
      bgColor: "bg-[#F0FDF4]",
      borderColor: "border-[#BBF7D0]",
      textColor: "text-[#065F46]",
      descColor: "text-[#047857]",
      badgeText: "Info",
      badgeBg: "bg-[#DCFCE7]",
      badgeTextColor: "text-[#065F46]",
    },
  ];

  const healthTips: HealthTip[] = [
    {
      id: "1",
      icon: <Droplet className="w-6 h-6 text-white" />,
      title: "Hydratation",
      description: "Buvez au moins 2L d'eau par jour",
      bgColor: "bg-[#F0F9FF]",
      borderColor: "border-[#BAE6FD]",
      iconBg: "bg-[#3B82F6]",
      textColor: "text-[#1E40AF]",
    },
    {
      id: "2",
      icon: <Activity className="w-6 h-6 text-white" />,
      title: "Exercice léger",
      description: "30 min de marche",
      bgColor: "bg-[#F0FDF4]",
      borderColor: "border-[#BBF7D0]",
      iconBg: "bg-[#10B981]",
      textColor: "text-[#065F46]",
    },
    {
      id: "3",
      icon: <Smile className="w-6 h-6 text-white" />,
      title: "Repos suffisant",
      description: "7-8h de sommeil/nuit",
      bgColor: "bg-[#FEF3C7]",
      borderColor: "border-[#FEF08A]",
      iconBg: "bg-[#F59E0B]",
      textColor: "text-[#92400E]",
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#F5F7FA]">
      <Sidebar />

      <div className="flex-1 lg:ml-[250px]">
        {/* Header */}
        <header className="h-20 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-6 lg:px-10">
          <div>
            <h1 className="text-[#1E293B] text-xl lg:text-[28px] font-bold">
              Bonjour, Ahmed
            </h1>
            <p className="text-[#64748B] text-sm hidden sm:block">
              Bienvenue sur votre tableau de bord
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-[60px] h-[60px] rounded-full bg-[#DBEAFE] flex items-center justify-center">
              <span className="text-[#2563EB] text-xl font-bold">AK</span>
            </div>
            <span className="text-[#64748B] text-xs hidden lg:block">
              Ahmed Khalid
            </span>
          </div>
        </header>

        {/* Main Content */}
        <div className="p-6 lg:p-10">
          {/* Top Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Next Appointment Card */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-[50px] h-[50px] rounded-full bg-[#DBEAFE] flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-6 h-6 text-[#2563EB]" />
                </div>
                <div className="flex-1">
                  <p className="text-[#1E293B] text-sm font-bold">
                    Prochain Rendez-vous
                  </p>
                </div>
              </div>
              <p className="text-[#2563EB] text-lg font-bold mb-2">
                Demain - 14:00
              </p>
              <p className="text-[#64748B] text-[13px] mb-1">Dr. Sara Ahmed</p>
              <p className="text-[#94A3B8] text-xs">Suivi anomalie cardiaque</p>
            </div>

            {/* Current Treatment Card */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-[50px] h-[50px] rounded-full bg-[#D1FAE5] flex items-center justify-center flex-shrink-0 relative">
                  <Clock className="w-6 h-6 text-[#10B981]" />
                </div>
                <div className="flex-1">
                  <p className="text-[#1E293B] text-sm font-bold">
                    Traitement en Cours
                  </p>
                </div>
              </div>
              <p className="text-[#10B981] text-lg font-bold mb-2">
                Amoxicilline 500mg
              </p>
              <p className="text-[#64748B] text-[13px] mb-3">
                Progression: 85%
              </p>
              <div className="w-full h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#10B981] rounded-full"
                  style={{ width: "85%" }}
                ></div>
              </div>
            </div>

            {/* Next Reminder Card */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-[50px] h-[50px] rounded-full bg-[#FEF3C7] flex items-center justify-center flex-shrink-0">
                  <Bell className="w-6 h-6 text-[#F59E0B]" />
                </div>
                <div className="flex-1">
                  <p className="text-[#1E293B] text-sm font-bold">
                    Prochain Rappel
                  </p>
                </div>
              </div>
              <p className="text-[#F59E0B] text-lg font-bold mb-2">
                Aujourd'hui - 14:00
              </p>
              <p className="text-[#64748B] text-[13px]">Prise médicament</p>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Alerts - Takes 2 columns */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-[#1E293B] text-xl font-bold">
                    Mes Alertes Récentes
                  </h2>
                  <button className="px-4 h-[30px] bg-[#F1F5F9] text-[#64748B] text-[13px] rounded hover:bg-[#E2E8F0] transition-colors">
                    Voir tout
                  </button>
                </div>

                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`${alert.bgColor} border ${alert.borderColor} rounded-lg p-4`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          {alert.type === "critical" && (
                            <div className="w-[30px] h-[30px] rounded-full bg-[#EF4444] flex items-center justify-center">
                              <span className="text-white text-base font-bold">
                                !
                              </span>
                            </div>
                          )}
                          {alert.type === "warning" && (
                            <div className="w-[30px] h-[30px] rounded-full bg-[#F59E0B] flex items-center justify-center">
                              <div className="flex flex-col gap-1">
                                <div className="w-1 h-1 rounded-full bg-white"></div>
                                <div className="w-1 h-1 rounded-full bg-white"></div>
                              </div>
                            </div>
                          )}
                          {alert.type === "info" && (
                            <div className="w-[30px] h-[30px] rounded-full bg-[#10B981] flex items-center justify-center">
                              <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`${alert.textColor} text-sm font-bold mb-1`}
                          >
                            {alert.title}
                          </p>
                          <p className={`${alert.descColor} text-xs`}>
                            {alert.description}
                          </p>
                        </div>
                        {alert.badgeText && (
                          <div
                            className={`${alert.badgeBg} ${alert.badgeTextColor} px-3 py-1 rounded-full text-[11px] flex-shrink-0`}
                          >
                            {alert.badgeText}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Health Tips - Takes 1 column */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-6">
                <h2 className="text-[#1E293B] text-lg font-bold mb-6">
                  Conseils Santé
                </h2>

                <div className="space-y-4">
                  {healthTips.map((tip) => (
                    <div
                      key={tip.id}
                      className={`${tip.bgColor} border ${tip.borderColor} rounded-lg p-4`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-[30px] h-[30px] rounded-full ${tip.iconBg} flex items-center justify-center flex-shrink-0`}
                        >
                          {tip.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`${tip.textColor} text-[13px] font-bold mb-1`}
                          >
                            {tip.title}
                          </p>
                          <p
                            className={`${tip.textColor} text-[11px] leading-relaxed`}
                          >
                            {tip.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
