import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  MoreVertical,
  ChevronLeft,
} from "lucide-react";

interface Patient {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  medication: string;
  medicationType: string;
  frequency: string;
  schedule: string;
  progress: number;
  totalDays: number;
  currentDays: number;
  status: "actif" | "alerte" | "terminé" | "suspendu";
}

const patients: Patient[] = [
  {
    id: "#P001",
    name: "Ahmed Khalid",
    initials: "AK",
    avatarColor: "#FBBF24",
    medication: "Aspirine 100mg",
    medicationType: "Anticoagulant",
    frequency: "1x / jour",
    schedule: "Matin - 08:00",
    progress: 93,
    totalDays: 30,
    currentDays: 28,
    status: "actif",
  },
  {
    id: "#P005",
    name: "Fatima Zahra",
    initials: "FZ",
    avatarColor: "#EC4899",
    medication: "Metformine 850mg",
    medicationType: "Antidiabétique",
    frequency: "2x / jour",
    schedule: "Matin & Soir",
    progress: 60,
    totalDays: 25,
    currentDays: 15,
    status: "actif",
  },
  {
    id: "#P004",
    name: "Mohammed Hassan",
    initials: "MH",
    avatarColor: "#8B5CF6",
    medication: "Lisinopril 10mg",
    medicationType: "Antihypertenseur",
    frequency: "1x / jour",
    schedule: "Soir - 20:00",
    progress: 8,
    totalDays: 60,
    currentDays: 5,
    status: "alerte",
  },
  {
    id: "#P003",
    name: "Khalid Admin",
    initials: "KA",
    avatarColor: "#06B6D4",
    medication: "Oméprazole 20mg",
    medicationType: "Inhibiteur pompe à protons",
    frequency: "1x / jour",
    schedule: "Matin - 07:30",
    progress: 100,
    totalDays: 14,
    currentDays: 14,
    status: "terminé",
  },
  {
    id: "#P008",
    name: "Leila Mansouri",
    initials: "LM",
    avatarColor: "#F97316",
    medication: "Levothyroxine 75µg",
    medicationType: "Hormone thyroïdienne",
    frequency: "1x / jour",
    schedule: "Matin - 06:30",
    progress: 22,
    totalDays: 90,
    currentDays: 20,
    status: "actif",
  },
  {
    id: "#P012",
    name: "ahmed khalil",
    initials: "YB",
    avatarColor: "#14B8A6",
    medication: "Atorvastatine 40mg",
    medicationType: "Hypolipémiant",
    frequency: "1x / jour",
    schedule: "Soir - 21:00",
    progress: 22,
    totalDays: 45,
    currentDays: 10,
    status: "suspendu",
  },
];

const getStatusStyles = (status: Patient["status"]) => {
  switch (status) {
    case "actif":
      return "bg-[#D1FAE5] text-[#059669]";
    case "alerte":
      return "bg-[#FEE2E2] text-[#DC2626]";
    case "terminé":
      return "bg-[#DBEAFE] text-[#2563EB]";
    case "suspendu":
      return "bg-[#FEF3C7] text-[#D97706]";
  }
};

const getStatusLabel = (status: Patient["status"]) => {
  switch (status) {
    case "actif":
      return "Actif";
    case "alerte":
      return "Alerte";
    case "terminé":
      return "Terminé";
    case "suspendu":
      return "Suspendu";
  }
};

const getProgressColor = (progress: number) => {
  if (progress >= 80) return "#10B981";
  if (progress >= 50) return "#3B82F6";
  if (progress >= 20) return "#F59E0B";
  return "#EF4444";
};

