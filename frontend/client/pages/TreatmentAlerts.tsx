import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function TreatmentAlerts() {
  return (
    <div className="flex min-h-screen bg-[#F5F7FA]">
      <Sidebar />
      <div className="flex-1 ml-[250px]">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 h-20 flex items-center justify-between px-10">
          <h1 className="text-2xl font-bold text-[#1E293B]">
            Page d'alerte traitement
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#64748B]">Doctor</span>
            <div className="w-10 h-10 rounded-full bg-[#2563EB] flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6 max-w-6xl mx-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Critical Alerts */}
            <div className="bg-white rounded-xl p-6 border border-[#E2E8F0]">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-[#64748B] mb-2">
                    Alertes Critiques
                  </p>
                  <p className="text-4xl font-bold text-[#EF4444]">3</p>
                </div>
                <div className="w-15 h-15 rounded-full bg-[#FEE2E2] flex items-center justify-center">
                  <span className="text-2xl font-bold text-[#EF4444]">!</span>
                </div>
              </div>
            </div>

            {/* Missed Reminders */}
            <div className="bg-white rounded-xl p-6 border border-[#E2E8F0]">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-[#64748B] mb-2">Rappels Manqués</p>
                  <p className="text-4xl font-bold text-[#F59E0B]">12</p>
                </div>
                <div className="w-15 h-15 rounded-full bg-[#FEF3C7] flex items-center justify-center">
                  <div className="flex flex-col gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Detected Anomalies */}
            <div className="bg-white rounded-xl p-6 border border-[#E2E8F0]">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-[#64748B] mb-2">
                    Anomalies Détectées
                  </p>
                  <p className="text-4xl font-bold text-[#8B5CF6]">2</p>
                </div>
                <div className="w-15 h-15 rounded-full bg-[#F3E8FF] flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full border-3 border-[#8B5CF6]"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 mb-6">
            <div className="flex flex-wrap gap-3 items-center justify-between">
              <div className="flex gap-2">
                <Button className="bg-[#2563EB] text-white hover:bg-[#1E40AF] h-[30px] text-sm px-4">
                  Toutes
                </Button>
                <Button
                  variant="outline"
                  className="h-[30px] text-sm px-4 border-[#E2E8F0] text-[#64748B]"
                >
                  Critiques
                </Button>
                <Button
                  variant="outline"
                  className="h-[30px] text-sm px-4 border-[#E2E8F0] text-[#64748B]"
                >
                  Manquées
                </Button>
                <Button
                  variant="outline"
                  className="h-[30px] text-sm px-4 border-[#E2E8F0] text-[#64748B]"
                >
                  Anomalies
                </Button>
              </div>
              <Button
                variant="outline"
                className="h-[30px] text-sm px-4 border-[#CBD5E1] bg-[#F8FAFC] text-[#475569]"
              >
                Trier par date ▼
              </Button>
            </div>
          </div>

          {/* Alerts List */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 mb-6 space-y-4">
            {/* Critical Alert */}
            <div className="bg-[#FEF2F2] border-2 border-[#FECACA] rounded-xl p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-[50px] h-[50px] rounded-full bg-[#EF4444] flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-white">!</span>
                  </div>
                  <div>
                    <span className="inline-block px-3 py-1 bg-[#FEE2E2] text-[#991B1B] text-xs font-bold rounded-full mb-2">
                      CRITIQUE
                    </span>
                    <h3 className="text-base font-bold text-[#1E293B]">
                      Mohammed Hassan - Traitement interrompu
                    </h3>
                    <p className="text-sm text-[#64748B] mt-1">
                      Aspirine 100mg - 3 prises consécutives manquées
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button className="bg-[#EF4444] text-white hover:bg-[#DC2626] h-[35px] text-sm">
                    Notifier
                  </Button>
                  <Button
                    variant="outline"
                    className="h-[35px] text-sm border-[#E2E8F0]"
                  >
                    •••
                  </Button>
                </div>
              </div>
            </div>

            {/* Warning Alert */}
            <div className="bg-[#FEFCE8] border-2 border-[#FEF08A] rounded-xl p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-[50px] h-[50px] rounded-full bg-[#F59E0B] flex items-center justify-center flex-shrink-0">
                    <div className="flex flex-col gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                    </div>
                  </div>
                  <div>
                    <span className="inline-block px-3 py-1 bg-[#FEF3C7] text-[#92400E] text-xs font-bold rounded-full mb-2">
                      ATTENTION
                    </span>
                    <h3 className="text-base font-bold text-[#1E293B]">
                      Ahmed Khalid - Rappel manqué
                    </h3>
                    <p className="text-sm text-[#64748B] mt-1">
                      Amoxicilline 500mg - Prise de 14:00 non effectuée
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button className="bg-[#F59E0B] text-white hover:bg-[#D97706] h-[35px] text-sm">
                    Reprogrammer
                  </Button>
                  <Button
                    variant="outline"
                    className="h-[35px] text-sm border-[#E2E8F0]"
                  >
                    Marquer OK
                  </Button>
                </div>
              </div>
            </div>

            {/* Anomaly Alert */}
            <div className="bg-[#F0F9FF] border-2 border-[#BAE6FD] rounded-xl p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-[50px] h-[50px] rounded-full bg-[#8B5CF6] flex items-center justify-center flex-shrink-0">
                    <div className="w-6 h-6 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <span className="inline-block px-3 py-1 bg-[#EDE9FE] text-[#5B21B6] text-xs font-bold rounded-full mb-2">
                      ANOMALIE
                    </span>
                    <h3 className="text-base font-bold text-[#1E293B]">
                      Fatima Zahra - Prises irrégulières
                    </h3>
                    <p className="text-sm text-[#64748B] mt-1">
                      Paracétamol 1g - Horaires non respectés (écart de 3h)
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button className="bg-[#8B5CF6] text-white hover:bg-[#7C3AED] h-[35px] text-sm">
                    Vérifier
                  </Button>
                  <Button
                    variant="outline"
                    className="h-[35px] text-sm border-[#E2E8F0]"
                  >
                    Ignorer
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#64748B]">
              Affichage 1-3 sur 17 alertes
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="w-9 h-9 p-0 border-[#E2E8F0] bg-[#F1F5F9]"
              >
                <ChevronLeft className="w-4 h-4 text-[#64748B]" />
              </Button>
              <Button className="w-9 h-9 p-0 bg-[#2563EB] text-white">1</Button>
              <Button
                variant="outline"
                className="w-9 h-9 p-0 border-[#E2E8F0] bg-[#F1F5F9]"
              >
                <ChevronRight className="w-4 h-4 text-[#64748B]" />
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
