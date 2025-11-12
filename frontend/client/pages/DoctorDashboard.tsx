import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import DoctorSidebar from "@/components/DoctorSidebar";
import {
  User,
  Users,
  Calendar,
  AlertCircle,
  Award,
  Plus,
  CheckCircle,
  AlertTriangle,
  Circle,
} from "lucide-react";

type Alert = {
  id: string;
  patientInitials: string;
  patientName: string;
  alertTitle: string;
  alertDetails: string;
  timestamp: string;
  initialsColor: string;
  actionButton: string;
  actionButtonColor: string;
  secondaryButton: string;
};

type Appointment = {
  id: string;
  initials: string;
  name: string;
  time: string;
  type: string;
  initialsColor: string;
  timeColor: string;
  borderColor: string;
  bgColor: string;
};

type RecentPatient = {
  id: string;
  initials: string;
  name: string;
  lastVisit: string;
  initialsColor: string;
  statusIcon: "check" | "alert" | "warning";
  statusColor: string;
};

export default function DoctorDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const alerts: Alert[] = [
    {
      id: "1",
      patientInitials: "AK",
      patientName: "Ahmed Khalid",
      alertTitle: "Anomalie cardiaque détectée",
      alertDetails: "Rythme cardiaque irrégulier - FC: 125 bpm",
      timestamp: "⏰ Il y a 15 minutes",
      initialsColor: "bg-[#DBEAFE] text-[#2563EB]",
      actionButton: "Planifier RDV",
      actionButtonColor: "bg-[#EF4444]",
      secondaryButton: "Voir historique",
    },
    {
      id: "2",
      patientInitials: "MH",
      patientName: "Mohammed Hassan",
      alertTitle: "Traitement interrompu",
      alertDetails: "3 prises consécutives manquées - Aspirine 100mg",
      timestamp: "⏰ Il y a 2 heures",
      initialsColor: "bg-[#FECACA] text-[#DC2626]",
      actionButton: "Contacter",
      actionButtonColor: "bg-[#EF4444]",
      secondaryButton: "Voir détails",
    },
    {
      id: "3",
      patientInitials: "FZ",
      patientName: "Fatima Zahra",
      alertTitle: "Tension artérielle élevée",
      alertDetails: "TA: 160/95 mmHg - Valeur au-dessus de la normale",
      timestamp: "⏰ Il y a 3 heures",
      initialsColor: "bg-[#FEF3C7] text-[#D97706]",
      actionButton: "Planifier RDV",
      actionButtonColor: "bg-[#EF4444]",
      secondaryButton: "Voir capteurs",
    },
  ];

  const appointments: Appointment[] = [
    {
      id: "1",
      initials: "AK",
      name: "Ahmed Khalid",
      time: "🕐 14:00 - 14:30",
      type: "Suivi anomalie cardiaque",
      initialsColor: "bg-[#DBEAFE] text-[#2563EB]",
      timeColor: "text-[#1E40AF]",
      borderColor: "border-[#BAE6FD]",
      bgColor: "bg-[#F0F9FF]",
    },
    {
      id: "2",
      initials: "FZ",
      name: "Fatima Zahra",
      time: "🕐 15:00 - 15:30",
      type: "Consultation générale",
      initialsColor: "bg-[#FEF3C7] text-[#F59E0B]",
      timeColor: "text-[#475569]",
      borderColor: "border-[#CBD5E1]",
      bgColor: "bg-[#F8FAFC]",
    },
    {
      id: "3",
      initials: "KA",
      name: "Khalid Admin",
      time: "🕐 16:00 - 16:30",
      type: "Suivi diabète",
      initialsColor: "bg-[#E0E7FF] text-[#4F46E5]",
      timeColor: "text-[#475569]",
      borderColor: "border-[#CBD5E1]",
      bgColor: "bg-[#F8FAFC]",
    },
  ];

  const recentPatients: RecentPatient[] = [
    {
      id: "1",
      initials: "AK",
      name: "Ahmed Khalid",
      lastVisit: "Dernière visite: Hier",
      initialsColor: "bg-[#DBEAFE] text-[#2563EB]",
      statusIcon: "check",
      statusColor: "bg-[#10B981]",
    },
    {
      id: "2",
      initials: "MH",
      name: "Mohammed Hassan",
      lastVisit: "Dernière visite: 2 jours",
      initialsColor: "bg-[#FECACA] text-[#DC2626]",
      statusIcon: "alert",
      statusColor: "bg-[#EF4444]",
    },
    {
      id: "3",
      initials: "FZ",
      name: "Fatima Zahra",
      lastVisit: "Dernière visite: 1 semaine",
      initialsColor: "bg-[#FEF3C7] text-[#F59E0B]",
      statusIcon: "warning",
      statusColor: "bg-[#F59E0B]",
    },
  ];

  const fullName = user ? `${user.firstName} ${user.lastName}` : "Utilisateur";
  const initials = user
    ? (user.firstName[0] + user.lastName[0]).toUpperCase()
    : "--";
  const doctorTitle = user?.role === "DOCTOR" ? `Dr. ${fullName}` : fullName;
  const alertsCount = alerts.length;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-[#F5F7FA]">
      <DoctorSidebar />

      <div className="flex-1 lg:ml-[250px]">
        {/* Header */}
        <header className="h-20 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-6 lg:px-10">
          <div>
            <h1 className="text-[#1E293B] text-xl lg:text-[28px] font-bold">
              {`Bonjour, ${doctorTitle}`}
            </h1>
            <p className="text-[#64748B] text-sm hidden sm:block">
              {"Vue d'ensemble de vos patients"}
            </p>
          </div>
          <div className="flex items-center gap-3 relative">
            <div className="relative">
              <div className="w-[60px] h-[60px] rounded-full bg-[#DBEAFE] flex items-center justify-center">
                <span className="text-[#2563EB] text-xl font-bold">{initials}</span>
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#EF4444] flex items-center justify-center">
                <span className="text-white text-[11px] font-bold">{alertsCount}</span>
              </div>
            </div>
            <span className="text-[#64748B] text-xs hidden lg:block absolute -bottom-6 right-0">
              {doctorTitle}
            </span>
            <button
              onClick={handleLogout}
              className="ml-8 h-9 px-4 bg-[#EF4444] text-white text-sm font-semibold rounded hover:bg-[#DC2626] transition-colors"
            >
              Déconnexion
            </button>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="p-6 lg:p-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-[50px] h-[50px] rounded-full bg-[#DBEAFE] flex items-center justify-center">
                <Users className="w-6 h-6 text-[#2563EB]" />
              </div>
              <div>
                <p className="text-[#64748B] text-[13px] mb-1">
                  Patients Actifs
                </p>
                <p className="text-[#2563EB] text-[32px] font-bold leading-none">
                  24
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-[50px] h-[50px] rounded-full bg-[#FEE2E2] flex items-center justify-center">
                <span className="text-[#EF4444] text-2xl font-bold">!</span>
              </div>
              <div>
                <p className="text-[#64748B] text-[13px] mb-1">
                  Alertes Critiques
                </p>
                <p className="text-[#EF4444] text-[32px] font-bold leading-none">
                  3
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-[50px] h-[50px] rounded-full bg-[#D1FAE5] flex items-center justify-center">
                <Calendar className="w-6 h-6 text-[#10B981]" />
              </div>
              <div>
                <p className="text-[#64748B] text-[13px] mb-1">
                  RDV Aujourd'hui
                </p>
                <p className="text-[#10B981] text-[32px] font-bold leading-none">
                  5
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-[50px] h-[50px] rounded-full bg-[#FEF3C7] flex items-center justify-center">
                <Award className="w-6 h-6 text-[#F59E0B]" />
              </div>
              <div>
                <p className="text-[#64748B] text-[13px] mb-1">En Attente</p>
                <p className="text-[#F59E0B] text-[32px] font-bold leading-none">
                  8
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="px-6 lg:px-10 pb-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Alerts & Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Critical Alerts */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[#1E293B] text-xl font-bold">
                  Alertes Critiques
                </h2>
                <button className="px-6 h-[30px] bg-[#EF4444] text-white text-[13px] font-bold rounded hover:bg-[#DC2626] transition-colors">
                  Voir toutes (3)
                </button>
              </div>

              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="bg-[#FEF2F2] border-2 border-[#FECACA] rounded-lg p-4"
                  >
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-[50px] h-[50px] rounded-full bg-[#EF4444] flex items-center justify-center">
                          <span className="text-white text-2xl font-bold">
                            !
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className={`w-10 h-10 rounded-full ${alert.initialsColor} flex items-center justify-center text-sm font-bold`}
                          >
                            {alert.patientInitials}
                          </div>
                          <h3 className="text-[#1E293B] text-base font-bold">
                            {alert.patientName}
                          </h3>
                        </div>
                        <p className="text-[#991B1B] text-sm font-bold mb-1">
                          {alert.alertTitle}
                        </p>
                        <p className="text-[#7F1D1D] text-xs mb-2">
                          {alert.alertDetails}
                        </p>
                        <p className="text-[#991B1B] text-[11px]">
                          {alert.timestamp}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        <button
                          className={`px-4 h-[35px] ${alert.actionButtonColor} text-white text-[13px] font-bold rounded hover:opacity-90 transition-opacity whitespace-nowrap`}
                        >
                          {alert.actionButton}
                        </button>
                        <button className="px-4 h-[25px] bg-[#F1F5F9] text-[#475569] text-xs rounded hover:bg-[#E2E8F0] transition-colors whitespace-nowrap">
                          {alert.secondaryButton}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="text-[#1E293B] text-base font-bold mb-4">
                Actions Rapides
              </h2>
              <div className="flex flex-wrap gap-4">
                <button className="px-6 h-[35px] bg-[#2563EB] text-white text-[13px] font-bold rounded hover:bg-[#1d4ed8] transition-colors flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Nouveau Patient
                </button>
                <button className="px-6 h-[35px] bg-[#10B981] text-white text-[13px] font-bold rounded hover:bg-[#059669] transition-colors flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Planifier RDV
                </button>
                <button className="px-6 h-[35px] bg-[#F59E0B] text-white text-[13px] font-bold rounded hover:bg-[#D97706] transition-colors">
                  Générer Rapport
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Appointments & Recent Patients */}
          <div className="space-y-6">
            {/* Today's Appointments */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[#1E293B] text-lg font-bold">
                  RDV Aujourd'hui
                </h2>
                <div className="bg-[#DCFCE7] text-[#166534] px-4 py-1 rounded-full text-[11px]">
                  5 RDV
                </div>
              </div>

              <div className="space-y-3">
                {appointments.map((apt) => (
                  <div
                    key={apt.id}
                    className={`${apt.bgColor} border ${apt.borderColor} rounded-lg p-4`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className={`w-9 h-9 rounded-full ${apt.initialsColor} flex items-center justify-center text-sm font-bold`}
                      >
                        {apt.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[#1E293B] text-sm font-bold">
                          {apt.name}
                        </p>
                      </div>
                    </div>
                    <p className={`${apt.timeColor} text-xs mb-1 pl-12`}>
                      {apt.time}
                    </p>
                    <p className="text-[#64748B] text-[11px] pl-12">
                      {apt.type}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Patients */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-6">
              <h2 className="text-[#1E293B] text-lg font-bold mb-6">
                Patients Récents
              </h2>
              <div className="space-y-4">
                {recentPatients.map((patient) => (
                  <div key={patient.id} className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-full ${patient.initialsColor} flex items-center justify-center text-sm font-bold`}
                    >
                      {patient.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[#1E293B] text-[13px] font-bold">
                        {patient.name}
                      </p>
                      <p className="text-[#64748B] text-[11px]">
                        {patient.lastVisit}
                      </p>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full ${patient.statusColor} flex items-center justify-center flex-shrink-0`}
                    >
                      {patient.statusIcon === "check" && (
                        <CheckCircle className="w-3 h-3 text-white" />
                      )}
                      {patient.statusIcon === "alert" && (
                        <span className="text-white text-sm font-bold">!</span>
                      )}
                      {patient.statusIcon === "warning" && (
                        <div className="flex flex-col gap-0.5">
                          <div className="w-1 h-1 rounded-full bg-white"></div>
                          <div className="w-1 h-1 rounded-full bg-white"></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