export default function ProfilesDashboard() {
  return (
    <div className="flex min-h-screen bg-[#F5F7FA]">
      <Sidebar />
      <div className="flex-1 ml-[250px]">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 h-20 flex items-center justify-between px-10">
          <h1 className="text-2xl font-bold text-[#1E293B]">
            Tableau de Bord - Profils
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#64748B]">Admin</span>
            <div className="w-10 h-10 rounded-full bg-[#2563EB] flex items-center justify-center">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 9.6875C9.2965 9.6875 8.59988 9.56625 7.94992 9.33068C7.29996 9.09512 6.70939 8.74984 6.21194 8.31456C5.71448 7.87929 5.31988 7.36254 5.05065 6.79383C4.78143 6.22511 4.64287 5.61557 4.64287 5C4.64287 4.38443 4.78143 3.77489 5.05065 3.20617C5.31988 2.63746 5.71448 2.12071 6.21194 1.68544C6.70939 1.25016 7.29996 0.904884 7.94992 0.669315C8.59988 0.433746 9.2965 0.3125 10 0.3125C10.7035 0.3125 11.4001 0.433746 12.0501 0.669315C12.7001 0.904884 13.2906 1.25016 13.7881 1.68544C14.2855 2.12071 14.6801 2.63746 14.9494 3.20617C15.2186 3.77489 15.3572 4.38443 15.3572 5C15.3572 5.61557 15.2186 6.22511 14.9494 6.79383C14.6801 7.36254 14.2855 7.87929 13.7881 8.31456C13.2906 8.74984 12.7001 9.09512 12.0501 9.33068C11.4001 9.56625 10.7035 9.6875 10 9.6875ZM8.6384 11.875H11.3616C11.7947 11.875 12.1429 12.1797 12.1429 12.5586C12.1429 12.7227 12.0759 12.8789 11.9554 13.0039L10.7322 14.2539L12.1161 18.75H12.1429L13.6875 13.3398C13.7857 13 14.183 12.793 14.558 12.918C17.3214 13.8398 19.2857 16.1836 19.2857 18.9258C19.2857 19.5156 18.7366 19.9961 18.0625 19.9961L1.93751 20C1.2634 20 0.714294 19.5195 0.714294 18.9297C0.714294 16.1875 2.67858 13.8438 5.44197 12.9219C5.81697 12.7969 6.21429 13.0039 6.31251 13.3438L7.85715 18.7539H7.88394L9.26787 14.2578L8.04465 13.0078C7.92412 12.8828 7.85715 12.7266 7.85715 12.5625C7.85715 12.1836 8.20537 11.8789 8.6384 11.8789V11.875Z"
                  fill="white"
                />
              </svg>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Active Treatments */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[#64748B] text-[13px] mb-2">
                    Traitements Actifs
                  </p>
                  <p className="text-[36px] font-bold text-[#2563EB] leading-tight">
                    24
                  </p>
                </div>
                <div className="w-11 h-11 rounded-full bg-[#DBEAFE] flex items-center justify-center">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="8"
                      stroke="rgba(0,0,0,0.25)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M20 12C20 14.1217 19.1571 16.1566 17.6569 17.6569C16.1566 19.1571 14.1217 20 12 20"
                      stroke="#2563EB"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Completed Today */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[#64748B] text-[13px] mb-2">
                    Prises Aujourd'hui
                  </p>
                  <p className="text-[36px] font-bold text-[#10B981] leading-tight">
                    18/24
                  </p>
                </div>
                <div className="w-11 h-11 rounded-full bg-[#D1FAE5] flex items-center justify-center">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="12" cy="12" r="11" fill="#D1FAE5" />
                    <path
                      d="M8 12L11 15L16 9"
                      stroke="#10B981"
                      strokeWidth="2.5"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Missed Reminders */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[#64748B] text-[13px] mb-2">
                    Rappels Manqués
                  </p>
                  <p className="text-[36px] font-bold text-[#EF4444] leading-tight">
                    6
                  </p>
                </div>
                <div className="w-11 h-11 rounded-full bg-[#FEE2E2] flex items-center justify-center relative">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="11"
                      cy="11"
                      r="10"
                      stroke="#EF4444"
                      strokeWidth="2"
                    />
                  </svg>
                  <span className="absolute text-[14px] font-bold text-[#EF4444]">
                    !
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] mb-6">
            <div className="p-5 flex flex-wrap gap-4 items-center">
              {/* Search */}
              <div className="relative flex-1 min-w-[300px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-[13px] h-[13px] text-white" />
                <Input
                  placeholder="Rechercher un profil..."
                  className="pl-10 bg-[#F8FAFC] border-[#E2E8F0] h-10 text-[14px] placeholder:text-[#94A3B8]"
                />
              </div>

              {/* Filter Buttons */}
              <div className="flex gap-2">
                <Button className="bg-[#2563EB] text-white hover:bg-[#1E40AF] h-10 text-[13px] px-6">
                  Tous
                </Button>
                <Button
                  variant="outline"
                  className="h-10 border-[#E2E8F0] text-[#64748B] text-[13px] px-6 hover:bg-[#F8FAFC]"
                >
                  Docteurs
                </Button>
                <Button
                  variant="outline"
                  className="h-10 border-[#E2E8F0] text-[#64748B] text-[13px] px-6 hover:bg-[#F8FAFC]"
                >
                  Patients
                </Button>
              </div>

              {/* Add Button */}
              <Button className="bg-[#10B981] text-white hover:bg-[#059669] h-10 text-[13px] px-5">
                + Ajouter
              </Button>
            </div>
          </div>

          {/* Patient Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="bg-[#F8FAFC] px-6 py-4 border-b border-[#E2E8F0]">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-3">
                  <h3 className="text-[12px] font-bold text-[#64748B] uppercase">
                    Patient
                  </h3>
                </div>
                <div className="col-span-3">
                  <h3 className="text-[12px] font-bold text-[#64748B] uppercase">
                    Médicament
                  </h3>
                </div>
                <div className="col-span-2">
                  <h3 className="text-[12px] font-bold text-[#64748B] uppercase">
                    Fréquence
                  </h3>
                </div>
                <div className="col-span-2">
                  <h3 className="text-[12px] font-bold text-[#64748B] uppercase">
                    Progression
                  </h3>
                </div>
                <div className="col-span-2">
                  <h3 className="text-[12px] font-bold text-[#64748B] uppercase">
                    Statut
                  </h3>
                </div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-[#E2E8F0]">
              {patients.map((patient) => (
                <div
                  key={patient.id}
                  className="px-6 py-4 hover:bg-[#F8FAFC] transition-colors"
                >
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* Patient */}
                    <div className="col-span-3 flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: patient.avatarColor }}
                      >
                        <span className="text-white text-[12px] font-bold">
                          {patient.initials}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] text-[#1E293B] font-normal truncate">
                          {patient.name}
                        </p>
                        <p className="text-[11px] text-[#94A3B8] truncate">
                          ID: {patient.id}
                        </p>
                      </div>
                    </div>

                    {/* Medication */}
                    <div className="col-span-3">
                      <p className="text-[13px] text-[#1E293B] truncate">
                        {patient.medication}
                      </p>
                      <p className="text-[11px] text-[#94A3B8] truncate">
                        {patient.medicationType}
                      </p>
                    </div>

                    {/* Frequency */}
                    <div className="col-span-2">
                      <p className="text-[13px] text-[#1E293B]">
                        {patient.frequency}
                      </p>
                      <p className="text-[11px] text-[#94A3B8]">
                        {patient.schedule}
                      </p>
                    </div>

                    {/* Progress */}
                    <div className="col-span-2">
                      <div className="w-full h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${patient.progress}%`,
                            backgroundColor: getProgressColor(patient.progress),
                          }}
                        />
                      </div>
                      <p className="text-[11px] text-[#64748B] mt-1">
                        {patient.currentDays}/{patient.totalDays} jours
                      </p>
                    </div>

                    {/* Status */}
                    <div className="col-span-2 flex items-center justify-between">
                      <Badge
                        className={`${getStatusStyles(
                          patient.status,
                        )} rounded-full px-3 py-1 text-[11px] font-normal border-0`}
                      >
                        {getStatusLabel(patient.status)}
                      </Badge>
                      <button className="text-[#64748B] hover:text-[#1E293B] transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-[#E2E8F0] flex justify-center">
              <div className="flex items-center gap-2">
                <button className="w-[35px] h-[35px] rounded-lg bg-[#F1F5F9] flex items-center justify-center hover:bg-[#E2E8F0] transition-colors">
                  <ChevronLeft className="w-4 h-4 text-[#64748B]" />
                </button>
                <button className="w-[35px] h-[35px] rounded-lg bg-[#2563EB] flex items-center justify-center">
                  <span className="text-[13px] text-white font-normal">1</span>
                </button>
                <button className="w-[35px] h-[35px] rounded-lg bg-[#F1F5F9] flex items-center justify-center hover:bg-[#E2E8F0] transition-colors">
                  <span className="text-[13px] text-[#64748B] font-normal">
                    2
                  </span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
